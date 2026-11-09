import { useState, useEffect } from 'react';
import { TruckIcon, CreditCardIcon, RefreshIcon } from '../../components/icons.jsx';
import { formatPaisa, formatDateTime } from '../../lib/format.js';
import { api } from '../../lib/api.js';

export default function SupplierLedgerModal({ isOpen, onClose, supplier, onRecordPayment }) {
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    if (!supplier?.id) return;
    setLoading(true);
    try {
      const data = await api.suppliers.getLedger(supplier.id);
      setLedgerData(data);
    } catch (err) {
      console.error('Failed to fetch supplier ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && supplier) {
      fetchLedger();
    }
  }, [isOpen, supplier]);

  if (!isOpen || !supplier) return null;

  const entries = ledgerData?.entries || [];
  const currentPayable = ledgerData?.currentBalancePaisa ?? (supplier.currentBalancePaisa ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#E8EAED] transition-all transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8EAED]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TruckIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#17191C]">
                  {supplier.name} — Supplier Khata Ledger
                </h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                  supplier.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {supplier.isActive ? 'Active Vendor' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-[#737780] mt-0.5">
                {supplier.phone && `Phone: ${supplier.phone} · `}
                {supplier.address && `Address: ${supplier.address}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLedger}
              className="rounded-lg p-1.5 text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-colors"
              title="Refresh Ledger"
            >
              <RefreshIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Current Balance & Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F7F8FA] border-b border-[#E8EAED]">
          <div className="rounded-xl bg-white p-3 border border-[#E8EAED]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737780] block">
              Total Credit (Purchases/Opening)
            </span>
            <span className="text-sm font-bold font-mono text-[#17191C] mt-0.5 block">
              {formatPaisa(ledgerData?.totalCreditPaisa ?? 0)}
            </span>
          </div>
          <div className="rounded-xl bg-white p-3 border border-[#E8EAED]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737780] block">
              Total Debit (Payments Disbursed)
            </span>
            <span className="text-sm font-bold font-mono text-emerald-700 mt-0.5 block">
              {formatPaisa(ledgerData?.totalDebitPaisa ?? 0)}
            </span>
          </div>
          <div className="rounded-xl bg-white p-3 border border-[#E8EAED] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737780] block">
                Net Outstanding Payable
              </span>
              <span className={`text-base font-bold font-mono mt-0.5 block ${
                currentPayable > 0 ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {formatPaisa(currentPayable)}
              </span>
            </div>
            {currentPayable > 0 && onRecordPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRecordPayment(supplier);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <CreditCardIcon className="size-3.5" />
                Pay
              </button>
            )}
          </div>
        </div>

        {/* Chronological Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-xs text-[#737780]">
              Loading ledger statement…
            </div>
          ) : entries.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-xs text-[#737780]">
              No transactions recorded for this supplier yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction</th>
                    <th className="py-2.5 px-3">Reference / Notes</th>
                    <th className="py-2.5 px-3 text-right">Debit (Paid)</th>
                    <th className="py-2.5 px-3 text-right">Credit (Bill)</th>
                    <th className="py-2.5 px-3 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED] bg-white text-[#17191C]">
                  {entries.map((en, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F8FA]/60">
                      <td className="py-2 px-3 text-[#737780] whitespace-nowrap">
                        {formatDateTime(en.date)}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          en.type === 'purchase'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : en.type === 'payment'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {en.type === 'purchase' ? 'Purchase Invoice' : en.type === 'payment' ? 'Payment Made' : 'Opening Balance'}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-medium text-[#737780]">
                        <span className="font-mono text-[#17191C]">{en.reference || '—'}</span>
                        {en.notes && <span className="block text-[11px] text-[#737780]">{en.notes}</span>}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-medium text-emerald-700">
                        {en.debitPaisa > 0 ? formatPaisa(en.debitPaisa) : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-medium text-[#17191C]">
                        {en.creditPaisa > 0 ? formatPaisa(en.creditPaisa) : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-[#17191C]">
                        {formatPaisa(en.runningBalancePaisa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#E8EAED] bg-[#F7F8FA] rounded-b-2xl">
          <p className="text-xs text-[#737780]">
            Running balance reflects cumulative vendor liability calculated strictly in integer paisa.
          </p>
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
  );
}
