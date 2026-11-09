/**
 * 006 — Suppliers, Purchase Invoices & Supplier Payments.
 *
 * Implements Milestone 4 data requirements:
 * - Suppliers table with opening balance in integer paisa
 * - Purchases table with invoice sequence, supplier relation, and paisa totals
 * - Purchase items table snapshotting product details and cost prices
 * - Supplier payments table tracking payments and allocations
 * - Foreign keys, constraints, and performance indexes
 */
export default {
  version: 6,
  name: 'suppliers_and_purchases',
  up(db) {
    db.exec(`
      -- 1. Suppliers Table
      CREATE TABLE suppliers (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        name                  TEXT NOT NULL CHECK (length(trim(name)) > 0),
        phone                 TEXT,
        email                 TEXT,
        address               TEXT,
        opening_balance_paisa INTEGER NOT NULL DEFAULT 0 CHECK (opening_balance_paisa >= 0),
        notes                 TEXT,
        is_active             INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
        created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE INDEX idx_suppliers_name ON suppliers(name);
      CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);

      -- 2. Purchases Master Table
      CREATE TABLE purchases (
        id                      INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number          TEXT NOT NULL UNIQUE CHECK (length(trim(invoice_number)) > 0),
        supplier_id             INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
        supplier_invoice_number TEXT,
        purchase_date           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        subtotal_paisa          INTEGER NOT NULL CHECK (subtotal_paisa >= 0),
        discount_paisa          INTEGER NOT NULL DEFAULT 0 CHECK (discount_paisa >= 0),
        total_paisa             INTEGER NOT NULL CHECK (total_paisa >= 0),
        paid_paisa              INTEGER NOT NULL DEFAULT 0 CHECK (paid_paisa >= 0),
        due_paisa               INTEGER NOT NULL DEFAULT 0 CHECK (due_paisa >= 0),
        status                  TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'partial', 'unpaid', 'cancelled')),
        notes                   TEXT,
        created_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE INDEX idx_purchases_invoice ON purchases(invoice_number);
      CREATE INDEX idx_purchases_supplier ON purchases(supplier_id);
      CREATE INDEX idx_purchases_date ON purchases(purchase_date);
      CREATE INDEX idx_purchases_status ON purchases(status);

      -- 3. Purchase Items Table (Snapshot line items)
      CREATE TABLE purchase_items (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_id       INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
        product_id        INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_name      TEXT NOT NULL,
        unit              TEXT NOT NULL,
        barcode           TEXT,
        quantity          REAL NOT NULL CHECK (quantity > 0),
        unit_cost_paisa   INTEGER NOT NULL CHECK (unit_cost_paisa >= 0),
        total_paisa       INTEGER NOT NULL CHECK (total_paisa >= 0)
      );

      CREATE INDEX idx_purchase_items_purchase ON purchase_items(purchase_id);
      CREATE INDEX idx_purchase_items_product ON purchase_items(product_id);

      -- 4. Supplier Payments Table
      CREATE TABLE supplier_payments (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id     INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
        purchase_id     INTEGER REFERENCES purchases(id) ON DELETE SET NULL,
        amount_paisa    INTEGER NOT NULL CHECK (amount_paisa > 0),
        payment_method  TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'cheque', 'online')),
        payment_date    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        reference       TEXT,
        notes           TEXT,
        created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE INDEX idx_supplier_payments_supplier ON supplier_payments(supplier_id);
      CREATE INDEX idx_supplier_payments_purchase ON supplier_payments(purchase_id);
      CREATE INDEX idx_supplier_payments_date ON supplier_payments(payment_date);

      -- Seed default demo suppliers for testing and grocery onboarding
      INSERT INTO suppliers (name, phone, address, opening_balance_paisa, notes) VALUES
        ('Metro Wholesale Cash & Carry', '042-111-786-111', 'Model Town Link Road, Lahore', 0, 'Primary staples & oil distributor'),
        ('Nestle Pakistan Direct', '0800-62282', 'Packages Mall Distribution, Lahore', 0, 'Dairy, juices & infant nutrition'),
        ('Unilever Pakistan Distribution', '021-111-200-300', 'Hub River Road, Karachi', 0, 'Soaps, detergents & tea stocks');
    `);
  },
};
