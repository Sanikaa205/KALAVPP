"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Star,
  ExternalLink,
  Instagram,
  Package,
  Palette,
  Globe,
} from "lucide-react";

export default function ArtistProfilePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = use(params);
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"products" | "services" | "reviews">("products");

  useEffect(() => {
    fetch(`/api/vendors/${storeSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.vendor) {
          setVendor(d.vendor);
          setProducts(d.products || []);
          setServices(d.services || []);
          setReviews(d.reviews || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-stone-600">Artist not found.</p>
        <Link href="/artists" className="mt-4 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Artists
        </Link>
      </div>
    );
  }

  const socialLinks = typeof vendor.socialLinks === "object" && vendor.socialLinks ? vendor.socialLinks : {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/artists" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> All Artists
      </Link>

      {/* Banner & Profile */}
      <div className="relative mb-8">
        <div className="h-48 sm:h-64 rounded-xl overflow-hidden bg-stone-200">
          {vendor.banner ? (
            <img src={vendor.banner} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200" />
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-16 px-4 sm:px-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-white bg-stone-100 shadow-lg flex-shrink-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.storeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-stone-400">
                {vendor.storeName?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{vendor.storeName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-stone-500">
              {vendor.location && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vendor.location}</span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {(vendor.rating || 0).toFixed(1)}
              </span>
              <span>{vendor.totalSales || 0} sales</span>
              {vendor.user?.createdAt && (
                <span>Joined {new Date(vendor.user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio & Social */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {vendor.description && (
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-900 mb-3">About</h2>
              <p className="text-sm text-stone-600 whitespace-pre-line">{vendor.description}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {/* Specializations */}
          {vendor.specializations?.length > 0 && (
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specializations.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {Object.entries(socialLinks).some(([, v]) => v) && (
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Connect</h3>
              <div className="space-y-2">
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700">
                    <Globe className="h-4 w-4" /> Website
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 mb-6">
        <nav className="flex gap-8">
          {[
            { key: "products" as const, label: "Products", icon: Package, count: products.length },
            { key: "services" as const, label: "Services", icon: Palette, count: services.length },
            { key: "reviews" as const, label: "Reviews", icon: Star, count: reviews.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label} ({t.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-stone-900 truncate group-hover:text-amber-700">{p.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{p.category?.name || p.type}</p>
                  <p className="text-sm font-bold text-stone-900 mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 text-sm">No products yet.</div>
        )
      )}

      {/* Services Tab */}
      {tab === "services" && (
        services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s: any) => (
              <Link key={s.id} href={`/services/${s.slug}`} className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-stone-100 overflow-hidden">
                  {s.images?.[0] ? (
                    <img src={s.images[0]} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Palette className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-700">{s.title}</h3>
                  <p className="text-xs text-stone-500 mt-1">{s.type.replace(/_/g, " ")}</p>
                  <p className="text-sm font-bold text-stone-900 mt-2">From {formatPrice(s.basePrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 text-sm">No services yet.</div>
        )
      )}

      {/* Reviews Tab */}
      {tab === "reviews" && (
        reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r: any) => (
              <div key={r.id} className="bg-white rounded-lg border border-stone-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 overflow-hidden">
                    {r.user?.avatar ? (
                      <img src={r.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      r.user?.name?.charAt(0)?.toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{r.user?.name}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-stone-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.product?.title && (
                  <p className="text-xs text-stone-500 mt-2">For: <span className="font-medium">{r.product.title}</span></p>
                )}
                {r.comment && <p className="text-sm text-stone-600 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 text-sm">No reviews yet.</div>
        )
      )}
    </div>
  );
}
