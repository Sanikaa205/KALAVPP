"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Search, ShoppingBag, Clock, Truck, CheckCircle } from "lucide-react";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    if (res.ok) fetchOrders();
    else alert("Failed to update order status");
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const processing = orders.filter((o) => ["CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  const statCards = [
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-amber-50 text-amber-700" },
    { label: "Processing", value: processing, icon: Truck, color: "bg-purple-50 text-purple-700" },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Orders</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-stone-900">{s.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-stone-200">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left p-3 font-medium text-stone-500">Order</th>
                <th className="text-left p-3 font-medium text-stone-500">Customer</th>
                <th className="text-left p-3 font-medium text-stone-500">Date</th>
                <th className="text-left p-3 font-medium text-stone-500">Total</th>
                <th className="text-left p-3 font-medium text-stone-500">Status</th>
                <th className="text-left p-3 font-medium text-stone-500">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="p-3 font-medium text-stone-900">{order.orderNumber}</td>
                  <td className="p-3 text-stone-600">{order.user?.name || "—"}</td>
                  <td className="p-3 text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-medium text-stone-900">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" :
                      order.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                      order.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>{order.status}</span>
                  </td>
                  <td className="p-3">
                    {["DELIVERED", "CANCELLED"].includes(order.status) ? (
                      <span className="text-xs text-stone-400">Final</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {STATUS_OPTIONS.filter((s) => s !== "CANCELLED").map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-stone-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
