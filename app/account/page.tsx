"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, Heart, Package, Download, ArrowRight, TrendingUp } from "lucide-react";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/wishlist").then((r) => r.json()),
      fetch("/api/downloads").then((r) => r.json()),
    ]).then(([ordData, wishData, dlData]) => {
      setOrders(ordData.orders || []);
      setWishlistCount((wishData.wishlistItems || wishData.items || []).length);
      setDownloadsCount((dlData.downloads || []).length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Wishlist Items", value: wishlistCount.toString(), icon: Heart, color: "bg-pink-50 text-pink-700" },
    { label: "Downloads", value: downloadsCount.toString(), icon: Download, color: "bg-purple-50 text-purple-700" },
    { label: "Total Spent", value: formatPrice(totalSpent), icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">Welcome back! Here is your account overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-stone-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="font-semibold text-stone-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {orders.slice(0, 3).map((order: any) => (
            <div key={order.id} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-stone-100 rounded-lg">
                  <Package className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">{formatPrice(order.total)}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" :
                  order.status === "SHIPPED" ? "bg-blue-50 text-blue-700" :
                  order.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                  "bg-stone-100 text-stone-600"
                }`}>{order.status}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="p-6 text-center text-sm text-stone-400">No orders yet</div>}
        </div>
      </div>

    </div>
  );
}
