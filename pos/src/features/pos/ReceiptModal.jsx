import { PrinterIcon } from '../../components/icons.jsx';
import { formatPaisa, formatDateTime } from '../../lib/format.js';

export default function ReceiptModal({ isOpen, onClose, sale, onNewSale }) {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-xl border border-[#E8EAED] bg-white shadow-xl overflow-hidden">
        {/* Receipt Header Actions */}
        <div className="flex items-center justify-between border-b border-[#E8EAED] bg-[#F7F8FA] px-4 py-2.5">
          <span className="text-xs font-semibold text-[#17191C]">Sales Receipt</span>
          <button
            onClick={onClose}
            className="text-xs text-[#737780] hover:text-[#17191C]"
          >
            ✕
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-5 font-mono text-[13px] text-[#17191C] leading-snug space-y-3">
          <div className="text-center space-y-0.5">
            <h2 className="font-sans text-base font-bold tracking-tight text-[#17191C]">GROCERY POS</h2>
            <p className="text-[11px] text-[#737780]">Retail Counter · Offline POS</p>
            <p className="text-[11px] text-[#737780]">Pakistan</p>
          </div>

          <div className="border-t border-dashed border-[#D1D5DB] pt-2 text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-bold">{sale.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDateTime(sale.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{sale.customerName || 'Walk-in'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-dashed border-[#D1D5DB] pt-2">
            <div className="flex justify-between text-[11px] font-bold text-[#737780] pb-1">
              <span>Item</span>
              <span>Qty × Price</span>
              <span>Total</span>
            </div>
            <div className="divide-y divide-dotted divide-[#E5E7EB]">
              {sale.items?.map((item, idx) => (
                <div key={idx} className="py-1 flex justify-between items-start text-xs">
                  <div className="max-w-[130px] truncate">
                    <p className="font-sans font-medium text-[#17191C]">{item.productName}</p>
                    <p className="text-[10px] text-[#737780]">{item.unit}</p>
                  </div>
                  <div className="text-[11px] text-[#737780] text-center">
                    {item.quantity} × {formatPaisa(item.unitPricePaisa)}
                  </div>
                  <div className="font-semibold text-right tabular-nums">
                    {formatPaisa(item.totalPaisa)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-[#D1D5DB] pt-2 space-y-1 text-xs">
            <div className="flex justify-between text-[#737780]">
              <span>Subtotal:</span>
              <span className="tabular-nums">{formatPaisa(sale.subtotalPaisa)}</span>
            </div>
            {sale.discountPaisa > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="tabular-nums">-{formatPaisa(sale.discountPaisa)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-[#17191C] pt-1 border-t border-[#E8EAED]">
              <span>GRAND TOTAL:</span>
              <span className="tabular-nums">{formatPaisa(sale.totalPaisa)}</span>
            </div>
            <div className="flex justify-between text-[#737780] pt-1">
              <span>Cash Received:</span>
              <span className="tabular-nums">{formatPaisa(sale.cashReceivedPaisa)}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-800">
              <span>Change Due:</span>
              <span className="tabular-nums">{formatPaisa(sale.changeDuePaisa)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-dashed border-[#D1D5DB] pt-2 text-center text-[11px] text-[#737780]">
            <p>Thank you for shopping with us!</p>
            <p className="text-[10px]">Please come again</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E8EAED] bg-[#F7F8FA] p-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#17191C] hover:bg-[#F3F4F6] transition-colors shadow-2xs"
          >
            <PrinterIcon className="size-3.5 text-[#737780]" />
            Print
          </button>
          <button
            onClick={onNewSale}
            className="rounded-lg bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            New Sale (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
