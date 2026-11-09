import migration001 from './001_initial.js';
import migration002 from './002_products_and_categories.js';
import migration003 from './003_sales_and_orders.js';
import migration004 from './004_pos_hardening.js';
import migration005 from './005_inventory_and_stock_movements.js';
import migration006 from './006_suppliers_and_purchases.js';

/**
 * Ordered list of all migrations. Imported statically (rather than scanned
 * from disk) so it works identically in development and inside the packaged
 * ASAR archive. Append new migrations to the end.
 */
export const migrations = [
  migration001,
  migration002,
  migration003,
  migration004,
  migration005,
  migration006,
];
