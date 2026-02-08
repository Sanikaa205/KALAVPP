"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-stone-500">Failed to load analytics data.</div>;
  }

  const ordersByStatus = data.ordersByStatus || {};
  const usersByRole = data.usersByRole || {};
  const topVendors = data.topVendors || [];

  // Calculate order status percentages
  const totalOrders = data.totalOrders || 1;
  const orderStatuses = [
    { label: "Pending", count: ordersByStatus.PENDING || 0, color: "bg-amber-500" },
    { label: "Confirmed", count: ordersByStatus.CONFIRMED || 0, color: "bg-blue-500" },
    { label: "Processing", count: ordersByStatus.PROCESSING || 0, color: "bg-purple-500" },
    { label: "Shipped", count: ordersByStatus.SHIPPED || 0, color: "bg-indigo-500" },
    { label: "Delivered", count: ordersByStatus.DELIVERED || 0, color: "bg-emerald-500" },
    { label: "Cancelled", count: ordersByStatus.CANCELLED || 0, color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="h-5 w-5 text-blue-600" /></div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(data.totalRevenue || 0)}</p>
          <p className="text-xs text-stone-500 mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><ShoppingCart className="h-5 w-5 text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{data.totalOrders || 0}</p>
          <p className="text-xs text-stone-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Users className="h-5 w-5 text-purple-600" /></div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{data.totalUsers || 0}</p>
          <p className="text-xs text-stone-500 mt-1">Total Users</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 rounded-lg"><Package className="h-5 w-5 text-amber-600" /></div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{data.totalProducts || 0}</p>
          <p className="text-xs text-stone-500 mt-1">Total Products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Order Status Distribution
          </h2>
          <div className="space-y-3">
            {orderStatuses.map((os) => (
              <div key={os.label} className="flex items-center gap-3">
                <span className="text-xs text-stone-600 w-20">{os.label}</span>
                <div className="flex-1 h-6 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${os.color} rounded-full flex items-center justify-end pr-2 transition-all`}
                    style={{ width: `${Math.max((os.count / totalOrders) * 100, os.count > 0 ? 8 : 0)}%` }}
                  >
                    {os.count > 0 && <span className="text-[10px] text-white font-bold">{os.count}</span>}
                  </div>
                </div>
                <span className="text-xs text-stone-500 w-12 text-right">
                  {((os.count / totalOrders) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> User Distribution
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Customers", count: usersByRole.CUSTOMER || 0, color: "text-blue-600 bg-blue-100" },
              { label: "Vendors", count: usersByRole.VENDOR || 0, color: "text-purple-600 bg-purple-100" },
              { label: "Admins", count: usersByRole.ADMIN || 0, color: "text-amber-600 bg-amber-100" },
            ].map((u) => (
              <div key={u.label} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${u.color} flex items-center justify-center text-xl font-bold`}>
                  {u.count}
                </div>
                <p className="text-xs text-stone-600 mt-2">{u.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Total Vendors</span>
              <span className="font-semibold text-stone-900">{data.totalVendors || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-white rounded-lg border border-stone-200">
        <div className="p-4 border-b border-stone-200">
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Top Performing Vendors
          </h2>
        </div>
        {topVendors.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Rank</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Vendor</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Total Sales</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Orders</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topVendors.map((v: any, i: number) => (
                <tr key={v.id}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-100 text-amber-700" :
                      i === 1 ? "bg-stone-100 text-stone-600" :
                      i === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-stone-50 text-stone-500"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{v.storeName}</p>
                    <p className="text-xs text-stone-500">{v.user?.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-900">
                    {formatPrice(v.totalSales || 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">{v.totalOrders || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {(v.rating || 0).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-stone-500">No vendor data available yet.</div>
        )}
      </div>
    </div>
  );
}
