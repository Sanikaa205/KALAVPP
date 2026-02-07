"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Eye, Search, Brush } from "lucide-react";

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/commissions")
      .then(r => r.json())
      .then(data => setCommissions(data.commissions || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Commission Oversight</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Commissions", value: "89" },
          { label: "Active", value: "34" },
          { label: "Completed", value: "45" },
          { label: "Disputed", value: "3" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            placeholder="Search commissions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <select className="px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="DISPUTED">Disputed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-7 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Commission</div>
          <div>Client</div>
          <div>Artist</div>
          <div>Budget</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {commissions.map((com: any) => (
            <div
              key={com.id}
              className="px-5 py-4 md:grid md:grid-cols-7 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md">
                  <Brush className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{com.service?.title || "Custom Commission"}</p>
                  <p className="text-xs text-stone-500 line-clamp-1">{com.description}</p>
                </div>
              </div>
              <div className="text-sm text-stone-600">{com.customer?.name || "Client"}</div>
              <div className="text-sm text-stone-600">{com.vendor?.storeName || "Artist"}</div>
              <div className="text-sm font-bold text-stone-900">{formatPrice(com.budget)}</div>
              <div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    com.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700"
                      : com.status === "IN_PROGRESS"
                      ? "bg-blue-50 text-blue-700"
                      : com.status === "ACCEPTED"
                      ? "bg-purple-50 text-purple-700"
                      : com.status === "DISPUTED"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {com.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <button className="p-1.5 text-stone-400 hover:text-stone-900">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
