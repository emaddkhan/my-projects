import { getDatabase } from '../database/index.js';
import { createPurchaseRepository } from '../database/repositories/purchaseRepository.js';

export function getPurchaseRepository() {
  return createPurchaseRepository(getDatabase());
}

export function createPurchase(purchaseData) {
  const { supplierId, supplierInvoiceNumber, purchaseDate, discountPaisa = 0, paidPaisa = 0, paymentMethod = 'cash', notes, items } = purchaseData;

  const numSupplierId = Number(supplierId);
  if (!Number.isInteger(numSupplierId) || numSupplierId <= 0) {
    throw new Error('Valid supplier ID is required.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Purchase must contain at least one product item.');
  }

  return getPurchaseRepository().createPurchase({
    supplierId: numSupplierId,
    supplierInvoiceNumber,
    purchaseDate,
    discountPaisa: Number.parseInt(discountPaisa, 10) || 0,
    paidPaisa: Number.parseInt(paidPaisa, 10) || 0,
    paymentMethod,
    notes,
  }, items);
}

export function getPurchaseById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid purchase ID.');
  }
  return getPurchaseRepository().getById(numId);
}

export function listPurchases(options = {}) {
  return getPurchaseRepository().list(options);
}

export function getPurchasesOverview() {
  return getPurchaseRepository().getOverview();
}
