import { useState } from 'react';
import { 
  PackageIcon, PlusIcon, FolderIcon, SearchIcon, EditIcon, TrashIcon, 
  AlertTriangleIcon, RefreshIcon, CheckCircleIcon 
} from '../../components/icons.jsx';
import { formatPaisa } from '../../lib/format.js';
import { useProducts } from './useProducts.js';
import ProductFormModal from './ProductFormModal.jsx';
import CategoryManagerModal from './CategoryManagerModal.jsx';

export default function ProductsView() {
  const {
    products,
    total,
    categories,
    lowStock,
    loading,
    error,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    showOnlyLowStock,
    setShowOnlyLowStock,
    refresh,
    saveProduct,
    removeProduct,
    saveCategory,
    removeCategory,
  } = useProducts();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      return;
    }
    try {
      await removeProduct(prod.id);
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  // Inventory value calculations
  const totalStockItems = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0);
  const totalInventoryRetailPaisa = products.reduce((sum, p) => sum + ((Number(p.currentStock) || 0) * (p.salePricePaisa || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Products</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
              <PackageIcon className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{total}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{totalStockItems.toFixed(0)} units in catalog</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Categories</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <FolderIcon className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{categories.length}</p>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-[11px] text-sky-400 hover:text-sky-300 mt-0.5 underline text-left"
          >
            Manage Departments →
          </button>
        </div>

        <div className={`rounded-2xl border p-4 shadow-sm backdrop-blur transition-colors ${
          lowStock.length > 0 
            ? 'border-amber-500/30 bg-amber-500/10' 
            : 'border-slate-800/80 bg-slate-900/60'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Low Stock Alerts</span>
            <div className={`flex size-7 items-center justify-center rounded-lg ${
              lowStock.length > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertTriangleIcon className="size-4" />
            </div>
          </div>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${lowStock.length > 0 ? 'text-amber-300' : 'text-white'}`}>
            {lowStock.length}
          </p>
          <button
            onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
            className="text-[11px] text-amber-400 hover:text-amber-300 mt-0.5 underline text-left"
          >
            {showOnlyLowStock ? 'Showing low stock (Click to clear)' : 'Filter low stock items'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Retail Value</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircleIcon className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-emerald-300 font-mono">
            {formatPaisa(totalInventoryRetailPaisa)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Estimated on-hand stock</p>
        </div>
      </div>

      {/* Control Bar: Search & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <SearchIcon className="absolute left-3.5 top-2.5 size-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, barcode, or SKU… (Press /)"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 backdrop-blur"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            title="Refresh List"
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FolderIcon className="size-3.5 text-sky-400" />
            Categories
          </button>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors"
          >
            <PlusIcon className="size-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('')}
          className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === ''
              ? 'bg-brand-500 text-white'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Categories ({total})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(selectedCategory === String(c.id) ? '' : String(c.id))}
            className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === String(c.id)
                ? 'bg-brand-500 text-white'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.name} ({c.productCount ?? 0})
          </button>
        ))}
      </div>

      {/* Products Table Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading products catalog…</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-rose-400">Error loading products: {error}</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 mb-3">
              <PackageIcon className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No products found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              {search || selectedCategory || showOnlyLowStock
                ? 'Try adjusting your search query or filters.'
                : 'Get started by adding grocery items with barcodes, prices, and stock.'}
            </p>
            <button
              onClick={handleAddProduct}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-400 transition-colors"
            >
              <PlusIcon className="size-3.5" />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Barcode / SKU</th>
                  <th className="px-4 py-3.5">Unit</th>
                  <th className="px-4 py-3.5 text-right">Cost Price</th>
                  <th className="px-4 py-3.5 text-right">Sale Price</th>
                  <th className="px-4 py-3.5 text-right">Stock</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => {
                  const isLow = prod.currentStock <= prod.minStockLevel;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-5 py-3.5 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{prod.name}</span>
                          {isLow && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-300 text-xs">
                        {prod.categoryName || <span className="text-slate-500 italic">Uncategorized</span>}
                      </td>

                      <td className="px-4 py-3.5 text-xs font-mono text-slate-400">
                        {prod.barcode ? (
                          <span className="text-slate-300">{prod.barcode}</span>
                        ) : prod.sku ? (
                          <span className="text-slate-400">{prod.sku}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-300 capitalize">
                        {prod.unit}
                      </td>

                      <td className="px-4 py-3.5 text-right text-xs font-mono text-slate-400">
                        {formatPaisa(prod.costPricePaisa)}
                      </td>

                      <td className="px-4 py-3.5 text-right text-xs font-mono font-semibold text-emerald-300">
                        {formatPaisa(prod.salePricePaisa)}
                      </td>

                      <td className="px-4 py-3.5 text-right text-xs font-mono">
                        <span className={`font-semibold ${isLow ? 'text-amber-400' : 'text-slate-200'}`}>
                          {prod.currentStock}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1">/ min {prod.minStockLevel}</span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          prod.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {prod.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            title="Edit Product"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                          >
                            <EditIcon className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            title="Delete Product"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={saveProduct}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSave={saveCategory}
        onDelete={removeCategory}
      />
    </div>
  );
}
