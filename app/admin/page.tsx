"use client";

import { useState, useEffect } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  IndianRupee,
  ArrowRight,
  Activity,
  Store,
  Download,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalVendors: number;
    totalRevenue: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    items: Array<{ title: string; quantity: number; price: number }>;
  }>;
  topVendors: Array<{
    id: string;
    storeName: string;
    totalSales: number;
    rating: number;
    user: { name: string; avatar: string | null };
    _count: { products: number; services: number };
  }>;
  ordersByStatus: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statsItems = data ? [
    { label: "Total Revenue", value: formatPrice(data.stats.totalRevenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-700" },
    { label: "Total Orders", value: data.stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Total Users", value: data.stats.totalUsers.toString(), icon: Users, color: "bg-purple-50 text-purple-700" },
    { label: "Active Products", value: data.stats.totalProducts.toString(), icon: Package, color: "bg-amber-50 text-amber-700" },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Platform overview and management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=orders"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Export Orders
          </a>
          <a
            href="/api/admin/export?type=commissions"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Export Commissions
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsItems.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.ordersByStatus && Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div key={status} className="p-3 bg-stone-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-stone-900">{count}</p>
                <p className="text-xs text-stone-500 capitalize">{status.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Quick Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-stone-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-stone-900">{data?.stats.totalVendors || 0}</p>
              <p className="text-xs text-stone-500">Active Vendors</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-stone-900">{data?.stats.totalProducts || 0}</p>
              <p className="text-xs text-stone-500">Active Products</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-700">{formatPrice(data?.stats.totalRevenue || 0)}</p>
              <p className="text-xs text-stone-500">Paid Revenue</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{data?.stats.totalOrders || 0}</p>
              <p className="text-xs text-stone-500">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {data?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{order.user.name} &middot; {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(order.total)}</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.status === "SHIPPED"
                        ? "bg-blue-50 text-blue-700"
                        : order.status === "PROCESSING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className="p-8 text-center text-sm text-stone-400">No orders yet</div>
            )}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Top Vendors</h2>
            <Link href="/admin/vendors" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {data?.topVendors?.map((vendor) => (
              <div key={vendor.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
                    {vendor.storeName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{vendor.storeName}</p>
                    <p className="text-xs text-stone-500">{vendor._count.products} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(vendor.totalSales)}</p>
                  <p className="text-xs text-stone-400">Rating: {vendor.rating.toFixed(1)}</p>
                </div>
              </div>
            ))}
            {(!data?.topVendors || data.topVendors.length === 0) && (
              <div className="p-8 text-center text-sm text-stone-400">No vendors yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
