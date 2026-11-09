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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
      <div className="relative w-full max-w-lg rounded-xl border border-[#E8EAED] bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8EAED] bg-[#FAFAFB] px-5 py-3">
          <div className="flex items-center gap-2">
            <FolderIcon className="size-4 text-emerald-800" />
            <h2 className="text-sm font-semibold text-[#17191C]">Manage Grocery Departments</h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#737780] hover:text-[#17191C]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-lg border border-[#E8EAED] bg-[#FAFAFB] p-3 space-y-2.5">
            <p className="text-xs font-semibold text-[#17191C]">
              {editingId ? 'Edit Department' : 'Create New Department'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#737780] mb-1">Department Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Frozen Foods"
                  maxLength={80}
                  required
                  className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#737780] mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short notes"
                  maxLength={150}
                  className="w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs text-[#17191C] placeholder-[#9CA3AF] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded px-2.5 py-1 text-xs text-[#737780] hover:text-[#17191C]"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded bg-emerald-800 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50"
              >
                <PlusIcon className="size-3" />
                {saving ? 'Saving…' : editingId ? 'Update' : 'Add Department'}
              </button>
            </div>
          </form>

          {/* List */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
              Departments ({categories.length})
            </p>
            <div className="divide-y divide-[#F0F2F5] rounded-lg border border-[#E8EAED] bg-white overflow-hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2.5 hover:bg-[#F9FAFB] transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#17191C]">{cat.name}</span>
                      <span className="rounded bg-[#F3F4F6] px-1.5 py-0.2 text-[10px] font-mono text-[#737780]">
                        {cat.productCount ?? 0} items
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-[#737780] mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      title="Edit Category"
                      className="rounded p-1 text-[#737780] hover:bg-[#F3F4F6] hover:text-[#17191C]"
                    >
                      <EditIcon className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      title="Delete Category"
                      className="rounded p-1 text-[#737780] hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8EAED] bg-[#FAFAFB] px-5 py-2.5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-[#17191C] hover:bg-[#F3F4F6]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
