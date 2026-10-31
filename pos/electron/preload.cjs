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
});
