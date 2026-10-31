import { getDatabase } from '../database/index.js';
import { createProductRepository } from '../database/repositories/productRepository.js';

export const ALLOWED_UNITS = Object.freeze(['piece', 'kg', 'gram', 'litre', 'packet', 'box']);

export function getProductRepository() {
  return createProductRepository(getDatabase());
}

/**
 * Normalizes input price to integer paisa.
 * Accepts either `paisa` (integer) or `rupees` (number/string, e.g. 150.50).
 */
export function toPaisa(rupeesOrPaisa, isPaisa = false) {
  if (isPaisa) {
    const val = Number.parseInt(rupeesOrPaisa, 10);
    if (!Number.isInteger(val) || val < 0) {
      throw new Error('Price in paisa must be a non-negative integer.');
    }
    return val;
  }

  const num = Number(rupeesOrPaisa);
  if (!Number.isFinite(num) || num < 0) {
    throw new Error('Price in PKR must be a non-negative number.');
  }
  return Math.round(num * 100);
}

function validateProductInput(data, currentId = null) {
  const { name, categoryId, barcode, sku, unit, costPrice, salePrice, costPricePaisa, salePricePaisa, currentStock, minStockLevel, isActive } = data;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Product name is required.');
  }
  if (name.trim().length > 150) {
    throw new Error('Product name cannot exceed 150 characters.');
  }

  const normalizedUnit = (unit || 'piece').toLowerCase().trim();
  if (!ALLOWED_UNITS.includes(normalizedUnit)) {
    throw new Error(`Unit must be one of: ${ALLOWED_UNITS.join(', ')}.`);
  }

  // Cost and Sale price validation in paisa: explicit rupee price takes precedence over legacy paisa field
  let costPaisa;
  if (costPrice !== undefined && costPrice !== null) {
    costPaisa = toPaisa(costPrice, false);
  } else if (costPricePaisa !== undefined && costPricePaisa !== null) {
    costPaisa = toPaisa(costPricePaisa, true);
  } else {
    costPaisa = 0;
  }

  let salePaisa;
  if (salePrice !== undefined && salePrice !== null) {
    salePaisa = toPaisa(salePrice, false);
  } else if (salePricePaisa !== undefined && salePricePaisa !== null) {
    salePaisa = toPaisa(salePricePaisa, true);
  } else {
    salePaisa = 0;
  }

  const stock = currentStock !== undefined ? Number(currentStock) : 0;
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error('Current stock must be a non-negative number.');
  }

  const minStock = minStockLevel !== undefined ? Number(minStockLevel) : 0;
  if (!Number.isFinite(minStock) || minStock < 0) {
    throw new Error('Minimum stock level must be a non-negative number.');
  }

  const repo = getProductRepository();

  // Validate barcode uniqueness if provided
  const cleanBarcode = barcode && typeof barcode === 'string' && barcode.trim().length > 0 ? barcode.trim() : null;
  if (cleanBarcode) {
    const existing = repo.getByBarcode(cleanBarcode);
    if (existing && existing.id !== currentId) {
      throw new Error(`Barcode "${cleanBarcode}" is already assigned to "${existing.name}".`);
    }
  }

  // Validate SKU uniqueness if provided
  const cleanSku = sku && typeof sku === 'string' && sku.trim().length > 0 ? sku.trim() : null;
  if (cleanSku) {
    const existing = repo.getBySku(cleanSku);
    if (existing && existing.id !== currentId) {
      throw new Error(`SKU "${cleanSku}" is already assigned to "${existing.name}".`);
    }
  }

  return {
    categoryId: categoryId ? Number(categoryId) : null,
    name: name.trim(),
    barcode: cleanBarcode,
    sku: cleanSku,
    unit: normalizedUnit,
    costPricePaisa: costPaisa,
    salePricePaisa: salePaisa,
    currentStock: stock,
    minStockLevel: minStock,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  };
}

export function listProducts(options = {}) {
  const repo = getProductRepository();
  return repo.list(options);
}

export function getProductById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid product ID.');
  }
  return getProductRepository().getById(numId);
}

export function getProductByBarcode(barcode) {
  if (!barcode || typeof barcode !== 'string' || barcode.trim() === '') {
    throw new Error('Barcode is required.');
  }
  return getProductRepository().getByBarcode(barcode.trim());
}

export function createProduct(input) {
  const validated = validateProductInput(input);
  const repo = getProductRepository();
  return repo.create(validated);
}

export function updateProduct(id, input) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid product ID.');
  }
  const repo = getProductRepository();
  const existing = repo.getById(numId);
  if (!existing) {
    throw new Error('Product not found.');
  }

  const validated = validateProductInput(input, numId);
  return repo.update(numId, validated);
}

export function deleteProduct(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid product ID.');
  }
  return getProductRepository().delete(numId);
}

export function getLowStockProducts() {
  return getProductRepository().getLowStock();
}
