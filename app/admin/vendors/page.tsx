"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Eye, CheckCircle2, XCircle, Search, Star } from "lucide-react";

interface Vendor {
  id: string;
  storeName: string;
  totalSales: number;
  rating: number;
  isVerified: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string };
  _count: { products: number; services: number };
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVendors = () => {
    fetch("/api/admin/vendors")
      .then((r) => r.json())
      .then((data) => { setVendors(data.vendors || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleApprove = async (vendorId: string) => {
    await fetch("/api/admin/vendors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, action: "verify" }),
    });
    fetchVendors();
  };

  const handleReject = async (userId: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "suspend" }),
    });
    fetchVendors();
  };

  const filtered = vendors.filter(
    (v) =>
      v.storeName.toLowerCase().includes(search.toLowerCase()) ||
      v.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = vendors.filter((v) => v.isVerified).length;
  const pendingCount = vendors.filter((v) => !v.isVerified).length;

  const stats = [
    { label: "Total Vendors", value: vendors.length.toString() },
    { label: "Verified", value: activeCount.toString() },
    { label: "Pending Approval", value: pendingCount.toString() },
    { label: "Total Revenue", value: formatPrice(vendors.reduce((s, v) => s + v.totalSales, 0)) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Vendor Management</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors..."
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-8 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Vendor</div>
          <div>Products</div>
          <div>Revenue</div>
          <div>Rating</div>
          <div>Status</div>
          <div>Joined</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {filtered.map((vendor) => (
            <div key={vendor.id} className="px-5 py-4 md:grid md:grid-cols-8 md:gap-4 md:items-center space-y-2 md:space-y-0">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
                  {vendor.storeName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{vendor.storeName}</p>
                  <p className="text-xs text-stone-500">{vendor.user.email}</p>
                </div>
              </div>
              <div className="text-sm text-stone-600">{vendor._count.products}</div>
              <div className="text-sm font-medium text-stone-900">
                {vendor.totalSales > 0 ? formatPrice(vendor.totalSales) : "-"}
              </div>
              <div className="flex items-center gap-1 text-sm text-stone-600">
                {vendor.rating > 0 ? (
                  <><Star className="h-3 w-3 text-amber-500 fill-amber-500" />{vendor.rating.toFixed(1)}</>
                ) : "-"}
              </div>
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  vendor.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {vendor.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="text-sm text-stone-600">
                {new Date(vendor.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="p-1.5 text-stone-400 hover:text-stone-900" title="View"><Eye className="h-4 w-4" /></button>
                {!vendor.isVerified && (
                  <>
                    <button onClick={() => handleApprove(vendor.id)} className="p-1.5 text-stone-400 hover:text-emerald-600" title="Approve">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleReject(vendor.user.id)} className="p-1.5 text-stone-400 hover:text-red-600" title="Reject">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-400">No vendors found</div>
          )}
        </div>
      </div>
    </div>
  );
}
