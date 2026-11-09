/**
 * SQL repository for Suppliers, Supplier Payments and Running Ledgers.
 * All monetary amounts are handled strictly as integer paisa.
 *
 * @param {import('better-sqlite3').Database} db
 */
export function createSupplierRepository(db) {
  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (
      name, phone, email, address, opening_balance_paisa, notes, is_active,
      created_at, updated_at
    ) VALUES (
      @name, @phone, @email, @address, @openingBalancePaisa, @notes, @isActive,
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const updateSupplierStmt = db.prepare(`
    UPDATE suppliers
    SET name = @name,
        phone = @phone,
        email = @email,
        address = @address,
        opening_balance_paisa = @openingBalancePaisa,
        notes = @notes,
        is_active = @isActive,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `);

  const selectSupplierById = db.prepare(`
    SELECT 
      s.id,
      s.name,
      s.phone,
      s.email,
      s.address,
      s.opening_balance_paisa AS openingBalancePaisa,
      s.notes,
      s.is_active AS isActive,
      s.created_at AS createdAt,
      s.updated_at AS updatedAt,
      COALESCE((SELECT SUM(total_paisa) FROM purchases WHERE supplier_id = s.id), 0) AS totalPurchasesPaisa,
      COALESCE((SELECT SUM(paid_paisa) FROM purchases WHERE supplier_id = s.id), 0) +
        COALESCE((SELECT SUM(amount_paisa) FROM supplier_payments WHERE supplier_id = s.id AND purchase_id IS NULL), 0) AS totalPaidPaisa,
      (s.opening_balance_paisa + 
        COALESCE((SELECT SUM(due_paisa) FROM purchases WHERE supplier_id = s.id), 0) -
        COALESCE((SELECT SUM(amount_paisa) FROM supplier_payments WHERE supplier_id = s.id AND purchase_id IS NULL), 0)
      ) AS currentBalancePaisa
    FROM suppliers s
    WHERE s.id = ?
  `);

  const insertPayment = db.prepare(`
    INSERT INTO supplier_payments (
      supplier_id, purchase_id, amount_paisa, payment_method,
      payment_date, reference, notes, created_at
    ) VALUES (
      @supplierId, @purchaseId, @amountPaisa, @paymentMethod,
      @paymentDate, @reference, @notes, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  `);

  const selectPaymentById = db.prepare(`
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
    WHERE id = ?
  `);

  const updatePurchasePayment = db.prepare(`
    UPDATE purchases
    SET paid_paisa = paid_paisa + @amountPaisa,
        due_paisa = MAX(0, total_paisa - (paid_paisa + @amountPaisa)),
        status = CASE 
          WHEN (paid_paisa + @amountPaisa) >= total_paisa THEN 'completed'
          ELSE 'partial'
        END
    WHERE id = @purchaseId
  `);

  return {
    create(data) {
      const info = insertSupplier.run({
        name: data.name.trim(),
        phone: data.phone ? data.phone.trim() : null,
        email: data.email ? data.email.trim() : null,
        address: data.address ? data.address.trim() : null,
        openingBalancePaisa: Number.isInteger(data.openingBalancePaisa) ? data.openingBalancePaisa : 0,
        notes: data.notes ? data.notes.trim() : null,
        isActive: data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
      });
      return selectSupplierById.get(Number(info.lastInsertRowid));
    },

    update(id, data) {
      updateSupplierStmt.run({
        id: Number(id),
        name: data.name.trim(),
        phone: data.phone ? data.phone.trim() : null,
        email: data.email ? data.email.trim() : null,
        address: data.address ? data.address.trim() : null,
        openingBalancePaisa: Number.isInteger(data.openingBalancePaisa) ? data.openingBalancePaisa : 0,
        notes: data.notes ? data.notes.trim() : null,
        isActive: data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
      });
      return selectSupplierById.get(Number(id));
    },

    getById(id) {
      return selectSupplierById.get(Number(id)) ?? null;
    },

    list({ search = '', isActive = null, limit = 100, offset = 0 } = {}) {
      const conditions = [];
      const params = {};

      if (search && search.trim() !== '') {
        const queryTerm = `%${search.trim()}%`;
        conditions.push('(name LIKE @queryTerm OR phone LIKE @queryTerm OR email LIKE @queryTerm)');
        params.queryTerm = queryTerm;
      }

      if (isActive !== null && isActive !== undefined) {
        conditions.push('is_active = @isActive');
        params.isActive = isActive ? 1 : 0;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRow = db.prepare(`SELECT COUNT(*) AS total FROM suppliers ${whereClause}`).get(params);
      const rows = db.prepare(`
        SELECT 
          s.id,
          s.name,
          s.phone,
          s.email,
          s.address,
          s.opening_balance_paisa AS openingBalancePaisa,
          s.notes,
          s.is_active AS isActive,
          s.created_at AS createdAt,
          s.updated_at AS updatedAt,
          COALESCE((SELECT SUM(total_paisa) FROM purchases WHERE supplier_id = s.id), 0) AS totalPurchasesPaisa,
          COALESCE((SELECT SUM(paid_paisa) FROM purchases WHERE supplier_id = s.id), 0) +
            COALESCE((SELECT SUM(amount_paisa) FROM supplier_payments WHERE supplier_id = s.id AND purchase_id IS NULL), 0) AS totalPaidPaisa,
          (s.opening_balance_paisa + 
            COALESCE((SELECT SUM(due_paisa) FROM purchases WHERE supplier_id = s.id), 0) -
            COALESCE((SELECT SUM(amount_paisa) FROM supplier_payments WHERE supplier_id = s.id AND purchase_id IS NULL), 0)
          ) AS currentBalancePaisa
        FROM suppliers s
        ${whereClause}
        ORDER BY s.name ASC
        LIMIT @limit OFFSET @offset
      `).all({ ...params, limit: Number(limit), offset: Number(offset) });

      return { items: rows, total: countRow.total };
    },

    /**
     * Records a payment to a supplier and updates purchase paid/due balances.
     */
    recordPayment(paymentData) {
      const transaction = db.transaction(() => {
        const supplier = selectSupplierById.get(Number(paymentData.supplierId));
        if (!supplier) {
          throw new Error(`Supplier ID ${paymentData.supplierId} not found.`);
        }

        const amount = Number(paymentData.amountPaisa);
        if (!Number.isInteger(amount) || amount <= 0) {
          throw new Error('Payment amount must be a positive integer in paisa.');
        }

        let purchaseId = paymentData.purchaseId ? Number(paymentData.purchaseId) : null;
        if (purchaseId) {
          const purchase = db.prepare('SELECT id, total_paisa AS totalPaisa, paid_paisa AS paidPaisa, due_paisa AS duePaisa FROM purchases WHERE id = ?').get(purchaseId);
          if (!purchase) {
            throw new Error(`Purchase invoice ID ${purchaseId} not found.`);
          }
          if (amount > purchase.duePaisa) {
            throw new Error(`Payment amount (Rs ${(amount / 100).toFixed(2)}) exceeds invoice due balance (Rs ${(purchase.duePaisa / 100).toFixed(2)}).`);
          }

          updatePurchasePayment.run({
            amountPaisa: amount,
            purchaseId,
          });
        }

        const info = insertPayment.run({
          supplierId: Number(paymentData.supplierId),
          purchaseId,
          amountPaisa: amount,
          paymentMethod: paymentData.paymentMethod || 'cash',
          paymentDate: paymentData.paymentDate || new Date().toISOString(),
          reference: paymentData.reference ? paymentData.reference.trim() : null,
          notes: paymentData.notes ? paymentData.notes.trim() : null,
        });

        return selectPaymentById.get(Number(info.lastInsertRowid));
      });

      return transaction();
    },

    /**
     * Calculates the chronological double-entry running ledger for a supplier.
     */
    getLedger(supplierId) {
      const supplier = selectSupplierById.get(Number(supplierId));
      if (!supplier) return null;

      // 1. Purchases (Debit to store / Credit to supplier payable)
      const purchaseRows = db.prepare(`
        SELECT 
          id,
          'purchase' AS type,
          invoice_number AS reference,
          total_paisa AS creditPaisa,
          0 AS debitPaisa,
          purchase_date AS date,
          notes
        FROM purchases
        WHERE supplier_id = ?
      `).all(Number(supplierId));

      // 2. Payments made (Debit to supplier payable / Credit to cash)
      const paymentRows = db.prepare(`
        SELECT 
          id,
          'payment' AS type,
          COALESCE(reference, 'PAY-' || id) AS reference,
          0 AS creditPaisa,
          amount_paisa AS debitPaisa,
          payment_date AS date,
          notes
        FROM supplier_payments
        WHERE supplier_id = ?
      `).all(Number(supplierId));

      // 3. Opening balance entry
      const entries = [];
      let runningBalance = supplier.openingBalancePaisa;

      entries.push({
        id: 0,
        type: 'opening_balance',
        reference: 'OPENING',
        date: supplier.createdAt,
        creditPaisa: supplier.openingBalancePaisa,
        debitPaisa: 0,
        balancePaisa: runningBalance,
        runningBalancePaisa: runningBalance,
        notes: 'Initial opening balance',
      });

      // Combine and sort chronologically
      const allEvents = [...purchaseRows, ...paymentRows].sort((a, b) => new Date(a.date) - new Date(b.date));

      let totalPurchasesPaisa = 0;
      let totalPaymentsPaisa = 0;

      for (const ev of allEvents) {
        if (ev.type === 'purchase') {
          totalPurchasesPaisa += ev.creditPaisa;
          runningBalance += ev.creditPaisa;
        } else if (ev.type === 'payment') {
          totalPaymentsPaisa += ev.debitPaisa;
          runningBalance -= ev.debitPaisa;
        }

        entries.push({
          ...ev,
          balancePaisa: runningBalance,
          runningBalancePaisa: runningBalance,
        });
      }

      return {
        supplier,
        entries,
        totalPurchasesPaisa,
        totalPaymentsPaisa,
        currentBalancePaisa: runningBalance,
      };
    },
  };
}
