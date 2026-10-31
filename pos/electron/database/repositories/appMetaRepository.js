/**
 * SQL access for the `app_meta` key/value table.
 * @param {import('better-sqlite3').Database} db
 */
export function createAppMetaRepository(db) {
  const selectOne = db.prepare('SELECT value FROM app_meta WHERE key = ?');
  const selectMany = db.prepare('SELECT key, value, updated_at AS updatedAt FROM app_meta ORDER BY key');
  const upsert = db.prepare(`
    INSERT INTO app_meta (key, value, updated_at)
    VALUES (@key, @value, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `);

  return {
    get(key) {
      return selectOne.get(key)?.value ?? null;
    },
    getAll() {
      return selectMany.all();
    },
    set(key, value) {
      upsert.run({ key, value: String(value) });
    },
    transaction(fn) {
      return db.transaction(fn);
    },
  };
}
