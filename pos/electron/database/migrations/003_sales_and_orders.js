/**
 * 003 — Sales, Orders and POS Transactions schema.
 *
 * Implements Milestone 2 data requirements:
 * - Sales table (invoices, customer, totals in integer paisa, cash received, change due)
 * - Sale items table (line items with product snapshots, quantity, paisa unit & line totals)
 * - Indices for invoice number, creation date, and product reference
 */
export default {
  version: 3,
  name: 'sales_and_orders',
  up(db) {
    db.exec(`
      CREATE TABLE sales (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number      TEXT NOT NULL UNIQUE CHECK (length(trim(invoice_number)) > 0),
        customer_name       TEXT NOT NULL DEFAULT 'Walk-in Customer',
        subtotal_paisa      INTEGER NOT NULL CHECK (subtotal_paisa >= 0),
        discount_paisa      INTEGER NOT NULL DEFAULT 0 CHECK (discount_paisa >= 0),
        tax_paisa           INTEGER NOT NULL DEFAULT 0 CHECK (tax_paisa >= 0),
        total_paisa         INTEGER NOT NULL CHECK (total_paisa >= 0),
        cash_received_paisa INTEGER NOT NULL CHECK (cash_received_paisa >= 0),
        change_due_paisa    INTEGER NOT NULL DEFAULT 0 CHECK (change_due_paisa >= 0),
        payment_method      TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'credit')),
        items_count         INTEGER NOT NULL CHECK (items_count > 0),
        notes               TEXT,
        created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE TABLE sale_items (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id           INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
        product_id        INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_name      TEXT NOT NULL,
        barcode           TEXT,
        unit              TEXT NOT NULL,
        unit_price_paisa  INTEGER NOT NULL CHECK (unit_price_paisa >= 0),
        cost_price_paisa  INTEGER NOT NULL DEFAULT 0 CHECK (cost_price_paisa >= 0),
        quantity          REAL NOT NULL CHECK (quantity > 0),
        total_paisa       INTEGER NOT NULL CHECK (total_paisa >= 0)
      );

      CREATE INDEX idx_sales_invoice ON sales(invoice_number);
      CREATE INDEX idx_sales_created_at ON sales(created_at);
      CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
      CREATE INDEX idx_sale_items_product ON sale_items(product_id);
    `);
  },
};
