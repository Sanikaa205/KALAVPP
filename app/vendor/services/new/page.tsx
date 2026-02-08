"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Plus, X } from "lucide-react";

const serviceTypes = [
  "PORTRAIT", "SCULPTURE", "MURAL", "CALLIGRAPHY",
  "ILLUSTRATION", "BRANDING", "BOOK_COVER", "EXHIBITION",
  "CONSULTANCY", "WORKSHOP", "CUSTOM",
];

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "PORTRAIT",
    basePrice: "",
    deliveryDays: "",
    maxRevisions: "3",
    includes: [""] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateInclude = (idx: number, value: string) => {
    const updated = [...formData.includes];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, includes: updated }));
  };

  const addInclude = () => {
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, ""] }));
  };

  const removeInclude = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.serviceType,
          basePrice: parseFloat(formData.basePrice),
          deliveryDays: formData.deliveryDays ? parseInt(formData.deliveryDays) : undefined,
          maxRevisions: parseInt(formData.maxRevisions) || 3,
          includes: formData.includes.filter((i) => i.trim()),
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create service");
        return;
      }

      router.push("/vendor/services");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) setImages([...images, url]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/vendor/services"
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Create New Service</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Service"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {error && (
          <div className="lg:col-span-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Service Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Service Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Custom Portrait Painting"
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your service in detail. What do clients get? What is the process?"
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Portfolio images */}
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Portfolio Images</h2>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Portfolio ${i + 1}`} className="h-20 w-20 object-cover rounded-md border border-stone-200" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-stone-400 mx-auto mb-3" />
              <p className="text-sm text-stone-600">Upload samples of your past work</p>
              <p className="text-xs text-stone-400 mt-1">Add image URLs. Max 6 images.</p>
              <button
                type="button"
                onClick={handleImageUrl}
                className="mt-3 px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Add Image URL
              </button>
            </div>
          </div>

          {/* What's included */}
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">What is Included</h2>
            <div className="space-y-2">
              {formData.includes.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateInclude(idx, e.target.value)}
                    placeholder={`Deliverable ${idx + 1}`}
                    className="flex-1 px-4 py-2 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                  {formData.includes.length > 1 && (
                    <button onClick={() => removeInclude(idx)} className="p-2 text-stone-400 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addInclude}
                className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Pricing & Delivery</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Base Price (Rs.)</label>
                <input
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Delivery Days</label>
                <input
                  name="deliveryDays"
                  type="number"
                  value={formData.deliveryDays}
                  onChange={handleChange}
                  placeholder="7"
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Max Revisions</label>
                <input
                  name="maxRevisions"
                  type="number"
                  value={formData.maxRevisions}
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Status</h2>
            <select className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
