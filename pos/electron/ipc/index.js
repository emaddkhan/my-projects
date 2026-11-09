import { IPC_CHANNELS } from './channels.js';
import { registerHandler, noArgs } from './registerHandler.js';
import { getAppInfo, getSystemHealth } from '../services/systemService.js';
import * as categoryService from '../services/categoryService.js';
import * as productService from '../services/productService.js';
import * as salesService from '../services/salesService.js';
import * as inventoryService from '../services/inventoryService.js';
import * as supplierService from '../services/supplierService.js';
import * as purchaseService from '../services/purchaseService.js';

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

  // Sales & POS Checkout
  registerHandler(IPC_CHANNELS.SALES_CHECKOUT, (data) => salesService.completeCheckout(data), generalOptions);
  registerHandler(IPC_CHANNELS.SALES_LIST, (options) => salesService.listSales(options), generalOptions);
  registerHandler(IPC_CHANNELS.SALES_GET, (id) => salesService.getSaleById(id), generalOptions);
  registerHandler(IPC_CHANNELS.SALES_SUMMARY, () => salesService.getSalesSummary(), systemOptions);

  // Inventory Management & Stock Movements
  registerHandler(IPC_CHANNELS.INVENTORY_STOCK_IN, (data) => inventoryService.stockIn(data), generalOptions);
  registerHandler(IPC_CHANNELS.INVENTORY_STOCK_OUT, (data) => inventoryService.stockOut(data), generalOptions);
  registerHandler(IPC_CHANNELS.INVENTORY_ADJUST, (data) => inventoryService.adjustStock(data), generalOptions);
  registerHandler(IPC_CHANNELS.INVENTORY_DAMAGED, (data) => inventoryService.markDamaged(data), generalOptions);
  registerHandler(IPC_CHANNELS.INVENTORY_MOVEMENTS, (options) => inventoryService.listMovements(options), generalOptions);
  registerHandler(IPC_CHANNELS.INVENTORY_OVERVIEW, () => inventoryService.getInventoryOverview(), systemOptions);

  // Suppliers & Vendor Management
  registerHandler(IPC_CHANNELS.SUPPLIERS_LIST, (options) => supplierService.listSuppliers(options), generalOptions);
  registerHandler(IPC_CHANNELS.SUPPLIERS_GET, (id) => supplierService.getSupplierById(id), generalOptions);
  registerHandler(IPC_CHANNELS.SUPPLIERS_CREATE, (data) => supplierService.createSupplier(data), generalOptions);
  registerHandler(IPC_CHANNELS.SUPPLIERS_UPDATE, (id, data) => supplierService.updateSupplier(id, data), generalOptions);
  registerHandler(IPC_CHANNELS.SUPPLIERS_LEDGER, (id) => supplierService.getSupplierLedger(id), generalOptions);
  registerHandler(IPC_CHANNELS.SUPPLIERS_PAYMENT, (data) => supplierService.recordSupplierPayment(data), generalOptions);

  // Purchases & Purchase Invoices
  registerHandler(IPC_CHANNELS.PURCHASES_LIST, (options) => purchaseService.listPurchases(options), generalOptions);
  registerHandler(IPC_CHANNELS.PURCHASES_GET, (id) => purchaseService.getPurchaseById(id), generalOptions);
  registerHandler(IPC_CHANNELS.PURCHASES_CREATE, (data) => purchaseService.createPurchase(data), generalOptions);
  registerHandler(IPC_CHANNELS.PURCHASES_OVERVIEW, () => purchaseService.getPurchasesOverview(), systemOptions);
}
