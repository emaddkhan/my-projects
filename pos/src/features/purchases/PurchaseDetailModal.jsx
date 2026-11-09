import { ReceiptIcon, ClockIcon } from '../../components/icons.jsx';
import { formatPaisa, formatDateTime } from '../../lib/format.js';

export default function PurchaseDetailModal({ isOpen, onClose, purchase, onRecordPayment }) {
  if (!isOpen || !purchase) return null;

  const items = purchase.items || [];
  const payments = purchase.payments || [];
  const hasDue = (purchase.duePaisa ?? 0) > 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Paid in Full
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Partially Paid
          </span>
        );
      case 'unpaid':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            Unpaid / Credit
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#E8EAED] transition-all transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8EAED]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ReceiptIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#17191C] font-mono">
                  {purchase.invoiceNumber}
                </h2>
                {getStatusBadge(purchase.status)}
              </div>
              <p className="text-xs text-[#737780] mt-0.5">
                Vendor: <span className="font-semibold text-[#17191C]">{purchase.supplierName}</span> · Date: {formatDateTime(purchase.purchaseDate)}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#F7F8FA] border border-[#E8EAED] text-xs">
            <div>
              <span className="text-[#737780] block text-[10px] font-semibold uppercase">Supplier Invoice #</span>
              <span className="font-medium text-[#17191C]">{purchase.supplierInvoiceNumber || '—'}</span>
            </div>
            <div>
              <span className="text-[#737780] block text-[10px] font-semibold uppercase">Items Received</span>
              <span className="font-medium text-[#17191C]">{items.length} items</span>
            </div>
            <div>
              <span className="text-[#737780] block text-[10px] font-semibold uppercase">Total Amount</span>
              <span className="font-mono font-bold text-[#17191C]">{formatPaisa(purchase.totalPaisa)}</span>
            </div>
            <div>
              <span className="text-[#737780] block text-[10px] font-semibold uppercase">Outstanding Due</span>
              <span className={`font-mono font-bold ${hasDue ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatPaisa(purchase.duePaisa)}
              </span>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737780] mb-2">
              Purchased Products & Received Stock
            </h3>
            <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED] bg-white text-[#17191C]">
                  {items.map((it, idx) => (
                    <tr key={it.id || idx} className="hover:bg-[#F7F8FA]/60">
                      <td className="py-2 px-3 text-[#737780]">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold">{it.productName}</td>
                      <td className="py-2 px-3 font-mono text-[#737780]">{it.barcode || '—'}</td>
                      <td className="py-2 px-3 text-right font-medium">
                        {it.quantity} <span className="text-[10px] text-[#737780]">{it.unit}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatPaisa(it.unitCostPaisa)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{formatPaisa(it.totalPaisa)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl bg-white border border-[#E8EAED]">
            <div className="text-xs text-[#737780] space-y-1">
              <span className="font-semibold text-[#17191C] block">Notes / Terms:</span>
              <p className="italic">{purchase.notes || 'No notes specified.'}</p>
            </div>
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#737780]">
                <span>Gross Subtotal:</span>
                <span className="font-mono text-[#17191C]">{formatPaisa(purchase.subtotalPaisa)}</span>
              </div>
              {purchase.discountPaisa > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Vendor Discount:</span>
                  <span className="font-mono">- {formatPaisa(purchase.discountPaisa)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#17191C] pt-1 border-t border-[#E8EAED]">
                <span>Net Total:</span>
                <span className="font-mono">{formatPaisa(purchase.totalPaisa)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-mono font-medium">{formatPaisa(purchase.paidPaisa)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#17191C] pt-1 border-t border-[#E8EAED]">
                <span className={hasDue ? 'text-rose-600' : 'text-emerald-700'}>Due Balance:</span>
                <span className={`font-mono ${hasDue ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatPaisa(purchase.duePaisa)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History for this invoice */}
          {payments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737780] mb-2 flex items-center gap-1.5">
                <ClockIcon className="size-3.5" />
                Payments Recorded Towards this Invoice
              </h3>
              <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Reference</th>
                      <th className="py-2 px-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EAED] bg-white text-[#17191C]">
                    {payments.map((pmt) => (
                      <tr key={pmt.id}>
                        <td className="py-2 px-3 text-[#737780]">{formatDateTime(pmt.paymentDate || pmt.createdAt)}</td>
                        <td className="py-2 px-3 font-medium capitalize">{pmt.paymentMethod}</td>
                        <td className="py-2 px-3 text-[#737780] font-mono">{pmt.reference || '—'}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                          {formatPaisa(pmt.amountPaisa)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-[#E8EAED] bg-[#F7F8FA] rounded-b-2xl">
          <div className="text-xs text-[#737780]">
            Stock auto-incremented into inventory on invoice creation.
          </div>
          <div className="flex items-center gap-2">
            {hasDue && onRecordPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRecordPayment(purchase);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-xs"
              >
                Pay Due Balance ({formatPaisa(purchase.duePaisa)})
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E8EAED] bg-white px-4 py-2 text-xs font-semibold text-[#17191C] hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
