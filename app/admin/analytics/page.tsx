"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  IndianRupee,
  Star,
  Brush,
  Store,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
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

  const { overview, growth, ordersByStatus, usersByRole, vendorsByStatus, commissionsByStatus, productsByType, paymentBreakdown, monthlyRevenue, topVendors, recentOrders, recentUsers } = data;

  const GrowthBadge = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const orderStatuses = [
    { label: "Pending", key: "PENDING", color: "bg-amber-500" },
    { label: "Confirmed", key: "CONFIRMED", color: "bg-blue-500" },
    { label: "Processing", key: "PROCESSING", color: "bg-purple-500" },
    { label: "Shipped", key: "SHIPPED", color: "bg-indigo-500" },
    { label: "Delivered", key: "DELIVERED", color: "bg-emerald-500" },
    { label: "Cancelled", key: "CANCELLED", color: "bg-red-500" },
  ];

  const totalOrderCount = Object.values(ordersByStatus as Record<string, number>).reduce((a: number, b: number) => a + b, 0) || 1;

  const commStatusMap = [
    { label: "Requested", key: "REQUESTED", color: "bg-blue-100 text-blue-700" },
    { label: "Accepted", key: "ACCEPTED", color: "bg-amber-100 text-amber-700" },
    { label: "In Progress", key: "IN_PROGRESS", color: "bg-purple-100 text-purple-700" },
    { label: "Completed", key: "COMPLETED", color: "bg-emerald-100 text-emerald-700" },
    { label: "Delivered", key: "DELIVERED", color: "bg-green-100 text-green-700" },
    { label: "Cancelled", key: "CANCELLED", color: "bg-red-100 text-red-700" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
        <p className="mt-1 text-sm text-stone-500">Comprehensive platform performance insights and metrics.</p>
      </div>

      {/* Key Metrics with Growth */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><IndianRupee className="h-5 w-5 text-emerald-600" /></div>
            <GrowthBadge value={growth.revenueGrowth} />
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(overview.totalRevenue)}</p>
          <p className="text-xs text-stone-500 mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg"><ShoppingCart className="h-5 w-5 text-blue-600" /></div>
            <GrowthBadge value={growth.orderGrowth} />
          </div>
          <p className="text-2xl font-bold text-stone-900">{overview.totalOrders}</p>
          <p className="text-xs text-stone-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-50 rounded-lg"><Users className="h-5 w-5 text-purple-600" /></div>
            <GrowthBadge value={growth.userGrowth} />
          </div>
          <p className="text-2xl font-bold text-stone-900">{overview.totalUsers}</p>
          <p className="text-xs text-stone-500 mt-1">Total Users</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg"><Package className="h-5 w-5 text-amber-600" /></div>
          </div>
          <p className="text-2xl font-bold text-stone-900">{overview.totalProducts}</p>
          <p className="text-xs text-stone-500 mt-1">Active Products</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Store, value: overview.totalVendors, label: "Active Vendors" },
          { icon: Layers, value: overview.totalServices, label: "Active Services" },
          { icon: Brush, value: overview.totalCommissions, label: "Total Commissions" },
          { icon: IndianRupee, value: formatPrice(overview.commissionRevenue), label: "Commission Revenue" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-50 rounded-lg"><item.icon className="h-4 w-4 text-stone-600" /></div>
              <div>
                <p className="text-lg font-bold text-stone-900">{item.value}</p>
                <p className="text-xs text-stone-500">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 mb-8">
        <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Monthly Revenue (Last 6 Months)
        </h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyRevenue?.map((m: any, i: number) => {
            const maxRev = Math.max(...monthlyRevenue.map((r: any) => r.revenue), 1);
            const height = (m.revenue / maxRev) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-stone-500 font-medium">{formatPrice(m.revenue)}</span>
                <div className="w-full bg-stone-100 rounded-t-md overflow-hidden relative" style={{ height: "100%" }}>
                  <div
                    className="w-full bg-stone-800 rounded-t-md transition-all absolute bottom-0"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-stone-500">{m.month}</span>
                  <p className="text-[10px] text-stone-400">{m.orders} orders</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> Order Status Distribution
          </h2>
          <div className="space-y-3">
            {orderStatuses.map((os) => {
              const count = ordersByStatus?.[os.key] || 0;
              return (
                <div key={os.key} className="flex items-center gap-3">
                  <span className="text-xs text-stone-600 w-20">{os.label}</span>
                  <div className="flex-1 h-6 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${os.color} rounded-full flex items-center justify-end pr-2 transition-all`}
                      style={{ width: `${Math.max((count / totalOrderCount) * 100, count > 0 ? 8 : 0)}%` }}
                    >
                      {count > 0 && <span className="text-[10px] text-white font-bold">{count}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-stone-500 w-12 text-right">{((count / totalOrderCount) * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> User Distribution
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "Customers", count: usersByRole?.CUSTOMER || 0, color: "text-blue-600 bg-blue-50" },
              { label: "Vendors", count: usersByRole?.VENDOR || 0, color: "text-purple-600 bg-purple-50" },
              { label: "Admins", count: usersByRole?.ADMIN || 0, color: "text-amber-600 bg-amber-50" },
            ].map((u) => (
              <div key={u.label} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${u.color} flex items-center justify-center text-xl font-bold`}>{u.count}</div>
                <p className="text-xs text-stone-600 mt-2">{u.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">New users (30d)</span>
              <span className="font-semibold text-stone-900">{growth.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Orders (30d)</span>
              <span className="font-semibold text-stone-900">{growth.ordersThisMonth}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Commission Insights */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Brush className="h-4 w-4" /> Commission Insights
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {commStatusMap.filter(s => (commissionsByStatus?.[s.key] || 0) > 0).map((cs) => (
              <div key={cs.key} className={`px-3 py-2 rounded-lg text-center ${cs.color}`}>
                <p className="text-lg font-bold">{commissionsByStatus?.[cs.key] || 0}</p>
                <p className="text-[10px]">{cs.label}</p>
              </div>
            ))}
          </div>
          {Object.keys(commissionsByStatus || {}).length === 0 && (
            <p className="text-sm text-stone-400 text-center py-4">No commissions yet</p>
          )}
        </div>

        {/* Vendor Status Overview */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Store className="h-4 w-4" /> Vendor Status Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Approved", key: "APPROVED", color: "bg-emerald-50 text-emerald-700" },
              { label: "Pending", key: "PENDING", color: "bg-amber-50 text-amber-700" },
              { label: "Rejected", key: "REJECTED", color: "bg-red-50 text-red-700" },
              { label: "Suspended", key: "SUSPENDED", color: "bg-stone-100 text-stone-600" },
            ].map((vs) => (
              <div key={vs.key} className={`px-4 py-3 rounded-lg ${vs.color}`}>
                <p className="text-2xl font-bold">{vendorsByStatus?.[vs.key] || 0}</p>
                <p className="text-xs">{vs.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Type Breakdown */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Package className="h-4 w-4" /> Products by Type
          </h2>
          <div className="space-y-3">
            {Object.entries(productsByType || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-stone-600 capitalize">{type.toLowerCase().replace("_", " ")}</span>
                <span className="text-sm font-semibold text-stone-900 bg-stone-50 px-3 py-1 rounded-full">{count as number}</span>
              </div>
            ))}
            {Object.keys(productsByType || {}).length === 0 && (
              <p className="text-sm text-stone-400 text-center">No products yet</p>
            )}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <IndianRupee className="h-4 w-4" /> Payment Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(paymentBreakdown || {}).map(([status, info]: [string, any]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === "PAID" ? "bg-emerald-100 text-emerald-700" :
                    status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    status === "FAILED" ? "bg-red-100 text-red-700" :
                    "bg-stone-100 text-stone-600"
                  }`}>{status}</span>
                  <span className="ml-2 text-sm text-stone-500">{info.count} orders</span>
                </div>
                <span className="text-sm font-bold text-stone-900">{formatPrice(info.total)}</span>
              </div>
            ))}
            {Object.keys(paymentBreakdown || {}).length === 0 && (
              <p className="text-sm text-stone-400 text-center">No payment data</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Vendors Table */}
      <div className="bg-white rounded-lg border border-stone-200 mb-8">
        <div className="p-5 border-b border-stone-200">
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Top Performing Vendors
          </h2>
        </div>
        {topVendors?.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-stone-500">Rank</th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">Vendor</th>
                <th className="text-right px-5 py-3 font-medium text-stone-500">Products</th>
                <th className="text-right px-5 py-3 font-medium text-stone-500">Services</th>
                <th className="text-right px-5 py-3 font-medium text-stone-500">Sales</th>
                <th className="text-right px-5 py-3 font-medium text-stone-500">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topVendors.map((v: any, i: number) => (
                <tr key={v.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-stone-200 text-stone-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-stone-50 text-stone-500"
                    }`}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-stone-900">{v.storeName}</p>
                    <p className="text-xs text-stone-500">{v.user?.name}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-stone-600">{v._count?.products || 0}</td>
                  <td className="px-5 py-3 text-right text-stone-600">{v._count?.services || 0}</td>
                  <td className="px-5 py-3 text-right font-semibold text-stone-900">{formatPrice(v.totalSales || 0)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {(v.rating || 0).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-stone-400">No vendor data available yet.</div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="p-5 border-b border-stone-200">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Recent Registrations
            </h2>
          </div>
          <div className="divide-y divide-stone-100">
            {recentUsers?.map((u: any) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{u.name || "Unnamed"}</p>
                  <p className="text-xs text-stone-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.role === "ADMIN" ? "bg-red-50 text-red-700" : u.role === "VENDOR" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                  }`}>{u.role}</span>
                  <p className="text-[10px] text-stone-400 mt-1">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
            {(!recentUsers || recentUsers.length === 0) && (
              <div className="p-6 text-center text-sm text-stone-400">No users yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200">
          <div className="p-5 border-b border-stone-200">
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Recent Orders
            </h2>
          </div>
          <div className="divide-y divide-stone-100">
            {recentOrders?.map((o: any) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{o.orderNumber}</p>
                  <p className="text-xs text-stone-500">{o.user?.name} &middot; {o.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(o.total)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    o.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : o.status === "SHIPPED" ? "bg-blue-50 text-blue-700" : "bg-stone-100 text-stone-600"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="p-6 text-center text-sm text-stone-400">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
