import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

/**
 * Owns the single better-sqlite3 connection used by the main process.
 *
 * The renderer never touches this module; it can only reach the database
 * through IPC handlers -> services -> repositories.
 */

let db = null;
let dbFilePath = null;

/**
 * Applies and verifies connection-level pragmas.
 * Throws if a required pragma could not be enabled, so the app never runs
 * against a database without foreign keys or WAL.
 */
function applyPragmas(instance) {
  const journalMode = String(instance.pragma('journal_mode = WAL', { simple: true })).toLowerCase();
  if (journalMode !== 'wal') {
    throw new Error(`Failed to enable WAL journal mode (SQLite reported "${journalMode}").`);
  }

  instance.pragma('foreign_keys = ON');
  if (instance.pragma('foreign_keys', { simple: true }) !== 1) {
    throw new Error('Failed to enable SQLite foreign key enforcement.');
  }

  // FULL trades a little write speed for durability: a committed sale must
  // survive a sudden power cut, which is common for retail counters.
  instance.pragma('synchronous = FULL');
  instance.pragma('busy_timeout = 5000');
}

/**
 * Opens (or creates) the database file. Safe to call repeatedly: subsequent
 * calls return the already-open connection.
 */
export function openDatabase(filePath) {
  if (db) {
    if (filePath !== dbFilePath) {
      throw new Error('A different database is already open.');
    }
    return db;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const instance = new Database(filePath);
  try {
    applyPragmas(instance);
  } catch (error) {
    instance.close();
    throw error;
  }

  db = instance;
  dbFilePath = filePath;
  return db;
}

/** Returns the open connection or throws if the database is not initialized. */
export function getDatabase() {
  if (!db) {
    throw new Error('Database has not been initialized.');
  }
  return db;
}

export function getDatabasePath() {
  return dbFilePath;
}

export function isDatabaseOpen() {
  return db !== null && db.open;
}

/** Closes the connection cleanly. Safe to call when nothing is open. */
export function closeDatabase() {
  if (!db) return;
  try {
    if (db.open) {
      db.pragma('optimize');
      db.close();
    }
  } finally {
    db = null;
    dbFilePath = null;
  }
}
