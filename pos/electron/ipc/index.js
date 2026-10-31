import { IPC_CHANNELS } from './channels.js';
import { registerHandler, noArgs } from './registerHandler.js';
import { getAppInfo, getSystemHealth } from '../services/systemService.js';
import * as categoryService from '../services/categoryService.js';
import * as productService from '../services/productService.js';

/**
 * Wires IPC channels to services. Handlers stay thin: validation lives in
 * registerHandler, business logic in services, SQL in repositories.
 *
 * @param {{ isTrustedSender: (frame: Electron.WebFrameMain | null) => boolean }} options
 */
export function registerIpcHandlers({ isTrustedSender }) {
  const systemOptions = { isTrustedSender, validate: noArgs };
  const generalOptions = { isTrustedSender };

  registerHandler(IPC_CHANNELS.APP_GET_INFO, () => getAppInfo(), systemOptions);
  registerHandler(IPC_CHANNELS.SYSTEM_GET_HEALTH, () => getSystemHealth(), systemOptions);

  // Categories
  registerHandler(IPC_CHANNELS.CATEGORIES_LIST, () => categoryService.listCategories(), systemOptions);
  registerHandler(IPC_CHANNELS.CATEGORIES_GET, (id) => categoryService.getCategoryById(id), generalOptions);
  registerHandler(IPC_CHANNELS.CATEGORIES_CREATE, (data) => categoryService.createCategory(data), generalOptions);
  registerHandler(IPC_CHANNELS.CATEGORIES_UPDATE, (id, data) => categoryService.updateCategory(id, data), generalOptions);
  registerHandler(IPC_CHANNELS.CATEGORIES_DELETE, (id) => categoryService.deleteCategory(id), generalOptions);

  // Products
  registerHandler(IPC_CHANNELS.PRODUCTS_LIST, (options) => productService.listProducts(options), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_GET, (id) => productService.getProductById(id), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_GET_BY_BARCODE, (barcode) => productService.getProductByBarcode(barcode), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_CREATE, (data) => productService.createProduct(data), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_UPDATE, (id, data) => productService.updateProduct(id, data), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_DELETE, (id) => productService.deleteProduct(id), generalOptions);
  registerHandler(IPC_CHANNELS.PRODUCTS_LOW_STOCK, () => productService.getLowStockProducts(), systemOptions);
}
