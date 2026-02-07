"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Search, Eye, Ban, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then(r => r.json())
      .then(data => setProducts(data.products || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Product Management</h1>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <select className="px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none">
          <option value="all">All Types</option>
          <option value="PHYSICAL">Physical</option>
          <option value="DIGITAL">Digital</option>
          <option value="MERCHANDISE">Merchandise</option>
        </select>
        <select className="px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-8 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Product</div>
          <div>Vendor</div>
          <div>Type</div>
          <div>Price</div>
          <div>Status</div>
          <div>Rating</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="px-5 py-4 md:grid md:grid-cols-8 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-stone-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0] || "/images/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-stone-900 truncate">{product.title}</p>
              </div>
              <div className="text-sm text-stone-600">{product.vendor?.storeName || "N/A"}</div>
              <div>
                <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">{product.type}</span>
              </div>
              <div className="text-sm font-medium text-stone-900">{formatPrice(product.price)}</div>
              <div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {product.isActive ? "Active" : "Draft"}
                </span>
              </div>
              <div className="text-sm text-stone-600">{product.rating}/5</div>
              <div className="flex items-center justify-end gap-1">
                <button className="p-1.5 text-stone-400 hover:text-stone-900"><Eye className="h-4 w-4" /></button>
                <button className="p-1.5 text-stone-400 hover:text-amber-600"><Ban className="h-4 w-4" /></button>
                <button className="p-1.5 text-stone-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
