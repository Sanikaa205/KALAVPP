"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, Brush, ArrowRight, Eye, IndianRupee } from "lucide-react";

export default function VendorDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/commissions").then((r) => r.json()),
      fetch("/api/products?limit=4").then((r) => r.json()),
    ]).then(([ordData, comData, prodData]) => {
      setOrders(ordData.orders || []);
      setCommissions(comData.commissions || []);
      setProducts(prodData.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || o.total || 0), 0);
  const activeCommissions = commissions.filter((c) => ["ACCEPTED", "IN_PROGRESS"].includes(c.status)).length;

  const stats = [
    { label: "Total Products", value: products.length.toString(), icon: Package, color: "bg-blue-50 text-blue-700" },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "bg-emerald-50 text-emerald-700" },
    { label: "Active Commissions", value: activeCommissions.toString(), icon: Brush, color: "bg-amber-50 text-amber-700" },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: IndianRupee, color: "bg-purple-50 text-purple-700" },
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Vendor Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">Manage your store, products, and commissions.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{order.user?.name || "Customer"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(order.totalAmount || order.total)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="p-6 text-center text-sm text-stone-400">No orders yet</div>}
          </div>
        </div>

        {/* Active Commissions */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Active Commissions</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {commissions.slice(0, 5).map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{c.service?.title || "Custom Commission"}</p>
                  <p className="text-xs text-stone-500">{c.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(c.budget)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                  }`}>{c.status?.replace("_", " ")}</span>
                </div>
              </div>
            ))}
            {commissions.length === 0 && <div className="p-6 text-center text-sm text-stone-400">No commissions yet</div>}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 bg-white rounded-lg border border-stone-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="font-semibold text-stone-900">Your Products</h2>
          <Link href="/vendor/products" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
            Manage Products <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {products.slice(0, 4).map((product: any) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{product.title}</p>
                <p className="text-xs text-stone-500">{product.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Eye className="h-3 w-3" /> {product.viewCount || 0}
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="p-6 text-center text-sm text-stone-400">No products yet</div>}
        </div>
      </div>
    </div>
  );
}
