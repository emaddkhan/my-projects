/**
 * Smoke test runner. Launches the real Electron app twice and verifies the
 * results reported by scripts/smoke-test.js, including persistence across
 * restarts.
 *
 *   npm run test:smoke        Production renderer (dist/), all network blocked.
 *   npm run test:smoke:dev    Vite dev server renderer.
 *
 * Options:  --screenshot <file.png>
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronBinary = require('electron');

const args = process.argv.slice(2);
const devMode = args.includes('--dev');
const screenshotIndex = args.indexOf('--screenshot');
const screenshot = screenshotIndex >= 0 ? path.resolve(args[screenshotIndex + 1]) : undefined;

function launch(label, extraEnv) {
  return new Promise((resolve) => {
    const env = { ...process.env, POS_SMOKE_TEST: '1', ...extraEnv };
    delete env.ELECTRON_RUN_AS_NODE;
    for (const [key, value] of Object.entries(env)) if (value === undefined) delete env[key];

    const child = spawn(electronBinary, ['.'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'inherit'] });
    let result = null;
    let buffer = '';
    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trimEnd();
        buffer = buffer.slice(newline + 1);
        if (line.startsWith('SMOKE_RESULT ')) result = JSON.parse(line.slice('SMOKE_RESULT '.length));
        else if (line) console.log(`  [${label}] ${line}`);
      }
    });
    child.on('exit', (code) => resolve({ code, result }));
  });
}

function printChecks(title, checks) {
  console.log(`\n${title}`);
  for (const [name, pass] of Object.entries(checks)) {
    console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${name}`);
  }
}

let viteServer = null;
let devUrl;
if (devMode) {
  const { createServer } = await import('vite');
  viteServer = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.js'), logLevel: 'warn' });
  await viteServer.listen();
  devUrl = viteServer.resolvedUrls.local[0];
  console.log(`[smoke] Vite dev server at ${devUrl}`);
}

const env = devMode ? { VITE_DEV_SERVER_URL: devUrl, POS_SMOKE_OFFLINE: '0' } : { POS_SMOKE_OFFLINE: '1' };
console.log(`[smoke] Mode: ${devMode ? 'development (Vite)' : 'production renderer, network blocked'}`);

const first = await launch('launch 1', { ...env, POS_SMOKE_SCREENSHOT: screenshot });
const second = await launch('launch 2', env);
if (viteServer) await viteServer.close();

let ok = true;
for (const [label, run] of [['Launch 1', first], ['Launch 2', second]]) {
  if (!run.result) {
    console.error(`\n${label}: no SMOKE_RESULT received (exit code ${run.code}).`);
    ok = false;
    continue;
  }
  printChecks(`${label} (exit ${run.code}) — ${run.result.loadedUrl}`, run.result.checks);
  if (run.result.error) console.error(`  ERROR: ${run.result.error}`);
  if (run.result.blockedNetworkRequests?.length) console.error('  Network attempts:', run.result.blockedNetworkRequests);
  if (run.result.consoleErrors?.length) console.error('  Renderer console errors:', run.result.consoleErrors);
  if (run.code !== 0) ok = false;
}

if (first.result && second.result) {
  const a = first.result.probe?.health?.data?.database ?? {};
  const b = second.result.probe?.health?.data?.database ?? {};
  const persistence = {
    sameDatabaseFile: Boolean(a.filePath) && a.filePath === b.filePath,
    creationTimePreserved: Boolean(a.createdAt) && a.createdAt === b.createdAt,
    launchCounterIncremented: b.launchCount === a.launchCount + 1,
    noMigrationsReappliedOnRestart: Array.isArray(b.migrationsAppliedThisLaunch) && b.migrationsAppliedThisLaunch.length === 0,
  };
  printChecks('Persistence across restart', persistence);
  console.log(`\n  Database file : ${b.filePath}`);
  console.log(`  Created at    : ${b.createdAt}`);
  console.log(`  Launch count  : ${a.launchCount} -> ${b.launchCount}`);
  console.log(`  Schema        : v${b.schemaVersion}, SQLite ${b.sqliteVersion}, journal=${b.journalMode}, synchronous=${b.synchronous}`);
  if (first.result.screenshot) console.log(`  Screenshot    : ${first.result.screenshot}`);
  if (!Object.values(persistence).every(Boolean)) ok = false;
}

console.log(`\n[smoke] ${ok ? 'ALL CHECKS PASSED' : 'SMOKE TEST FAILED'}`);
process.exit(ok ? 0 : 1);
