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

  const cost = Number.parseFloat(costPrice) || 0;
  const sale = Number.parseFloat(salePrice) || 0;
  const profit = sale - cost;
  const marginPct = sale > 0 ? Math.round((profit / sale) * 100) : 0;

  const generateRandomBarcode = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
      <div className="relative w-full max-w-xl rounded-xl border border-[#E8EAED] bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8EAED] bg-[#FAFAFB] px-5 py-3">
          <div className="flex items-center gap-2">
            <PackageIcon className="size-4 text-emerald-800" />
            <h2 className="text-sm font-semibold text-[#17191C]">
              {product ? 'Edit Grocery Product' : 'Add New Grocery Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#737780] hover:text-[#17191C]"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#17191C] mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Olpers Milk 1L, Tapal Danedar Tea 400g"
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17191C] mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#17191C] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
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
                <label className="block text-xs font-medium text-[#17191C] mb-1">Unit of Measure *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#17191C] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
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
                  <label className="text-xs font-medium text-[#17191C]">Barcode</label>
                  <button
                    type="button"
                    onClick={generateRandomBarcode}
                    className="text-[11px] text-emerald-800 hover:underline"
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
                    className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono shadow-2xs"
                  />
                  <BarcodeIcon className="absolute right-2.5 top-2 size-4 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17191C] mb-1">SKU / Item Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. MILK-OLP-1L"
                  className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono shadow-2xs"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="rounded-lg border border-[#E8EAED] bg-[#FAFAFB] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#17191C]">
                  Pricing (PKR Paisa Precision)
                </span>
                <span className={`text-xs font-bold ${profit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                  Margin: {marginPct}% (Profit: Rs {profit.toFixed(2)})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#737780] mb-1">Cost Price (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-mono font-medium text-[#17191C] focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737780] mb-1">Sale Price (Rs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    required
                    className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-mono font-bold text-emerald-800 focus:border-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="rounded-lg border border-[#E8EAED] bg-[#FAFAFB] p-3.5 space-y-2.5">
              <span className="text-xs font-semibold text-[#17191C]">
                Stock & Reorder Levels
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#737780] mb-1">Opening Stock Quantity</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-mono text-[#17191C] focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737780] mb-1">Low Stock Alert Level</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(e.target.value)}
                    className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-mono text-[#17191C] focus:border-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Status Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-[#D1D5DB] text-emerald-800 focus:ring-emerald-700"
              />
              <span className="text-xs text-[#17191C]">Active and available for checkout</span>
            </label>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E8EAED] bg-[#FAFAFB] px-5 py-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-xs text-[#737780] hover:text-[#17191C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
