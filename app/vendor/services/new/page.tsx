"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Plus, X } from "lucide-react";

const serviceTypes = [
  "PORTRAIT_PAINTING", "DIGITAL_ILLUSTRATION", "WALL_MURAL", "CARICATURE",
  "LOGO_DESIGN", "CALLIGRAPHY", "RESTORATION", "PET_PORTRAIT",
  "CUSTOM_SCULPTURE", "TATTOO_DESIGN", "OTHER",
];

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "PORTRAIT_PAINTING",
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
        <button className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
          <Save className="h-4 w-4" /> Save Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-stone-400 mx-auto mb-3" />
              <p className="text-sm text-stone-600">Upload samples of your past work</p>
              <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 10MB. Max 6 images.</p>
              <button className="mt-3 px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">
                Choose Files
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
