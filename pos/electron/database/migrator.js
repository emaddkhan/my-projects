/**
 * Minimal forward-only migration runner.
 *
 * - Applied migrations are recorded in `schema_migrations`.
 * - Each migration runs inside its own IMMEDIATE transaction together with
 *   its bookkeeping row, so a failure leaves the schema untouched.
 * - Running it repeatedly is safe: already-applied versions are skipped.
 * - A database created by a newer app version is rejected instead of being
 *   used by older code that does not understand its schema.
 *
 * Note: statements that SQLite ignores inside transactions (for example
 * `PRAGMA foreign_keys`) must not be placed in migrations.
 */

const CREATE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version    INTEGER PRIMARY KEY NOT NULL,
    name       TEXT    NOT NULL,
    applied_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`;

function validateMigrations(migrations) {
  if (!Array.isArray(migrations) || migrations.length === 0) {
    throw new Error('Migration list must be a non-empty array.');
  }

  let previous = 0;
  for (const migration of migrations) {
    const { version, name, up } = migration ?? {};
    if (!Number.isInteger(version) || version <= 0) {
      throw new Error(`Invalid migration version: ${version}`);
    }
    if (version <= previous) {
      throw new Error(`Migrations must be strictly ascending (found ${version} after ${previous}).`);
    }
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error(`Migration ${version} must have a name.`);
    }
    if (typeof up !== 'function') {
      throw new Error(`Migration ${version} must export an up(db) function.`);
    }
    previous = version;
  }
}

/**
 * @param {import('better-sqlite3').Database} db
 * @param {Array<{version:number,name:string,up:(db)=>void}>} migrations
 * @returns {{ appliedNow: number[], currentVersion: number, latestVersion: number }}
 */
export function runMigrations(db, migrations) {
  validateMigrations(migrations);
  db.exec(CREATE_MIGRATIONS_TABLE);

  const known = new Map(migrations.map((m) => [m.version, m]));
  const applied = db.prepare('SELECT version, name FROM schema_migrations ORDER BY version').all();

  for (const row of applied) {
    const migration = known.get(row.version);
    if (!migration) {
      throw new Error(
        `Database schema version ${row.version} is not known to this application. ` +
          'It was probably created by a newer version of Grocery POS.'
      );
    }
    if (migration.name !== row.name) {
      throw new Error(
        `Migration ${row.version} name mismatch: database has "${row.name}", application has "${migration.name}".`
      );
    }
  }

  const appliedVersions = new Set(applied.map((row) => row.version));
  const pending = migrations.filter((m) => !appliedVersions.has(m.version));
  const record = db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)');
  const appliedNow = [];

  for (const migration of pending) {
    const apply = db.transaction(() => {
      migration.up(db);
      record.run(migration.version, migration.name);
    });
    try {
      apply.immediate();
    } catch (error) {
      throw new Error(`Migration ${migration.version} (${migration.name}) failed: ${error.message}`, {
        cause: error,
      });
    }
    appliedNow.push(migration.version);
  }

  const latestVersion = migrations[migrations.length - 1].version;
  const currentVersion = db.prepare('SELECT COALESCE(MAX(version), 0) AS v FROM schema_migrations').get().v;

  return { appliedNow, currentVersion, latestVersion };
}
