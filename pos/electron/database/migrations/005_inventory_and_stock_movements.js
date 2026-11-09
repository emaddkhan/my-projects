/**
 * 005 — Inventory Management & Stock Movement Ledger.
 *
 * Implements Milestone 3 data requirements:
 * - Creates stock_movements table tracking every stock mutation
 * - Movement types: opening_balance, stock_in, stock_out, sale, adjustment_in, adjustment_out, damaged
 * - Preserves fractional quantities (REAL) for metric goods
 * - Foreign key with products table ON DELETE SET NULL to preserve audit trail
 * - Backfills initial opening_balance movements for all pre-existing products with stock > 0
 */
export default {
  version: 5,
  name: 'inventory_and_stock_movements',
  up(db) {
    db.exec(`
      CREATE TABLE stock_movements (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
        movement_type   TEXT NOT NULL CHECK (movement_type IN (
                          'opening_balance',
                          'stock_in',
                          'stock_out',
                          'sale',
                          'adjustment_in',
                          'adjustment_out',
                          'damaged'
                        )),
        quantity        REAL NOT NULL CHECK (quantity > 0),
        previous_stock  REAL NOT NULL CHECK (previous_stock >= 0),
        new_stock       REAL NOT NULL CHECK (new_stock >= 0),
        reason          TEXT,
        reference_type  TEXT,
        reference_id    TEXT,
        created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
      CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
      CREATE INDEX idx_stock_movements_created ON stock_movements(created_at);
      CREATE INDEX idx_stock_movements_ref ON stock_movements(reference_type, reference_id);

      -- Backfill opening_balance for pre-existing products that have stock > 0
      INSERT INTO stock_movements (
        product_id, movement_type, quantity, previous_stock, new_stock, reason, created_at
      )
      SELECT 
        id AS product_id,
        'opening_balance' AS movement_type,
        current_stock AS quantity,
        0 AS previous_stock,
        current_stock AS new_stock,
        'Initial opening balance on migration' AS reason,
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now') AS created_at
      FROM products
      WHERE current_stock > 0;
    `);
  },
};
