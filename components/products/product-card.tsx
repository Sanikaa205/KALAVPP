"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: any;
  variant?: "default" | "compact" | "horizontal";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const typeLabel =
    product.type === "DIGITAL"
      ? "Digital"
      : product.type === "MERCHANDISE"
        ? "Merch"
        : "Physical";

  const typeBadgeVariant =
    product.type === "DIGITAL"
      ? "info"
      : product.type === "MERCHANDISE"
        ? "warning"
        : "default";

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
        <Link href={`/shop/${product.slug}`} className="w-40 h-40 flex-shrink-0">
          <img
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
        <div className="flex-1 py-3 pr-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant={typeBadgeVariant as "default" | "success" | "warning" | "error" | "info" | "outline"}>{typeLabel}</Badge>
              <Link href={`/shop/${product.slug}`}>
                <h3 className="mt-1.5 text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-1">
                  {product.title}
                </h3>
              </Link>
              {product.vendor && (
                <p className="text-xs text-stone-500 mt-0.5">
                  by {product.vendor.storeName}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-stone-900">
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-xs text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-500 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-stone-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
        <Link href={`/shop/${product.slug}`} className="block aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <div className="p-3">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-xs font-semibold text-stone-900 line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm font-bold text-stone-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <Link href={`/shop/${product.slug}`}>
          <img
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant={typeBadgeVariant as "default" | "success" | "warning" | "error" | "info" | "outline"}>{typeLabel}</Badge>
          {product.isOriginal && (
            <Badge variant="success">Original</Badge>
          )}
          {product.compareAtPrice && (
            <Badge variant="error">
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100
              )}
              % off
            </Badge>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/40 to-transparent pt-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-stone-900 rounded-md py-2 text-xs font-medium hover:bg-stone-100 transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
          <button className="p-2 bg-white text-stone-600 rounded-md hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart className="h-3.5 w-3.5" />
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="p-2 bg-white text-stone-600 rounded-md hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.vendor && (
          <Link
            href={`/artists/${product.vendor.storeSlug}`}
            className="text-xs text-stone-400 hover:text-amber-700 transition-colors"
          >
            {product.vendor.storeName}
          </Link>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-1 text-sm font-semibold text-stone-900 line-clamp-1 hover:text-amber-700 transition-colors">
            {product.title}
          </h3>
        </Link>
        {product.medium && (
          <p className="mt-0.5 text-xs text-stone-400">{product.medium}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-stone-900">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-xs text-stone-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-stone-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
