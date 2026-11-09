import { useState, useEffect } from 'react';
import { TruckIcon, AlertTriangleIcon } from '../../components/icons.jsx';
import { paisaToRupees } from '../../lib/format.js';

export default function SupplierModal({ isOpen, onClose, supplier, onSave }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalanceRupees, setOpeningBalanceRupees] = useState('0.00');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || '');
      setPhone(supplier.phone || '');
      setEmail(supplier.email || '');
      setAddress(supplier.address || '');
      setOpeningBalanceRupees(paisaToRupees(supplier.openingBalancePaisa ?? 0));
      setNotes(supplier.notes || '');
      setIsActive(supplier.isActive !== undefined ? Boolean(supplier.isActive) : true);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setOpeningBalanceRupees('0.00');
      setNotes('');
      setIsActive(true);
    }
    setError(null);
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(supplier?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Supplier name is required.');
      return;
    }

    const openingPaisa = Math.round((Number.parseFloat(openingBalanceRupees) || 0) * 100);
    if (openingPaisa < 0) {
      setError('Opening balance cannot be negative.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        openingBalancePaisa: openingPaisa,
        notes: notes.trim() || null,
        isActive,
      }, supplier?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save supplier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8EAED] transition-all transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TruckIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17191C]">
                {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <p className="text-xs text-[#737780]">
                {isEditing ? 'Update supplier contact and payable details' : 'Register a new vendor/distributor for purchases'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertTriangleIcon className="size-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Supplier / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Cash & Carry, Nestlé Pakistan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. 0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. orders@distributor.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Physical / Warehouse Address
            </label>
            <input
              type="text"
              placeholder="e.g. Warehouse 14, Circular Road, Lahore"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all"
            />
          </div>

          <div className="rounded-xl bg-[#F7F8FA] p-3.5 border border-[#E8EAED] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-[#17191C]">
                  Opening Payable Balance (PKR)
                </label>
                <p className="text-[11px] text-[#737780]">
                  Amount already owed to this vendor before starting on this POS.
                </p>
              </div>
              <div className="w-36">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isEditing}
                  value={openingBalanceRupees}
                  onChange={(e) => setOpeningBalanceRupees(e.target.value)}
                  className={`w-full text-right rounded-lg border border-[#E8EAED] bg-white px-3 py-1.5 text-sm font-mono font-medium text-[#17191C] focus:border-emerald-600 focus:outline-hidden ${
                    isEditing ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
            {isEditing && (
              <p className="text-[10px] text-[#737780] italic">
                * Note: Opening balance cannot be edited once created. Record adjustments via Payments or Purchases.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Notes / Terms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Payment terms: 15 days credit, deliveries on Tuesdays"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E8EAED] bg-white px-3.5 py-2 text-sm text-[#17191C] placeholder-[#737780]/50 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-[#E8EAED] text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-[#17191C]">
                Active Supplier
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#E8EAED] bg-white px-4 py-2 text-xs font-semibold text-[#737780] hover:bg-[#F7F8FA] hover:text-[#17191C] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs"
              >
                {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Supplier'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
