/**
 * SQL repository for grocery products.
 *
 * Implements strict queries with parameterized statements.
 * Money amounts are always handled in integer paisa.
 *
 * @param {import('better-sqlite3').Database} db
 */
export function createProductRepository(db) {
  const selectById = db.prepare(`
    SELECT 
      p.id,
      p.category_id AS categoryId,
      c.name AS categoryName,
      p.name,
      p.barcode,
      p.sku,
      p.unit,
      p.cost_price_paisa AS costPricePaisa,
      p.sale_price_paisa AS salePricePaisa,
      p.current_stock AS currentStock,
      p.min_stock_level AS minStockLevel,
      p.is_active AS isActive,
      p.created_at AS createdAt,
      p.updated_at AS updatedAt
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `);

  const selectByBarcode = db.prepare(`
    SELECT 
      p.id,
      p.category_id AS categoryId,
      c.name AS categoryName,
      p.name,
      p.barcode,
      p.sku,
      p.unit,
      p.cost_price_paisa AS costPricePaisa,
      p.sale_price_paisa AS salePricePaisa,
      p.current_stock AS currentStock,
      p.min_stock_level AS minStockLevel,
      p.is_active AS isActive,
      p.created_at AS createdAt,
      p.updated_at AS updatedAt
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.barcode = ?
  `);

  const selectBySku = db.prepare(`
    SELECT 
      p.id,
      p.category_id AS categoryId,
      c.name AS categoryName,
      p.name,
      p.barcode,
      p.sku,
      p.unit,
      p.cost_price_paisa AS costPricePaisa,
      p.sale_price_paisa AS salePricePaisa,
      p.current_stock AS currentStock,
      p.min_stock_level AS minStockLevel,
      p.is_active AS isActive,
      p.created_at AS createdAt,
      p.updated_at AS updatedAt
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.sku = ?
  `);

  const insert = db.prepare(`
    INSERT INTO products (
      category_id, name, barcode, sku, unit,
      cost_price_paisa, sale_price_paisa, current_stock, min_stock_level,
      is_active, updated_at
    ) VALUES (
      @categoryId, @name, @barcode, @sku, @unit,
      @costPricePaisa, @salePricePaisa, @currentStock, @minStockLevel,
      @isActive, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const update = db.prepare(`
    UPDATE products
    SET category_id = @categoryId,
        name = @name,
        barcode = @barcode,
        sku = @sku,
        unit = @unit,
        cost_price_paisa = @costPricePaisa,
        sale_price_paisa = @salePricePaisa,
        current_stock = @currentStock,
        min_stock_level = @minStockLevel,
        is_active = @isActive,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `);

  const deleteById = db.prepare('DELETE FROM products WHERE id = ?');

  const updateStock = db.prepare(`
    UPDATE products
    SET current_stock = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `);

  const selectLowStock = db.prepare(`
    SELECT 
      p.id,
      p.category_id AS categoryId,
      c.name AS categoryName,
      p.name,
      p.barcode,
      p.sku,
      p.unit,
      p.cost_price_paisa AS costPricePaisa,
      p.sale_price_paisa AS salePricePaisa,
      p.current_stock AS currentStock,
      p.min_stock_level AS minStockLevel,
      p.is_active AS isActive
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = 1 AND p.current_stock <= p.min_stock_level
    ORDER BY p.current_stock ASC
  `);

  const insertOpeningMovement = db.prepare(`
    INSERT INTO stock_movements (
      product_id, movement_type, quantity, previous_stock, new_stock, reason, created_at
    ) VALUES (
      ?, 'opening_balance', ?, 0, ?, 'Initial opening stock balance', strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  return {
    getById(id) {
      return selectById.get(id) ?? null;
    },
    getByBarcode(barcode) {
      return selectByBarcode.get(barcode) ?? null;
    },
    getBySku(sku) {
      return selectBySku.get(sku) ?? null;
    },
    create(data) {
      const initialStock = Number(data.currentStock) || 0;
      const fn = () => {
        const info = insert.run({
          categoryId: data.categoryId ?? null,
          name: data.name,
          barcode: data.barcode ?? null,
          sku: data.sku ?? null,
          unit: data.unit,
          costPricePaisa: data.costPricePaisa,
          salePricePaisa: data.salePricePaisa,
          currentStock: initialStock,
          minStockLevel: data.minStockLevel ?? 0,
          isActive: data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
        });
        const newId = Number(info.lastInsertRowid);
        if (initialStock > 0) {
          insertOpeningMovement.run(newId, initialStock, initialStock);
        }
        return selectById.get(newId);
      };
      if (db.inTransaction) return fn();
      return db.transaction(fn)();
    },
    update(id, data) {
      update.run({
        id,
        categoryId: data.categoryId ?? null,
        name: data.name,
        barcode: data.barcode ?? null,
        sku: data.sku ?? null,
        unit: data.unit,
        costPricePaisa: data.costPricePaisa,
        salePricePaisa: data.salePricePaisa,
        currentStock: data.currentStock ?? 0,
        minStockLevel: data.minStockLevel ?? 0,
        isActive: data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
      });
      return selectById.get(id);
    },
    delete(id) {
      const result = deleteById.run(id);
      return result.changes > 0;
    },
    updateStock(id, newStock) {
      const result = updateStock.run(newStock, id);
      return result.changes > 0;
    },
    getLowStock() {
      return selectLowStock.all();
    },
    list({ search = '', categoryId = null, isActive = null, limit = 100, offset = 0 } = {}) {
      const conditions = [];
      const params = {};

      if (search && search.trim() !== '') {
        const queryTerm = `%${search.trim()}%`;
        conditions.push('(p.name LIKE @queryTerm OR p.barcode LIKE @queryTerm OR p.sku LIKE @queryTerm)');
        params.queryTerm = queryTerm;
      }

      if (categoryId !== null && categoryId !== undefined && categoryId !== '') {
        conditions.push('p.category_id = @categoryId');
        params.categoryId = Number(categoryId);
      }

      if (isActive !== null && isActive !== undefined) {
        conditions.push('p.is_active = @isActive');
        params.isActive = isActive ? 1 : 0;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countSql = `SELECT COUNT(*) AS total FROM products p ${whereClause}`;
      const countStmt = db.prepare(countSql);
      const total = countStmt.get(params).total;

      const listSql = `
        SELECT 
          p.id,
          p.category_id AS categoryId,
          c.name AS categoryName,
          p.name,
          p.barcode,
          p.sku,
          p.unit,
          p.cost_price_paisa AS costPricePaisa,
          p.sale_price_paisa AS salePricePaisa,
          p.current_stock AS currentStock,
          p.min_stock_level AS minStockLevel,
          p.is_active AS isActive,
          p.created_at AS createdAt,
          p.updated_at AS updatedAt
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ${whereClause}
        ORDER BY p.id DESC
        LIMIT @limit OFFSET @offset
      `;
      const listStmt = db.prepare(listSql);
      const items = listStmt.all({ ...params, limit, offset });

      return { items, total };
    },
  };
}
