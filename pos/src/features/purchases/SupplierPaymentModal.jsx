import { useState, useEffect } from 'react';
import { CreditCardIcon, AlertTriangleIcon } from '../../components/icons.jsx';
import { formatPaisa } from '../../lib/format.js';

export default function SupplierPaymentModal({ isOpen, onClose, suppliers = [], defaultSupplierId = null, purchases = [], onSuccess }) {
  const [supplierId, setSupplierId] = useState('');
  const [purchaseId, setPurchaseId] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSupplierId(defaultSupplierId ? String(defaultSupplierId) : (suppliers[0]?.id ? String(suppliers[0].id) : ''));
      setPurchaseId('');
      setAmountRupees('');
      setPaymentMethod('cash');
      setReference('');
      setNotes('');
      setError(null);
    }
  }, [isOpen, defaultSupplierId, suppliers]);

  if (!isOpen) return null;

  const selectedSupplier = suppliers.find((s) => String(s.id) === String(supplierId));
  const currentPayablePaisa = selectedSupplier?.currentBalancePaisa ?? 0;

  // Invoices for this supplier that have an outstanding due balance
  const supplierUnpaidInvoices = purchases.filter(
    (p) => String(p.supplierId) === String(supplierId) && (p.duePaisa ?? 0) > 0
  );

  const handleSelectPurchase = (e) => {
    const pId = e.target.value;
    setPurchaseId(pId);
    if (pId) {
      const inv = supplierUnpaidInvoices.find((p) => String(p.id) === String(pId));
      if (inv) {
        setAmountRupees((inv.duePaisa / 100).toFixed(2));
      }
    }
  };

  const handlePayFullBalance = () => {
    if (currentPayablePaisa > 0) {
      setAmountRupees((currentPayablePaisa / 100).toFixed(2));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const sId = Number(supplierId);
    if (!Number.isInteger(sId) || sId <= 0) {
      setError('Please select a supplier.');
      return;
    }

    const amount = Math.round((Number.parseFloat(amountRupees) || 0) * 100);
    if (amount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      await onSuccess({
        supplierId: sId,
        purchaseId: purchaseId ? Number(purchaseId) : null,
        amountPaisa: amount,
        paymentMethod,
        reference: reference.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record supplier payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8EAED] transition-all transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <CreditCardIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17191C]">
                Record Supplier Payment
              </h2>
              <p className="text-xs text-[#737780]">
                Disburse cash or bank payment to reduce supplier outstanding payable
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertTriangleIcon className="size-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Supplier Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Select Supplier <span className="text-rose-500">*</span>
            </label>
            <select
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                setPurchaseId('');
              }}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.phone ? `(${s.phone})` : ''} — Outstanding: {formatPaisa(s.currentBalancePaisa ?? 0)}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Balance Highlight */}
          {selectedSupplier && (
            <div className="flex items-center justify-between rounded-xl bg-[#F7F8FA] p-3 border border-[#E8EAED]">
              <div>
                <span className="text-[11px] font-medium text-[#737780] block">
                  Current Total Payable
                </span>
                <span className={`text-base font-bold font-mono ${
                  currentPayablePaisa > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {formatPaisa(currentPayablePaisa)}
                </span>
              </div>
              {currentPayablePaisa > 0 && (
                <button
                  type="button"
                  onClick={handlePayFullBalance}
                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  Pay Full Balance
                </button>
              )}
            </div>
          )}

          {/* Optional specific purchase invoice selector */}
          {supplierUnpaidInvoices.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Link to Purchase Invoice (Optional)
              </label>
              <select
                value={purchaseId}
                onChange={handleSelectPurchase}
                className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
              >
                <option value="">-- General Payment (Applies to overall ledger) --</option>
                {supplierUnpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    Invoice #{inv.invoiceNumber} — Due: {formatPaisa(inv.duePaisa)} ({inv.purchaseDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Payment Amount (PKR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                className="w-full text-right rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm font-mono font-bold text-[#17191C] focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
              >
                <option value="cash">Cash in Hand</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online / Raast</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Reference & Cheque Number */}
          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Payment Reference / Cheque # / Slip #
            </label>
            <input
              type="text"
              placeholder="e.g. Cheque #44921, Slip #882, Trx #7890"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Notes / Particulars
            </label>
            <input
              type="text"
              placeholder="e.g. Paid in full for last week delivery"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8EAED]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E8EAED] bg-white px-4 py-2 text-xs font-semibold text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs"
            >
              {submitting ? 'Recording…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
