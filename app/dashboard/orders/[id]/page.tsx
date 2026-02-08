"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";

const STATUS_STEPS = [
  { key: "PENDING", label: "Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

function getStatusIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setOrder(d.order);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-600">{error || "Order not found"}</p>
        <Link href="/dashboard/orders" className="mt-4 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = getStatusIndex(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED";

  return (
    <div>
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-stone-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
          isCancelled ? "bg-red-100 text-red-700" :
          order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-700" :
          "bg-amber-100 text-amber-700"
        }`}>
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-stone-900 mb-6">Order Progress</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200" />
            <div className="absolute top-5 left-0 h-0.5 bg-amber-600 transition-all" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= currentStep;
              return (
                <div key={step.key} className="relative flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? "text-stone-900" : "text-stone-400"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-stone-200">
            <div className="p-4 border-b border-stone-200">
              <h2 className="text-sm font-semibold text-stone-900">Order Items ({order.items?.length || 0})</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {(order.items || []).map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4">
                  <Link href={`/shop/${item.product?.slug || "#"}`} className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || "/images/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product?.slug || "#"}`} className="text-sm font-semibold text-stone-900 hover:text-amber-700">
                      {item.title}
                    </Link>
                    {item.product?.vendor && (
                      <p className="text-xs text-stone-500 mt-0.5">by {item.product.vendor.storeName}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                      <span>Qty: {item.quantity}</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded">{item.type}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment
            </h2>
            <div className="text-sm space-y-1">
              <p className="text-stone-600">Method: <span className="text-stone-900 font-medium">{order.paymentMethod || "N/A"}</span></p>
              <p className="text-stone-600">Status: <span className={`font-medium ${order.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>{order.paymentStatus}</span></p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Shipping Address
              </h2>
              <div className="text-sm text-stone-600 space-y-0.5">
                <p className="font-medium text-stone-900">{order.address.fullName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
                {order.address.phone && <p className="mt-1">Phone: {order.address.phone}</p>}
              </div>
            </div>
          )}

          {/* Customer Info (for vendors/admins) */}
          {order.user && (
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" /> Customer
              </h2>
              <div className="text-sm text-stone-600 space-y-0.5">
                <p className="font-medium text-stone-900">{order.user.name}</p>
                <p>{order.user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
