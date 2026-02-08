"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const fetchWishlist = () => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => { setItems(d.wishlistItems || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId: string) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    fetchWishlist();
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">My Wishlist</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                <Link href={`/shop/${product.slug}`}>
                  <div className="h-48 bg-stone-100">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">No image</div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-stone-900 truncate hover:text-amber-700">{product.title}</h3>
                  </Link>
                  <p className="text-xs text-stone-500 mt-1">{product.vendor?.storeName || product.type}</p>
                  <p className="text-lg font-bold text-stone-900 mt-2">{formatPrice(product.price)}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2 border border-stone-200 rounded-md text-stone-400 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-stone-500">Save pieces you love for later.</p>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
            Explore Shop
          </Link>
        </div>
      )}
    </div>
  );
}
