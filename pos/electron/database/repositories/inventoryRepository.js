/**
 * SQL repository for Inventory Management and Stock Movements.
 *
 * Implements strict transaction-safe stock operations, preventing negative
 * stock and maintaining an immutable audit ledger of every inventory change.
 *
 * @param {import('better-sqlite3').Database} db
 */
export function createInventoryRepository(db) {
  const selectProductForStock = db.prepare(`
    SELECT id, name, unit, current_stock AS currentStock, min_stock_level AS minStockLevel, is_active AS isActive
    FROM products
    WHERE id = ?
  `);

  const updateProductStock = db.prepare(`
    UPDATE products
    SET current_stock = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `);

  const insertStockMovement = db.prepare(`
    INSERT INTO stock_movements (
      product_id, movement_type, quantity, previous_stock, new_stock,
      reason, reference_type, reference_id, created_at
    ) VALUES (
      @productId, @movementType, @quantity, @previousStock, @newStock,
      @reason, @referenceType, @referenceId, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const selectMovementById = db.prepare(`
    SELECT 
      m.id,
      m.product_id AS productId,
      p.name AS productName,
      p.barcode,
      p.unit,
      m.movement_type AS movementType,
      m.quantity,
      m.previous_stock AS previousStock,
      m.new_stock AS newStock,
      m.reason,
      m.reference_type AS referenceType,
      m.reference_id AS referenceId,
      m.created_at AS createdAt
    FROM stock_movements m
    LEFT JOIN products p ON p.id = m.product_id
    WHERE m.id = ?
  `);

  return {
    /**
     * Executes a stock change atomically with an immutable audit record.
     * Can be invoked directly or inside an existing external transaction.
     */
    applyStockMovement(data) {
      const {
        productId,
        movementType,
        quantity,
        reason = null,
        referenceType = null,
        referenceId = null,
      } = data;

      const numQty = Number(quantity);
      if (!Number.isFinite(numQty) || numQty <= 0) {
        throw new Error('Movement quantity must be a positive number.');
      }

      const product = selectProductForStock.get(productId);
      if (!product) {
        throw new Error(`Product ID ${productId} does not exist.`);
      }

      // Unit-specific quantity validation
      const integerUnits = ['piece', 'packet', 'box'];
      if (integerUnits.includes(product.unit)) {
        if (!Number.isInteger(numQty)) {
          throw new Error(`Quantity for unit "${product.unit}" must be a whole number.`);
        }
      }

      const previousStock = Number(product.currentStock);
      let newStock;

      const isIncrease = ['stock_in', 'adjustment_in', 'opening_balance'].includes(movementType);
      const isDecrease = ['stock_out', 'adjustment_out', 'damaged', 'sale'].includes(movementType);

      if (isIncrease) {
        newStock = Number((previousStock + numQty).toFixed(3));
      } else if (isDecrease) {
        if (previousStock < numQty) {
          throw new Error(
            `Insufficient stock for "${product.name}". Requested: ${numQty} ${product.unit}, Available: ${previousStock} ${product.unit}.`
          );
        }
        newStock = Number((previousStock - numQty).toFixed(3));
      } else {
        throw new Error(`Invalid movement type: "${movementType}".`);
      }

      if (newStock < 0) {
        throw new Error(`Resulting stock cannot be negative (calculated: ${newStock}).`);
      }

      // Perform update and insert atomically
      const runUpdates = () => {
        updateProductStock.run(newStock, productId);
        const info = insertStockMovement.run({
          productId,
          movementType,
          quantity: numQty,
          previousStock,
          newStock,
          reason: reason ? String(reason).trim() : null,
          referenceType: referenceType ? String(referenceType).trim() : null,
          referenceId: referenceId ? String(referenceId).trim() : null,
        });

        return selectMovementById.get(Number(info.lastInsertRowid));
      };

      // If we are already inside a transaction, run directly; otherwise wrap in transaction
      if (db.inTransaction) {
        return runUpdates();
      }
      return db.transaction(runUpdates)();
    },

    /**
     * Physical inventory stock adjustment.
     * Calculates the exact delta between verified physical count and system stock.
     */
    adjustStock(productId, targetPhysicalStock, reason) {
      const target = Number(targetPhysicalStock);
      if (!Number.isFinite(target) || target < 0) {
        throw new Error('Physical stock must be a non-negative number.');
      }
      if (!reason || typeof reason !== 'string' || !reason.trim()) {
        throw new Error('A reason is required for stock adjustments.');
      }

      const product = selectProductForStock.get(productId);
      if (!product) {
        throw new Error(`Product ID ${productId} does not exist.`);
      }

      const current = Number(product.currentStock);
      const diff = Number((target - current).toFixed(3));

      if (diff === 0) {
        throw new Error(`Verified physical stock is identical to current stock (${current} ${product.unit}). No adjustment needed.`);
      }

      const movementType = diff > 0 ? 'adjustment_in' : 'adjustment_out';
      const quantity = Math.abs(diff);

      return this.applyStockMovement({
        productId,
        movementType,
        quantity,
        reason: reason.trim(),
        referenceType: 'manual_adjustment',
      });
    },

    /**
     * Lists stock movements with dynamic filters (product, movementType, dates).
     */
    listMovements({ productId = null, movementType = null, limit = 50, offset = 0 } = {}) {
      const conditions = [];
      const params = {};

      if (productId) {
        conditions.push('m.product_id = @productId');
        params.productId = Number(productId);
      }
      if (movementType && movementType !== 'all') {
        conditions.push('m.movement_type = @movementType');
        params.movementType = String(movementType).trim();
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRow = db.prepare(`
        SELECT COUNT(*) AS total
        FROM stock_movements m
        ${whereClause}
      `).get(params);

      const items = db.prepare(`
        SELECT 
          m.id,
          m.product_id AS productId,
          p.name AS productName,
          p.barcode,
          p.unit,
          m.movement_type AS movementType,
          m.quantity,
          m.previous_stock AS previousStock,
          m.new_stock AS newStock,
          m.reason,
          m.reference_type AS referenceType,
          m.reference_id AS referenceId,
          m.created_at AS createdAt
        FROM stock_movements m
        LEFT JOIN products p ON p.id = m.product_id
        ${whereClause}
        ORDER BY m.id DESC
        LIMIT @limit OFFSET @offset
      `).all({ ...params, limit: Number(limit), offset: Number(offset) });

      return {
        items,
        total: countRow.total,
      };
    },

    /**
     * High-level inventory KPI metrics.
     */
    getInventoryOverview() {
      const stats = db.prepare(`
        SELECT 
          (SELECT COUNT(*) FROM products WHERE is_active = 1) AS totalActiveProducts,
          (SELECT COUNT(*) FROM products WHERE is_active = 1 AND current_stock <= min_stock_level AND current_stock > 0) AS lowStockCount,
          (SELECT COUNT(*) FROM products WHERE is_active = 1 AND current_stock = 0) AS outOfStockCount,
          (SELECT COUNT(*) FROM stock_movements WHERE created_at >= date('now', 'start of day')) AS movementsTodayCount
      `).get();

      return {
        totalActiveProducts: stats.totalActiveProducts || 0,
        lowStockCount: stats.lowStockCount || 0,
        outOfStockCount: stats.outOfStockCount || 0,
        movementsTodayCount: stats.movementsTodayCount || 0,
      };
    },
  };
}
