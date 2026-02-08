"use client";

import { useState, useEffect } from "react";
import { Save, Store, Loader2 } from "lucide-react";

export default function VendorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    instagram: "",
    twitter: "",
    facebook: "",
  });

  useEffect(() => {
    fetch("/api/vendor/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.vendor) {
          setStoreName(d.vendor.storeName || "");
          setDescription(d.vendor.description || "");
          setLogo(d.vendor.logo || "");
          setBanner(d.vendor.banner || "");
          setSpecializations(d.vendor.specializations || []);
          const links = d.vendor.socialLinks || {};
          setSocialLinks({
            website: links.website || "",
            instagram: links.instagram || "",
            twitter: links.twitter || "",
            facebook: links.facebook || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/vendor/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          description,
          logo,
          banner,
          specializations,
          socialLinks,
        }),
      });
      if (res.ok) setSuccess("Settings saved successfully!");
      else {
        const d = await res.json();
        setError(d.error || "Failed to save settings");
      }
    } catch {
      setError("Failed to save settings");
    }
    setSaving(false);
  };

  const addSpecialization = () => {
    const val = specInput.trim();
    if (val && !specializations.includes(val)) {
      setSpecializations([...specializations, val]);
      setSpecInput("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter((s) => s !== spec));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Store Settings</h1>
          <p className="mt-1 text-sm text-stone-500">Manage your store profile and details.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" /> Store Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Logo URL</label>
                <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Banner URL</label>
                <input value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://..." className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Specializations</h2>
          <div className="flex gap-2 mb-3">
            <input value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())} placeholder="Add specialization..." className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <button onClick={addSpecialization} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <span key={spec} className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm">
                {spec}
                <button onClick={() => removeSpecialization(spec)} className="ml-1 text-amber-600 hover:text-amber-800 font-bold">&times;</button>
              </span>
            ))}
            {specializations.length === 0 && <p className="text-sm text-stone-400">No specializations added</p>}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["website", "instagram", "twitter", "facebook"] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">{key}</label>
                <input
                  value={socialLinks[key]}
                  onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                  placeholder={`https://${key}.com/...`}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
