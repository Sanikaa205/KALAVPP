"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical } from "lucide-react";

export default function VendorProductsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const products = mockProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Products</h1>
        <Link
          href="/vendor/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 border border-stone-300 rounded-md text-sm text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          <option value="all">All Types</option>
          <option value="PHYSICAL">Physical</option>
          <option value="DIGITAL">Digital</option>
          <option value="MERCHANDISE">Merchandise</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-8 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-3">Product</div>
          <div>Type</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-stone-100">
          {products.map((product) => (
            <div
              key={product.id}
              className="px-5 py-4 md:grid md:grid-cols-8 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0] || "/images/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{product.title}</p>
                  <p className="text-xs text-stone-500">{product.category?.name}</p>
                </div>
              </div>
              <div>
                <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                  {product.type}
                </span>
              </div>
              <div className="text-sm font-medium text-stone-900">
                {formatPrice(product.price)}
              </div>
              <div className="text-sm text-stone-600">
                {product.type === "DIGITAL" ? "Unlimited" : product.stockQuantity}
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {product.isActive ? "Active" : "Draft"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <button className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
