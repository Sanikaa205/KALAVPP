"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { ProductCard } from "@/components/products/product-card";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, LayoutList, X, Search } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

const typeFilters = [
  { value: "all", label: "All Types" },
  { value: "PHYSICAL", label: "Physical" },
  { value: "DIGITAL", label: "Digital" },
  { value: "MERCHANDISE", label: "Merchandise" },
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-1000", label: "Under Rs. 1,000" },
  { value: "1000-5000", label: "Rs. 1,000 - 5,000" },
  { value: "5000-25000", label: "Rs. 5,000 - 25,000" },
  { value: "25000-100000", label: "Rs. 25,000 - 1,00,000" },
  { value: "100000+", label: "Above Rs. 1,00,000" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (<div key={i} className="h-72 bg-stone-200 rounded-lg" />))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([prodData, catData]) => {
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
          p.vendor?.storeName?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      const cat = categories.find((c: any) => c.slug === selectedCategory);
      if (cat) {
        filtered = filtered.filter((p: any) => p.categoryId === cat.id);
      }
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((p: any) => p.type === typeFilter);
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        filtered = filtered.filter((p: any) => p.price >= min && p.price <= max);
      } else {
        filtered = filtered.filter((p: any) => p.price >= min);
      }
    }

    // Sort
    switch (sort) {
      case "price-asc":
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a: any, b: any) => b.viewCount - a.viewCount);
        break;
      default:
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  }, [products, categories, selectedCategory, typeFilter, priceRange, sort, searchQuery]);

  const activeFilterCount = [
    selectedCategory !== "all",
    typeFilter !== "all",
    priceRange !== "all",
    !!searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          {selectedCategory !== "all"
            ? categories.find((c: any) => c.slug === selectedCategory)?.name || "Shop"
            : "Shop All Artworks"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {filteredProducts.length} artwork{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-stone-100 text-stone-900 font-medium"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-stone-100 text-stone-900 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {cat.name}
                    <span className="text-stone-400 ml-1 text-xs">
                      ({cat._count?.products || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Type</h3>
              <div className="space-y-1">
                {typeFilters.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTypeFilter(tf.value)}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      typeFilter === tf.value
                        ? "bg-stone-100 text-stone-900 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Price Range</h3>
              <div className="space-y-1">
                {priceRanges.map((pr) => (
                  <button
                    key={pr.value}
                    onClick={() => setPriceRange(pr.value)}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      priceRange === pr.value
                        ? "bg-stone-100 text-stone-900 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setTypeFilter("all");
                  setPriceRange("all");
                  setSearchQuery("");
                }}
                className="text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Product grid area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          {searchQuery && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-stone-500">Searching for:</span>
              <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm font-medium flex items-center gap-1">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery("")} className="ml-1 text-stone-400 hover:text-stone-700"><X className="h-3 w-3" /></button>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-700 hover:bg-stone-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-stone-900 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* View mode */}
              <div className="hidden sm:flex items-center border border-stone-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-stone-100 text-stone-900" : "text-stone-400"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-stone-100 text-stone-900" : "text-stone-400"}`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filters */}
          {filtersOpen && (
            <div className="lg:hidden mb-6 p-4 bg-white border border-stone-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-4 w-4 text-stone-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                  >
                    {typeFilters.map((tf) => (
                      <option key={tf.value} value={tf.value}>{tf.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">Price</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                  >
                    {priceRanges.map((pr) => (
                      <option key={pr.value} value={pr.value}>{pr.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={viewMode === "list" ? "horizontal" : "default"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-stone-700">
                No artworks found
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Try adjusting your filters to find what you are looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setTypeFilter("all");
                  setPriceRange("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
