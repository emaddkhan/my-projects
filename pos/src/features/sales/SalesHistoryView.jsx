import { useState, useEffect } from 'react';
import { ReceiptIcon, RefreshIcon, ClockIcon, CashIcon } from '../../components/icons.jsx';
import { api, isBridgeAvailable } from '../../lib/api.js';
import { formatPaisa, formatDateTime } from '../../lib/format.js';
import StatTile from '../../components/StatTile.jsx';
import ReceiptModal from '../pos/ReceiptModal.jsx';

export default function SalesHistoryView() {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  const loadData = async () => {
    if (!isBridgeAvailable()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [listRes, sumRes] = await Promise.all([
        api.sales.list({ limit: 100 }),
        api.sales.getSummary(),
      ]);
      setSales(listRes.items);
      setTotal(listRes.total);
      setSummary(sumRes);
    } catch (err) {
      console.error('Failed to load sales history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewReceipt = async (saleId) => {
    try {
      const fullSale = await api.sales.get(saleId);
      setSelectedSale(fullSale);
    } catch (err) {
      console.error('Failed to load receipt:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          label="Today's Revenue"
          icon={<CashIcon className="size-4" />}
          value={formatPaisa(summary?.totalRevenuePaisa ?? 0)}
          hint="Gross retail receipts today"
        />
        <StatTile
          label="Today's Transactions"
          icon={<ReceiptIcon className="size-4" />}
          value={summary?.totalOrders ?? 0}
          hint="Completed checkout sessions"
        />
        <StatTile
          label="Items Sold Today"
          icon={<ClockIcon className="size-4" />}
          value={summary?.totalItemsSold ?? 0}
          hint="Total individual units"
        />
      </div>

      {/* Sales Invoices Table Card */}
      <div className="rounded-xl border border-[#E8EAED] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8EAED] px-4 py-3 bg-[#FAFAFB]">
          <div>
            <h2 className="text-sm font-semibold text-[#17191C]">Sales Transaction Ledger</h2>
            <p className="text-xs text-[#737780]">Permanent records of all past customer invoices</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs text-[#17191C] hover:bg-[#F3F4F6] transition-colors"
          >
            <RefreshIcon className={`size-3 text-[#737780] ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading && sales.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#737780]">Loading sales ledger…</div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-[#737780]">
            <ReceiptIcon className="size-8 stroke-1 mx-auto text-[#D1D5DB] mb-2" />
            <p className="text-xs font-semibold text-[#17191C]">No sales recorded yet</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Switch to the POS Terminal to make your first sale</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8EAED] bg-[#F7F8FA] text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
                  <th className="px-4 py-2.5">Invoice #</th>
                  <th className="px-4 py-2.5">Date & Time</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5 text-center">Items</th>
                  <th className="px-4 py-2.5 text-center">Payment</th>
                  <th className="px-4 py-2.5 text-right">Total Amount</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F5]">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-[#17191C]">
                      {s.invoiceNumber}
                    </td>
                    <td className="px-4 py-2.5 text-[#737780]">
                      {formatDateTime(s.createdAt)}
                    </td>
                    <td className="px-4 py-2.5 text-[#17191C] font-medium">
                      {s.customerName}
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono">
                      {s.itemsCount}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-block rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#737780]">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      {formatPaisa(s.totalPaisa)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleViewReceipt(s.id)}
                        className="rounded border border-[#D1D5DB] bg-white px-2 py-0.5 text-[11px] font-medium text-[#17191C] hover:bg-[#F3F4F6] transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedSale)}
        onClose={() => setSelectedSale(null)}
        sale={selectedSale}
        onNewSale={() => setSelectedSale(null)}
      />
    </div>
  );
}
