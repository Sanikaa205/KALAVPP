"use client";

import { mockProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  // Use first 4 products as mock wishlist
  const wishlistItems = mockProducts.slice(0, 4);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-stone-500">Save pieces you love for later.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
          >
            Explore Shop
          </Link>
        </div>
      )}
    </div>
  );
}
