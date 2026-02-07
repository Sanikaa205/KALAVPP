"use client";

import { mockProducts, mockOrders, mockCommissions, mockServices } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Brush,
  TrendingUp,
  ArrowRight,
  Eye,
  IndianRupee,
} from "lucide-react";

const stats = [
  { label: "Total Products", value: "24", icon: Package, color: "bg-blue-50 text-blue-700" },
  { label: "Total Orders", value: "89", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-700" },
  { label: "Active Commissions", value: "5", icon: Brush, color: "bg-amber-50 text-amber-700" },
  { label: "Revenue", value: formatPrice(156800), icon: IndianRupee, color: "bg-purple-50 text-purple-700" },
];

const recentSales = [
  { id: "1", product: "Sunset over Jaipur", buyer: "Demo Customer", amount: 15000, date: "2024-01-15" },
  { id: "2", product: "Digital Phoenix", buyer: "Neha Sharma", amount: 499, date: "2024-01-14" },
  { id: "3", product: "Handwoven Pashmina", buyer: "Rahul Mehta", amount: 8500, date: "2024-01-13" },
];

export default function VendorDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Vendor Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your store, products, and commissions.
        </p>
      </div>

      {/* Stats */}
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
        {/* Recent sales */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Recent Sales</h2>
            <Link href="/vendor/orders" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentSales.map((sale) => (
              <div key={sale.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{sale.product}</p>
                  <p className="text-xs text-stone-500">{sale.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(sale.amount)}</p>
                  <p className="text-xs text-stone-400">{new Date(sale.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Commissions */}
        <div className="bg-white rounded-lg border border-stone-200">
          <div className="flex items-center justify-between p-5 border-b border-stone-200">
            <h2 className="font-semibold text-stone-900">Active Commissions</h2>
            <Link href="/vendor/commissions" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {mockCommissions.map((commission) => (
              <div key={commission.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{commission.title}</p>
                  <p className="text-xs text-stone-500">{commission.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-900">{formatPrice(commission.budget)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    commission.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {commission.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 bg-white rounded-lg border border-stone-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="font-semibold text-stone-900">Top Products</h2>
          <Link href="/vendor/products" className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
            Manage Products <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {mockProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0] || "/images/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{product.title}</p>
                <p className="text-xs text-stone-500">{product.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Eye className="h-3 w-3" /> {product.viewCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
