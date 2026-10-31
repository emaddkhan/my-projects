/**
 * SQL access for product categories.
 * @param {import('better-sqlite3').Database} db
 */
export function createCategoryRepository(db) {
  const selectAllWithCounts = db.prepare(`
    SELECT 
      c.id,
      c.name,
      c.description,
      c.created_at AS createdAt,
      c.updated_at AS updatedAt,
      COUNT(p.id) AS productCount
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name COLLATE NOCASE ASC
  `);

  const selectById = db.prepare(`
    SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt
    FROM categories
    WHERE id = ?
  `);

  const selectByName = db.prepare(`
    SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt
    FROM categories
    WHERE lower(name) = lower(?)
  `);

  const insert = db.prepare(`
    INSERT INTO categories (name, description, updated_at)
    VALUES (@name, @description, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  `);

  const update = db.prepare(`
    UPDATE categories
    SET name = @name,
        description = @description,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `);

  const deleteById = db.prepare('DELETE FROM categories WHERE id = ?');

  return {
    list() {
      return selectAllWithCounts.all();
    },
    getById(id) {
      return selectById.get(id) ?? null;
    },
    getByName(name) {
      return selectByName.get(name) ?? null;
    },
    create({ name, description = null }) {
      const info = insert.run({ name: name.trim(), description: description?.trim() || null });
      return selectById.get(info.lastInsertRowid);
    },
    update(id, { name, description = null }) {
      update.run({ id, name: name.trim(), description: description?.trim() || null });
      return selectById.get(id);
    },
    delete(id) {
      const result = deleteById.run(id);
      return result.changes > 0;
    },
  };
}
