"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">
          Explore our collection and add some beautiful artworks to your cart.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-8">
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-lg border border-stone-200 p-4"
            >
              <Link
                href={`/shop/${item.product.slug}`}
                className="w-24 h-24 rounded-md overflow-hidden bg-stone-100 flex-shrink-0"
              >
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    {item.product.vendor && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        by {item.product.vendor.storeName}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                      {item.product.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {item.product.type !== "DIGITAL" ? (
                    <div className="flex items-center border border-stone-300 rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="p-1.5 text-stone-600 hover:bg-stone-50"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="p-1.5 text-stone-600 hover:bg-stone-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500">Digital Download</span>
                  )}
                  <p className="text-sm font-bold text-stone-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-stone-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-3 text-xs text-stone-500">
                Add {formatPrice(2000 - subtotal)} more for free shipping
              </p>
            )}

            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-stone-400">
              <span>Secure Checkout</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
