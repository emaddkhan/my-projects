import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  SearchIcon, BarcodeIcon, ShoppingCartIcon, PlusIcon, MinusIcon, 
  TrashIcon, ReceiptIcon, CheckCircleIcon 
} from '../../components/icons.jsx';
import { api, isBridgeAvailable } from '../../lib/api.js';
import { formatPaisa, rupeesToPaisa } from '../../lib/format.js';
import ReceiptModal from './ReceiptModal.jsx';

export default function PosView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [discountRupees, setDiscountRupees] = useState('0');
  const [cashReceivedRupees, setCashReceivedRupees] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const barcodeInputRef = useRef(null);

  // Load catalog
  const loadCatalog = async () => {
    if (!isBridgeAvailable()) return;
    try {
      const [prodRes, cats] = await Promise.all([
        api.products.list({ limit: 300 }),
        api.categories.list(),
      ]);
      setProducts(prodRes.items.filter((p) => p.isActive));
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load POS catalog:', err);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = !selectedCategory || String(p.categoryId) === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const matchName = p.name.toLowerCase().includes(q);
      const matchBarcode = p.barcode && p.barcode.toLowerCase().includes(q);
      const matchSku = p.sku && p.sku.toLowerCase().includes(q);
      return matchName || matchBarcode || matchSku;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handle barcode scanner input (enter key or exact barcode scan)
  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = searchQuery.trim();
      if (!code) return;

      const exactMatch = products.find(
        (p) => (p.barcode && p.barcode.toLowerCase() === code.toLowerCase()) ||
               (p.sku && p.sku.toLowerCase() === code.toLowerCase()) ||
               p.name.toLowerCase() === code.toLowerCase()
      );

      if (exactMatch) {
        addToCart(exactMatch);
        setSearchQuery('');
      }
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        next[existingIdx].totalPaisa = Math.round(next[existingIdx].quantity * next[existingIdx].unitPricePaisa);
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          barcode: product.barcode,
          unit: product.unit,
          unitPricePaisa: product.salePricePaisa,
          costPricePaisa: product.costPricePaisa || 0,
          quantity: 1,
          totalPaisa: product.salePricePaisa,
        },
      ];
    });
    setErrorMessage(null);
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = Math.max(0.1, Number((next[index].quantity + delta).toFixed(2)));
      next[index].quantity = newQty;
      next[index].totalPaisa = Math.round(newQty * next[index].unitPricePaisa);
      return next;
    });
  };

  const setDirectQuantity = (index, val) => {
    const num = Math.max(0.01, Number(val) || 0);
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = num;
      next[index].totalPaisa = Math.round(num * next[index].unitPricePaisa);
      return next;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequestClearCart = () => {
    if (cart.length === 0) return;
    setShowClearConfirm(true);
  };

  const executeClearCart = () => {
    setCart([]);
    setDiscountRupees('0');
    setCashReceivedRupees('');
    setErrorMessage(null);
    setShowClearConfirm(false);
  };

  const cancelClearCart = () => {
    setShowClearConfirm(false);
  };

  // Calculations in paisa
  const subtotalPaisa = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPaisa, 0);
  }, [cart]);

  const discountPaisa = useMemo(() => {
    return rupeesToPaisa(discountRupees);
  }, [discountRupees]);

  const grandTotalPaisa = Math.max(0, subtotalPaisa - discountPaisa);
  const grandTotalRupees = (grandTotalPaisa / 100).toFixed(2);

  const cashReceivedPaisa = paymentMethod === 'cash'
    ? rupeesToPaisa(cashReceivedRupees || grandTotalRupees)
    : grandTotalPaisa;

  const changeDuePaisa = paymentMethod === 'cash' ? Math.max(0, cashReceivedPaisa - grandTotalPaisa) : 0;
  const isCashInsufficient = paymentMethod === 'cash' && cashReceivedPaisa < grandTotalPaisa && cart.length > 0;

  // Checkout submission
  const handleCheckout = async (e) => {
    e?.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Shopping cart is empty. Add items to checkout.');
      return;
    }
    if (isCashInsufficient) {
      setErrorMessage(`Insufficient cash. Grand total is Rs ${grandTotalRupees}.`);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const idempotencyKey = `pos-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const sale = await api.sales.checkout({
        idempotencyKey,
        customerName: customerName.trim() || 'Walk-in Customer',
        subtotalPaisa,
        discountPaisa,
        cashReceivedPaisa,
        paymentMethod,
        items: cart,
      });

      setCompletedSale(sale);
      setCart([]);
      setDiscountRupees('0');
      setCashReceivedRupees('');
      setErrorMessage(null);
      loadCatalog(); // Refresh live stock counts
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickCash = (extra) => {
    const base = Number.parseFloat(grandTotalRupees) || 0;
    if (extra === 'exact') {
      setCashReceivedRupees(grandTotalRupees);
    } else {
      setCashReceivedRupees(String(base + extra));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-100px)] overflow-hidden">
      {/* LEFT COLUMN: Product Catalog & Fast Search */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-[#E8EAED] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Search & Barcode Bar */}
        <div className="p-4 border-b border-[#E8EAED] bg-[#FAFAFB] space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-2.5 size-4 text-[#9CA3AF]" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="Scan barcode or search by item name / SKU… (Press Enter to quick-add)"
              className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-10 py-2 text-sm text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-2xs"
              autoFocus
            />
            <div className="absolute right-3 top-2 text-[#9CA3AF]">
              <BarcodeIcon className="size-5" />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('')}
              className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === ''
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white border border-[#E8EAED] text-[#737780] hover:text-[#17191C] hover:bg-[#F3F4F6]'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(selectedCategory === String(c.id) ? '' : String(c.id))}
                className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === String(c.id)
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-[#E8EAED] text-[#737780] hover:text-[#17191C] hover:bg-[#F3F4F6]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-sm font-medium text-[#737780]">No matching products in catalog</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Try another search term or scan a valid barcode</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {filteredProducts.map((p) => {
                const inCart = cart.find((item) => item.productId === p.id);
                const isLow = p.currentStock <= p.minStockLevel;

                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`flex flex-col justify-between text-left p-3 rounded-lg border transition-all text-sm group ${
                      inCart
                        ? 'border-emerald-600/40 bg-emerald-50/40'
                        : 'border-[#E8EAED] bg-white hover:border-[#D1D5DB] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-xs text-[#17191C] leading-snug line-clamp-2">
                          {p.name}
                        </span>
                        {inCart && (
                          <span className="shrink-0 size-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                            {inCart.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#737780] mt-1 truncate">
                        {p.categoryName || 'General'} · <span className="capitalize">{p.unit}</span>
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#F0F2F5] flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 font-mono tabular-nums">
                        {formatPaisa(p.salePricePaisa)}
                      </span>
                      <span className={`text-[10px] font-medium ${isLow ? 'text-amber-700 font-semibold' : 'text-[#9CA3AF]'}`}>
                        {p.currentStock} {p.unit}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Shopping Cart & Checkout Panel */}
      <div className="w-full lg:w-[410px] shrink-0 flex flex-col bg-white rounded-xl border border-[#E8EAED] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Cart Header */}
        <div className="flex items-center justify-between border-b border-[#E8EAED] px-4 py-3 bg-[#FAFAFB]">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="size-4 text-emerald-800" />
            <h2 className="text-sm font-semibold text-[#17191C]">Cart ({cart.length})</h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleRequestClearCart}
              className="text-xs text-[#737780] hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-3 mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5] p-3 space-y-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-[#9CA3AF]">
              <ShoppingCartIcon className="size-8 stroke-1 text-[#D1D5DB] mb-2" />
              <p className="text-xs font-medium text-[#737780]">Cart is empty</p>
              <p className="text-[11px] text-[#9CA3AF]">Scan a barcode or click items to begin sale</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#17191C] truncate">{item.productName}</p>
                  <p className="text-[10px] text-[#737780]">
                    {formatPaisa(item.unitPricePaisa)} / {item.unit}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="size-6 flex items-center justify-center rounded border border-[#D1D5DB] bg-white text-[#737780] hover:bg-[#F3F4F6] text-xs"
                  >
                    <MinusIcon className="size-3" />
                  </button>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={item.quantity}
                    onChange={(e) => setDirectQuantity(index, e.target.value)}
                    className="w-10 text-center text-xs font-mono font-semibold text-[#17191C] border border-[#D1D5DB] rounded py-0.5"
                  />
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="size-6 flex items-center justify-center rounded border border-[#D1D5DB] bg-white text-[#737780] hover:bg-[#F3F4F6] text-xs"
                  >
                    <PlusIcon className="size-3" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right w-18">
                  <span className="text-xs font-bold text-[#17191C] font-mono tabular-nums">
                    {formatPaisa(item.totalPaisa)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-[#9CA3AF] hover:text-red-600 p-1"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary & Payment Footer */}
        <div className="border-t border-[#E8EAED] bg-[#FAFAFB] p-4 space-y-3">
          {/* Subtotal & Discount Rows */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#737780]">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-[#17191C] tabular-nums">
                {formatPaisa(subtotalPaisa)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#737780]">
              <span>Discount (Rs):</span>
              <input
                type="number"
                min="0"
                value={discountRupees}
                onChange={(e) => setDiscountRupees(e.target.value)}
                className="w-20 rounded border border-[#D1D5DB] bg-white px-2 py-0.5 text-right font-mono text-xs text-[#17191C]"
              />
            </div>

            <div className="flex items-center justify-between text-[#737780]">
              <span>Customer:</span>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-36 rounded border border-[#D1D5DB] bg-white px-2 py-0.5 text-xs text-[#17191C]"
              />
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between border-t border-[#E8EAED] pt-2">
            <span className="text-sm font-semibold text-[#17191C]">Grand Total:</span>
            <span className="text-xl font-extrabold text-emerald-800 font-mono tabular-nums">
              {formatPaisa(grandTotalPaisa)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-1.5">
            {['cash', 'card', 'bank_transfer'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                  paymentMethod === m
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-[#D1D5DB] text-[#737780] hover:bg-[#F3F4F6]'
                }`}
              >
                {m === 'bank_transfer' ? 'Transfer' : m}
              </button>
            ))}
          </div>

          {/* Cash Received & Change Due */}
          {paymentMethod === 'cash' && (
            <div className="space-y-2 pt-1 border-t border-[#E8EAED]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#737780]">Cash Tendered (Rs):</label>
                <input
                  type="number"
                  placeholder={grandTotalRupees}
                  value={cashReceivedRupees}
                  onChange={(e) => setCashReceivedRupees(e.target.value)}
                  className="w-28 rounded border border-[#D1D5DB] bg-white px-2 py-1 text-right font-mono text-xs font-bold text-[#17191C] focus:border-emerald-700"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex gap-1 justify-end text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickCash('exact')}
                  className="rounded border border-[#D1D5DB] bg-white px-2 py-0.5 hover:bg-[#F3F4F6] text-[#737780]"
                >
                  Exact
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(500)}
                  className="rounded border border-[#D1D5DB] bg-white px-2 py-0.5 hover:bg-[#F3F4F6] text-[#737780]"
                >
                  +500
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(1000)}
                  className="rounded border border-[#D1D5DB] bg-white px-2 py-0.5 hover:bg-[#F3F4F6] text-[#737780]"
                >
                  +1000
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-medium text-[#737780]">Change Due:</span>
                <span className={`font-mono font-bold tabular-nums ${isCashInsufficient ? 'text-red-600' : 'text-emerald-800'}`}>
                  {isCashInsufficient ? 'Insufficient Cash' : formatPaisa(changeDuePaisa)}
                </span>
              </div>
            </div>
          )}

          {/* Checkout Action Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0 || submitting || isCashInsufficient}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <CheckCircleIcon className="size-4" />
            {submitting ? 'Processing Sale…' : `Complete Sale (${formatPaisa(grandTotalPaisa)})`}
          </button>
        </div>
      </div>

      {/* Sales Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(completedSale)}
        onClose={() => setCompletedSale(null)}
        sale={completedSale}
        onNewSale={() => setCompletedSale(null)}
      />

      {/* Cart Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-[#E8EAED] bg-white p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <TrashIcon className="size-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#17191C]">Clear Shopping Cart?</h3>
                <p className="text-xs text-[#737780]">
                  Are you sure you want to remove all {cart.length} item{cart.length === 1 ? '' : 's'} from the active cart? All scanned goods and customer inputs will be reset.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelClearCart}
                className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#17191C] hover:bg-[#F3F4F6] transition-colors"
              >
                Keep Cart
              </button>
              <button
                type="button"
                onClick={executeClearCart}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
