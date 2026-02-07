"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    type: "PHYSICAL",
    category: "",
    medium: "",
    style: "",
    dimensions: "",
    yearCreated: "",
    stockQuantity: "1",
    isOriginal: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setProduct((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/vendor/products");
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/vendor/products" className="p-2 text-stone-400 hover:text-stone-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
              <input
                name="title"
                value={product.title}
                onChange={handleChange}
                required
                placeholder="Enter artwork title"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your artwork..."
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                <select
                  name="type"
                  value={product.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="PHYSICAL">Physical Artwork</option>
                  <option value="DIGITAL">Digital Download</option>
                  <option value="MERCHANDISE">Merchandise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">Select category</option>
                  <option value="paintings">Paintings</option>
                  <option value="digital-art">Digital Art</option>
                  <option value="sculptures">Sculptures</option>
                  <option value="photography">Photography</option>
                  <option value="textiles">Textiles</option>
                  <option value="pottery">Pottery & Ceramics</option>
                  <option value="prints">Prints & Posters</option>
                  <option value="handicrafts">Handicrafts</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price (Rs.)</label>
              <input
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Compare at Price</label>
              <input
                name="compareAtPrice"
                type="number"
                value={product.compareAtPrice}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            {product.type !== "DIGITAL" && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Stock Quantity</label>
                <input
                  name="stockQuantity"
                  type="number"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Art Details */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Art Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Medium</label>
              <input
                name="medium"
                value={product.medium}
                onChange={handleChange}
                placeholder="e.g., Oil on Canvas"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Style</label>
              <input
                name="style"
                value={product.style}
                onChange={handleChange}
                placeholder="e.g., Contemporary"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Dimensions</label>
              <input
                name="dimensions"
                value={product.dimensions}
                onChange={handleChange}
                placeholder="e.g., 24 x 36 inches"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Year Created</label>
              <input
                name="yearCreated"
                value={product.yearCreated}
                onChange={handleChange}
                placeholder="e.g., 2024"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              name="isOriginal"
              type="checkbox"
              checked={product.isOriginal}
              onChange={handleChange}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-400"
            />
            <label className="text-sm text-stone-700">This is an original artwork</label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Images</h2>
          <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm text-stone-600">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-xs text-stone-400 mt-1">
              PNG, JPG up to 10MB. First image will be the cover.
            </p>
            <button
              type="button"
              className="mt-3 px-4 py-2 border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Publishing..." : "Publish Product"}
          </button>
          <button
            type="button"
            className="px-8 py-3 border border-stone-300 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-50"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
