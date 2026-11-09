import { getDatabase } from '../database/index.js';
import { createSupplierRepository } from '../database/repositories/supplierRepository.js';

export function getSupplierRepository() {
  return createSupplierRepository(getDatabase());
}

export function createSupplier(data) {
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Supplier name is required.');
  }

  const openingPaisa = data.openingBalancePaisa ? Number.parseInt(data.openingBalancePaisa, 10) : 0;
  if (!Number.isInteger(openingPaisa) || openingPaisa < 0) {
    throw new Error('Opening balance in paisa must be a non-negative integer.');
  }

  return getSupplierRepository().create({
    name: data.name.trim(),
    phone: data.phone ? String(data.phone).trim() : null,
    email: data.email ? String(data.email).trim() : null,
    address: data.address ? String(data.address).trim() : null,
    openingBalancePaisa: openingPaisa,
    notes: data.notes ? String(data.notes).trim() : null,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });
}

export function updateSupplier(id, data) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid supplier ID.');
  }
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Supplier name is required.');
  }

  const openingPaisa = data.openingBalancePaisa !== undefined ? Number.parseInt(data.openingBalancePaisa, 10) : 0;
  if (!Number.isInteger(openingPaisa) || openingPaisa < 0) {
    throw new Error('Opening balance in paisa must be a non-negative integer.');
  }

  return getSupplierRepository().update(numId, {
    name: data.name.trim(),
    phone: data.phone ? String(data.phone).trim() : null,
    email: data.email ? String(data.email).trim() : null,
    address: data.address ? String(data.address).trim() : null,
    openingBalancePaisa: openingPaisa,
    notes: data.notes ? String(data.notes).trim() : null,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });
}

export function getSupplierById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid supplier ID.');
  }
  return getSupplierRepository().getById(numId);
}

export function listSuppliers(options = {}) {
  return getSupplierRepository().list(options);
}

export function recordSupplierPayment(paymentData) {
  const { supplierId, purchaseId, amountPaisa, paymentMethod = 'cash', paymentDate, reference, notes } = paymentData;

  const numSupplierId = Number(supplierId);
  if (!Number.isInteger(numSupplierId) || numSupplierId <= 0) {
    throw new Error('Valid supplier ID is required.');
  }

  const amount = Number.parseInt(amountPaisa, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }

  return getSupplierRepository().recordPayment({
    supplierId: numSupplierId,
    purchaseId: purchaseId ? Number(purchaseId) : null,
    amountPaisa: amount,
    paymentMethod,
    paymentDate: paymentDate || new Date().toISOString(),
    reference: reference ? String(reference).trim() : null,
    notes: notes ? String(notes).trim() : null,
  });
}

export function getSupplierLedger(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid supplier ID.');
  }
  return getSupplierRepository().getLedger(numId);
}
