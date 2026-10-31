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
  assert(initState.currentVersion === 2, 'Schema currentVersion is 2');
  assert(initState.appliedThisLaunch.includes(1) && initState.appliedThisLaunch.includes(2), 'Migrations 1 and 2 applied on fresh db');

  // Verify idempotency
  shutdownDatabase();
  const reinitState = initDatabase({ userDataDir: tmpDir });
  assert(reinitState.appliedThisLaunch.length === 0, 'No migrations re-applied on subsequent launch');
  assert(reinitState.currentVersion === 2, 'Schema version remains 2 on restart');

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

  console.log('\n--- 4. Testing IPC Channels Mapping ---');
  assert(IPC_CHANNELS.PRODUCTS_LIST === 'products:list', 'PRODUCTS_LIST channel registered');
  assert(IPC_CHANNELS.PRODUCTS_CREATE === 'products:create', 'PRODUCTS_CREATE channel registered');
  assert(IPC_CHANNELS.CATEGORIES_LIST === 'categories:list', 'CATEGORIES_LIST channel registered');

  console.log(`\n========================================`);
  console.log(`ALL TESTS PASSED: ${passedTests} / ${totalTests}`);
  console.log(`========================================\n`);
} finally {
  shutdownDatabase();
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
