/**
 * SQL repository for Sales, Invoices and Line Items.
 * All financial amounts are handled as integer paisa.
 *
 * @param {import('better-sqlite3').Database} db
 */
export function createSalesRepository(db) {
  const insertSale = db.prepare(`
    INSERT INTO sales (
      invoice_number, idempotency_key, customer_name, subtotal_paisa, discount_paisa,
      tax_paisa, total_paisa, cash_received_paisa, change_due_paisa,
      payment_method, items_count, notes, created_at
    ) VALUES (
      @invoiceNumber, @idempotencyKey, @customerName, @subtotalPaisa, @discountPaisa,
      @taxPaisa, @totalPaisa, @cashReceivedPaisa, @changeDuePaisa,
      @paymentMethod, @itemsCount, @notes, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const insertItem = db.prepare(`
    INSERT INTO sale_items (
      sale_id, product_id, product_name, barcode, unit,
      unit_price_paisa, cost_price_paisa, quantity, total_paisa
    ) VALUES (
      @saleId, @productId, @productName, @barcode, @unit,
      @unitPricePaisa, @costPricePaisa, @quantity, @totalPaisa
    )
  `);

  const selectProductForStock = db.prepare(`
    SELECT id, name, unit, current_stock AS currentStock, is_active AS isActive
    FROM products
    WHERE id = ?
  `);

  const deductStock = db.prepare(`
    UPDATE products
    SET current_stock = current_stock - ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ? AND current_stock >= ?
  `);

  const selectSaleById = db.prepare(`
    SELECT 
      id,
      invoice_number AS invoiceNumber,
      idempotency_key AS idempotencyKey,
      customer_name AS customerName,
      subtotal_paisa AS subtotalPaisa,
      discount_paisa AS discountPaisa,
      tax_paisa AS taxPaisa,
      total_paisa AS totalPaisa,
      cash_received_paisa AS cashReceivedPaisa,
      change_due_paisa AS changeDuePaisa,
      payment_method AS paymentMethod,
      items_count AS itemsCount,
      notes,
      created_at AS createdAt
    FROM sales
    WHERE id = ?
  `);

  const selectSaleByIdempotencyKey = db.prepare(`
    SELECT id FROM sales WHERE idempotency_key = ?
  `);

  const selectItemsBySaleId = db.prepare(`
    SELECT 
      id,
      sale_id AS saleId,
      product_id AS productId,
      product_name AS productName,
      barcode,
      unit,
      unit_price_paisa AS unitPricePaisa,
      cost_price_paisa AS costPricePaisa,
      quantity,
      total_paisa AS totalPaisa
    FROM sale_items
    WHERE sale_id = ?
    ORDER BY id ASC
  `);

  const getNextInvoiceSequence = db.prepare(`
    SELECT COUNT(*) + 1 AS nextSeq 
    FROM sales 
    WHERE created_at >= date('now', 'start of day')
  `);

  const insertSaleMovement = db.prepare(`
    INSERT INTO stock_movements (
      product_id, movement_type, quantity, previous_stock, new_stock,
      reason, reference_type, reference_id, created_at
    ) VALUES (
      @productId, 'sale', @quantity, @previousStock, @newStock,
      @reason, 'sale', @referenceId, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  return {
    generateInvoiceNumber() {
      const today = new Date();
      const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
      const seq = getNextInvoiceSequence.get().nextSeq;
      const padded = String(seq).padStart(4, '0');
      return `INV-${datePart}-${padded}`;
    },

    createSale(saleData, items) {
      // 1. Idempotency fast check: if already completed, return existing sale without re-processing
      if (saleData.idempotencyKey) {
        const existing = selectSaleByIdempotencyKey.get(saleData.idempotencyKey);
        if (existing) {
          return this.getSaleById(existing.id);
        }
      }

      const transaction = db.transaction(() => {
        // Double-check idempotency inside transaction for concurrent racing requests
        if (saleData.idempotencyKey) {
          const existing = selectSaleByIdempotencyKey.get(saleData.idempotencyKey);
          if (existing) {
            return this.getSaleById(existing.id);
          }
        }

        // 2. Aggregate quantities by product to handle duplicate cart lines correctly
        const productQuantities = new Map();
        const productStockBefore = new Map();
        for (const item of items) {
          if (item.productId) {
            const current = productQuantities.get(item.productId) || 0;
            productQuantities.set(item.productId, current + Number(item.quantity));
          }
        }

        // 3. Strict pre-validation: check live database availability for every product
        for (const [productId, requestedQty] of productQuantities.entries()) {
          const product = selectProductForStock.get(productId);
          if (!product) {
            throw new Error(`Product (ID: ${productId}) no longer exists.`);
          }
          if (!product.isActive) {
            throw new Error(`Product "${product.name}" is currently inactive and cannot be sold.`);
          }
          if (product.currentStock < requestedQty) {
            throw new Error(
              `Insufficient stock for "${product.name}". Requested: ${requestedQty} ${product.unit}, Available: ${product.currentStock} ${product.unit}.`
            );
          }
          productStockBefore.set(productId, Number(product.currentStock));
        }

        // 4. Atomically deduct stock using strict WHERE current_stock >= requestedQty
        for (const [productId, requestedQty] of productQuantities.entries()) {
          const result = deductStock.run(requestedQty, productId, requestedQty);
          if (result.changes === 0) {
            const current = selectProductForStock.get(productId);
            throw new Error(
              `Insufficient stock for "${current?.name || 'Product'}". Stock was changed concurrently. Available: ${current?.currentStock ?? 0}.`
            );
          }
        }

        // 5. Insert master sale record
        const invoiceNumber = saleData.invoiceNumber || this.generateInvoiceNumber();

        const saleInfo = insertSale.run({
          invoiceNumber,
          idempotencyKey: saleData.idempotencyKey || null,
          customerName: (saleData.customerName || 'Walk-in Customer').trim(),
          subtotalPaisa: saleData.subtotalPaisa,
          discountPaisa: saleData.discountPaisa || 0,
          taxPaisa: saleData.taxPaisa || 0,
          totalPaisa: saleData.totalPaisa,
          cashReceivedPaisa: saleData.cashReceivedPaisa,
          changeDuePaisa: saleData.changeDuePaisa || 0,
          paymentMethod: saleData.paymentMethod || 'cash',
          itemsCount: items.length,
          notes: saleData.notes ? saleData.notes.trim() : null,
        });

        const saleId = Number(saleInfo.lastInsertRowid);

        // 6. Insert line items
        for (const item of items) {
          insertItem.run({
            saleId,
            productId: item.productId || null,
            productName: item.productName.trim(),
            barcode: item.barcode || null,
            unit: item.unit || 'piece',
            unitPricePaisa: item.unitPricePaisa,
            costPricePaisa: item.costPricePaisa || 0,
            quantity: Number(item.quantity),
            totalPaisa: item.totalPaisa,
          });
        }

        // 7. Insert audit stock movement records linked to this sale
        for (const [productId, requestedQty] of productQuantities.entries()) {
          const prev = productStockBefore.get(productId);
          const newStock = Number((prev - requestedQty).toFixed(3));
          insertSaleMovement.run({
            productId,
            quantity: requestedQty,
            previousStock: prev,
            newStock,
            reason: `Sold on invoice ${invoiceNumber}`,
            referenceId: String(saleId),
          });
        }

        const sale = selectSaleById.get(saleId);
        const saleItems = selectItemsBySaleId.all(saleId);
        return { ...sale, items: saleItems };
      });

      return transaction();
    },

    getSaleById(id) {
      const sale = selectSaleById.get(id);
      if (!sale) return null;
      const items = selectItemsBySaleId.all(id);
      return { ...sale, items };
    },

    listSales({ limit = 50, offset = 0 } = {}) {
      const totalCount = db.prepare('SELECT COUNT(*) AS total FROM sales').get().total;
      const rows = db.prepare(`
        SELECT 
          id,
          invoice_number AS invoiceNumber,
          customer_name AS customerName,
          subtotal_paisa AS subtotalPaisa,
          discount_paisa AS discountPaisa,
          tax_paisa AS taxPaisa,
          total_paisa AS totalPaisa,
          cash_received_paisa AS cashReceivedPaisa,
          change_due_paisa AS changeDuePaisa,
          payment_method AS paymentMethod,
          items_count AS itemsCount,
          notes,
          created_at AS createdAt
        FROM sales
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `).all(limit, offset);

      return { items: rows, total: totalCount };
    },

    getSalesSummaryToday() {
      const row = db.prepare(`
        SELECT 
          COUNT(*) AS totalOrders,
          COALESCE(SUM(total_paisa), 0) AS totalRevenuePaisa,
          COALESCE(SUM(items_count), 0) AS totalItemsSold
        FROM sales
        WHERE created_at >= date('now', 'start of day')
      `).get();

      return {
        totalOrders: row.totalOrders,
        totalRevenuePaisa: row.totalRevenuePaisa,
        totalItemsSold: row.totalItemsSold,
      };
    },
  };
}
