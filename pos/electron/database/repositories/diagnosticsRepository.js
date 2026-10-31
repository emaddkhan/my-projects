/**
 * Read-only diagnostic queries against the SQLite engine itself.
 * @param {import('better-sqlite3').Database} db
 */
export function createDiagnosticsRepository(db) {
  const ping = db.prepare('SELECT 1 AS ok');
  const sqliteVersion = db.prepare('SELECT sqlite_version() AS version');
  const schemaVersion = db.prepare('SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations');

  return {
    ping() {
      return ping.get().ok === 1;
    },
    sqliteVersion() {
      return sqliteVersion.get().version;
    },
    schemaVersion() {
      return schemaVersion.get().version;
    },
    journalMode() {
      return String(db.pragma('journal_mode', { simple: true })).toLowerCase();
    },
    foreignKeysEnabled() {
      return db.pragma('foreign_keys', { simple: true }) === 1;
    },
    synchronousMode() {
      // 0 OFF, 1 NORMAL, 2 FULL, 3 EXTRA
      return ['off', 'normal', 'full', 'extra'][db.pragma('synchronous', { simple: true })] ?? 'unknown';
    },
    /** Fast structural check; returns 'ok' when the file is sound. */
    quickCheck() {
      return String(db.pragma('quick_check', { simple: true }));
    },
  };
}
