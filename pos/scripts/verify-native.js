/**
 * Verifies that the better-sqlite3 native binary loads inside Electron's
 * runtime (not just system Node.js) and that WAL + foreign keys work.
 *
 * Usage: npm run verify:native
 *
 * better-sqlite3 v13 ships Node-API prebuilt binaries, which are ABI-stable
 * across Node.js and Electron versions, so no node-gyp rebuild is required.
 * This script proves that on the current machine.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

if (!process.versions.electron) {
  // Re-run this same file under Electron in "run as Node" mode.
  const electronBinary = require('electron');
  const result = spawnSync(electronBinary, [fileURLToPath(import.meta.url)], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  });
  process.exit(result.status ?? 1);
}

const Database = require('better-sqlite3');
const { getPrebuildPath } = require('better-sqlite3/lib/binding.js');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grocery-pos-native-'));
const file = path.join(dir, 'verify.sqlite');

try {
  const db = new Database(file);
  const journalMode = db.pragma('journal_mode = WAL', { simple: true });
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE parent (id INTEGER PRIMARY KEY);
    CREATE TABLE child (id INTEGER PRIMARY KEY, parent_id INTEGER NOT NULL REFERENCES parent(id));
  `);

  let foreignKeyEnforced = false;
  try {
    db.prepare('INSERT INTO child (parent_id) VALUES (999)').run();
  } catch (error) {
    foreignKeyEnforced = error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY';
  }

  const report = {
    electron: process.versions.electron,
    node: process.versions.node,
    modules: process.versions.modules,
    napi: process.versions.napi,
    binary: getPrebuildPath() ?? 'build/Release (compiled)',
    sqlite: db.prepare('SELECT sqlite_version() AS v').get().v,
    journalMode,
    foreignKeyEnforced,
  };
  db.close();

  console.log(JSON.stringify(report, null, 2));
  if (journalMode !== 'wal' || !foreignKeyEnforced) {
    console.error('Native SQLite verification FAILED.');
    process.exit(1);
  }
  console.log('Native SQLite verification passed inside Electron.');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
