import { useState, useEffect, useCallback } from 'react';
import { api, isBridgeAvailable } from '../../lib/api.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  const loadCategories = useCallback(async () => {
    if (!isBridgeAvailable()) return;
    try {
      const list = await api.categories.list();
      setCategories(list);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    if (!isBridgeAvailable()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [prodRes, lowRes] = await Promise.all([
        api.products.list({
          search,
          categoryId: selectedCategory || null,
          limit: 150,
          offset: 0,
        }),
        api.products.getLowStock(),
      ]);

      let items = prodRes.items;
      if (showOnlyLowStock) {
        items = items.filter((p) => p.currentStock <= p.minStockLevel);
      }

      setProducts(items);
      setTotal(prodRes.total);
      setLowStock(lowRes);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, showOnlyLowStock]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const saveProduct = async (productData, id = null) => {
    if (id) {
      await api.products.update(id, productData);
    } else {
      await api.products.create(productData);
    }
    await Promise.all([loadProducts(), loadCategories()]);
  };

  const removeProduct = async (id) => {
    await api.products.delete(id);
    await Promise.all([loadProducts(), loadCategories()]);
  };

  const saveCategory = async (categoryData, id = null) => {
    if (id) {
      await api.categories.update(id, categoryData);
    } else {
      await api.categories.create(categoryData);
    }
    await Promise.all([loadCategories(), loadProducts()]);
  };

  const removeCategory = async (id) => {
    await api.categories.delete(id);
    await Promise.all([loadCategories(), loadProducts()]);
  };

  return {
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
    refresh: loadProducts,
    saveProduct,
    removeProduct,
    saveCategory,
    removeCategory,
  };
}
