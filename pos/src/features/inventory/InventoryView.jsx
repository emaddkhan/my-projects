import { useState, useEffect, useMemo } from 'react';
import { 
  PackageIcon, SearchIcon, RefreshIcon, AlertTriangleIcon, 
  ArrowDownIcon, ArrowUpIcon, ClockIcon, ClipboardListIcon 
} from '../../components/icons.jsx';
import StatTile from '../../components/StatTile.jsx';
import { api, isBridgeAvailable } from '../../lib/api.js';
import { formatDateTime } from '../../lib/format.js';
import StockOperationModal from './StockOperationModal.jsx';

export default function InventoryView() {
  const [activeSubTab, setActiveSubTab] = useState('stock'); // 'stock' | 'movements'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [movementsTotal, setMovementsTotal] = useState(0);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters for Stock view
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all'); // 'all' | 'low' | 'out' | 'healthy'

  // Filters for Movements view
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [movementProductFilter, setMovementProductFilter] = useState('');

  // Active operation modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [operationType, setOperationType] = useState('stock_in');
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    if (!isBridgeAvailable()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [prodRes, catRes, overRes, movRes] = await Promise.all([
        api.products.list({ limit: 500 }),
        api.categories.list(),
        api.inventory.getOverview(),
        api.inventory.listMovements({ limit: 100, movementType: movementTypeFilter }),
      ]);
      setProducts(prodRes.items);
      setCategories(catRes);
      setOverview(overRes);
      setMovements(movRes.items);
      setMovementsTotal(movRes.total);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [movementTypeFilter]);

  const handleOpenOperation = (product, type) => {
    setSelectedProduct(product);
    setOperationType(type);
    setModalOpen(true);
  };

  // Filtered Stock List
  const filteredProducts = useMemo(() => {
    const q = stockSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = !stockCategoryFilter || String(p.categoryId) === stockCategoryFilter;
      if (!matchCat) return false;

      const isOut = p.currentStock <= 0;
      const isLow = !isOut && p.currentStock <= p.minStockLevel;

      if (stockStatusFilter === 'out' && !isOut) return false;
      if (stockStatusFilter === 'low' && !isLow) return false;
      if (stockStatusFilter === 'healthy' && (isOut || isLow)) return false;

      if (!q) return true;
      const matchName = p.name.toLowerCase().includes(q);
      const matchBarcode = p.barcode && p.barcode.toLowerCase().includes(q);
      const matchSku = p.sku && p.sku.toLowerCase().includes(q);
      return matchName || matchBarcode || matchSku;
    });
  }, [products, stockSearch, stockCategoryFilter, stockStatusFilter]);

  // Movement badge color helper
  const getMovementBadge = (type) => {
    switch (type) {
      case 'stock_in':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Stock In</span>;
      case 'stock_out':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Stock Out</span>;
      case 'adjustment_in':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Adjust (+)</span>;
      case 'adjustment_out':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Adjust (-)</span>;
      case 'damaged':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">Damaged</span>;
      case 'sale':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Sale</span>;
      case 'opening_balance':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Opening Balance</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">{type}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <StatTile
          label="Active Products"
          icon={<PackageIcon className="size-4" />}
          value={overview?.totalActiveProducts ?? 0}
          hint="Catalog items active for retail"
        />
        <StatTile
          label="Low Stock Alerts"
          icon={<AlertTriangleIcon className="size-4 text-amber-600" />}
          value={overview?.lowStockCount ?? 0}
          hint="Items below reorder threshold"
        />
        <StatTile
          label="Out of Stock"
          icon={<AlertTriangleIcon className="size-4 text-red-600" />}
          value={overview?.outOfStockCount ?? 0}
          hint="Zero units currently available"
        />
        <StatTile
          label="Movements Today"
          icon={<ClockIcon className="size-4 text-emerald-700" />}
          value={overview?.movementsTodayCount ?? 0}
          hint="Total inventory changes today"
        />
      </div>

      {/* Main Card with Segmented Controls */}
      <div className="rounded-xl border border-[#E8EAED] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E8EAED] px-4 py-3 bg-[#FAFAFB] gap-3">
          {/* Segmented Switcher */}
          <div className="flex bg-[#E8EAED] p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('stock')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'stock'
                  ? 'bg-white text-[#17191C] shadow-xs'
                  : 'text-[#737780] hover:text-[#17191C]'
              }`}
            >
              Current Stock Levels ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeSubTab === 'movements'
                  ? 'bg-white text-[#17191C] shadow-xs'
                  : 'text-[#737780] hover:text-[#17191C]'
              }`}
            >
              Movement Audit History ({movementsTotal})
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#737780] hover:text-[#17191C] bg-white border border-[#D1D5DB] px-3 py-1.5 rounded-lg shadow-2xs hover:bg-[#F3F4F6] transition-colors"
          >
            <RefreshIcon className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* SUBTAB 1: Current Stock Levels & Quick Actions */}
        {activeSubTab === 'stock' && (
          <div>
            {/* Filter Bar */}
            <div className="p-3 border-b border-[#E8EAED] flex flex-wrap gap-2 items-center justify-between bg-white text-xs">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <SearchIcon className="size-3.5 absolute left-2.5 top-2.5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search by product name, barcode, SKU…"
                    className="w-full rounded-lg border border-[#D1D5DB] pl-8 pr-3 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Category filter */}
                <select
                  value={stockCategoryFilter}
                  onChange={(e) => setStockCategoryFilter(e.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value)}
                  className="rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#17191C] focus:border-emerald-600 focus:outline-none"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="low">Low Stock Only</option>
                  <option value="out">Out of Stock Only</option>
                  <option value="healthy">Healthy Stock</option>
                </select>
              </div>
            </div>

            {/* Products Stock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17191C]">
                <thead className="bg-[#FAFAFB] text-[11px] font-semibold text-[#737780] border-b border-[#E8EAED]">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-3 py-2.5">Barcode / SKU</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5 text-right">Current Stock</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-4 py-2.5 text-right">Stock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#737780]">
                        No matching products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isOut = p.currentStock <= 0;
                      const isLow = !isOut && p.currentStock <= p.minStockLevel;

                      return (
                        <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-4 py-2.5">
                            <span className="font-semibold text-[#17191C] block">{p.name}</span>
                            <span className="text-[10px] text-[#737780]">Unit: {p.unit}</span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-[#737780]">
                            {p.barcode || p.sku || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-[#737780]">
                            {p.categoryName || 'General'}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold tabular-nums">
                            <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-[#17191C]'}>
                              {p.currentStock} {p.unit}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {isOut ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                Low Stock (≤{p.minStockLevel})
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenOperation(p, 'stock_in')}
                                className="rounded px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                title="Add received stock"
                              >
                                + Stock In
                              </button>
                              <button
                                onClick={() => handleOpenOperation(p, 'stock_out')}
                                className="rounded px-2 py-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                                title="Manually remove stock"
                              >
                                - Stock Out
                              </button>
                              <button
                                onClick={() => handleOpenOperation(p, 'adjust')}
                                className="rounded px-2 py-1 text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                                title="Reconcile physical stock"
                              >
                                Adjust
                              </button>
                              <button
                                onClick={() => handleOpenOperation(p, 'damaged')}
                                className="rounded px-2 py-1 text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                                title="Write off broken or expired goods"
                              >
                                Damaged
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

        {/* SUBTAB 2: Movement Audit History Ledger */}
        {activeSubTab === 'movements' && (
          <div>
            {/* Movement Filter Bar */}
            <div className="p-3 border-b border-[#E8EAED] flex flex-wrap gap-2 items-center justify-between bg-white text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {[
                  { id: 'all', label: 'All Movements' },
                  { id: 'stock_in', label: 'Stock In' },
                  { id: 'stock_out', label: 'Stock Out' },
                  { id: 'adjustment_in', label: 'Adjustments (+)' },
                  { id: 'adjustment_out', label: 'Adjustments (-)' },
                  { id: 'damaged', label: 'Damaged' },
                  { id: 'sale', label: 'Sales' },
                  { id: 'opening_balance', label: 'Opening Balances' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setMovementTypeFilter(btn.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      movementTypeFilter === btn.id
                        ? 'bg-[#17191C] text-white shadow-xs'
                        : 'bg-[#F3F4F6] text-[#737780] hover:bg-[#E8EAED]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Movements Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17191C]">
                <thead className="bg-[#FAFAFB] text-[11px] font-semibold text-[#737780] border-b border-[#E8EAED]">
                  <tr>
                    <th className="px-4 py-2.5">Date & Time</th>
                    <th className="px-3 py-2.5">Product</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5 text-right">Quantity</th>
                    <th className="px-3 py-2.5 text-center">Stock Change</th>
                    <th className="px-4 py-2.5">Reason / Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED]">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#737780]">
                        No stock movement records found for this filter.
                      </td>
                    </tr>
                  ) : (
                    movements.map((m) => {
                      const isAddition = ['stock_in', 'adjustment_in', 'opening_balance'].includes(m.movementType);
                      return (
                        <tr key={m.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-4 py-2 font-mono text-[11px] text-[#737780] whitespace-nowrap">
                            {formatDateTime(m.createdAt)}
                          </td>
                          <td className="px-3 py-2 font-medium text-[#17191C]">
                            {m.productName || `Deleted Product (ID ${m.productId})`}
                          </td>
                          <td className="px-3 py-2">
                            {getMovementBadge(m.movementType)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold tabular-nums">
                            <span className={isAddition ? 'text-emerald-700' : 'text-red-600'}>
                              {isAddition ? `+${m.quantity}` : `-${m.quantity}`} {m.unit}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center font-mono text-[11px] text-[#737780]">
                            {m.previousStock} → <span className="font-semibold text-[#17191C]">{m.newStock}</span>
                          </td>
                          <td className="px-4 py-2 text-[#737780] max-w-xs truncate" title={m.reason || ''}>
                            <span>{m.reason || '—'}</span>
                            {m.referenceId && (
                              <span className="block text-[10px] text-[#9CA3AF]">
                                Ref: {m.referenceType || 'Doc'} #{m.referenceId}
                              </span>
                            )}
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

      {/* Stock Operation Modal */}
      <StockOperationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        operationType={operationType}
        onSuccess={loadData}
      />
    </div>
  );
}
