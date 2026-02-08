"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, Eye } from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => setOrders(data.orders || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">My Orders</h1>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Order</div>
          <div>Date</div>
          <div>Status</div>
          <div>Items</div>
          <div className="text-right">Total</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-stone-100">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="px-5 py-4 md:grid md:grid-cols-6 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md">
                  <Package className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.orderNumber}</p>
                  <p className="text-xs text-stone-500 md:hidden">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-sm text-stone-600">
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
                      : order.status === "CANCELLED"
                      ? "bg-red-50 text-red-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-stone-600">
                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3">
                <span className="text-sm font-bold text-stone-900">
                  {formatPrice(order.total)}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
