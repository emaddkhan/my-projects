import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { app } from 'electron';
import { getDatabase, getDatabaseState, isDatabaseOpen } from '../database/index.js';
import { createAppMetaRepository } from '../database/repositories/appMetaRepository.js';
import { createDiagnosticsRepository } from '../database/repositories/diagnosticsRepository.js';

export const PRODUCT_NAME = 'Grocery POS';

function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/** Static application information for the renderer. */
export function getAppInfo() {
  return {
    productName: PRODUCT_NAME,
    version: app.getVersion(),
    mode: 'offline',
    isPackaged: app.isPackaged,
    platform: process.platform,
    arch: process.arch,
    versions: {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
    },
  };
}

/**
 * Records this launch in app_meta. Used for diagnostics and to verify that
 * data persists across restarts.
 */
export function recordAppStart() {
  const meta = createAppMetaRepository(getDatabase());
  const record = meta.transaction(() => {
    const previous = Number.parseInt(meta.get('launch_count') ?? '0', 10);
    const launchCount = Number.isFinite(previous) ? previous + 1 : 1;
    meta.set('launch_count', launchCount);
    meta.set('last_started_at', new Date().toISOString());
    meta.set('last_app_version', app.getVersion());
    return launchCount;
  });
  return record();
}

/**
 * Runs the database health check. Never throws: failures are reported in
 * the result so the UI can always render a status.
 */
export function getDatabaseHealth() {
  const state = getDatabaseState();
  const base = {
    filePath: state.filePath,
    latestSchemaVersion: state.latestVersion,
    migrationsAppliedThisLaunch: state.appliedThisLaunch,
  };

  if (state.status !== 'ready' || !isDatabaseOpen()) {
    return {
      ...base,
      status: 'error',
      error: state.error ?? 'Database is not open.',
    };
  }

  try {
    const started = performance.now();
    const db = getDatabase();
    const diagnostics = createDiagnosticsRepository(db);
    const meta = createAppMetaRepository(db);

    const reachable = diagnostics.ping();
    const integrity = diagnostics.quickCheck();
    const journalMode = diagnostics.journalMode();
    const foreignKeys = diagnostics.foreignKeysEnabled();
    const schemaVersion = diagnostics.schemaVersion();
    const responseMs = Math.round((performance.now() - started) * 100) / 100;

    const checks = {
      reachable,
      integrity: integrity === 'ok',
      walMode: journalMode === 'wal',
      foreignKeys,
      schemaUpToDate: schemaVersion === state.latestVersion,
    };
    const healthy = Object.values(checks).every(Boolean);

    return {
      ...base,
      status: healthy ? 'connected' : 'degraded',
      error: healthy ? null : 'One or more database checks failed.',
      checks,
      integrityResult: integrity,
      journalMode,
      synchronous: diagnostics.synchronousMode(),
      sqliteVersion: diagnostics.sqliteVersion(),
      schemaVersion,
      sizeBytes: fileSize(state.filePath) + fileSize(`${state.filePath}-wal`),
      createdAt: meta.get('database_created_at'),
      launchCount: Number.parseInt(meta.get('launch_count') ?? '0', 10),
      lastStartedAt: meta.get('last_started_at'),
      responseMs,
    };
  } catch (error) {
    return {
      ...base,
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Combined system health snapshot consumed by the welcome screen. */
export function getSystemHealth() {
  const database = getDatabaseHealth();
  const overall =
    database.status === 'connected' ? 'healthy' : database.status === 'degraded' ? 'degraded' : 'unavailable';

  return {
    checkedAt: new Date().toISOString(),
    overall,
    database,
    process: {
      uptimeSeconds: Math.round(process.uptime()),
      memoryRssBytes: process.memoryUsage().rss,
    },
  };
}
