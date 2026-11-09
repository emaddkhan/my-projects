import { createInventoryRepository } from './inventoryRepository.js';

/**
 * SQL repository for Purchase Invoices, Item Snapshots, and Inward Stock Intake.
 * All monetary amounts are handled strictly as integer paisa.
 *
 * @param {import('better-sqlite3').Database} db
 */
export function createPurchaseRepository(db) {
  const insertPurchase = db.prepare(`
    INSERT INTO purchases (
      invoice_number, supplier_id, supplier_invoice_number, purchase_date,
      subtotal_paisa, discount_paisa, total_paisa, paid_paisa, due_paisa,
      status, notes, created_at
    ) VALUES (
      @invoiceNumber, @supplierId, @supplierInvoiceNumber, @purchaseDate,
      @subtotalPaisa, @discountPaisa, @totalPaisa, @paidPaisa, @duePaisa,
      @status, @notes, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const insertPurchaseItem = db.prepare(`
    INSERT INTO purchase_items (
      purchase_id, product_id, product_name, unit, barcode,
      quantity, unit_cost_paisa, total_paisa
    ) VALUES (
      @purchaseId, @productId, @productName, @unit, @barcode,
      @quantity, @unitCostPaisa, @totalPaisa
    )
  `);

  const insertSupplierPayment = db.prepare(`
    INSERT INTO supplier_payments (
      supplier_id, purchase_id, amount_paisa, payment_method,
      payment_date, reference, notes, created_at
    ) VALUES (
      @supplierId, @purchaseId, @amountPaisa, @paymentMethod,
      @paymentDate, @reference, @notes, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const updateProductCostPrice = db.prepare(`
    UPDATE products
    SET cost_price_paisa = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `);

  const selectProductForPurchase = db.prepare(`
    SELECT id, name, unit, cost_price_paisa AS costPricePaisa, current_stock AS currentStock, is_active AS isActive
    FROM products
    WHERE id = ?
  `);

  const selectSupplierForPurchase = db.prepare(`
    SELECT id, name, is_active AS isActive
    FROM suppliers
    WHERE id = ?
  `);

  const selectPurchaseById = db.prepare(`
    SELECT 
      p.id,
      p.invoice_number AS invoiceNumber,
      p.supplier_id AS supplierId,
      s.name AS supplierName,
      p.supplier_invoice_number AS supplierInvoiceNumber,
      p.purchase_date AS purchaseDate,
      p.subtotal_paisa AS subtotalPaisa,
      p.discount_paisa AS discountPaisa,
      p.total_paisa AS totalPaisa,
      p.paid_paisa AS paidPaisa,
      p.due_paisa AS duePaisa,
      p.status,
      p.notes,
      p.created_at AS createdAt
    FROM purchases p
    JOIN suppliers s ON s.id = p.supplier_id
    WHERE p.id = ?
  `);

  const selectItemsByPurchaseId = db.prepare(`
    SELECT 
      id,
      purchase_id AS purchaseId,
      product_id AS productId,
      product_name AS productName,
      unit,
      barcode,
      quantity,
      unit_cost_paisa AS unitCostPaisa,
      total_paisa AS totalPaisa
    FROM purchase_items
    WHERE purchase_id = ?
    ORDER BY id ASC
  `);

  const selectPaymentsByPurchaseId = db.prepare(`
    SELECT 
      id,
      supplier_id AS supplierId,
      purchase_id AS purchaseId,
      amount_paisa AS amountPaisa,
      payment_method AS paymentMethod,
      payment_date AS paymentDate,
      reference,
      notes,
      created_at AS createdAt
    FROM supplier_payments
    WHERE purchase_id = ?
    ORDER BY id ASC
  `);

  const getNextPurchaseSequence = db.prepare(`
    SELECT COUNT(*) + 1 AS nextSeq 
    FROM purchases 
    WHERE created_at >= date('now', 'start of day')
  `);

  const inventoryRepo = createInventoryRepository(db);

  return {
    generateInvoiceNumber() {
      const today = new Date();
      const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
      const seq = getNextPurchaseSequence.get().nextSeq;
      const padded = String(seq).padStart(4, '0');
      return `PUR-${datePart}-${padded}`;
    },

    createPurchase(purchaseData, items) {
      const transaction = db.transaction(() => {
        // 1. Validate Supplier
        const supplier = selectSupplierForPurchase.get(Number(purchaseData.supplierId));
        if (!supplier) {
          throw new Error(`Supplier ID ${purchaseData.supplierId} not found.`);
        }
        if (!supplier.isActive) {
          throw new Error(`Supplier "${supplier.name}" is currently inactive. Cannot receive purchases.`);
        }

        // 2. Validate Items & calculate subtotal
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Purchase must contain at least one item.');
        }

        let calculatedSubtotalPaisa = 0;
        const validatedItems = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const prod = selectProductForPurchase.get(Number(item.productId));
          if (!prod) {
            throw new Error(`Product (ID ${item.productId}) does not exist.`);
          }
          if (!prod.isActive) {
            throw new Error(`Product "${prod.name}" is inactive. Cannot receive purchase.`);
          }

          const qty = Number(item.quantity);
          if (!Number.isFinite(qty) || qty <= 0) {
            throw new Error(`Item "${prod.name}" has invalid quantity: ${item.quantity}`);
          }

          const unitCost = Number.parseInt(item.unitCostPaisa, 10);
          if (!Number.isInteger(unitCost) || unitCost < 0) {
            throw new Error(`Item "${prod.name}" has invalid unit cost price.`);
          }

          const lineTotal = Math.round(qty * unitCost);
          calculatedSubtotalPaisa += lineTotal;

          validatedItems.push({
            productId: prod.id,
            productName: prod.name,
            unit: prod.unit,
            barcode: item.barcode || null,
            quantity: qty,
            unitCostPaisa: unitCost,
            totalPaisa: lineTotal,
            currentStock: Number(prod.currentStock),
            currentCostPricePaisa: Number(prod.costPricePaisa),
          });
        }

        const disc = Number.parseInt(purchaseData.discountPaisa, 10) || 0;
        if (disc > calculatedSubtotalPaisa) {
          throw new Error('Purchase discount cannot exceed subtotal amount.');
        }

        const grandTotalPaisa = Math.max(0, calculatedSubtotalPaisa - disc);
        const paidPaisa = Number.parseInt(purchaseData.paidPaisa, 10) || 0;
        if (paidPaisa > grandTotalPaisa) {
          throw new Error(`Payment amount (Rs ${(paidPaisa / 100).toFixed(2)}) cannot exceed purchase total (Rs ${(grandTotalPaisa / 100).toFixed(2)}).`);
        }

        const duePaisa = Math.max(0, grandTotalPaisa - paidPaisa);
        let status = 'completed';
        if (duePaisa > 0) {
          status = paidPaisa > 0 ? 'partial' : 'unpaid';
        }

        const invoiceNumber = purchaseData.invoiceNumber || this.generateInvoiceNumber();
        const purchaseDate = purchaseData.purchaseDate || new Date().toISOString();

        // 3. Insert Purchase Master
        const info = insertPurchase.run({
          invoiceNumber,
          supplierId: supplier.id,
          supplierInvoiceNumber: purchaseData.supplierInvoiceNumber ? String(purchaseData.supplierInvoiceNumber).trim() : null,
          purchaseDate,
          subtotalPaisa: calculatedSubtotalPaisa,
          discountPaisa: disc,
          totalPaisa: grandTotalPaisa,
          paidPaisa,
          duePaisa,
          status,
          notes: purchaseData.notes ? String(purchaseData.notes).trim() : null,
        });

        const purchaseId = Number(info.lastInsertRowid);

        // 4. Insert Items, Update Weighted-Average Cost, and Inward Stock Intake
        for (const it of validatedItems) {
          insertPurchaseItem.run({
            purchaseId,
            productId: it.productId,
            productName: it.productName,
            unit: it.unit,
            barcode: it.barcode,
            quantity: it.quantity,
            unitCostPaisa: it.unitCostPaisa,
            totalPaisa: it.totalPaisa,
          });

          // Moving Weighted-Average Cost Calculation
          let newCostPricePaisa = it.unitCostPaisa;
          if (it.currentStock > 0) {
            const currentTotalValue = it.currentStock * it.currentCostPricePaisa;
            const newTotalValue = it.quantity * it.unitCostPaisa;
            const totalStockAfter = it.currentStock + it.quantity;
            if (totalStockAfter > 0) {
              newCostPricePaisa = Math.round((currentTotalValue + newTotalValue) / totalStockAfter);
            }
          }

          updateProductCostPrice.run(newCostPricePaisa, it.productId);

          // Atomic Stock Intake through Centralized Inventory Movement
          inventoryRepo.applyStockMovement({
            productId: it.productId,
            movementType: 'stock_in',
            quantity: it.quantity,
            reason: `Purchase from ${supplier.name} (${invoiceNumber})`,
            referenceType: 'purchase',
            referenceId: String(purchaseId),
          });
        }

        // 5. Record Payment if initial payment made
        if (paidPaisa > 0) {
          insertSupplierPayment.run({
            supplierId: supplier.id,
            purchaseId,
            amountPaisa: paidPaisa,
            paymentMethod: purchaseData.paymentMethod || 'cash',
            paymentDate: purchaseDate,
            reference: `Payment on ${invoiceNumber}`,
            notes: 'Initial payment at invoice creation',
          });
        }

        const purchase = selectPurchaseById.get(purchaseId);
        const purchaseItems = selectItemsByPurchaseId.all(purchaseId);
        const payments = selectPaymentsByPurchaseId.all(purchaseId);

        return { ...purchase, items: purchaseItems, payments };
      });

      return transaction();
    },

    getById(id) {
      const purchase = selectPurchaseById.get(Number(id));
      if (!purchase) return null;
      const items = selectItemsByPurchaseId.all(Number(id));
      const payments = selectPaymentsByPurchaseId.all(Number(id));
      return { ...purchase, items, payments };
    },

    list({ supplierId = null, status = null, limit = 50, offset = 0 } = {}) {
      const conditions = [];
      const params = {};

      if (supplierId) {
        conditions.push('p.supplier_id = @supplierId');
        params.supplierId = Number(supplierId);
      }
      if (status && status !== 'all') {
        conditions.push('p.status = @status');
        params.status = String(status).trim();
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRow = db.prepare(`SELECT COUNT(*) AS total FROM purchases p ${whereClause}`).get(params);
      const rows = db.prepare(`
        SELECT 
          p.id,
          p.invoice_number AS invoiceNumber,
          p.supplier_id AS supplierId,
          s.name AS supplierName,
          p.supplier_invoice_number AS supplierInvoiceNumber,
          p.purchase_date AS purchaseDate,
          p.subtotal_paisa AS subtotalPaisa,
          p.discount_paisa AS discountPaisa,
          p.total_paisa AS totalPaisa,
          p.paid_paisa AS paidPaisa,
          p.due_paisa AS duePaisa,
          p.status,
          p.notes,
          p.created_at AS createdAt,
          (SELECT COUNT(*) FROM purchase_items WHERE purchase_id = p.id) AS itemsCount
        FROM purchases p
        JOIN suppliers s ON s.id = p.supplier_id
        ${whereClause}
        ORDER BY p.id DESC
        LIMIT @limit OFFSET @offset
      `).all({ ...params, limit: Number(limit), offset: Number(offset) });

      return { items: rows, total: countRow.total };
    },

    getOverview() {
      const row = db.prepare(`
        SELECT 
          COUNT(*) AS totalPurchases,
          COALESCE(SUM(total_paisa), 0) AS totalPurchasedPaisa,
          COALESCE(SUM(paid_paisa), 0) AS totalPaidPaisa,
          COALESCE(SUM(due_paisa), 0) AS totalDuePaisa
        FROM purchases
      `).get();

      const activeSuppliersRow = db.prepare(`
        SELECT COUNT(*) AS activeCount FROM suppliers WHERE is_active = 1
      `).get();

      const totalPaymentsRow = db.prepare(`
        SELECT COALESCE(SUM(amount_paisa), 0) AS totalDisbursedPaisa FROM supplier_payments
      `).get();

      return {
        purchasesCount: row.totalPurchases || 0,
        totalPurchases: row.totalPurchases || 0,
        totalPurchasesPaisa: row.totalPurchasedPaisa || 0,
        totalPurchasedPaisa: row.totalPurchasedPaisa || 0,
        totalPaidPaisa: totalPaymentsRow.totalDisbursedPaisa || row.totalPaidPaisa || 0,
        totalDuePaisa: row.totalDuePaisa || 0,
        activeSuppliersCount: activeSuppliersRow.activeCount || 0,
      };
    },
  };
}
