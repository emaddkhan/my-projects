import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, Menu, session } from 'electron';
import { initDatabase, shutdownDatabase } from './database/index.js';
import { registerIpcHandlers } from './ipc/index.js';
import { recordAppStart, PRODUCT_NAME } from './services/systemService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.join(__dirname, '..');
const PRELOAD_PATH = path.join(__dirname, 'preload.cjs');
const RENDERER_INDEX = path.join(APP_ROOT, 'dist', 'index.html');

// The dev server URL is only honoured in unpackaged (development) runs, so a
// packaged build can never be pointed at remote content via the environment.
const DEV_SERVER_URL = !app.isPackaged ? process.env.VITE_DEV_SERVER_URL : undefined;

// Keep development data separate from a production install on the same PC.
// Both locations are still inside the OS user-data area (%APPDATA%).
if (!app.isPackaged) {
  app.setPath('userData', path.join(app.getPath('appData'), `${PRODUCT_NAME} Dev`));
}

// Optional automated verification hook (development only, never packaged).
if (!app.isPackaged && process.env.POS_SMOKE_TEST === '1') {
  await import('../scripts/smoke-test.js');
}

/** @type {BrowserWindow | null} */
let mainWindow = null;

function isAllowedRendererUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (DEV_SERVER_URL) {
      return url.origin === new URL(DEV_SERVER_URL).origin;
    }
    return (
      url.protocol === 'file:' &&
      path.normalize(fileURLToPath(url)).toLowerCase() === path.normalize(RENDERER_INDEX).toLowerCase()
    );
  } catch {
    return false;
  }
}

/** Only the top-level frame of our own renderer may call IPC handlers. */
function isTrustedSender(frame) {
  return Boolean(frame && frame.parent === null && isAllowedRendererUrl(frame.url));
}

function configureSecurity() {
  // No camera, microphone, notifications, geolocation, etc. unless added deliberately.
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);

  app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (event, url) => {
      if (!isAllowedRendererUrl(url)) event.preventDefault();
    });
    contents.on('will-redirect', (event, url) => {
      if (!isAllowedRendererUrl(url)) event.preventDefault();
    });
    contents.on('will-attach-webview', (event) => event.preventDefault());
  });
}

function resolveWindowIcon() {
  if (app.isPackaged) return undefined; // packaged builds use the executable's icon
  const iconPath = path.join(APP_ROOT, 'build', 'icon.png');
  return fs.existsSync(iconPath) ? iconPath : undefined;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: PRODUCT_NAME,
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    backgroundColor: '#0b1120',
    icon: resolveWindowIcon(),
    webPreferences: {
      preload: PRELOAD_PATH,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (DEV_SERVER_URL) {
    mainWindow.loadURL(DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(RENDERER_INDEX);
  }
}

function initializeDatabase() {
  try {
    const state = initDatabase({ userDataDir: app.getPath('userData'), appDir: APP_ROOT });
    const launchCount = recordAppStart();
    console.log(
      `[db] Ready at ${state.filePath} (schema v${state.currentVersion}, ` +
        `migrations applied this launch: [${state.appliedThisLaunch.join(', ')}], launch #${launchCount})`
    );
  } catch (error) {
    // The window still opens so the health screen can show the failure.
    console.error('[db] Initialization failed:', error);
  }
}

// One instance only: two processes must never write the same POS database.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    if (app.isPackaged) Menu.setApplicationMenu(null);
    configureSecurity();
    initializeDatabase();
    registerIpcHandlers({ isTrustedSender });
    createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('will-quit', () => {
    shutdownDatabase();
  });
}
