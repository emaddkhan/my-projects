/**
 * In-process smoke test hook (development only).
 *
 * Loaded by electron/main.js ONLY when `!app.isPackaged && POS_SMOKE_TEST=1`.
 * It is never included in packaged builds. It observes the real main window,
 * inspects it from the outside, prints a single `SMOKE_RESULT {json}` line,
 * and exits. Driven by scripts/run-smoke.js.
 *
 * Env:
 *   POS_SMOKE_OFFLINE=1        Cancel and record every http(s)/ws(s) request.
 *   POS_SMOKE_SCREENSHOT=path  Save a PNG of the rendered window.
 */
import fs from 'node:fs';
import path from 'node:path';
import { app, session } from 'electron';
import { shutdownDatabase } from '../electron/database/index.js';

const OFFLINE = process.env.POS_SMOKE_OFFLINE === '1';
const SCREENSHOT = process.env.POS_SMOKE_SCREENSHOT;
const TIMEOUT_MS = 45_000;

const report = {
  mode: OFFLINE ? 'offline' : 'online',
  checks: {},
  blockedNetworkRequests: [],
  consoleErrors: [],
};

let finished = false;
function finish(code) {
  if (finished) return;
  finished = true;
  process.stdout.write(`SMOKE_RESULT ${JSON.stringify(report)}\n`);
  shutdownDatabase(); // app.exit() skips 'will-quit', so close explicitly
  app.exit(code);
}

setTimeout(() => {
  report.error = `Smoke test timed out after ${TIMEOUT_MS} ms`;
  finish(1);
}, TIMEOUT_MS);

app.whenReady().then(() => {
  if (!OFFLINE) return;
  // Simulates "no internet": any network request the app attempts is cancelled and recorded.
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] },
    (details, callback) => {
      report.blockedNetworkRequests.push(details.url);
      callback({ cancel: true });
    }
  );
});

async function waitFor(webContents, expression, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const value = await webContents.executeJavaScript(expression);
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

function isInside(child, parent) {
  const relative = path.relative(parent.toLowerCase(), child.toLowerCase());
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function runChecks(win) {
  const wc = win.webContents;
  const prefs = wc.getLastWebPreferences();
  report.loadedUrl = wc.getURL();
  report.webPreferences = {
    nodeIntegration: prefs.nodeIntegration,
    contextIsolation: prefs.contextIsolation,
    sandbox: prefs.sandbox,
  };

  // Wait until React has rendered and the health request has resolved.
  await waitFor(
    wc,
    `(() => { const el = document.querySelector('#db-status'); return el && el.dataset.status !== 'loading'; })()`
  );

  const probe = await wc.executeJavaScript(`(async () => {
    const health = await window.posApi.system.getHealth();
    const info = await window.posApi.app.getInfo();
    const popup = window.open('https://example.com');
    return {
      title: document.querySelector('#app-title')?.textContent,
      mode: document.querySelector('#app-mode')?.textContent,
      version: document.querySelector('#app-version')?.textContent,
      dbStatusText: document.querySelector('#db-status')?.textContent,
      uiChecks: Object.fromEntries([...document.querySelectorAll('li[id^="check-"]')].map((li) => [li.id, li.dataset.pass === 'true'])),
      bridge: { top: Object.keys(window.posApi), app: Object.keys(window.posApi.app), system: Object.keys(window.posApi.system) },
      globals: { require: typeof window.require, process: typeof window.process, module: typeof window.module, Buffer: typeof window.Buffer, ipcRenderer: typeof window.ipcRenderer },
      popupBlocked: popup === null,
      csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content ?? null,
      health,
      info,
    };
  })()`);

  const expectedDbPath = path.join(app.getPath('userData'), 'database', 'grocery-pos.sqlite');
  const db = probe.health?.data?.database;

  report.userDataDir = app.getPath('userData');
  report.appDir = app.getAppPath();
  report.probe = probe;

  report.checks = {
    electronLaunched: true,
    reactRendered: probe.title === 'Grocery POS',
    secureWebPreferences: prefs.contextIsolation === true && prefs.sandbox === true && prefs.nodeIntegration === false,
    nodeNotExposedToRenderer: Object.values(probe.globals).every((t) => t === 'undefined'),
    preloadBridgeExposed:
      probe.bridge.top.join() === 'app,system' && probe.bridge.app.join() === 'getInfo' && probe.bridge.system.join() === 'getHealth',
    ipcAppInfo: probe.info?.ok === true && probe.info.data.version === app.getVersion(),
    ipcDatabaseHealth: probe.health?.ok === true && db?.status === 'connected',
    allHealthChecksPass: db?.checks ? Object.values(db.checks).every(Boolean) : false,
    walAndForeignKeys: db?.journalMode === 'wal' && db?.checks?.foreignKeys === true,
    dbInUserDataDir: db?.filePath === expectedDbPath && fs.existsSync(expectedDbPath),
    dbOutsideProjectDir: Boolean(db?.filePath) && !isInside(db.filePath, app.getAppPath()),
    uiShowsConnected: probe.dbStatusText === 'Connected',
    uiShowsOfflineReady: probe.mode === 'Offline Ready',
    uiShowsVersion: probe.version === app.getVersion(),
    uiAllHealthRowsPass: Object.keys(probe.uiChecks).length === 6 && Object.values(probe.uiChecks).every(Boolean),
    popupsBlocked: probe.popupBlocked,
    cspPresent: typeof probe.csp === 'string' && probe.csp.includes("default-src 'self'"),
    noRendererConsoleErrors: report.consoleErrors.length === 0,
  };
  if (OFFLINE) {
    report.checks.noNetworkRequests = report.blockedNetworkRequests.length === 0;
  }

  if (SCREENSHOT) {
    await new Promise((resolve) => setTimeout(resolve, 1200)); // let entrance animations settle
    const image = await wc.capturePage();
    fs.mkdirSync(path.dirname(SCREENSHOT), { recursive: true });
    fs.writeFileSync(SCREENSHOT, image.toPNG());
    report.screenshot = SCREENSHOT;
  }

  return Object.values(report.checks).every(Boolean);
}

app.on('browser-window-created', (_event, win) => {
  const wc = win.webContents;

  wc.on('console-message', (event, legacyLevel, legacyMessage) => {
    const level = event?.level ?? legacyLevel;
    const message = event?.message ?? legacyMessage;
    if (level === 'error' || level === 3) report.consoleErrors.push(message);
  });

  wc.on('did-fail-load', (_e, code, description, url) => {
    report.error = `did-fail-load ${code} ${description} ${url}`;
    finish(1);
  });

  wc.once('did-finish-load', () => {
    runChecks(win)
      .then((passed) => finish(passed ? 0 : 1))
      .catch((error) => {
        report.error = error instanceof Error ? error.stack : String(error);
        finish(1);
      });
  });
});
