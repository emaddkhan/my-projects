import { useState, useEffect } from 'react';
import { PackageIcon, BarcodeIcon } from '../../components/icons.jsx';
import { paisaToRupees } from '../../lib/format.js';

const UNITS = [
  { value: 'piece', label: 'Piece (Pcs)' },
  { value: 'kg', label: 'Kilogram (Kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'packet', label: 'Packet (Pkt)' },
  { value: 'box', label: 'Box (Ctn/Box)' },
];

export default function ProductFormModal({ isOpen, onClose, product, categories, onSave }) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('piece');
  const [costPrice, setCostPrice] = useState('0.00');
  const [salePrice, setSalePrice] = useState('0.00');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategoryId(product.categoryId ? String(product.categoryId) : '');
      setBarcode(product.barcode || '');
      setSku(product.sku || '');
      setUnit(product.unit || 'piece');
      setCostPrice(paisaToRupees(product.costPricePaisa));
      setSalePrice(paisaToRupees(product.salePricePaisa));
      setCurrentStock(String(product.currentStock ?? 0));
      setMinStockLevel(String(product.minStockLevel ?? 5));
      setIsActive(product.isActive !== undefined ? Boolean(product.isActive) : true);
    } else {
      setName('');
      setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
      setBarcode('');
      setSku('');
      setUnit('piece');
      setCostPrice('0.00');
      setSalePrice('0.00');
      setCurrentStock('0');
      setMinStockLevel('5');
      setIsActive(true);
    }
    setError(null);
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  // Margin calculation
  const cost = Number.parseFloat(costPrice) || 0;
  const sale = Number.parseFloat(salePrice) || 0;
  const profit = sale - cost;
  const marginPct = sale > 0 ? Math.round((profit / sale) * 100) : 0;

  const generateRandomBarcode = () => {
    // Generate an EAN-13 style standard 13-digit retail barcode with Pakistan prefix 896
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    setBarcode(`896${randomDigits}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (sale < 0 || cost < 0) {
      setError('Prices cannot be negative.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        categoryId: categoryId ? Number(categoryId) : null,
        barcode: barcode.trim() || null,
        sku: sku.trim() || null,
        unit,
        costPrice: cost,
        salePrice: sale,
        currentStock: Number(currentStock) || 0,
        minStockLevel: Number(minStockLevel) || 0,
        isActive,
      }, product?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
              <PackageIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {product ? 'Edit Product' : 'Add New Grocery Product'}
              </h2>
              <p className="text-xs text-slate-400">Configure barcode, category, prices, and stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Olpers Milk 1 Litre, Tapal Danedar Tea 400g"
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">(Uncategorized)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Unit of Measure *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Barcode</label>
                  <button
                    type="button"
                    onClick={generateRandomBarcode}
                    className="text-[11px] text-brand-400 hover:text-brand-300 underline"
                  >
                    Generate Barcode
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan or enter barcode"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <BarcodeIcon className="absolute right-3 top-2.5 size-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">SKU / Code (Optional)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. MILK-OLP-1L"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            {/* Pricing Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Pricing (PKR Paisa Precision)
                </span>
                <span className={`text-xs font-medium ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Margin: {marginPct}% (Profit: Rs {profit.toFixed(2)})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cost Price (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sale Price (Rs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Stock Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Stock & Inventory Levels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current Stock Quantity</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Low Stock Alert Level</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs text-slate-300 font-medium">Product is active and available for sale</span>
            </label>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800/80 px-6 py-4 bg-slate-950/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-brand-400 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
