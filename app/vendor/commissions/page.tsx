"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Palette, Clock, CheckCircle, AlertTriangle, Search, MessageSquare } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  REVISION_REQUESTED: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function VendorCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/commissions")
      .then((r) => r.json())
      .then((d) => { setCommissions(d.commissions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch("/api/commissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const res = await fetch("/api/commissions");
    const d = await res.json();
    setCommissions(d.commissions || []);
  };

  const filtered = commissions.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: commissions.length,
    active: commissions.filter((c) => ["ACCEPTED", "IN_PROGRESS"].includes(c.status)).length,
    pending: commissions.filter((c) => c.status === "REQUESTED").length,
    revenue: commissions.filter((c) => ["COMPLETED", "DELIVERED"].includes(c.status)).reduce((s, c) => s + c.budget, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Commission Requests</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-xs text-stone-500">Total Requests</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-xs text-stone-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-xs text-stone-500">Active</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-xs text-stone-500">Revenue</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commissions..."
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="all">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVISION_REQUESTED">Revision</option>
          <option value="COMPLETED">Completed</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Commission Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-stone-900">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || "bg-stone-100 text-stone-600"}`}>
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Client: <span className="font-medium text-stone-700">{c.customer?.name || "Unknown"}</span>
                    {c.service && <> &middot; Service: {c.service.title}</>}
                  </p>
                  <p className="text-sm text-stone-600 mt-2 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
                    <span className="font-semibold text-stone-900">{formatPrice(c.budget)}</span>
                    {c.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Due: {new Date(c.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {c.status === "REQUESTED" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(c.id, "ACCEPTED")}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(c.id, "CANCELLED")}
                        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-md hover:bg-red-50"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {c.status === "ACCEPTED" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "IN_PROGRESS")}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700"
                    >
                      Start Work
                    </button>
                  )}
                  {c.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "COMPLETED")}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700"
                    >
                      Mark Complete
                    </button>
                  )}
                  {c.status === "REVISION_REQUESTED" && (
                    <button
                      onClick={() => handleStatusChange(c.id, "IN_PROGRESS")}
                      className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-md hover:bg-amber-700"
                    >
                      Resume Work
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Palette className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">No commissions found</p>
          <p className="mt-1 text-sm text-stone-500">Commission requests from customers will appear here.</p>
        </div>
      )}
    </div>
  );
}
