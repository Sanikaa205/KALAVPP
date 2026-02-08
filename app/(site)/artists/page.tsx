"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";
import { Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ArtistsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendors")
      .then(r => r.json())
      .then(data => {
        setVendors(data.vendors || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-stone-500">Loading artists...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
          Meet Our Artists
        </h1>
        <p className="mt-3 text-stone-500 max-w-2xl mx-auto">
          Discover talented creators from across India. Each artist brings a unique perspective,
          style, and centuries of cultural tradition to their work.
        </p>
      </div>

      {/* Artists Grid */}
      <div className="space-y-8">
        {vendors.map((vendor: any) => {
          const vendorProducts = vendor.products || [];
          const vendorServices = vendor.services || [];

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden"
            >
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-stone-800 to-stone-600 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center text-2xl font-bold text-stone-600 shadow-md">
                    {vendor.storeName.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="pt-14 pb-6 px-6">
                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">{vendor.storeName}</h2>
                    <div className="mt-1 flex items-center gap-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {vendor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {vendor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Joined {new Date(vendor.createdAt || "2024-01-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/artists/${vendor.storeSlug}`}
                    className="flex items-center gap-1 px-4 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                  >
                    View Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <p className="mt-3 text-sm text-stone-600 leading-relaxed max-w-3xl">
                  {vendor.bio}
                </p>

                {/* Specialties */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(vendor.specializations || []).map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-4 flex gap-6 text-sm">
                  <div>
                    <span className="font-bold text-stone-900">{vendor.totalSales}</span>
                    <span className="text-stone-500 ml-1">Sales</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">{vendorProducts.length}</span>
                    <span className="text-stone-500 ml-1">Artworks</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">{vendorServices.length}</span>
                    <span className="text-stone-500 ml-1">Services</span>
                  </div>
                </div>

                {/* Preview artworks */}
                {vendorProducts.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-3">Featured Artworks</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {vendorProducts.map((product: any) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          className="aspect-square rounded-md overflow-hidden bg-stone-100 group"
                        >
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview services */}
                {vendorServices.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-stone-900 mb-2">Services Offered</h3>
                    <div className="flex flex-wrap gap-3">
                      {vendorServices.map((service: any) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className="px-3 py-2 border border-stone-200 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          {service.title} - from {formatPrice(service.basePrice)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
