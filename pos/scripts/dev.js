/**
 * Development launcher.
 *
 *   npm run dev            Start the Vite dev server and Electron together.
 *   npm run dev:electron   Attach Electron to an already running `npm run dev:renderer`.
 *
 * Electron is restarted automatically when files in electron/ change; the
 * renderer uses Vite HMR. Uses Vite's JS API, so no extra process-runner
 * dependencies are required.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronBinary = require('electron');
const electronOnly = process.argv.includes('--electron-only');
const DEFAULT_DEV_URL = 'http://localhost:5173/';

async function waitForUrl(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Timed out waiting for ${url}. Is "npm run dev:renderer" running?`);
}

let viteServer = null;
let devUrl;

if (electronOnly) {
  devUrl = process.env.VITE_DEV_SERVER_URL || DEFAULT_DEV_URL;
  console.log(`[dev] Waiting for renderer at ${devUrl} …`);
  await waitForUrl(devUrl);
} else {
  const { createServer } = await import('vite');
  viteServer = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.js') });
  await viteServer.listen();
  viteServer.printUrls();
  devUrl = viteServer.resolvedUrls.local[0];
}

let child = null;
let restarting = false;
let shuttingDown = false;

function startElectron() {
  const env = { ...process.env, VITE_DEV_SERVER_URL: devUrl };
  delete env.ELECTRON_RUN_AS_NODE; // some terminals set this; it would stop Electron from opening windows
  child = spawn(electronBinary, ['.'], { cwd: ROOT, stdio: 'inherit', env });
  child.on('exit', (code) => {
    child = null;
    if (restarting) {
      restarting = false;
      startElectron();
      return;
    }
    shutdown(code ?? 0);
  });
}

let debounce = null;
const watcher = fs.watch(path.join(ROOT, 'electron'), { recursive: true }, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (!child || shuttingDown) return;
    console.log('[dev] Main process files changed, restarting Electron…');
    restarting = true;
    child.kill();
  }, 300);
});

async function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  watcher.close();
  if (child) child.kill();
  if (viteServer) await viteServer.close();
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

startElectron();
