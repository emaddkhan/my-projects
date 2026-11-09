/**
 * Automated test suite for Milestone 1 (Product & Category Management).
 *
 * Verifies:
 * - Database migration 001 and 002 apply cleanly in order.
 * - Idempotent re-initialization (no migrations re-applied).
 * - Category CRUD operations and constraints.
 * - Product CRUD operations with integer paisa precision.
 * - Barcode and SKU uniqueness enforcement.
 * - Allowed units constraint ('piece', 'kg', 'gram', 'litre', 'packet', 'box').
 * - Dynamic product search (by name, barcode, SKU).
 * - Low-stock filtering.
 * - Preload and IPC channel consistency.
 *
 * Usage: node scripts/test-milestone1.js
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initDatabase, shutdownDatabase, getDatabase } from '../electron/database/index.js';
import * as categoryService from '../electron/services/categoryService.js';
import * as productService from '../electron/services/productService.js';
import { IPC_CHANNELS } from '../electron/ipc/channels.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'grocery-pos-m1-test-'));

try {
  console.log('\n--- 1. Testing Database Initialization & Migrations ---');
  const initState = initDatabase({ userDataDir: tmpDir });
  assert(initState.status === 'ready', 'Database initialized with status "ready"');
  assert(initState.currentVersion === 6, 'Schema currentVersion is 6');
  assert(
    initState.appliedThisLaunch.includes(1) && 
    initState.appliedThisLaunch.includes(2) && 
    initState.appliedThisLaunch.includes(3) &&
    initState.appliedThisLaunch.includes(4) &&
    initState.appliedThisLaunch.includes(5) &&
    initState.appliedThisLaunch.includes(6),
    'Migrations 1, 2, 3, 4, 5, and 6 applied on fresh db'
  );

  // Verify idempotency
  shutdownDatabase();
  const reinitState = initDatabase({ userDataDir: tmpDir });
  assert(reinitState.appliedThisLaunch.length === 0, 'No migrations re-applied on subsequent launch');
  assert(reinitState.currentVersion === 6, 'Schema version remains 6 on restart');

  console.log('\n--- 2. Testing Category Management ---');
  const initialCategories = categoryService.listCategories();
  assert(initialCategories.length >= 7, 'Default grocery categories seeded (found ' + initialCategories.length + ')');

  const newCat = categoryService.createCategory({
    name: 'Spices & Masalas',
    description: 'Chilli powder, turmeric, cumin, garam masala',
  });
  assert(newCat.id > 0, 'Created category has positive ID');
  assert(newCat.name === 'Spices & Masalas', 'Category name matches');

  // Test duplicate category name rejection
  let duplicateRejected = false;
  try {
    categoryService.createCategory({ name: 'Spices & Masalas' });
  } catch (err) {
    duplicateRejected = true;
  }
  assert(duplicateRejected, 'Duplicate category name correctly rejected');

  // Update category
  const updatedCat = categoryService.updateCategory(newCat.id, {
    name: 'Spices & Herbs',
    description: 'Dry spices and fresh herbs',
  });
  assert(updatedCat.name === 'Spices & Herbs', 'Category updated successfully');

  console.log('\n--- 3. Testing Product Management & Paisa Precision ---');
  // Create product with PKR 250.50 sale price and PKR 200.00 cost price
  const prod1 = productService.createProduct({
    categoryId: newCat.id,
    name: 'Shan Biryani Masala 50g',
    barcode: '8964000100123',
    sku: 'SHAN-BIR-50G',
    unit: 'packet',
    costPrice: 200.0,
    salePrice: 250.5,
    currentStock: 40,
    minStockLevel: 10,
  });

  assert(prod1.id > 0, 'Product created with positive ID');
  assert(prod1.costPricePaisa === 20000, 'Cost price 200.00 correctly stored as 20000 paisa');
  assert(prod1.salePricePaisa === 25050, 'Sale price 250.50 correctly stored as 25050 paisa');
  assert(prod1.unit === 'packet', 'Product unit is packet');

  // Lookup by barcode
  const foundByBarcode = productService.getProductByBarcode('8964000100123');
  assert(foundByBarcode && foundByBarcode.id === prod1.id, 'Product found by exact barcode');

  // Duplicate barcode rejection
  let dupBarcodeRejected = false;
  try {
    productService.createProduct({
      categoryId: newCat.id,
      name: 'Duplicate Barcode Item',
      barcode: '8964000100123',
      unit: 'piece',
      salePrice: 100,
    });
  } catch (err) {
    dupBarcodeRejected = true;
  }
  assert(dupBarcodeRejected, 'Duplicate barcode correctly rejected');

  // Invalid unit rejection
  let invalidUnitRejected = false;
  try {
    productService.createProduct({
      name: 'Invalid Unit Item',
      unit: 'invalid_unit_name',
      salePrice: 50,
    });
  } catch (err) {
    invalidUnitRejected = true;
  }
  assert(invalidUnitRejected, 'Invalid unit rejected');

  // Add low-stock product
  const prod2 = productService.createProduct({
    categoryId: newCat.id,
    name: 'National Korma Masala 45g',
    barcode: '8964000200456',
    unit: 'packet',
    costPrice: 180,
    salePrice: 220,
    currentStock: 3, // <= minStockLevel (5)
    minStockLevel: 5,
  });

  // Verify search
  const searchByName = productService.listProducts({ search: 'Biryani' });
  assert(searchByName.total === 1 && searchByName.items[0].name.includes('Biryani'), 'Search by name works');

  const searchByBarcode = productService.listProducts({ search: '8964000200456' });
  assert(searchByBarcode.total === 1 && searchByBarcode.items[0].id === prod2.id, 'Search by barcode works');

  const searchByCategory = productService.listProducts({ categoryId: newCat.id });
  assert(searchByCategory.total === 2, 'Filter by category works (2 products in Spices)');

  // Verify low stock query
  const lowStock = productService.getLowStockProducts();
  assert(lowStock.some((p) => p.id === prod2.id), 'Low stock product correctly detected');

  // Category product count reflection
  const catsWithCount = categoryService.listCategories();
  const spiceCat = catsWithCount.find((c) => c.id === newCat.id);
  assert(spiceCat.productCount === 2, 'Category product count is 2');

  // Update product
  const updatedProd = productService.updateProduct(prod1.id, {
    ...prod1,
    currentStock: 60,
    salePrice: 260.0,
  });
  assert(updatedProd.currentStock === 60, 'Product stock updated to 60');
  assert(updatedProd.salePricePaisa === 26000, 'Sale price updated to 26000 paisa');

  // Delete product
  const deleteSuccess = productService.deleteProduct(prod2.id);
  assert(deleteSuccess === true, 'Product deleted successfully');
  assert(productService.getProductById(prod2.id) === null, 'Deleted product is no longer returned');

  console.log('\n--- 4. Testing POS Sales Checkout & Atomic Inventory Deduction ---');
  const salesService = await import('../electron/services/salesService.js');
  const sale = salesService.completeCheckout({
    customerName: 'Tariq Mehmood',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: prod1.id,
        productName: prod1.name,
        unit: prod1.unit,
        unitPricePaisa: 26000,
        costPricePaisa: 20000,
        quantity: 3,
      },
    ],
  });

  assert(sale.id > 0, 'Sale recorded with positive ID');
  assert(sale.invoiceNumber.startsWith('INV-'), 'Generated valid invoice number: ' + sale.invoiceNumber);
  assert(sale.totalPaisa === 78000, 'Total paisa is 78000 (3 × 260.00)');
  assert(sale.changeDuePaisa === 22000, 'Change due is 22000 paisa (1000 - 780)');

  const prodAfterSale = productService.getProductById(prod1.id);
  assert(prodAfterSale.currentStock === 57, 'Inventory atomically deducted from 60 to 57');

  const salesSummary = salesService.getSalesSummary();
  assert(salesSummary.totalOrders >= 1, 'Today summary counts at least 1 order');
  assert(salesSummary.totalRevenuePaisa >= 78000, 'Today summary records correct revenue');

  console.log('\n--- 5. Milestone 2.5: Strict Stock Validation & Rollback ---');
  // 5.1 Insufficient stock rejection
  let insufficientCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Oversell Tester',
      cashReceivedPaisa: 3000000,
      items: [
        {
          productId: prod1.id,
          productName: prod1.name,
          unit: prod1.unit,
          unitPricePaisa: 26000,
          quantity: 100, // available is 57
        },
      ],
    });
  } catch (err) {
    insufficientCaught = true;
    assert(err.message.includes('Insufficient stock'), 'Error message specifies insufficient stock: ' + err.message);
  }
  assert(insufficientCaught === true, 'Oversell attempt was rejected');
  assert(productService.getProductById(prod1.id).currentStock === 57, 'Stock remained untouched at 57 after rejected sale');

  // 5.2 Exact stock checkout (selling all remaining 57 units)
  const exactSale = salesService.completeCheckout({
    customerName: 'Bulk Buyer',
    cashReceivedPaisa: 2000000,
    items: [
      {
        productId: prod1.id,
        productName: prod1.name,
        unit: prod1.unit,
        unitPricePaisa: 26000,
        quantity: 57,
      },
    ],
  });
  assert(exactSale.id > 0, 'Exact stock checkout succeeded');
  assert(productService.getProductById(prod1.id).currentStock === 0, 'Stock reduced exactly to 0');

  // Selling when stock is 0 is rejected
  let zeroStockCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Zero Stock Tester',
      cashReceivedPaisa: 50000,
      items: [
        {
          productId: prod1.id,
          productName: prod1.name,
          unit: prod1.unit,
          unitPricePaisa: 26000,
          quantity: 1,
        },
      ],
    });
  } catch (err) {
    zeroStockCaught = true;
  }
  assert(zeroStockCaught === true, 'Sale rejected when available stock is 0');

  // 5.3 Fractional stock quantities (e.g. Rice 2.5 kg)
  const riceProduct = productService.createProduct({
    categoryId: newCat.id,
    name: 'Basmati Rice Super Kernel',
    unit: 'kg',
    salePrice: 320.0,
    costPrice: 260.0,
    currentStock: 5.5,
    minStockLevel: 2.0,
  });
  assert(riceProduct.currentStock === 5.5, 'Created metric product with 5.5 kg');

  // Sell 2.25 kg
  const riceSale = salesService.completeCheckout({
    customerName: 'Weight Buyer',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: riceProduct.id,
        productName: riceProduct.name,
        unit: riceProduct.unit,
        unitPricePaisa: 32000,
        quantity: 2.25,
      },
    ],
  });
  assert(riceSale.id > 0, 'Fractional 2.25 kg checkout succeeded');
  const riceAfterSale1 = productService.getProductById(riceProduct.id);
  assert(Number(riceAfterSale1.currentStock.toFixed(2)) === 3.25, 'Stock reduced from 5.5 kg to 3.25 kg');

  // Try to sell 4.0 kg when 3.25 kg remains
  let metricOversellCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Metric Oversell',
      cashReceivedPaisa: 200000,
      items: [
        {
          productId: riceProduct.id,
          productName: riceProduct.name,
          unit: riceProduct.unit,
          unitPricePaisa: 32000,
          quantity: 4.0,
        },
      ],
    });
  } catch (err) {
    metricOversellCaught = true;
    assert(err.message.includes('3.25 kg'), 'Error specifies available 3.25 kg: ' + err.message);
  }
  assert(metricOversellCaught === true, 'Metric oversell attempt was rejected');
  assert(Number(productService.getProductById(riceProduct.id).currentStock.toFixed(2)) === 3.25, 'Metric stock untouched at 3.25 kg');

  // 5.4 Multiple products in cart where one has insufficient stock (Atomic Rollback)
  const flourProduct = productService.createProduct({
    categoryId: newCat.id,
    name: 'Chakki Atta Premium',
    unit: 'packet',
    salePrice: 150.0,
    costPrice: 120.0,
    currentStock: 10,
    minStockLevel: 2,
  });

  let mixedCartCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Mixed Cart Buyer',
      cashReceivedPaisa: 500000,
      items: [
        {
          productId: flourProduct.id, // has 10 (sufficient for 2)
          productName: flourProduct.name,
          unit: flourProduct.unit,
          unitPricePaisa: 15000,
          quantity: 2,
        },
        {
          productId: riceProduct.id, // has 3.25 (INSUFFICIENT for 10)
          productName: riceProduct.name,
          unit: riceProduct.unit,
          unitPricePaisa: 32000,
          quantity: 10,
        },
      ],
    });
  } catch (err) {
    mixedCartCaught = true;
  }
  assert(mixedCartCaught === true, 'Mixed cart with one out-of-stock item was rejected');
  assert(productService.getProductById(flourProduct.id).currentStock === 10, 'Flour stock was NOT deducted (atomic rollback preserved it at 10)');
  assert(Number(productService.getProductById(riceProduct.id).currentStock.toFixed(2)) === 3.25, 'Rice stock was NOT deducted');

  // 5.5 Aggregate cart quantity check (same product across multiple line items)
  let aggregateOversellCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Duplicate Line Buyer',
      cashReceivedPaisa: 500000,
      items: [
        {
          productId: flourProduct.id, // has 10
          productName: flourProduct.name,
          unit: flourProduct.unit,
          unitPricePaisa: 15000,
          quantity: 7, // line 1: 7
        },
        {
          productId: flourProduct.id,
          productName: flourProduct.name,
          unit: flourProduct.unit,
          unitPricePaisa: 15000,
          quantity: 6, // line 2: 6 (combined: 13 > 10)
        },
      ],
    });
  } catch (err) {
    aggregateOversellCaught = true;
    assert(err.message.includes('Requested: 13'), 'Aggregate quantity check detected total 13: ' + err.message);
  }
  assert(aggregateOversellCaught === true, 'Duplicate cart lines aggregating over stock rejected');
  assert(productService.getProductById(flourProduct.id).currentStock === 10, 'Stock remains 10 after aggregate oversell');

  // 5.6 Inactive product rejection
  productService.updateProduct(flourProduct.id, {
    ...flourProduct,
    isActive: 0,
  });
  let inactiveCaught = false;
  try {
    salesService.completeCheckout({
      customerName: 'Inactive Product Buyer',
      cashReceivedPaisa: 50000,
      items: [
        {
          productId: flourProduct.id,
          productName: flourProduct.name,
          unit: flourProduct.unit,
          unitPricePaisa: 15000,
          quantity: 1,
        },
      ],
    });
  } catch (err) {
    inactiveCaught = true;
    assert(err.message.includes('inactive'), 'Error states product is inactive: ' + err.message);
  }
  assert(inactiveCaught === true, 'Inactive product checkout rejected');

  // Re-enable flour
  productService.updateProduct(flourProduct.id, {
    ...flourProduct,
    isActive: 1,
  });

  console.log('\n--- 6. Milestone 2.5: Duplicate Checkout Protection & Idempotency ---');
  const idempotencyToken = 'token-pos-test-999';
  const initialSalesCount = salesService.listSales().total;

  // First checkout with idempotency token
  const firstSale = salesService.completeCheckout({
    idempotencyKey: idempotencyToken,
    customerName: 'Idempotency Tester',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: flourProduct.id,
        productName: flourProduct.name,
        unit: flourProduct.unit,
        unitPricePaisa: 15000,
        quantity: 2,
      },
    ],
  });
  assert(firstSale.id > 0, 'First checkout succeeded with ID: ' + firstSale.id);
  assert(productService.getProductById(flourProduct.id).currentStock === 8, 'Flour stock reduced from 10 to 8');
  assert(salesService.listSales().total === initialSalesCount + 1, 'Sales count increased by exactly 1');

  // Immediate retry with the EXACT same idempotency token
  const secondSale = salesService.completeCheckout({
    idempotencyKey: idempotencyToken,
    customerName: 'Idempotency Tester',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: flourProduct.id,
        productName: flourProduct.name,
        unit: flourProduct.unit,
        unitPricePaisa: 15000,
        quantity: 2,
      },
    ],
  });
  assert(secondSale.id === firstSale.id, 'Duplicate checkout returned original sale ID (idempotent replay)');
  assert(secondSale.invoiceNumber === firstSale.invoiceNumber, 'Duplicate checkout returned original invoice number: ' + secondSale.invoiceNumber);
  assert(productService.getProductById(flourProduct.id).currentStock === 8, 'Stock was NOT deducted again (remained at 8)');
  assert(salesService.listSales().total === initialSalesCount + 1, 'No duplicate sale row created in database');

  // Subsequent legitimate checkout with a DIFFERENT token succeeds normally
  const legitimateNextSale = salesService.completeCheckout({
    idempotencyKey: 'token-pos-test-1000',
    customerName: 'Next Customer',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: flourProduct.id,
        productName: flourProduct.name,
        unit: flourProduct.unit,
        unitPricePaisa: 15000,
        quantity: 3,
      },
    ],
  });
  assert(legitimateNextSale.id > firstSale.id, 'New legitimate checkout succeeded with new ID');
  assert(productService.getProductById(flourProduct.id).currentStock === 5, 'Stock correctly reduced from 8 to 5');
  assert(salesService.listSales().total === initialSalesCount + 2, 'Sales count increased to 2 new sales');

  console.log('\n--- 7. Testing IPC Channels Mapping ---');
  assert(IPC_CHANNELS.PRODUCTS_LIST === 'products:list', 'PRODUCTS_LIST channel registered');
  assert(IPC_CHANNELS.PRODUCTS_CREATE === 'products:create', 'PRODUCTS_CREATE channel registered');
  assert(IPC_CHANNELS.CATEGORIES_LIST === 'categories:list', 'CATEGORIES_LIST channel registered');
  assert(IPC_CHANNELS.SALES_CHECKOUT === 'sales:checkout', 'SALES_CHECKOUT channel registered');
  assert(IPC_CHANNELS.SALES_LIST === 'sales:list', 'SALES_LIST channel registered');
  assert(IPC_CHANNELS.INVENTORY_STOCK_IN === 'inventory:stock-in', 'INVENTORY_STOCK_IN channel registered');
  assert(IPC_CHANNELS.INVENTORY_STOCK_OUT === 'inventory:stock-out', 'INVENTORY_STOCK_OUT channel registered');
  assert(IPC_CHANNELS.INVENTORY_ADJUST === 'inventory:adjust', 'INVENTORY_ADJUST channel registered');
  assert(IPC_CHANNELS.INVENTORY_DAMAGED === 'inventory:damaged', 'INVENTORY_DAMAGED channel registered');
  assert(IPC_CHANNELS.INVENTORY_MOVEMENTS === 'inventory:movements', 'INVENTORY_MOVEMENTS channel registered');
  assert(IPC_CHANNELS.INVENTORY_OVERVIEW === 'inventory:overview', 'INVENTORY_OVERVIEW channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_LIST === 'suppliers:list', 'SUPPLIERS_LIST channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_GET === 'suppliers:get', 'SUPPLIERS_GET channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_CREATE === 'suppliers:create', 'SUPPLIERS_CREATE channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_UPDATE === 'suppliers:update', 'SUPPLIERS_UPDATE channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_LEDGER === 'suppliers:ledger', 'SUPPLIERS_LEDGER channel registered');
  assert(IPC_CHANNELS.SUPPLIERS_PAYMENT === 'suppliers:payment', 'SUPPLIERS_PAYMENT channel registered');
  assert(IPC_CHANNELS.PURCHASES_LIST === 'purchases:list', 'PURCHASES_LIST channel registered');
  assert(IPC_CHANNELS.PURCHASES_GET === 'purchases:get', 'PURCHASES_GET channel registered');
  assert(IPC_CHANNELS.PURCHASES_CREATE === 'purchases:create', 'PURCHASES_CREATE channel registered');
  assert(IPC_CHANNELS.PURCHASES_OVERVIEW === 'purchases:overview', 'PURCHASES_OVERVIEW channel registered');

  console.log('\n--- 8. Milestone 3: Inventory Management & Stock Movement Ledger ---');
  const inventoryService = await import('../electron/services/inventoryService.js');

  // 8.1 Stock In increases stock correctly
  const stockInRes = inventoryService.stockIn({
    productId: flourProduct.id, // currently 5
    quantity: 15,
    reason: 'Delivery from supplier',
    reference: 'PO-2026-001',
  });
  assert(stockInRes.movementType === 'stock_in', 'Movement recorded as stock_in');
  assert(stockInRes.previousStock === 5, 'Previous stock was 5');
  assert(stockInRes.newStock === 20, 'New stock is 20');
  assert(productService.getProductById(flourProduct.id).currentStock === 20, 'Flour stock increased to 20');

  // 8.2 Stock Out decreases stock correctly
  const stockOutRes = inventoryService.stockOut({
    productId: flourProduct.id,
    quantity: 4,
    reason: 'Store internal sampling',
    reference: 'SAMPLE-1',
  });
  assert(stockOutRes.movementType === 'stock_out', 'Movement recorded as stock_out');
  assert(stockOutRes.previousStock === 20, 'Previous stock was 20');
  assert(stockOutRes.newStock === 16, 'New stock is 16');
  assert(productService.getProductById(flourProduct.id).currentStock === 16, 'Flour stock decreased to 16');

  // 8.3 Stock Out greater than available stock is rejected
  let stockOutOversellCaught = false;
  const initialMovementsCount = inventoryService.listMovements({ productId: flourProduct.id }).total;
  try {
    inventoryService.stockOut({
      productId: flourProduct.id,
      quantity: 50, // only 16 available
      reason: 'Excessive withdrawal',
    });
  } catch (err) {
    stockOutOversellCaught = true;
    assert(err.message.includes('Insufficient stock'), 'Error specifies insufficient stock: ' + err.message);
  }
  assert(stockOutOversellCaught === true, 'Excessive stock out was rejected');
  assert(productService.getProductById(flourProduct.id).currentStock === 16, 'Stock remained untouched at 16 after rejected stock out');
  assert(inventoryService.listMovements({ productId: flourProduct.id }).total === initialMovementsCount, 'No movement was created for failed stock out');

  // 8.4 Stock Adjustment increases stock
  const adjustInRes = inventoryService.adjustStock({
    productId: flourProduct.id,
    targetPhysicalStock: 25, // current is 16 -> +9
    reason: 'Physical shelf count audit',
  });
  assert(adjustInRes.movementType === 'adjustment_in', 'Adjustment recorded as adjustment_in');
  assert(adjustInRes.quantity === 9, 'Adjustment delta is 9');
  assert(adjustInRes.newStock === 25, 'New stock is 25');
  assert(productService.getProductById(flourProduct.id).currentStock === 25, 'Stock updated to 25');

  // 8.5 Stock Adjustment decreases stock
  const adjustOutRes = inventoryService.adjustStock({
    productId: flourProduct.id,
    targetPhysicalStock: 22, // current is 25 -> -3
    reason: 'Damage and unrecorded shrinkage',
  });
  assert(adjustOutRes.movementType === 'adjustment_out', 'Adjustment recorded as adjustment_out');
  assert(adjustOutRes.quantity === 3, 'Adjustment delta is 3');
  assert(adjustOutRes.newStock === 22, 'New stock is 22');
  assert(productService.getProductById(flourProduct.id).currentStock === 22, 'Stock updated to 22');

  // 8.6 Stock Adjustment cannot create negative stock
  let negAdjustCaught = false;
  try {
    inventoryService.adjustStock({
      productId: flourProduct.id,
      targetPhysicalStock: -5,
      reason: 'Invalid physical count',
    });
  } catch (err) {
    negAdjustCaught = true;
  }
  assert(negAdjustCaught === true, 'Negative target physical stock rejected');
  assert(productService.getProductById(flourProduct.id).currentStock === 22, 'Stock untouched at 22');

  // 8.7 Damaged stock is deducted correctly
  const damagedRes = inventoryService.markDamaged({
    productId: flourProduct.id,
    quantity: 2,
    reason: 'Water spill damage on bags',
  });
  assert(damagedRes.movementType === 'damaged', 'Movement recorded as damaged');
  assert(damagedRes.previousStock === 22, 'Previous stock was 22');
  assert(damagedRes.newStock === 20, 'New stock is 20');
  assert(productService.getProductById(flourProduct.id).currentStock === 20, 'Stock reduced to 20');

  // 8.8 Damaged quantity cannot exceed available stock
  let excessDamageCaught = false;
  try {
    inventoryService.markDamaged({
      productId: flourProduct.id,
      quantity: 50,
      reason: 'All spoiled',
    });
  } catch (err) {
    excessDamageCaught = true;
  }
  assert(excessDamageCaught === true, 'Excessive damaged stock rejected');
  assert(productService.getProductById(flourProduct.id).currentStock === 20, 'Stock remains 20 after failed damage deduction');

  // 8.9 Fractional kg quantities work correctly
  const riceKgIn = inventoryService.stockIn({
    productId: riceProduct.id, // currently 3.25 kg
    quantity: 4.75,
    reason: 'Wholesale sack added',
  });
  assert(riceKgIn.newStock === 8, 'Fractional 3.25 kg + 4.75 kg = 8.0 kg');
  assert(productService.getProductById(riceProduct.id).currentStock === 8, 'Rice stock is 8 kg');

  const riceKgOut = inventoryService.stockOut({
    productId: riceProduct.id,
    quantity: 2.25,
    reason: 'Transferred to bulk dispenser',
  });
  assert(riceKgOut.newStock === 5.75, 'Fractional 8.0 kg - 2.25 kg = 5.75 kg');
  assert(productService.getProductById(riceProduct.id).currentStock === 5.75, 'Rice stock is 5.75 kg');

  // 8.10 Fractional litre quantities work correctly
  const cookingOil = productService.createProduct({
    categoryId: newCat.id,
    name: 'Habib Cooking Oil 1L',
    unit: 'litre',
    salePrice: 480.0,
    costPrice: 420.0,
    currentStock: 10.0,
    minStockLevel: 2.0,
  });
  assert(cookingOil.unit === 'litre', 'Oil product created with litre unit');

  const oilIn = inventoryService.stockIn({
    productId: cookingOil.id,
    quantity: 2.5,
    reason: 'Partial carton received',
  });
  assert(oilIn.newStock === 12.5, '10.0 L + 2.5 L = 12.5 L');

  const oilOut = inventoryService.stockOut({
    productId: cookingOil.id,
    quantity: 1.25,
    reason: 'Internal kitchen use',
  });
  assert(oilOut.newStock === 11.25, '12.5 L - 1.25 L = 11.25 L');

  // 8.11 Piece-based product quantity rules remain intact
  const pieceProduct = productService.createProduct({
    categoryId: newCat.id,
    name: 'LU Prince Biscuits Half Roll',
    unit: 'piece',
    salePrice: 50.0,
    costPrice: 40.0,
    currentStock: 30,
    minStockLevel: 5,
  });

  let fractionalPieceCaught = false;
  try {
    inventoryService.stockIn({
      productId: pieceProduct.id,
      quantity: 1.5, // fractional piece not allowed
      reason: 'Broken pack test',
    });
  } catch (err) {
    fractionalPieceCaught = true;
    assert(err.message.includes('whole number'), 'Error specifies whole number required for piece: ' + err.message);
  }
  assert(fractionalPieceCaught === true, 'Fractional piece stock in was rejected');

  // Whole number piece stock in succeeds
  const pieceIn = inventoryService.stockIn({
    productId: pieceProduct.id,
    quantity: 10,
    reason: 'Carton of pieces',
  });
  assert(pieceIn.newStock === 40, '30 + 10 = 40 pieces');

  // 8.12 Checkout creates linked sale movements
  const saleBeforeMovementsCount = inventoryService.listMovements({ movementType: 'sale' }).total;
  const newSale = salesService.completeCheckout({
    customerName: 'Movement Test Customer',
    cashReceivedPaisa: 100000,
    items: [
      {
        productId: pieceProduct.id, // currently 40
        productName: pieceProduct.name,
        unit: pieceProduct.unit,
        unitPricePaisa: 5000,
        quantity: 5,
      },
    ],
  });
  assert(newSale.id > 0, 'Checkout succeeded with ID: ' + newSale.id);
  assert(productService.getProductById(pieceProduct.id).currentStock === 35, 'Piece stock reduced from 40 to 35');

  const saleMovements = inventoryService.listMovements({ movementType: 'sale' });
  assert(saleMovements.total === saleBeforeMovementsCount + 1, 'Sale movement count increased by exactly 1');
  const latestSaleMovement = saleMovements.items[0];
  assert(latestSaleMovement.productId === pieceProduct.id, 'Sale movement records correct product');
  assert(latestSaleMovement.quantity === 5, 'Sale movement records sold quantity of 5');
  assert(latestSaleMovement.referenceType === 'sale', 'Reference type is "sale"');
  assert(latestSaleMovement.referenceId === String(newSale.id), 'Reference ID matches sale ID: ' + newSale.id);

  // 8.13 Product creation with initial stock records opening balance
  const initialStockMovements = inventoryService.listMovements({
    productId: pieceProduct.id,
    movementType: 'opening_balance',
  });
  assert(initialStockMovements.total === 1, 'Product with initial stock received opening_balance movement');
  assert(initialStockMovements.items[0].quantity === 30, 'Opening balance quantity matches initial 30 pieces');

  // 8.14 Inventory Overview metrics
  const overview = inventoryService.getInventoryOverview();
  assert(overview.totalActiveProducts > 0, 'Overview reports active products: ' + overview.totalActiveProducts);
  assert(Number.isInteger(overview.lowStockCount), 'Overview reports lowStockCount');
  assert(Number.isInteger(overview.outOfStockCount), 'Overview reports outOfStockCount');
  assert(overview.movementsTodayCount > 0, 'Overview reports movements today: ' + overview.movementsTodayCount);

  console.log('\n--- 9. Milestone 4: Suppliers & Purchase Management ---');
  const supplierService = await import('../electron/services/supplierService.js');
  const purchaseService = await import('../electron/services/purchaseService.js');

  // 9.1 Seeded suppliers
  const initialSuppliers = supplierService.listSuppliers();
  assert(initialSuppliers.items.length >= 3, 'Default suppliers seeded (found ' + initialSuppliers.items.length + ')');
  const unilever = initialSuppliers.items.find(s => s.name.includes('Unilever'));
  assert(Boolean(unilever), 'Unilever Pakistan default supplier exists');

  // 9.2 Create supplier with opening balance
  const sup1 = supplierService.createSupplier({
    name: 'Al-Madina Wholesale Distributors',
    phone: '0300-1122334',
    email: 'orders@almadinawholesale.pk',
    address: 'Shop 12, Grain Market, Multan',
    openingBalancePaisa: 500000, // PKR 5,000.00
    notes: '15 days credit terms',
  });
  assert(sup1.id > 0, 'Supplier created with positive ID: ' + sup1.id);
  assert(sup1.name === 'Al-Madina Wholesale Distributors', 'Supplier name matches');
  assert(sup1.openingBalancePaisa === 500000, 'Opening balance is 500,000 paisa (PKR 5,000.00)');
  assert(sup1.currentBalancePaisa === 500000, 'Initial current balance matches opening balance');

  // 9.3 Validation constraints
  let emptyNameCaught = false;
  try {
    supplierService.createSupplier({ name: '   ', openingBalancePaisa: 0 });
  } catch (err) {
    emptyNameCaught = true;
    assert(err.message.includes('Supplier name is required'), 'Empty name rejected: ' + err.message);
  }
  assert(emptyNameCaught === true, 'Supplier with empty name was rejected');

  let negativeOpeningCaught = false;
  try {
    supplierService.createSupplier({ name: 'Bad Balance Supplier', openingBalancePaisa: -500 });
  } catch (err) {
    negativeOpeningCaught = true;
    assert(err.message.includes('non-negative integer'), 'Negative opening balance rejected: ' + err.message);
  }
  assert(negativeOpeningCaught === true, 'Supplier with negative opening balance was rejected');

  // 9.4 Update supplier
  const updatedSup = supplierService.updateSupplier(sup1.id, {
    ...sup1,
    phone: '0300-9988776',
    notes: 'Updated credit terms: 30 days',
  });
  assert(updatedSup.phone === '0300-9988776', 'Supplier phone updated');
  assert(updatedSup.notes === 'Updated credit terms: 30 days', 'Supplier notes updated');

  // 9.5 Create purchase invoice with single item and verify:
  // - Inward stock movement recorded (movement_type: stock_in, reference_type: purchase)
  // - Stock incremented
  // - Moving weighted average cost calculated
  const teaProduct = productService.createProduct({
    categoryId: newCat.id,
    name: 'Tapal Danedar Tea 400g',
    unit: 'packet',
    salePrice: 700.0,
    costPrice: 500.0, // 50000 paisa
    currentStock: 20,
    minStockLevel: 5,
  });

  const purchase1 = purchaseService.createPurchase({
    supplierId: sup1.id,
    supplierInvoiceNumber: 'ALM-INV-001',
    purchaseDate: '2026-11-09T10:00:00.000Z',
    discountPaisa: 0,
    paidPaisa: 0,
    notes: 'Winter stock intake',
    items: [
      {
        productId: teaProduct.id,
        quantity: 30, // 30 packets
        unitCostPaisa: 60000, // PKR 600.00 per packet (new purchase cost)
      },
    ],
  });

  assert(purchase1.id > 0, 'Purchase 1 created with ID: ' + purchase1.id);
  assert(purchase1.invoiceNumber.startsWith('PUR-'), 'Generated valid purchase invoice number: ' + purchase1.invoiceNumber);
  assert(purchase1.subtotalPaisa === 1800000, 'Subtotal is 1,800,000 paisa (30 × 600.00)');
  assert(purchase1.totalPaisa === 1800000, 'Total is 1,800,000 paisa');
  assert(purchase1.paidPaisa === 0, 'Paid paisa is 0');
  assert(purchase1.duePaisa === 1800000, 'Due paisa is 1,800,000');
  assert(purchase1.status === 'unpaid', 'Status is unpaid');

  // Verify stock incremented from 20 to 50
  const teaAfterPur = productService.getProductById(teaProduct.id);
  assert(teaAfterPur.currentStock === 50, 'Tea stock incremented from 20 to 50');

  // Verify Moving Weighted Average Cost:
  // (20 × 50000) + (30 × 60000) = 1,000,000 + 1,800,000 = 2,800,000 paisa
  // 2,800,000 / 50 = 56,000 paisa (PKR 560.00)
  assert(teaAfterPur.costPricePaisa === 56000, 'Cost price updated via moving weighted average to 56,000 paisa (PKR 560.00)');

  // Verify stock movement ledger link
  const teaMovements = inventoryService.listMovements({
    productId: teaProduct.id,
    movementType: 'stock_in',
  });
  const purMovement = teaMovements.items.find(m => m.referenceType === 'purchase' && m.referenceId === String(purchase1.id));
  assert(Boolean(purMovement), 'Stock movement with reference_type "purchase" and matching purchase ID exists');
  assert(purMovement.quantity === 30, 'Stock movement quantity matches purchase item quantity of 30');

  // 9.6 Metric Fractional Purchase (Rice product)
  const riceBefore = productService.getProductById(riceProduct.id);
  const riceBeforeStock = riceBefore.currentStock; // 3.25 kg
  const riceBeforeCost = riceBefore.costPricePaisa;

  const purchase2 = purchaseService.createPurchase({
    supplierId: sup1.id,
    supplierInvoiceNumber: 'ALM-INV-002',
    purchaseDate: '2026-11-09T11:00:00.000Z',
    discountPaisa: 0,
    paidPaisa: 0,
    items: [
      {
        productId: riceProduct.id,
        quantity: 6.75, // 6.75 kg
        unitCostPaisa: 28000, // PKR 280.00 / kg
      },
    ],
  });
  assert(purchase2.id > 0, 'Metric fractional purchase created');
  const expectedLinePaisa = Math.round(6.75 * 28000); // 189,000 paisa
  assert(purchase2.totalPaisa === expectedLinePaisa, 'Metric total computed accurately in paisa: ' + expectedLinePaisa);
  const riceAfter = productService.getProductById(riceProduct.id);
  assert(Number(riceAfter.currentStock.toFixed(2)) === Number((riceBeforeStock + 6.75).toFixed(2)), 'Rice stock increased to 10.0 kg');

  // 9.7 Purchase with Trade Discount and Partial Payment
  const purchase3 = purchaseService.createPurchase({
    supplierId: sup1.id,
    supplierInvoiceNumber: 'ALM-INV-003',
    purchaseDate: '2026-11-09T12:00:00.000Z',
    discountPaisa: 50000, // PKR 500.00 discount
    paidPaisa: 100000, // PKR 1,000.00 initial payment
    paymentMethod: 'cash',
    notes: 'Partial payment on delivery',
    items: [
      {
        productId: teaProduct.id,
        quantity: 10,
        unitCostPaisa: 56000, // Line total = 560,000 paisa
      },
    ],
  });
  assert(purchase3.subtotalPaisa === 560000, 'Subtotal is 560,000 paisa');
  assert(purchase3.discountPaisa === 50000, 'Discount is 50,000 paisa');
  assert(purchase3.totalPaisa === 510000, 'Net total is 510,000 paisa (560,000 - 50,000)');
  assert(purchase3.paidPaisa === 100000, 'Paid is 100,000 paisa');
  assert(purchase3.duePaisa === 410000, 'Due balance is 410,000 paisa (510,000 - 100,000)');
  assert(purchase3.status === 'partial', 'Status is "partial"');

  // Verify payment recorded in supplier_payments
  const fullPur3 = purchaseService.getPurchaseById(purchase3.id);
  assert(fullPur3.payments.length === 1, 'Initial payment linked to purchase');
  assert(fullPur3.payments[0].amountPaisa === 100000, 'Payment record amount is 100,000 paisa');

  // 9.8 Supplier Khata Ledger Verification
  const ledger = supplierService.getSupplierLedger(sup1.id);
  assert(ledger.supplier.id === sup1.id, 'Ledger matches supplier ID');
  assert(ledger.entries.length === 5, 'Ledger has 5 entries (Opening + 3 Purchases + 1 Payment)');
  assert(ledger.entries[0].type === 'opening_balance', 'First ledger entry is opening balance');
  assert(ledger.entries[0].creditPaisa === 500000, 'Opening balance credit is 500,000 paisa');
  assert(ledger.entries[0].runningBalancePaisa === 500000, 'Running balance after opening is 500,000');

  // Check cumulative liability
  const expectedPayable = 500000 + 1800000 + expectedLinePaisa + 510000 - 100000;
  assert(ledger.currentBalancePaisa === expectedPayable, 'Supplier current payable balance calculated correctly: ' + expectedPayable);

  // 9.9 Record Dedicated Payment Against Purchase Invoice
  const payResult = supplierService.recordSupplierPayment({
    supplierId: sup1.id,
    purchaseId: purchase1.id,
    amountPaisa: 1800000, // Settle purchase 1 in full
    paymentMethod: 'bank_transfer',
    reference: 'HBL-FT-99012',
    notes: 'Paid via bank transfer',
  });
  assert(payResult.id > 0, 'Payment recorded with ID: ' + payResult.id);

  // Verify purchase 1 is now completed
  const pur1AfterPay = purchaseService.getPurchaseById(purchase1.id);
  assert(pur1AfterPay.paidPaisa === 1800000, 'Purchase 1 paid is now 1,800,000 paisa');
  assert(pur1AfterPay.duePaisa === 0, 'Purchase 1 due is now 0');
  assert(pur1AfterPay.status === 'completed', 'Purchase 1 status transitioned to "completed"');

  // Verify ledger reflects additional payment debit
  const ledgerAfterPay = supplierService.getSupplierLedger(sup1.id);
  assert(ledgerAfterPay.currentBalancePaisa === expectedPayable - 1800000, 'Payable reduced by 1,800,000 paisa');

  // 9.10 Atomic Rollback on Invalid Purchase
  let rollbackCaught = false;
  const purCountBefore = purchaseService.listPurchases().total;
  const teaStockBefore = productService.getProductById(teaProduct.id).currentStock;
  try {
    purchaseService.createPurchase({
      supplierId: sup1.id,
      items: [
        {
          productId: 999999, // non-existent product
          quantity: 10,
          unitCostPaisa: 5000,
        },
      ],
    });
  } catch (err) {
    rollbackCaught = true;
    assert(err.message.includes('does not exist'), 'Rollback error message: ' + err.message);
  }
  assert(rollbackCaught === true, 'Invalid purchase was rejected');
  assert(purchaseService.listPurchases().total === purCountBefore, 'No purchase record created on rollback');
  assert(productService.getProductById(teaProduct.id).currentStock === teaStockBefore, 'Stock remained untouched on rollback');

  // 9.11 Purchases Overview Metrics
  const purOverview = purchaseService.getPurchasesOverview();
  assert(purOverview.purchasesCount >= 3, 'Overview counts at least 3 purchases');
  assert(purOverview.totalPurchasesPaisa > 0, 'Overview reports total purchases paisa');
  assert(purOverview.totalPaidPaisa >= 1900000, 'Overview reports total paid paisa');
  assert(purOverview.activeSuppliersCount >= 4, 'Overview reports active suppliers count: ' + purOverview.activeSuppliersCount);

  console.log(`\n========================================`);
  console.log(`ALL TESTS PASSED: ${passedTests} / ${totalTests}`);
  console.log(`========================================\n`);
} finally {
  shutdownDatabase();
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
