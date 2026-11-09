/**
 * Every IPC channel the renderer may use. Keep in sync with
 * electron/preload.cjs (sandboxed preloads cannot import local modules).
 */
export const IPC_CHANNELS = Object.freeze({
  APP_GET_INFO: 'app:get-info',
  SYSTEM_GET_HEALTH: 'system:get-health',

  // Categories
  CATEGORIES_LIST: 'categories:list',
  CATEGORIES_GET: 'categories:get',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  // Products
  PRODUCTS_LIST: 'products:list',
  PRODUCTS_GET: 'products:get',
  PRODUCTS_GET_BY_BARCODE: 'products:get-by-barcode',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_LOW_STOCK: 'products:low-stock',

  // Sales & POS Checkout
  SALES_CHECKOUT: 'sales:checkout',
  SALES_LIST: 'sales:list',
  SALES_GET: 'sales:get',
  SALES_SUMMARY: 'sales:summary',

  // Inventory Management & Stock Movements
  INVENTORY_STOCK_IN: 'inventory:stock-in',
  INVENTORY_STOCK_OUT: 'inventory:stock-out',
  INVENTORY_ADJUST: 'inventory:adjust',
  INVENTORY_DAMAGED: 'inventory:damaged',
  INVENTORY_MOVEMENTS: 'inventory:movements',
  INVENTORY_OVERVIEW: 'inventory:overview',

  // Suppliers & Vendor Management
  SUPPLIERS_LIST: 'suppliers:list',
  SUPPLIERS_GET: 'suppliers:get',
  SUPPLIERS_CREATE: 'suppliers:create',
  SUPPLIERS_UPDATE: 'suppliers:update',
  SUPPLIERS_LEDGER: 'suppliers:ledger',
  SUPPLIERS_PAYMENT: 'suppliers:payment',

  // Purchases & Purchase Invoices
  PURCHASES_LIST: 'purchases:list',
  PURCHASES_GET: 'purchases:get',
  PURCHASES_CREATE: 'purchases:create',
  PURCHASES_OVERVIEW: 'purchases:overview',
});
