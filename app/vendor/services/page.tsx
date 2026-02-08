"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Trash2, Eye, Star } from "lucide-react";

export default function VendorServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchServices = () => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => { setServices(d.services || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchServices();
    else alert("Failed to delete service");
  };

  const filtered = services.filter((s) =>
    !search || s.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Services</h1>
        <Link href="/vendor/services/new" className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
          <Plus className="h-4 w-4" /> Add Service
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 mb-4">
        <div className="p-4 border-b border-stone-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>
        <p className="px-4 pt-3 text-xs text-stone-500">{filtered.length} service{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((service: any) => (
          <div key={service.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="h-40 bg-stone-100 relative">
              {service.images?.[0] ? (
                <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">No image</div>
              )}
              <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                service.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-stone-900 truncate">{service.title}</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">{formatPrice(service.basePrice || service.price)}</span>
                  {service.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-600">
                      <Star className="h-3 w-3 fill-current" /> {service.rating}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/services/${service.slug}`} target="_blank" className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleDelete(service.id, service.title)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-lg border border-stone-200 p-8 text-center text-stone-400">
          <p>No services found</p>
          <Link href="/vendor/services/new" className="text-amber-700 hover:text-amber-800 text-sm mt-2 inline-block">Create your first service</Link>
        </div>
      )}
    </div>
  );
}
