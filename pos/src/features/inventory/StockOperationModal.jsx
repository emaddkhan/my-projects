import { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { ArrowDownIcon, ArrowUpIcon, AlertTriangleIcon } from '../../components/icons.jsx';

export default function StockOperationModal({ isOpen, onClose, product, operationType = 'stock_in', onSuccess }) {
  const [quantity, setQuantity] = useState('');
  const [targetPhysicalStock, setTargetPhysicalStock] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity('');
      setTargetPhysicalStock(String(product.currentStock ?? 0));
      setReason('');
      setReference('');
      setError(null);
    }
  }, [isOpen, product, operationType]);

  if (!isOpen || !product) return null;

  const current = Number(product.currentStock ?? 0);
  const isMetric = ['kg', 'gram', 'litre'].includes(product.unit);
  const step = isMetric ? '0.01' : '1';

  // Calculations for preview
  let calculatedNewStock = current;
  let diff = 0;

  if (operationType === 'adjust') {
    const target = Number(targetPhysicalStock);
    if (Number.isFinite(target)) {
      calculatedNewStock = target;
      diff = Number((target - current).toFixed(3));
    }
  } else {
    const qty = Number(quantity);
    if (Number.isFinite(qty) && qty > 0) {
      if (operationType === 'stock_in') {
        calculatedNewStock = Number((current + qty).toFixed(3));
      } else {
        calculatedNewStock = Number((current - qty).toFixed(3));
      }
    }
  }

  const titles = {
    stock_in: 'Stock In — Receive Inventory',
    stock_out: 'Stock Out — Manual Removal',
    adjust: 'Stock Adjustment — Physical Count',
    damaged: 'Mark Damaged / Expired Stock',
  };

  const ctaLabels = {
    stock_in: 'Confirm Stock In',
    stock_out: 'Confirm Stock Out',
    adjust: 'Save Physical Adjustment',
    damaged: 'Write Off Damaged Stock',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setSubmitting(true);
    try {
      if (operationType === 'stock_in') {
        const qty = Number(quantity);
        if (!qty || qty <= 0) throw new Error('Please enter a valid quantity greater than zero.');
        await api.inventory.stockIn({
          productId: product.id,
          quantity: qty,
          reason: reason.trim() || 'Manual stock reception',
          reference: reference.trim() || null,
        });
      } else if (operationType === 'stock_out') {
        const qty = Number(quantity);
        if (!qty || qty <= 0) throw new Error('Please enter a valid quantity greater than zero.');
        if (!reason.trim()) throw new Error('A reason is mandatory for Stock Out.');
        if (qty > current) throw new Error(`Stock out quantity (${qty}) exceeds available stock (${current} ${product.unit}).`);
        await api.inventory.stockOut({
          productId: product.id,
          quantity: qty,
          reason: reason.trim(),
          reference: reference.trim() || null,
        });
      } else if (operationType === 'adjust') {
        const target = Number(targetPhysicalStock);
        if (!Number.isFinite(target) || target < 0) throw new Error('Physical stock must be zero or positive.');
        if (!reason.trim()) throw new Error('A reason is mandatory for stock adjustment.');
        await api.inventory.adjust({
          productId: product.id,
          targetPhysicalStock: target,
          reason: reason.trim(),
        });
      } else if (operationType === 'damaged') {
        const qty = Number(quantity);
        if (!qty || qty <= 0) throw new Error('Please enter a valid quantity greater than zero.');
        if (!reason.trim()) throw new Error('A reason or description is required for damaged stock.');
        if (qty > current) throw new Error(`Damaged quantity (${qty}) exceeds available stock (${current} ${product.unit}).`);
        await api.inventory.markDamaged({
          productId: product.id,
          quantity: qty,
          reason: reason.trim(),
          reference: reference.trim() || null,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Stock operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-[#E8EAED] bg-white p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8EAED] pb-3 mb-4">
          <h2 className="text-sm font-semibold text-[#17191C]">{titles[operationType]}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#737780] hover:text-[#17191C] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Product Snapshot Card */}
        <div className="mb-4 rounded-lg border border-[#E8EAED] bg-[#F7F8FA] p-3 text-xs flex justify-between items-center">
          <div>
            <p className="font-semibold text-[#17191C]">{product.name}</p>
            <p className="text-[11px] text-[#737780]">{product.categoryName || 'General Grocery'} · {product.unit}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#737780] block">Current Stock</span>
            <span className="font-mono font-bold text-sm text-[#17191C]">{current} {product.unit}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangleIcon className="size-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Operation Inputs */}
          {operationType === 'adjust' ? (
            <div>
              <label className="block font-medium text-[#17191C] mb-1">
                Verified Physical Stock ({product.unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step={step}
                min="0"
                required
                value={targetPhysicalStock}
                onChange={(e) => setTargetPhysicalStock(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 font-mono text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
                placeholder="Enter actual physical shelf count"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-[#737780]">
                <span>Difference:</span>
                <span className={`font-mono font-bold ${diff > 0 ? 'text-emerald-700' : diff < 0 ? 'text-red-600' : 'text-[#737780]'}`}>
                  {diff > 0 ? `+${diff}` : diff} {product.unit}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-medium text-[#17191C] mb-1">
                Quantity ({product.unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step={step}
                min={isMetric ? '0.01' : '1'}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 font-mono text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
                placeholder={`Enter quantity in ${product.unit}`}
              />
            </div>
          )}

          {/* Reason Field */}
          <div>
            <label className="block font-medium text-[#17191C] mb-1">
              Reason / Explanation {operationType !== 'stock_in' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={operationType !== 'stock_in'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                operationType === 'stock_in'
                  ? 'e.g. New delivery from distributor (optional)'
                  : operationType === 'stock_out'
                  ? 'e.g. Internal store use / product tasting'
                  : operationType === 'adjust'
                  ? 'e.g. Monthly stock audit discrepancy'
                  : 'e.g. Broken packaging / expiration date passed'
              }
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Reference / Invoice Field (Optional) */}
          {operationType !== 'adjust' && (
            <div>
              <label className="block font-medium text-[#737780] mb-1">
                Reference ID / Note (Optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. PO-8921 or Delivery Note #12"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
              />
            </div>
          )}

          {/* Resulting Stock Projection Card */}
          <div className="rounded-lg border border-[#E8EAED] bg-[#FAFAFB] p-2.5 flex items-center justify-between text-xs">
            <span className="text-[#737780]">Resulting Stock Count:</span>
            <span className={`font-mono font-bold ${calculatedNewStock < 0 ? 'text-red-600' : 'text-[#17191C]'}`}>
              {calculatedNewStock} {product.unit}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAED]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#17191C] hover:bg-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || calculatedNewStock < 0}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50 ${
                operationType === 'damaged' || operationType === 'stock_out'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-800 hover:bg-emerald-700'
              }`}
            >
              {submitting ? 'Applying…' : ctaLabels[operationType]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
