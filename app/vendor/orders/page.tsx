"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, Eye, MoreVertical } from "lucide-react";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => setOrders(data.orders || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Orders</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "All Orders", value: "89", active: true },
          { label: "Processing", value: "12" },
          { label: "Shipped", value: "8" },
          { label: "Delivered", value: "69" },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`p-4 rounded-lg border text-left ${
              tab.active
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
            }`}
          >
            <p className={`text-xs ${tab.active ? "text-stone-300" : "text-stone-500"}`}>{tab.label}</p>
            <p className={`text-xl font-bold mt-1 ${tab.active ? "text-white" : "text-stone-900"}`}>{tab.value}</p>
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
          {orders.map((order: any) => (
            <div key={order.id} className="px-5 py-4 md:grid md:grid-cols-7 md:gap-4 md:items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md">
                  <Package className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500">{order.items?.length || 0} item(s)</p>
                </div>
              </div>
              <div className="text-sm text-stone-600">{order.user?.name || "Customer"}</div>
              <div className="text-sm text-stone-600">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
              <div>
                <select
                  defaultValue={order.status}
                  className="text-xs font-medium px-2 py-1 rounded border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="text-sm font-bold text-stone-900">
                {formatPrice(order.totalAmount || order.total)}
              </div>
              <div className="flex items-center justify-end gap-1">
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
