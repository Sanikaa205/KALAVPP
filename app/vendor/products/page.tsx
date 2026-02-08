"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchProducts = () => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
    else alert("Failed to delete product");
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "ALL" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Products</h1>
        <Link href="/vendor/products/new" className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-stone-200">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="ALL">All Types</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
            <option value="MERCHANDISE">Merchandise</option>
          </select>
        </div>

        <p className="px-4 pt-3 text-xs text-stone-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

        <div className="divide-y divide-stone-100">
          {filtered.map((product: any) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{product.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {product.isActive ? "Active" : "Draft"}
                  </span>
                  {product.stock !== undefined && <span className="text-xs text-stone-400">Stock: {product.stock}</span>}
                </div>
              </div>
              <div className="text-right mr-4">
                <p className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                  <Eye className="h-3 w-3" /> {product.viewCount || 0}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/shop/${product.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(product.id, product.title)} className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-stone-400">
              <p>No products found</p>
              <Link href="/vendor/products/new" className="text-amber-700 hover:text-amber-800 text-sm mt-2 inline-block">Create your first product</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
