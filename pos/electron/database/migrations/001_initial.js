/**
 * 001 — Initial schema.
 *
 * Creates only the application metadata table used for diagnostics
 * (database creation time, launch counter). Business tables arrive in
 * later milestones as new numbered migrations. Never edit a migration
 * after it has shipped; add a new one instead.
 */
export default {
  version: 1,
  name: 'initial_app_meta',
  up(db) {
    db.exec(`
      CREATE TABLE app_meta (
        key        TEXT PRIMARY KEY NOT NULL CHECK (length(key) BETWEEN 1 AND 100),
        value      TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      ) STRICT;

      INSERT INTO app_meta (key, value)
      VALUES ('database_created_at', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
    `);
  },
};
