import { getDatabase } from '../database/index.js';
import { createSalesRepository } from '../database/repositories/salesRepository.js';

export function getSalesRepository() {
  return createSalesRepository(getDatabase());
}

export function completeCheckout(checkoutData) {
  const { customerName, items, discountPaisa = 0, taxPaisa = 0, cashReceivedPaisa, paymentMethod = 'cash', notes, idempotencyKey } = checkoutData;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cannot complete sale: Shopping cart is empty.');
  }

  let calculatedSubtotalPaisa = 0;
  const validatedItems = items.map((item, idx) => {
    if (!item.productName || typeof item.productName !== 'string' || !item.productName.trim()) {
      throw new Error(`Item #${idx + 1} is missing a product name.`);
    }

    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error(`Item "${item.productName}" has an invalid quantity.`);
    }

    const unitPrice = Number.parseInt(item.unitPricePaisa, 10);
    if (!Number.isInteger(unitPrice) || unitPrice < 0) {
      throw new Error(`Item "${item.productName}" has an invalid unit price.`);
    }

    const lineTotal = Math.round(qty * unitPrice);
    calculatedSubtotalPaisa += lineTotal;

    return {
      productId: item.productId ? Number(item.productId) : null,
      productName: item.productName.trim(),
      barcode: item.barcode ? String(item.barcode).trim() : null,
      unit: item.unit || 'piece',
      unitPricePaisa: unitPrice,
      costPricePaisa: item.costPricePaisa ? Number.parseInt(item.costPricePaisa, 10) : 0,
      quantity: qty,
      totalPaisa: lineTotal,
    };
  });

  const disc = Number.parseInt(discountPaisa, 10) || 0;
  const tax = Number.parseInt(taxPaisa, 10) || 0;
  const grandTotalPaisa = Math.max(0, calculatedSubtotalPaisa - disc + tax);

  const cashReceived = Number.parseInt(cashReceivedPaisa, 10);
  if (paymentMethod === 'cash') {
    if (!Number.isInteger(cashReceived) || cashReceived < grandTotalPaisa) {
      throw new Error(`Insufficient cash received. Required: Rs ${(grandTotalPaisa / 100).toFixed(2)}, Received: Rs ${((cashReceived || 0) / 100).toFixed(2)}.`);
    }
  }

  const changeDuePaisa = paymentMethod === 'cash' ? Math.max(0, cashReceived - grandTotalPaisa) : 0;

  const repo = getSalesRepository();
  return repo.createSale({
    idempotencyKey: idempotencyKey ? String(idempotencyKey).trim() : null,
    customerName: customerName || 'Walk-in Customer',
    subtotalPaisa: calculatedSubtotalPaisa,
    discountPaisa: disc,
    taxPaisa: tax,
    totalPaisa: grandTotalPaisa,
    cashReceivedPaisa: paymentMethod === 'cash' ? cashReceived : grandTotalPaisa,
    changeDuePaisa,
    paymentMethod,
    notes,
  }, validatedItems);
}

export function listSales(options = {}) {
  const repo = getSalesRepository();
  return repo.listSales(options);
}

export function getSaleById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid sale ID.');
  }
  return getSalesRepository().getSaleById(numId);
}

export function getSalesSummary() {
  return getSalesRepository().getSalesSummaryToday();
}
