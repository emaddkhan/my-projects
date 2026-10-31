/**
 * 002 — Categories and Products schema for Grocery POS.
 *
 * Implements Milestone 1 data requirements:
 * - Categories table
 * - Products table with units (piece, kg, gram, litre, packet, box)
 * - Money values stored strictly as integer paisa (Rule: never float)
 * - Barcode and SKU support with unique indexing
 * - Stock quantity and low stock threshold
 * - Foreign key constraint with categories
 */
export default {
  version: 2,
  name: 'products_and_categories',
  up(db) {
    db.exec(`
      CREATE TABLE categories (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
        description TEXT,
        created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE TABLE products (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        name              TEXT NOT NULL CHECK (length(trim(name)) > 0),
        barcode           TEXT UNIQUE CHECK (barcode IS NULL OR length(trim(barcode)) > 0),
        sku               TEXT UNIQUE CHECK (sku IS NULL OR length(trim(sku)) > 0),
        unit              TEXT NOT NULL CHECK (unit IN ('piece', 'kg', 'gram', 'litre', 'packet', 'box')),
        cost_price_paisa  INTEGER NOT NULL CHECK (cost_price_paisa >= 0),
        sale_price_paisa  INTEGER NOT NULL CHECK (sale_price_paisa >= 0),
        current_stock     REAL NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
        min_stock_level   REAL NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
        is_active         INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
        created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE INDEX idx_products_category ON products(category_id);
      CREATE INDEX idx_products_barcode ON products(barcode);
      CREATE INDEX idx_products_sku ON products(sku);
      CREATE INDEX idx_products_name ON products(name);
      CREATE INDEX idx_products_is_active ON products(is_active);

      -- Default grocery categories
      INSERT INTO categories (name, description) VALUES
        ('General Grocery', 'Flour, rice, sugar, oil, pulses, and staples'),
        ('Beverages', 'Soft drinks, juices, mineral water, tea, and coffee'),
        ('Dairy & Eggs', 'Milk, yogurt, butter, cheese, and farm fresh eggs'),
        ('Snacks & Biscuits', 'Chips, crackers, biscuits, and confectionery'),
        ('Bakery', 'Fresh bread, buns, rusk, and cakes'),
        ('Personal Care', 'Soaps, shampoo, toothpaste, and toiletries'),
        ('Household & Cleaning', 'Detergents, dishwash, surface cleaners');
    `);
  },
};
