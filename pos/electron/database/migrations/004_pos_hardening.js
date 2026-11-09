/**
 * 004 — POS Hardening: Idempotency & Duplicate Checkout Protection.
 *
 * Adds idempotency_key to the sales table to ensure repeat or concurrent
 * checkout requests never produce duplicate invoices or double-deduct stock.
 */
export default {
  version: 4,
  name: 'pos_hardening_idempotency',
  up(db) {
    db.exec(`
      ALTER TABLE sales ADD COLUMN idempotency_key TEXT;
      CREATE UNIQUE INDEX idx_sales_idempotency_key ON sales(idempotency_key) WHERE idempotency_key IS NOT NULL;
    `);
  },
};
