import { getDatabase } from '../database/index.js';
import { createInventoryRepository } from '../database/repositories/inventoryRepository.js';

export function getInventoryRepository() {
  return createInventoryRepository(getDatabase());
}

/**
 * Stock In: Receiving inventory (returns, direct stock reception, etc.)
 */
export function stockIn({ productId, quantity, reason = null, reference = null }) {
  if (!productId) throw new Error('Product ID is required.');
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }

  const repo = getInventoryRepository();
  return repo.applyStockMovement({
    productId: Number(productId),
    movementType: 'stock_in',
    quantity: qty,
    reason: reason ? String(reason).trim() : 'Stock received',
    referenceType: 'manual_stock_in',
    referenceId: reference ? String(reference).trim() : null,
  });
}

/**
 * Stock Out: Manual removal of inventory (sampling, internal store use, etc.)
 */
export function stockOut({ productId, quantity, reason, reference = null }) {
  if (!productId) throw new Error('Product ID is required.');
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('A reason is mandatory for Stock Out operations.');
  }

  const repo = getInventoryRepository();
  return repo.applyStockMovement({
    productId: Number(productId),
    movementType: 'stock_out',
    quantity: qty,
    reason: String(reason).trim(),
    referenceType: 'manual_stock_out',
    referenceId: reference ? String(reference).trim() : null,
  });
}

/**
 * Stock Adjustment: Physical inventory reconciliation
 */
export function adjustStock({ productId, targetPhysicalStock, reason }) {
  if (!productId) throw new Error('Product ID is required.');
  const target = Number(targetPhysicalStock);
  if (!Number.isFinite(target) || target < 0) {
    throw new Error('Verified physical stock cannot be negative.');
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('A reason is mandatory for inventory adjustments.');
  }

  const repo = getInventoryRepository();
  return repo.adjustStock(Number(productId), target, String(reason).trim());
}

/**
 * Mark Damaged: Writes off broken, spilled, or expired inventory
 */
export function markDamaged({ productId, quantity, reason, reference = null }) {
  if (!productId) throw new Error('Product ID is required.');
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('A reason/note is required for damaged stock write-offs.');
  }

  const repo = getInventoryRepository();
  return repo.applyStockMovement({
    productId: Number(productId),
    movementType: 'damaged',
    quantity: qty,
    reason: String(reason).trim(),
    referenceType: 'damaged_stock',
    referenceId: reference ? String(reference).trim() : null,
  });
}

/**
 * List stock movements audit history
 */
export function listMovements(options = {}) {
  const repo = getInventoryRepository();
  return repo.listMovements(options);
}

/**
 * Get inventory KPI statistics
 */
export function getInventoryOverview() {
  const repo = getInventoryRepository();
  return repo.getInventoryOverview();
}
