"use client";

import { use, useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  Download,
  ArrowLeft,
  Check,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) {
          setProduct(data.product);
          setProductReviews(data.product.reviews || []);
          // Fetch related products
          fetch(`/api/products?limit=4&category=${data.product.category?.slug || ""}`)
            .then(r => r.json())
            .then(rel => {
              setRelatedProducts(
                (rel.products || []).filter((p: any) => p.id !== data.product.id).slice(0, 4)
              );
            });
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Product not found</h1>
        <p className="mt-2 text-stone-500">The artwork you are looking for does not exist.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/shop" className="hover:text-stone-900 transition-colors">
          Shop
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-stone-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-medium truncate">{product.title}</span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-stone-100">
            <img
              src={product.images[selectedImage] || "/images/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-stone-900"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant={
                product.type === "DIGITAL" ? "info" : product.type === "MERCHANDISE" ? "warning" : "default"
              }
            >
              {product.type === "DIGITAL" ? "Digital" : product.type === "MERCHANDISE" ? "Merchandise" : "Physical"}
            </Badge>
            {product.isOriginal && <Badge variant="success">Original Artwork</Badge>}
          </div>

          {/* Vendor */}
          {product.vendor && (
            <Link
              href={`/artists/${product.vendor.storeSlug}`}
              className="text-sm text-stone-500 hover:text-amber-700 transition-colors"
            >
              by {product.vendor.storeName}
            </Link>
          )}

          <h1 className="mt-2 text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} showValue />
            <span className="text-sm text-stone-400">
              ({product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""})
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <Badge variant="error">
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100
                  )}
                  % off
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Art Details */}
          <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg">
            {product.medium && (
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Medium</p>
                <p className="text-sm text-stone-700 mt-0.5">{product.medium}</p>
              </div>
            )}
            {product.style && (
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Style</p>
                <p className="text-sm text-stone-700 mt-0.5">{product.style}</p>
              </div>
            )}
            {product.artDimensions && (
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Dimensions</p>
                <p className="text-sm text-stone-700 mt-0.5">{product.artDimensions}</p>
              </div>
            )}
            {product.yearCreated && (
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Year</p>
                <p className="text-sm text-stone-700 mt-0.5">{product.yearCreated}</p>
              </div>
            )}
          </div>

          {/* Stock / Availability */}
          {product.type === "PHYSICAL" && product.stockQuantity !== undefined && (
            <div className="mt-4 flex items-center gap-2">
              {product.stockQuantity > 0 ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600 font-medium">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-6 space-y-3">
            {product.type !== "DIGITAL" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.type === "DIGITAL" ? "Buy Now" : "Add to Cart"}
              </button>
              <button className="p-3.5 border border-stone-300 rounded-md text-stone-600 hover:bg-stone-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3.5 border border-stone-300 rounded-md text-stone-600 hover:bg-stone-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.type === "DIGITAL" ? (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Download className="h-4 w-4" />
                <span>Instant digital download</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Truck className="h-4 w-4" />
                <span>Free shipping over Rs. 2,000</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Shield className="h-4 w-4" />
              <span>Buyer protection</span>
            </div>
            {product.certificate && (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Check className="h-4 w-4" />
                <span>Certificate of authenticity</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {productReviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Customer Reviews ({productReviews.length})
          </h2>
          <div className="space-y-6">
            {productReviews.map((review: any) => (
              <div
                key={review.id}
                className="border-b border-stone-200 pb-6 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                      {review.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  {review.isVerified && (
                    <Badge variant="success">Verified Purchase</Badge>
                  )}
                </div>
                {review.title && (
                  <h4 className="mt-3 text-sm font-semibold text-stone-900">
                    {review.title}
                  </h4>
                )}
                {review.comment && (
                  <p className="mt-1 text-sm text-stone-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
