import { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, FolderIcon } from '../../components/icons.jsx';

export default function CategoryManagerModal({ isOpen, onClose, categories, onSave, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({ name: name.trim(), description: description.trim() || null }, editingId);
      handleCancelEdit();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"? Products in this category will become uncategorized.`)) {
      return;
    }
    try {
      await onDelete(id);
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
              <FolderIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Manage Categories</h2>
              <p className="text-xs text-slate-400">Organize grocery departments and sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300">
              {error}
            </div>
          )}

          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Frozen Foods"
                  maxLength={80}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ice cream, meat, nuggets"
                  maxLength={150}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-medium text-white shadow hover:bg-brand-400 disabled:opacity-50 transition-colors"
              >
                <PlusIcon className="size-3.5" />
                {saving ? 'Saving…' : editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Existing Categories ({categories.length})</p>
            <div className="divide-y divide-slate-800/60 rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3.5 hover:bg-slate-800/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{cat.name}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                        {cat.productCount ?? 0} products
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      title="Edit Category"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                    >
                      <EditIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      title="Delete Category"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/80 px-6 py-3.5 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
