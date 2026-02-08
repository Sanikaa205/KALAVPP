"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Bell, Shield, Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function CustomerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", bio: "", avatar: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/addresses").then((r) => r.json()),
    ]).then(([profData, addrData]) => {
      if (profData.user) {
        setProfile({
          name: profData.user.name || "",
          email: profData.user.email || "",
          phone: profData.user.phone || "",
          bio: profData.user.bio || "",
          avatar: profData.user.avatar || "",
        });
      }
      setAddresses(addrData.addresses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true); setError(""); setSuccess("");
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, phone: profile.phone, bio: profile.bio, avatar: profile.avatar }),
    });
    if (res.ok) setSuccess("Profile updated successfully!");
    else { const d = await res.json(); setError(d.error || "Failed to update profile"); }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { setError("Passwords don't match"); return; }
    if (passwords.newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
    setSavingPassword(true); setError(""); setSuccess("");
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    });
    if (res.ok) { setSuccess("Password changed successfully!"); setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { const d = await res.json(); setError(d.error || "Failed to change password"); }
    setSavingPassword(false);
  };

  const fetchAddresses = () => fetch("/api/addresses").then((r) => r.json()).then((d) => setAddresses(d.addresses || []));

  const handleSaveAddress = async () => {
    const method = editingAddressId ? "PUT" : "POST";
    const body = editingAddressId ? { ...addressForm, id: editingAddressId } : addressForm;
    const res = await fetch("/api/addresses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ label: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
    fetchAddresses();
  };

  const startEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({ label: addr.label || "", street: addr.street || "", city: addr.city || "", state: addr.state || "", zipCode: addr.zipCode || "", country: addr.country || "India", isDefault: addr.isDefault || false });
    setShowAddressForm(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Settings</h1>
      {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4"><User className="h-4 w-4" /> Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input value={profile.email} disabled className="w-full px-4 py-2.5 rounded-md border border-stone-200 text-sm bg-stone-50 text-stone-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Enter phone number" className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Avatar URL</label>
              <input value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
            <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself" className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
          <button onClick={handleSaveProfile} disabled={saving} className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
          </button>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2"><MapPin className="h-4 w-4" /> Saved Addresses</h2>
            <button onClick={() => { setShowAddressForm(true); setEditingAddressId(null); setAddressForm({ label: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false }); }} className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add</button>
          </div>
          <div className="space-y-3">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="p-4 border border-stone-200 rounded-md flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-900">{addr.label || "Address"}</span>
                    {addr.isDefault && <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">Default</span>}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEditAddress(addr)} className="text-xs text-amber-700 hover:text-amber-800 font-medium">Edit</button>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">Delete</button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && !showAddressForm && <p className="text-sm text-stone-400">No addresses saved</p>}
          </div>
          {showAddressForm && (
            <div className="mt-4 p-4 border border-stone-200 rounded-md bg-stone-50 space-y-3">
              <h3 className="text-sm font-semibold text-stone-900">{editingAddressId ? "Edit" : "New"} Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="Label (Home, Work...)" className="px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="Street address" className="px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" className="px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" className="px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <input value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} placeholder="PIN Code" className="px-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="rounded" /> Default address
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveAddress} className="px-4 py-2 bg-stone-900 text-white rounded text-sm font-medium hover:bg-stone-800">Save</button>
                <button onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="px-4 py-2 border border-stone-200 rounded text-sm text-stone-600 hover:bg-stone-50">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4"><Shield className="h-4 w-4" /> Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
              <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={savingPassword} className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50">
            {savingPassword ? "Changing..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
