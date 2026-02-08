"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    compareAtPrice: "",
    type: "PHYSICAL",
    categoryId: "",
    medium: "",
    style: "",
    artDimensions: "",
    yearCreated: "",
    stockQuantity: "1",
    isOriginal: true,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setProduct((prev) => ({ ...prev, [target.name]: value }));
  };

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = fileArray.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name}: Invalid type. Only JPEG, PNG, WebP, GIF, AVIF allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`${file.name}: Too large. Maximum 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
      }

      if (data.errors) {
        setError(data.errors.join("; "));
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, status: string = "ACTIVE") => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          shortDescription: product.shortDescription || undefined,
          type: product.type,
          categoryId: product.categoryId || undefined,
          price: parseFloat(product.price),
          compareAtPrice: product.compareAtPrice
            ? parseFloat(product.compareAtPrice)
            : undefined,
          stockQuantity:
            product.type !== "DIGITAL" ? parseInt(product.stockQuantity) : undefined,
          medium: product.medium || undefined,
          style: product.style || undefined,
          artDimensions: product.artDimensions || undefined,
          yearCreated: product.yearCreated
            ? parseInt(product.yearCreated)
            : undefined,
          isOriginal: product.isOriginal,
          images,
          tags,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product");
        return;
      }

      router.push("/vendor/products");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
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
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

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
                  name="categoryId"
                  value={product.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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
                name="artDimensions"
                value={product.artDimensions}
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

        {/* Images - Drag & Drop Upload */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Images</h2>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-stone-200"
                  />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-stone-900 text-white text-[10px] font-medium rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-amber-500 bg-amber-50"
                : "border-stone-300 hover:border-stone-400 hover:bg-stone-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-amber-600 animate-spin mb-2" />
                <p className="text-sm text-stone-600 font-medium">Uploading images...</p>
              </div>
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-stone-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-stone-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  JPEG, PNG, WebP, GIF or AVIF (max 5MB each)
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  First image will be the cover photo
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag"
              className="flex-1 px-4 py-2 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-stone-100 rounded-md text-sm text-stone-700 hover:bg-stone-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Publishing..." : "Publish Product"}
          </button>
          <button
            type="button"
            disabled={loading || uploading}
            onClick={(e) => handleSubmit(e, "DRAFT")}
            className="px-8 py-3 border border-stone-300 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
