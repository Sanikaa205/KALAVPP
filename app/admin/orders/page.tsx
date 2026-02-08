"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Search, Package, ChevronDown } from "lucide-react";

const STATUSES = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    setUpdatingId(null);
    fetchOrders();
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === "ALL" || o.status === filter;
    const matchesSearch = !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countByStatus = (s: string) => s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Order Management</h1>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`p-3 rounded-lg border text-center transition ${
              filter === s ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <p className={`text-xl font-bold ${filter === s ? "text-white" : "text-stone-900"}`}>{countByStatus(s)}</p>
            <p className={`text-xs capitalize ${filter === s ? "text-stone-300" : "text-stone-500"}`}>{s.toLowerCase()}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-7 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Order</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Status</div>
          <div>Total</div>
          <div className="text-right">Update Status</div>
        </div>
        <div className="divide-y divide-stone-100">
          {filtered.map((order: any) => (
            <div key={order.id} className="px-5 py-4 md:grid md:grid-cols-7 md:gap-4 md:items-center space-y-2 md:space-y-0">
              <div className="col-span-2 flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md">
                  <Package className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{order.items?.length || 0} items</p>
                </div>
              </div>
              <div className="text-sm text-stone-600">{order.user?.name || "Customer"}</div>
              <div className="text-sm text-stone-600">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700"
                    : order.status === "SHIPPED" ? "bg-blue-50 text-blue-700"
                    : order.status === "PROCESSING" ? "bg-amber-50 text-amber-700"
                    : order.status === "CANCELLED" ? "bg-red-50 text-red-700"
                    : "bg-stone-100 text-stone-600"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm font-bold text-stone-900">{formatPrice(order.total)}</div>
              <div className="flex items-center justify-end">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updatingId === order.id || order.status === "CANCELLED" || order.status === "DELIVERED"}
                  className="text-xs border border-stone-200 rounded px-2 py-1.5 bg-white disabled:opacity-50"
                >
                  {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-400">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
