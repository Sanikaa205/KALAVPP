"use client";

import { mockProducts, mockServices } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";
import { Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const mockVendors = [
  {
    id: "v1",
    storeName: "Priya's Canvas",
    storeSlug: "priyas-canvas",
    bio: "Contemporary artist specializing in vibrant oil paintings and mixed media. Each piece tells a story of colour, emotion, and the human experience. Based in Jaipur, creating art that bridges traditional Indian aesthetics with modern expression.",
    avatar: null,
    banner: null,
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    totalSales: 156,
    joinedDate: "2023-03-15",
    specialties: ["Oil Painting", "Mixed Media", "Portraits"],
  },
  {
    id: "v2",
    storeName: "Arjun Digital Studio",
    storeSlug: "arjun-digital-studio",
    bio: "Digital artist and illustrator creating stunning concept art, character designs, and digital prints. Blending technology with artistic vision to create unique pieces for collectors and commercial clients.",
    avatar: null,
    banner: null,
    location: "Mumbai, Maharashtra",
    rating: 4.7,
    totalSales: 89,
    joinedDate: "2023-06-20",
    specialties: ["Digital Art", "Illustrations", "Concept Art"],
  },
  {
    id: "v3",
    storeName: "Kavya Handicrafts",
    storeSlug: "kavya-handicrafts",
    bio: "Traditional handicraft artist preserving the ancient art forms of India. Specializing in Madhubani paintings, pottery, and handwoven textiles. Every creation carries centuries of cultural heritage.",
    avatar: null,
    banner: null,
    location: "Varanasi, UP",
    rating: 4.8,
    totalSales: 234,
    joinedDate: "2023-01-10",
    specialties: ["Madhubani", "Pottery", "Textiles"],
  },
];

export default function ArtistsPage() {
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
        {mockVendors.map((vendor) => {
          const vendorProducts = mockProducts.filter((p) => p.vendorId === vendor.id).slice(0, 3);
          const vendorServices = mockServices.filter((s) => s.vendorId === vendor.id).slice(0, 2);

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
                        <Calendar className="h-3.5 w-3.5" /> Joined {new Date(vendor.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
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
                  {vendor.specialties.map((s) => (
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
                      {vendorProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          className="aspect-square rounded-md overflow-hidden bg-stone-100 group"
                        >
                          <img
                            src={product.images[0] || "/images/placeholder.jpg"}
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
                      {vendorServices.map((service) => (
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
