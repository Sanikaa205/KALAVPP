"use client";

import { mockOrders } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Search, Eye, Package, MoreVertical } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Order Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "All", value: "342", active: true },
          { label: "Pending", value: "23" },
          { label: "Processing", value: "45" },
          { label: "Shipped", value: "67" },
          { label: "Delivered", value: "207" },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`p-3 rounded-lg border text-center ${
              tab.active
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <p className={`text-xl font-bold ${tab.active ? "text-white" : "text-stone-900"}`}>
              {tab.value}
            </p>
            <p className={`text-xs ${tab.active ? "text-stone-300" : "text-stone-500"}`}>
              {tab.label}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
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
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="px-5 py-4 md:grid md:grid-cols-7 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
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
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
              <div className="text-sm font-bold text-stone-900">{formatPrice(order.totalAmount || order.total)}</div>
              <div className="flex items-center justify-end gap-2">
                <button className="p-1.5 text-stone-400 hover:text-stone-900">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-stone-900">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
