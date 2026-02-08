"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, X } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", street: "", city: "", state: "", postalCode: "", country: "India", phone: "", isDefault: false,
  });

  const fetchAddresses = () => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => { setAddresses(d.addresses || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const resetForm = () => {
    setForm({ fullName: "", street: "", city: "", state: "", postalCode: "", country: "India", phone: "", isDefault: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: any) => {
    setForm({
      fullName: addr.fullName || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
      phone: addr.phone || "",
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;

    await fetch("/api/addresses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    resetForm();
    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Addresses</h1>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900">{editingId ? "Edit Address" : "New Address"}</h2>
            <button onClick={resetForm} className="text-stone-400 hover:text-stone-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Street Address</label>
              <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Postal Code</label>
              <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Country</label>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-stone-300" />
                <span className="text-sm text-stone-700">Set as default address</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800">
              {editingId ? "Update" : "Save"} Address
            </button>
            <button onClick={resetForm} className="px-6 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-md hover:bg-stone-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-lg border p-4 relative ${addr.isDefault ? "border-amber-300 ring-1 ring-amber-200" : "border-stone-200"}`}>
              {addr.isDefault && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3" /> Default
                </span>
              )}
              <p className="text-sm font-semibold text-stone-900">{addr.fullName}</p>
              <p className="text-sm text-stone-600 mt-1">{addr.street}</p>
              <p className="text-sm text-stone-600">{addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="text-sm text-stone-600">{addr.country}</p>
              {addr.phone && <p className="text-sm text-stone-500 mt-1">Phone: {addr.phone}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(addr)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-amber-700">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <MapPin className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">No addresses saved</p>
          <p className="mt-1 text-sm text-stone-500">Add an address for faster checkout.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" /> Add Address
          </button>
        </div>
      ) : null}
    </div>
  );
}
