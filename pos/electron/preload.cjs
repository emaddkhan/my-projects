/**
 * Preload bridge (CommonJS: sandboxed preloads cannot use ES modules or
 * require local files).
 *
 * Exposes a small, explicit API on `window.posApi`. The renderer never gets
 * ipcRenderer, Node.js, or database access directly.
 */
const { contextBridge, ipcRenderer } = require('electron');

// Keep in sync with electron/ipc/channels.js
const CHANNELS = Object.freeze({
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

contextBridge.exposeInMainWorld('posApi', {
  app: {
    getInfo: () => ipcRenderer.invoke(CHANNELS.APP_GET_INFO),
  },
  system: {
    getHealth: () => ipcRenderer.invoke(CHANNELS.SYSTEM_GET_HEALTH),
  },
  categories: {
    list: () => ipcRenderer.invoke(CHANNELS.CATEGORIES_LIST),
    get: (id) => ipcRenderer.invoke(CHANNELS.CATEGORIES_GET, id),
    create: (data) => ipcRenderer.invoke(CHANNELS.CATEGORIES_CREATE, data),
    update: (id, data) => ipcRenderer.invoke(CHANNELS.CATEGORIES_UPDATE, id, data),
    delete: (id) => ipcRenderer.invoke(CHANNELS.CATEGORIES_DELETE, id),
  },
  products: {
    list: (options) => ipcRenderer.invoke(CHANNELS.PRODUCTS_LIST, options),
    get: (id) => ipcRenderer.invoke(CHANNELS.PRODUCTS_GET, id),
    getByBarcode: (barcode) => ipcRenderer.invoke(CHANNELS.PRODUCTS_GET_BY_BARCODE, barcode),
    create: (data) => ipcRenderer.invoke(CHANNELS.PRODUCTS_CREATE, data),
    update: (id, data) => ipcRenderer.invoke(CHANNELS.PRODUCTS_UPDATE, id, data),
    delete: (id) => ipcRenderer.invoke(CHANNELS.PRODUCTS_DELETE, id),
    getLowStock: () => ipcRenderer.invoke(CHANNELS.PRODUCTS_LOW_STOCK),
  },
  sales: {
    checkout: (data) => ipcRenderer.invoke(CHANNELS.SALES_CHECKOUT, data),
    list: (options) => ipcRenderer.invoke(CHANNELS.SALES_LIST, options),
    get: (id) => ipcRenderer.invoke(CHANNELS.SALES_GET, id),
    getSummary: () => ipcRenderer.invoke(CHANNELS.SALES_SUMMARY),
  },
  inventory: {
    stockIn: (data) => ipcRenderer.invoke(CHANNELS.INVENTORY_STOCK_IN, data),
    stockOut: (data) => ipcRenderer.invoke(CHANNELS.INVENTORY_STOCK_OUT, data),
    adjust: (data) => ipcRenderer.invoke(CHANNELS.INVENTORY_ADJUST, data),
    markDamaged: (data) => ipcRenderer.invoke(CHANNELS.INVENTORY_DAMAGED, data),
    listMovements: (options) => ipcRenderer.invoke(CHANNELS.INVENTORY_MOVEMENTS, options),
    getOverview: () => ipcRenderer.invoke(CHANNELS.INVENTORY_OVERVIEW),
  },
  suppliers: {
    list: (options) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_LIST, options),
    get: (id) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_GET, id),
    create: (data) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_CREATE, data),
    update: (id, data) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_UPDATE, id, data),
    getLedger: (id) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_LEDGER, id),
    recordPayment: (data) => ipcRenderer.invoke(CHANNELS.SUPPLIERS_PAYMENT, data),
  },
  purchases: {
    list: (options) => ipcRenderer.invoke(CHANNELS.PURCHASES_LIST, options),
    get: (id) => ipcRenderer.invoke(CHANNELS.PURCHASES_GET, id),
    create: (data) => ipcRenderer.invoke(CHANNELS.PURCHASES_CREATE, data),
    getOverview: () => ipcRenderer.invoke(CHANNELS.PURCHASES_OVERVIEW),
  },
});
