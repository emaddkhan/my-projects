import { useState } from 'react';
import { 
  PackageIcon, PlusIcon, FolderIcon, SearchIcon, EditIcon, TrashIcon, 
  AlertTriangleIcon, RefreshIcon, CheckCircleIcon 
} from '../../components/icons.jsx';
import { formatPaisa } from '../../lib/format.js';
import { useProducts } from './useProducts.js';
import StatTile from '../../components/StatTile.jsx';
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

  const totalStockItems = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0);
  const totalInventoryRetailPaisa = products.reduce((sum, p) => sum + ((Number(p.currentStock) || 0) * (p.salePricePaisa || 0)), 0);

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Catalog Items"
          icon={<PackageIcon className="size-4" />}
          value={total}
          hint={`${totalStockItems.toFixed(0)} units on hand`}
        />

        <StatTile
          label="Departments"
          icon={<FolderIcon className="size-4" />}
          value={categories.length}
          hint={
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-emerald-800 font-medium hover:underline"
            >
              Manage Categories →
            </button>
          }
        />

        <StatTile
          label="Low Stock Alert"
          icon={<AlertTriangleIcon className="size-4" />}
          value={
            <span className={lowStock.length > 0 ? 'text-amber-700' : 'text-[#17191C]'}>
              {lowStock.length}
            </span>
          }
          hint={
            <button
              onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
              className="text-xs text-[#737780] hover:text-[#17191C] underline"
            >
              {showOnlyLowStock ? 'Showing low stock (Reset)' : 'Filter low stock items'}
            </button>
          }
        />

        <StatTile
          label="Estimated Retail Value"
          icon={<CheckCircleIcon className="size-4" />}
          value={<span className="text-emerald-800">{formatPaisa(totalInventoryRetailPaisa)}</span>}
          hint="Gross retail value"
        />
      </div>

      {/* Control Bar: Search & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-2.5 size-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, barcode, SKU…"
            className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-9 pr-8 py-1.5 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-xs text-[#9CA3AF] hover:text-[#17191C]"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            title="Refresh List"
            className="rounded-lg border border-[#D1D5DB] bg-white p-1.5 text-[#737780] hover:bg-[#F3F4F6] transition-colors"
          >
            <RefreshIcon className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#17191C] hover:bg-[#F3F4F6] transition-colors shadow-2xs"
          >
            <FolderIcon className="size-3.5 text-[#737780]" />
            Categories
          </button>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
          >
            <PlusIcon className="size-3.5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('')}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === ''
              ? 'bg-emerald-800 text-white'
              : 'bg-white border border-[#E8EAED] text-[#737780] hover:text-[#17191C] hover:bg-[#F3F4F6]'
          }`}
        >
          All Items ({total})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(selectedCategory === String(c.id) ? '' : String(c.id))}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === String(c.id)
                ? 'bg-emerald-800 text-white'
                : 'bg-white border border-[#E8EAED] text-[#737780] hover:text-[#17191C] hover:bg-[#F3F4F6]'
            }`}
          >
            {c.name} ({c.productCount ?? 0})
          </button>
        ))}
      </div>

      {/* Products Table Card */}
      <div className="rounded-xl border border-[#E8EAED] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#737780]">Loading products catalog…</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-700">Error loading products: {error}</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-[#737780]">
            <PackageIcon className="size-8 stroke-1 mx-auto text-[#D1D5DB] mb-2" />
            <h3 className="text-xs font-semibold text-[#17191C]">No products found</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5 max-w-sm mx-auto">
              {search || selectedCategory || showOnlyLowStock
                ? 'Try adjusting your search query or department filter.'
                : 'Click "Add Product" to add grocery items with barcodes, prices, and stock.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8EAED] bg-[#F7F8FA] text-[11px] font-semibold uppercase tracking-wider text-[#737780]">
                  <th className="px-4 py-2.5">Product Name</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5">Barcode / SKU</th>
                  <th className="px-3 py-2.5">Unit</th>
                  <th className="px-3 py-2.5 text-right">Cost</th>
                  <th className="px-3 py-2.5 text-right">Sale Price</th>
                  <th className="px-3 py-2.5 text-right">Stock</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2F5]">
                {products.map((prod) => {
                  const isLow = prod.currentStock <= prod.minStockLevel;
                  return (
                    <tr key={prod.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-2.5 font-medium text-[#17191C]">
                        <div className="flex items-center gap-1.5">
                          <span>{prod.name}</span>
                          {isLow && (
                            <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-[#737780]">
                        {prod.categoryName || <span className="text-[#9CA3AF] italic">Uncategorized</span>}
                      </td>

                      <td className="px-3 py-2.5 font-mono text-[#737780]">
                        {prod.barcode ? (
                          <span className="text-[#17191C]">{prod.barcode}</span>
                        ) : prod.sku ? (
                          <span>{prod.sku}</span>
                        ) : (
                          <span className="text-[#D1D5DB]">—</span>
                        )}
                      </td>

                      <td className="px-3 py-2.5 text-[#737780] capitalize">
                        {prod.unit}
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono text-[#737780] tabular-nums">
                        {formatPaisa(prod.costPricePaisa)}
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-800 tabular-nums">
                        {formatPaisa(prod.salePricePaisa)}
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                        <span className={`font-semibold ${isLow ? 'text-amber-700' : 'text-[#17191C]'}`}>
                          {prod.currentStock}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] ml-1">/ min {prod.minStockLevel}</span>
                      </td>

                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          prod.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {prod.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            title="Edit Product"
                            className="rounded p-1 text-[#737780] hover:bg-[#F3F4F6] hover:text-[#17191C] transition-colors"
                          >
                            <EditIcon className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            title="Delete Product"
                            className="rounded p-1 text-[#737780] hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <TrashIcon className="size-3.5" />
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
