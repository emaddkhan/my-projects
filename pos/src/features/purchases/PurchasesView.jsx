import { useState, useEffect, useMemo } from 'react';
import { 
  TruckIcon, SearchIcon, PlusIcon, RefreshIcon, ReceiptIcon, 
  CreditCardIcon, AlertTriangleIcon, CheckCircleIcon, TrashIcon,
  BarcodeIcon, EyeIcon
} from '../../components/icons.jsx';
import StatTile from '../../components/StatTile.jsx';
import { api, isBridgeAvailable } from '../../lib/api.js';
import { formatPaisa, paisaToRupees, formatDateTime } from '../../lib/format.js';
import SupplierModal from './SupplierModal.jsx';
import SupplierPaymentModal from './SupplierPaymentModal.jsx';
import PurchaseDetailModal from './PurchaseDetailModal.jsx';
import SupplierLedgerModal from './SupplierLedgerModal.jsx';

export default function PurchasesView() {
  const [activeSubTab, setActiveSubTab] = useState('new_purchase'); // 'new_purchase' | 'invoices' | 'suppliers'
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Purchase Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cartItems, setCartItems] = useState([]);
  const [discountRupees, setDiscountRupees] = useState('0.00');
  const [paidRupees, setPaidRupees] = useState('0.00');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [submittingPurchase, setSubmittingPurchase] = useState(false);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState(null);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState(null);

  // Invoices Sub-tab State
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all'); // 'all' | 'completed' | 'partial' | 'unpaid'

  // Suppliers Sub-tab State
  const [supplierSearch, setSupplierSearch] = useState('');

  // Modals state
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentDefaultSupplierId, setPaymentDefaultSupplierId] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPurchaseDetail, setSelectedPurchaseDetail] = useState(null);

  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [selectedLedgerSupplier, setSelectedLedgerSupplier] = useState(null);

  const loadAllData = async () => {
    if (!isBridgeAvailable()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [suppRes, purRes, prodRes, overRes] = await Promise.all([
        api.suppliers.list({ limit: 500 }),
        api.purchases.list({ limit: 100 }),
        api.products.list({ limit: 1000 }),
        api.purchases.getOverview(),
      ]);
      setSuppliers(suppRes.items || []);
      setPurchases(purRes.items || []);
      setProducts(prodRes.items || []);
      setOverview(overRes);

      // Default supplier selector if none chosen
      if (!selectedSupplierId && suppRes.items && suppRes.items.length > 0) {
        setSelectedSupplierId(String(suppRes.items[0].id));
      }
    } catch (err) {
      console.error('Failed to load purchases module data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered Products for Purchase Entry Search
  const searchResults = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBarcode = p.barcode && p.barcode.toLowerCase().includes(q);
      const matchSku = p.sku && p.sku.toLowerCase().includes(q);
      return matchName || matchBarcode || matchSku;
    }).slice(0, 8);
  }, [products, productSearch]);

  // Cart Calculations
  const grossSubtotalPaisa = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0;
      const costPaisa = Math.round((Number.parseFloat(item.unitCostRupees) || 0) * 100);
      return acc + Math.round(qty * costPaisa);
    }, 0);
  }, [cartItems]);

  const discountPaisa = Math.max(0, Math.round((Number.parseFloat(discountRupees) || 0) * 100));
  const netTotalPaisa = Math.max(0, grossSubtotalPaisa - discountPaisa);
  const paidPaisa = Math.max(0, Math.round((Number.parseFloat(paidRupees) || 0) * 100));
  const duePaisa = Math.max(0, netTotalPaisa - paidPaisa);

  // Cart handlers
  const handleAddProductToCart = (prod) => {
    const existingIndex = cartItems.findIndex((it) => it.productId === prod.id);
    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity = Number((updated[existingIndex].quantity + 1).toFixed(3));
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: prod.id,
          name: prod.name,
          unit: prod.unit,
          barcode: prod.barcode,
          currentStock: prod.currentStock,
          quantity: 1,
          unitCostRupees: paisaToRupees(prod.costPricePaisa || 0),
        },
      ]);
    }
    setProductSearch('');
  };

  const handleUpdateCartItemQty = (index, value) => {
    const updated = [...cartItems];
    updated[index].quantity = value;
    setCartItems(updated);
  };

  const handleUpdateCartItemCost = (index, value) => {
    const updated = [...cartItems];
    updated[index].unitCostRupees = value;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleQuickPayFull = () => {
    setPaidRupees((netTotalPaisa / 100).toFixed(2));
  };

  const handleQuickPayZero = () => {
    setPaidRupees('0.00');
  };

  const handleResetPurchaseForm = () => {
    setCartItems([]);
    setDiscountRupees('0.00');
    setPaidRupees('0.00');
    setSupplierInvoiceNo('');
    setPurchaseNotes('');
    setPurchaseErrorMessage(null);
  };

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    setPurchaseErrorMessage(null);
    setPurchaseSuccessMessage(null);

    const sId = Number(selectedSupplierId);
    if (!Number.isInteger(sId) || sId <= 0) {
      setPurchaseErrorMessage('Please select a supplier.');
      return;
    }

    if (cartItems.length === 0) {
      setPurchaseErrorMessage('Please add at least one product to the purchase invoice.');
      return;
    }

    // Validate item values
    for (const item of cartItems) {
      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        setPurchaseErrorMessage(`Quantity for "${item.name}" must be greater than zero.`);
        return;
      }
      const cost = Number.parseFloat(item.unitCostRupees);
      if (!Number.isFinite(cost) || cost < 0) {
        setPurchaseErrorMessage(`Unit cost for "${item.name}" cannot be negative.`);
        return;
      }
    }

    setSubmittingPurchase(true);
    try {
      const itemsPayload = cartItems.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitCostPaisa: Math.round(Number.parseFloat(item.unitCostRupees) * 100),
      }));

      const result = await api.purchases.create({
        supplierId: sId,
        supplierInvoiceNumber: supplierInvoiceNo.trim() || null,
        purchaseDate: purchaseDate || new Date().toISOString(),
        discountPaisa,
        paidPaisa,
        paymentMethod: paidPaisa > 0 ? paymentMethod : 'cash',
        notes: purchaseNotes.trim() || null,
        items: itemsPayload,
      });

      setPurchaseSuccessMessage(`Purchase Invoice ${result.invoiceNumber} recorded successfully! Stock and cost prices updated.`);
      handleResetPurchaseForm();
      await loadAllData();
    } catch (err) {
      setPurchaseErrorMessage(err.message || 'Failed to record purchase invoice.');
    } finally {
      setSubmittingPurchase(false);
    }
  };

  // Supplier CRUD
  const handleSaveSupplier = async (supplierData, supplierId) => {
    if (supplierId) {
      await api.suppliers.update(supplierId, supplierData);
    } else {
      await api.suppliers.create(supplierData);
    }
    await loadAllData();
  };

  // Supplier Payment
  const handleRecordPayment = async (paymentData) => {
    await api.suppliers.recordPayment(paymentData);
    await loadAllData();
  };

  // Filtered Invoices
  const filteredPurchases = useMemo(() => {
    const q = invoiceSearch.trim().toLowerCase();
    return purchases.filter((p) => {
      if (invoiceStatusFilter !== 'all' && p.status !== invoiceStatusFilter) return false;
      if (!q) return true;
      const matchInv = p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q);
      const matchSupp = p.supplierName && p.supplierName.toLowerCase().includes(q);
      const matchSuppInv = p.supplierInvoiceNumber && p.supplierInvoiceNumber.toLowerCase().includes(q);
      return matchInv || matchSupp || matchSuppInv;
    });
  }, [purchases, invoiceSearch, invoiceStatusFilter]);

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const matchPhone = s.phone && s.phone.toLowerCase().includes(q);
      return matchName || matchPhone;
    });
  }, [suppliers, supplierSearch]);

  const handleOpenPurchaseDetail = async (p) => {
    try {
      const full = await api.purchases.get(p.id);
      setSelectedPurchaseDetail(full);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to load purchase detail:', err);
    }
  };

  const handleOpenLedger = (s) => {
    setSelectedLedgerSupplier(s);
    setLedgerModalOpen(true);
  };

  const handleOpenPaymentForSupplier = (s) => {
    setPaymentDefaultSupplierId(s.id);
    setPaymentModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatTile
          label="Total Purchases"
          icon={<ReceiptIcon className="size-4" />}
          value={formatPaisa(overview?.totalPurchasesPaisa ?? 0)}
          hint={`${overview?.purchasesCount ?? 0} invoices recorded`}
        />
        <StatTile
          label="Total Disbursed (Paid)"
          icon={<CreditCardIcon className="size-4" />}
          value={formatPaisa(overview?.totalPaidPaisa ?? 0)}
          hint="Cash & bank supplier payments"
        />
        <StatTile
          label="Accounts Payable (Due)"
          icon={<TruckIcon className="size-4" />}
          value={formatPaisa(overview?.totalDuePaisa ?? 0)}
          hint="Total vendor liability outstanding"
        />
        <StatTile
          label="Active Suppliers"
          icon={<TruckIcon className="size-4" />}
          value={String(overview?.activeSuppliersCount ?? suppliers.length)}
          hint="Registered wholesale vendors"
        />
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl border border-[#E8EAED] bg-white shadow-xs">
        {/* Sub-navigation bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E8EAED] px-4 py-2.5 gap-2">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-[#E8EAED] bg-[#F7F8FA] p-0.5">
            <button
              onClick={() => setActiveSubTab('new_purchase')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeSubTab === 'new_purchase'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-[#737780] hover:text-[#17191C]'
              }`}
            >
              <PlusIcon className="size-3.5" />
              New Purchase Invoice
            </button>
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeSubTab === 'invoices'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-[#737780] hover:text-[#17191C]'
              }`}
            >
              <ReceiptIcon className="size-3.5" />
              Purchase Invoices ({purchases.length})
            </button>
            <button
              onClick={() => setActiveSubTab('suppliers')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeSubTab === 'suppliers'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-[#737780] hover:text-[#17191C]'
              }`}
            >
              <TruckIcon className="size-3.5" />
              Suppliers & Khata ({suppliers.length})
            </button>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingSupplier(null);
                setSupplierModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8EAED] bg-white px-3 py-1.5 text-xs font-semibold text-[#17191C] hover:bg-[#F7F8FA] transition-all shadow-2xs"
            >
              <PlusIcon className="size-3.5 text-emerald-600" />
              New Supplier
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentDefaultSupplierId(null);
                setPaymentModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-2xs"
            >
              <CreditCardIcon className="size-3.5" />
              Record Payment
            </button>
            <button
              type="button"
              onClick={loadAllData}
              className="rounded-xl border border-[#E8EAED] bg-white p-1.5 text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-all"
              title="Refresh Data"
            >
              <RefreshIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* SUB-TAB 1: NEW PURCHASE INVOICE */}
        {activeSubTab === 'new_purchase' && (
          <div className="p-4 space-y-4">
            {/* Success Alert */}
            {purchaseSuccessMessage && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{purchaseSuccessMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPurchaseSuccessMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Alert */}
            {purchaseErrorMessage && (
              <div className="flex items-center justify-between rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="size-4 text-rose-600 shrink-0" />
                  <span className="font-medium">{purchaseErrorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPurchaseErrorMessage(null)}
                  className="text-rose-700 hover:text-rose-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitPurchase} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Supplier & Products Entry */}
              <div className="lg:col-span-2 space-y-4">
                {/* Invoice Meta Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E8EAED]">
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Supplier / Vendor <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      className="w-full rounded-lg border border-[#E8EAED] bg-white px-3 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-hidden"
                    >
                      <option value="">-- Select Vendor --</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.phone ? `(${s.phone})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Supplier Invoice / Challan #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV-9901, DC-44"
                      value={supplierInvoiceNo}
                      onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                      className="w-full rounded-lg border border-[#E8EAED] bg-white px-3 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full rounded-lg border border-[#E8EAED] bg-white px-3 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Product Search & Quick Add */}
                <div className="relative">
                  <div className="relative">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#737780]" />
                    <input
                      type="text"
                      placeholder="Search product by name or scan barcode to add to purchase invoice…"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full rounded-xl border border-[#E8EAED] bg-white pl-10 pr-4 py-2.5 text-xs text-[#17191C] placeholder-[#737780]/60 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 shadow-2xs"
                    />
                  </div>

                  {/* Search Dropdown Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-60 overflow-y-auto rounded-xl border border-[#E8EAED] bg-white p-1.5 shadow-xl">
                      {searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleAddProductToCart(p)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="text-xs font-semibold text-[#17191C] block">{p.name}</span>
                            <span className="text-[11px] text-[#737780]">
                              Stock: {p.currentStock} {p.unit} · Barcode: {p.barcode || '—'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-medium text-emerald-800 block">
                              Cost: {formatPaisa(p.costPricePaisa)}
                            </span>
                            <span className="text-[10px] text-[#737780]">Click to add</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Line Items Table */}
                <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-right w-28">Quantity</th>
                        <th className="py-2.5 px-3 text-right w-32">Unit Cost (PKR)</th>
                        <th className="py-2.5 px-3 text-right w-32">Line Total</th>
                        <th className="py-2.5 px-3 text-center w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EAED] bg-white">
                      {cartItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-[#737780]">
                            No products added yet. Use the search box above to add items to this purchase.
                          </td>
                        </tr>
                      ) : (
                        cartItems.map((item, idx) => {
                          const qty = Number(item.quantity) || 0;
                          const costPaisa = Math.round((Number.parseFloat(item.unitCostRupees) || 0) * 100);
                          const linePaisa = Math.round(qty * costPaisa);

                          return (
                            <tr key={item.productId} className="hover:bg-[#F7F8FA]/50">
                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-[#17191C] block">{item.name}</span>
                                <span className="text-[10px] text-[#737780]">
                                  Current Stock: {item.currentStock} {item.unit}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <input
                                  type="number"
                                  min="0.01"
                                  step="any"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateCartItemQty(idx, e.target.value)}
                                  className="w-20 text-right rounded-md border border-[#E8EAED] px-2 py-1 text-xs font-mono font-medium focus:border-emerald-600 focus:outline-hidden"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitCostRupees}
                                  onChange={(e) => handleUpdateCartItemCost(idx, e.target.value)}
                                  className="w-24 text-right rounded-md border border-[#E8EAED] px-2 py-1 text-xs font-mono font-medium focus:border-emerald-600 focus:outline-hidden"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-[#17191C]">
                                {formatPaisa(linePaisa)}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCartItem(idx)}
                                  className="rounded-md p-1 text-[#737780] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Remove Item"
                                >
                                  <TrashIcon className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Col: Invoice Financial Breakdown & Post Button */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#E8EAED] bg-[#F7F8FA] p-4 space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#737780] border-b border-[#E8EAED] pb-2">
                    Purchase Order Financials
                  </h3>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#737780]">Gross Subtotal:</span>
                    <span className="font-mono font-semibold text-[#17191C]">
                      {formatPaisa(grossSubtotalPaisa)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[#737780]">Discount (PKR):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountRupees}
                      onChange={(e) => setDiscountRupees(e.target.value)}
                      className="w-28 text-right rounded-lg border border-[#E8EAED] bg-white px-2 py-1 text-xs font-mono font-medium text-[#17191C] focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Net Total */}
                  <div className="flex justify-between items-center text-sm font-bold text-[#17191C] pt-2 border-t border-[#E8EAED]">
                    <span>Net Invoice Total:</span>
                    <span className="font-mono text-base text-emerald-800">
                      {formatPaisa(netTotalPaisa)}
                    </span>
                  </div>

                  {/* Paid Amount */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E8EAED]">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-[#737780] font-semibold">Amount Paid Now (PKR):</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={paidRupees}
                        onChange={(e) => setPaidRupees(e.target.value)}
                        className="w-28 text-right rounded-lg border border-[#E8EAED] bg-white px-2 py-1 text-xs font-mono font-bold text-emerald-700 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    {/* Quick Pay Buttons */}
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={handleQuickPayFull}
                        className="rounded-md border border-[#E8EAED] bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
                      >
                        Pay 100% (Full)
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickPayZero}
                        className="rounded-md border border-[#E8EAED] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#737780] hover:bg-gray-100 transition-colors"
                      >
                        Pay 0 (Full Credit)
                      </button>
                    </div>
                  </div>

                  {/* Due Balance */}
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-[#E8EAED]">
                    <span className={duePaisa > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                      Remaining Due (Payable):
                    </span>
                    <span className={`font-mono text-sm ${duePaisa > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatPaisa(duePaisa)}
                    </span>
                  </div>

                  {/* Payment Method selector if paying anything */}
                  {paidPaisa > 0 && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-[#17191C] mb-1">
                        Disbursement Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-lg border border-[#E8EAED] bg-white px-2.5 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-hidden"
                      >
                        <option value="cash">Cash in Hand</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                        <option value="online">Online / Raast</option>
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Purchase Notes / Remarks
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Received batch #440, goods in sound condition"
                      value={purchaseNotes}
                      onChange={(e) => setPurchaseNotes(e.target.value)}
                      className="w-full rounded-lg border border-[#E8EAED] bg-white p-2 text-xs text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Post CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingPurchase || cartItems.length === 0}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-sm"
                    >
                      <ReceiptIcon className="size-4" />
                      {submittingPurchase ? 'Posting Invoice & Stock…' : 'Post Purchase Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* SUB-TAB 2: PURCHASE INVOICES */}
        {activeSubTab === 'invoices' && (
          <div className="p-4 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#737780]" />
                <input
                  type="text"
                  placeholder="Filter by invoice # or supplier name…"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8EAED] bg-white pl-10 pr-3.5 py-1.5 text-xs text-[#17191C] placeholder-[#737780]/60 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Status Segmented control */}
              <div className="flex items-center gap-1 rounded-lg border border-[#E8EAED] bg-[#F7F8FA] p-0.5 text-xs">
                {['all', 'completed', 'partial', 'unpaid'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInvoiceStatusFilter(st)}
                    className={`rounded-md px-2.5 py-1 font-semibold capitalize transition-all ${
                      invoiceStatusFilter === st
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-[#737780] hover:text-[#17191C]'
                    }`}
                  >
                    {st === 'all' ? 'All Invoices' : st === 'completed' ? 'Paid' : st === 'partial' ? 'Partial' : 'Unpaid'}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Due (Payable)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED] bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#737780]">
                        Loading purchase invoices…
                      </td>
                    </tr>
                  ) : filteredPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#737780]">
                        No purchase invoices found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPurchases.map((p) => {
                      const hasDue = (p.duePaisa ?? 0) > 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#F7F8FA]/60">
                          <td className="py-2.5 px-3 font-mono font-semibold text-[#17191C]">
                            {p.invoiceNumber}
                          </td>
                          <td className="py-2.5 px-3 text-[#737780] whitespace-nowrap">
                            {formatDateTime(p.purchaseDate || p.createdAt)}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#17191C]">
                            {p.supplierName}
                            {p.supplierInvoiceNumber && (
                              <span className="block text-[10px] text-[#737780] font-normal">
                                Sup Ref: {p.supplierInvoiceNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#17191C]">
                            {formatPaisa(p.totalPaisa)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                            {formatPaisa(p.paidPaisa)}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                            hasDue ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {formatPaisa(p.duePaisa)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : p.status === 'partial'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {p.status === 'completed' ? 'Paid' : p.status === 'partial' ? 'Partial' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenPurchaseDetail(p)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAED] bg-white px-2.5 py-1 text-xs font-semibold text-[#17191C] hover:bg-[#F7F8FA] transition-all"
                            >
                              <EyeIcon className="size-3 text-[#737780]" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: SUPPLIERS & KHATA */}
        {activeSubTab === 'suppliers' && (
          <div className="p-4 space-y-4">
            {/* Filter & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#737780]" />
                <input
                  type="text"
                  placeholder="Search suppliers by name or phone…"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8EAED] bg-white pl-10 pr-3.5 py-1.5 text-xs text-[#17191C] placeholder-[#737780]/60 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingSupplier(null);
                  setSupplierModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all shadow-xs"
              >
                <PlusIcon className="size-3.5" />
                Add New Supplier
              </button>
            </div>

            {/* Suppliers Table */}
            <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#737780] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Address</th>
                    <th className="py-2.5 px-3 text-right">Total Purchases</th>
                    <th className="py-2.5 px-3 text-right">Total Paid</th>
                    <th className="py-2.5 px-3 text-right">Net Payable</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED] bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#737780]">
                        Loading suppliers…
                      </td>
                    </tr>
                  ) : filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#737780]">
                        No suppliers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((s) => {
                      const payable = s.currentBalancePaisa ?? 0;
                      return (
                        <tr key={s.id} className="hover:bg-[#F7F8FA]/60">
                          <td className="py-2.5 px-3 font-semibold text-[#17191C]">
                            {s.name}
                            {s.notes && (
                              <span className="block text-[10px] text-[#737780] font-normal truncate max-w-xs">
                                {s.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#737780]">
                            {s.phone && <span className="block text-[#17191C] font-medium">{s.phone}</span>}
                            {s.email && <span className="block text-[11px]">{s.email}</span>}
                            {!s.phone && !s.email && '—'}
                          </td>
                          <td className="py-2.5 px-3 text-[#737780] truncate max-w-xs">
                            {s.address || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#17191C]">
                            {formatPaisa(s.totalPurchasesPaisa ?? 0)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                            {formatPaisa(s.totalPaidPaisa ?? 0)}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                            payable > 0 ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {formatPaisa(payable)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              s.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {s.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenLedger(s)}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EAED] bg-white px-2 py-1 text-xs font-semibold text-[#17191C] hover:bg-[#F7F8FA] transition-all"
                                title="View Khata Statement"
                              >
                                Ledger
                              </button>
                              {payable > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenPaymentForSupplier(s)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs font-semibold hover:bg-blue-100 transition-all"
                                  title="Record Payment"
                                >
                                  Pay
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSupplier(s);
                                  setSupplierModalOpen(true);
                                }}
                                className="rounded-lg border border-[#E8EAED] bg-white px-2 py-1 text-xs font-semibold text-[#737780] hover:text-[#17191C] hover:bg-[#F7F8FA] transition-all"
                                title="Edit Supplier"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <SupplierModal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        supplier={editingSupplier}
        onSave={handleSaveSupplier}
      />

      <SupplierPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        suppliers={suppliers}
        defaultSupplierId={paymentDefaultSupplierId}
        purchases={purchases}
        onSuccess={handleRecordPayment}
      />

      <PurchaseDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        purchase={selectedPurchaseDetail}
        onRecordPayment={(pur) => {
          setPaymentDefaultSupplierId(pur.supplierId);
          setPaymentModalOpen(true);
        }}
      />

      <SupplierLedgerModal
        isOpen={ledgerModalOpen}
        onClose={() => setLedgerModalOpen(false)}
        supplier={selectedLedgerSupplier}
        onRecordPayment={(s) => {
          setPaymentDefaultSupplierId(s.id);
          setPaymentModalOpen(true);
        }}
      />
    </div>
  );
}
