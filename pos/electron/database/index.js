import path from 'node:path';
import { openDatabase, closeDatabase, getDatabase, getDatabasePath, isDatabaseOpen } from './connection.js';
import { runMigrations } from './migrator.js';
import { migrations } from './migrations/index.js';

export const DATABASE_DIR_NAME = 'database';
export const DATABASE_FILE_NAME = 'grocery-pos.sqlite';

/** Initialization state, exposed read-only to the health service. */
const state = {
  status: 'uninitialized', // 'uninitialized' | 'ready' | 'error'
  error: null,
  filePath: null,
  appliedThisLaunch: [],
  currentVersion: 0,
  latestVersion: migrations[migrations.length - 1].version,
};

export function resolveDatabasePath(userDataDir) {
  if (typeof userDataDir !== 'string' || !path.isAbsolute(userDataDir)) {
    throw new Error('userDataDir must be an absolute path.');
  }
  return path.join(userDataDir, DATABASE_DIR_NAME, DATABASE_FILE_NAME);
}

/** Guards against ever writing operational data into the source/app folder. */
function assertOutsideAppDir(filePath, appDir) {
  if (!appDir) return;
  const relative = path.relative(appDir.toLowerCase(), filePath.toLowerCase());
  const isInside = relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  if (isInside) {
    throw new Error(`Refusing to store the database inside the application directory: ${filePath}`);
  }
}

/**
 * Opens the database and brings the schema up to date.
 * Idempotent: calling it again after success is a no-op.
 *
 * @param {{ userDataDir: string, appDir?: string }} options
 */
export function initDatabase({ userDataDir, appDir }) {
  if (state.status === 'ready' && isDatabaseOpen()) {
    return getDatabaseState();
  }

  try {
    const filePath = resolveDatabasePath(userDataDir);
    state.filePath = filePath;
    assertOutsideAppDir(filePath, appDir);

    const db = openDatabase(filePath);
    const result = runMigrations(db, migrations);

    state.status = 'ready';
    state.error = null;
    state.appliedThisLaunch = result.appliedNow;
    state.currentVersion = result.currentVersion;
    state.latestVersion = result.latestVersion;
  } catch (error) {
    closeDatabase();
    state.status = 'error';
    state.error = error instanceof Error ? error.message : String(error);
    throw error;
  }

  return getDatabaseState();
}

export function getDatabaseState() {
  return { ...state, appliedThisLaunch: [...state.appliedThisLaunch] };
}

export function shutdownDatabase() {
  closeDatabase();
  if (state.status === 'ready') state.status = 'uninitialized';
}

export { getDatabase, getDatabasePath, isDatabaseOpen };
