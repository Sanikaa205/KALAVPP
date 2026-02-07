"use client";

import { Eye, CheckCircle2, XCircle, Search, Star } from "lucide-react";

const vendors = [
  { name: "Priya's Canvas", email: "priya@kalavpp.com", products: 24, revenue: 156800, rating: 4.9, status: "Active", joined: "2023-03-15" },
  { name: "Arjun Digital Studio", email: "arjun@kalavpp.com", products: 18, revenue: 89500, rating: 4.7, status: "Active", joined: "2023-06-20" },
  { name: "Kavya Handicrafts", email: "kavya@kalavpp.com", products: 32, revenue: 234000, rating: 4.8, status: "Active", joined: "2023-01-10" },
  { name: "Ravi Sculptures", email: "ravi@example.com", products: 0, revenue: 0, rating: 0, status: "Pending", joined: "2024-01-20" },
  { name: "Ananya Arts", email: "ananya@example.com", products: 0, revenue: 0, rating: 0, status: "Pending", joined: "2024-01-22" },
];

export default function AdminVendorsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Vendor Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Vendors", value: "148" },
          { label: "Active", value: "135" },
          { label: "Pending Approval", value: "8" },
          { label: "Suspended", value: "5" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
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
          {vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="px-5 py-4 md:grid md:grid-cols-8 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{vendor.name}</p>
                  <p className="text-xs text-stone-500">{vendor.email}</p>
                </div>
              </div>
              <div className="text-sm text-stone-600">{vendor.products}</div>
              <div className="text-sm font-medium text-stone-900">
                {vendor.revenue > 0 ? `Rs. ${(vendor.revenue / 1000).toFixed(0)}K` : "-"}
              </div>
              <div className="flex items-center gap-1 text-sm text-stone-600">
                {vendor.rating > 0 ? (
                  <>
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    {vendor.rating}
                  </>
                ) : (
                  "-"
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    vendor.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : vendor.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
              <div className="text-sm text-stone-600">
                {new Date(vendor.joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="p-1.5 text-stone-400 hover:text-stone-900" title="View">
                  <Eye className="h-4 w-4" />
                </button>
                {vendor.status === "Pending" && (
                  <>
                    <button className="p-1.5 text-stone-400 hover:text-emerald-600" title="Approve">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-stone-400 hover:text-red-600" title="Reject">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
