"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, MapPin, Package } from "lucide-react";

const steps = [
  { id: 1, name: "Shipping", icon: MapPin },
  { id: 2, name: "Payment", icon: CreditCard },
  { id: 3, name: "Confirmation", icon: Check },
];

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = getTotal();
  const shipping = subtotal > 2000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateShipping = () => {
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.city || !shippingData.state || !shippingData.pincode) {
      setOrderError("Please fill in all shipping fields");
      return false;
    }
    setOrderError("");
    return true;
  };

  const handlePlaceOrder = async () => {
    setOrderError("");
    setOrderLoading(true);

    try {
      // First save the address
      const addrRes = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: shippingData.fullName,
          line1: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          postalCode: shippingData.pincode,
          phone: shippingData.phone,
          isDefault: true,
        }),
      });

      let addressId: string | null = null;
      if (addrRes.ok) {
        const addrData = await addrRes.json();
        addressId = addrData.address?.id || null;
      }

      // Create the order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtotal,
          shippingCost: shipping,
          tax,
          total,
          paymentMethod,
          addressId,
          items: items.map((item) => ({
            productId: item.productId,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            type: item.product.type || "PHYSICAL",
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error || "Failed to place order. Please try again.");
        return;
      }

      setOrderNumber(data.order?.orderNumber || "N/A");
      setOrderPlaced(true);
      setCurrentStep(3);
      clearCart();
    } catch {
      setOrderError("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-900">Nothing to checkout</h1>
        <p className="mt-2 text-stone-500">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Order Placed Successfully!</h1>
        <p className="mt-2 text-stone-500">
          Your order #{orderNumber} has been confirmed. You will receive an email
          confirmation shortly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard/orders"
            className="px-6 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-stone-300 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                currentStep >= step.id
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-400"
              }`}
            >
              <step.icon className="h-4 w-4" />
              {step.name}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? "bg-stone-900" : "bg-stone-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="10-digit phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={shippingData.pincode}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="6-digit pincode"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
                  <input
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="House no., Street, Locality"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                  <input
                    name="city"
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                  <input
                    name="state"
                    value={shippingData.state}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Cart
                </Link>
                <button
                  onClick={() => { if (validateShipping()) setCurrentStep(2); }}
                  className="px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
                >
                  Continue to Payment
                </button>
              </div>
              {orderError && currentStep === 1 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-700">{orderError}</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Payment</h2>
              <div className="space-y-4">
                {/* Payment options */}
                <div className="border border-stone-900 rounded-lg p-4 cursor-pointer" onClick={() => setPaymentMethod("UPI")}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} className="text-stone-900" />
                    <CreditCard className="h-5 w-5 text-stone-600" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">UPI / Cards / NetBanking</p>
                      <p className="text-xs text-stone-500">Pay using Razorpay secure gateway</p>
                    </div>
                  </div>
                </div>
                <div className="border border-stone-200 rounded-lg p-4 cursor-pointer" onClick={() => setPaymentMethod("COD")}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="text-stone-900" />
                    <Package className="h-5 w-5 text-stone-600" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">Cash on Delivery</p>
                      <p className="text-xs text-stone-500">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-stone-50 rounded-lg">
                <h3 className="text-sm font-semibold text-stone-900 mb-2">Shipping to:</h3>
                <p className="text-sm text-stone-600">
                  {shippingData.fullName || "Name"}, {shippingData.address || "Address"},{" "}
                  {shippingData.city || "City"}, {shippingData.state || "State"} - {shippingData.pincode || "000000"}
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
                >
                  {orderLoading ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                </button>
              </div>
              {orderError && currentStep === 2 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-700">{orderError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-stone-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || "/images/placeholder.jpg"}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-900 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-medium text-stone-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
