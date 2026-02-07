"use client";

import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Brush,
  Eye,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: formatPrice(485000), icon: IndianRupee, color: "bg-emerald-50 text-emerald-700", change: "+18.2%", up: true },
  { label: "Total Orders", value: "342", icon: ShoppingBag, color: "bg-blue-50 text-blue-700", change: "+12.5%", up: true },
  { label: "Total Users", value: "1,245", icon: Users, color: "bg-purple-50 text-purple-700", change: "+8.3%", up: true },
  { label: "Active Products", value: "567", icon: Package, color: "bg-amber-50 text-amber-700", change: "+5.1%", up: true },
];

const recentOrders = [
  { id: "KVP-001234", customer: "Rahul Mehta", amount: 15000, status: "PROCESSING", date: "2 hours ago" },
  { id: "KVP-001233", customer: "Meera Patel", amount: 8500, status: "SHIPPED", date: "5 hours ago" },
  { id: "KVP-001232", customer: "Arjun Kumar", amount: 25000, status: "DELIVERED", date: "1 day ago" },
  { id: "KVP-001231", customer: "Neha Sharma", amount: 3200, status: "PENDING", date: "1 day ago" },
  { id: "KVP-001230", customer: "Priya Singh", amount: 45000, status: "DELIVERED", date: "2 days ago" },
];

const recentVendors = [
  { name: "Priya's Canvas", products: 24, revenue: 156800, status: "Active", rating: 4.9 },
  { name: "Arjun Digital Studio", products: 18, revenue: 89500, status: "Active", rating: 4.7 },
  { name: "Kavya Handicrafts", products: 32, revenue: 234000, status: "Active", rating: 4.8 },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Platform overview and management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.up ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Revenue Overview</h2>
            <select className="text-xs border border-stone-200 rounded px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-52 flex items-center justify-center bg-stone-50 rounded-lg">
            <div className="text-center">
              <Activity className="h-8 w-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm text-stone-400">Revenue chart visualization</p>
              <p className="text-xs text-stone-300 mt-1">Connect analytics to see trends</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Order Statistics</h2>
            <select className="text-xs border border-stone-200 rounded px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-52 flex items-center justify-center bg-stone-50 rounded-lg">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-stone-900">156</p>
                <p className="text-xs text-stone-500">This Month</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-stone-900">132</p>
                <p className="text-xs text-stone-500">Last Month</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">96%</p>
                <p className="text-xs text-stone-500">Completion Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-600">4</p>
                <p className="text-xs text-stone-500">Pending Issues</p>
              </div>
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
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.id}</p>
                  <p className="text-xs text-stone-500">{order.customer} &middot; {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(order.amount)}</p>
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
            {recentVendors.map((vendor) => (
              <div key={vendor.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{vendor.name}</p>
                    <p className="text-xs text-stone-500">{vendor.products} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(vendor.revenue)}</p>
                  <p className="text-xs text-stone-400">Rating: {vendor.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
