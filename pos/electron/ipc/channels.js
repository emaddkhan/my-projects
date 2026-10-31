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
});
