"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Star, Clock, CheckCircle2 } from "lucide-react";

const serviceTypes = [
  { value: "all", label: "All Services" },
  { value: "PORTRAIT", label: "Portrait" },
  { value: "SCULPTURE", label: "Sculpture" },
  { value: "MURAL", label: "Mural" },
  { value: "CALLIGRAPHY", label: "Calligraphy" },
  { value: "ILLUSTRATION", label: "Illustration" },
  { value: "BRANDING", label: "Branding" },
  { value: "BOOK_COVER", label: "Book Cover" },
  { value: "EXHIBITION", label: "Exhibition" },
  { value: "CONSULTANCY", label: "Consultancy" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "CUSTOM", label: "Custom" },
];

export default function ServicesPage() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      });
  }, []);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (filter !== "all") {
      filtered = filtered.filter((s: any) => s.type === filter);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a: any, b: any) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        filtered.sort((a: any, b: any) => b.basePrice - a.basePrice);
        break;
      case "rating":
        filtered.sort((a: any, b: any) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [services, filter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
          Creative Services
        </h1>
        <p className="mt-3 text-stone-500 max-w-2xl mx-auto">
          Commission talented artists for custom artwork, portraits, murals, and more.
          Every piece is handcrafted to your vision.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
        <div className="flex flex-wrap gap-2">
          {serviceTypes.slice(0, 6).map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === type.value
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {type.label}
            </button>
          ))}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border-none focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            {serviceTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  src={service.images[0] || "/images/placeholder.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-stone-700">
                  {service.type.replace(/_/g, " ")}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Vendor */}
                {service.vendor && (
                  <p className="text-xs text-stone-500 mb-1">
                    by {service.vendor.storeName}
                  </p>
                )}

                <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                  {service.title}
                </h3>

                <p className="mt-2 text-xs text-stone-500 line-clamp-2">
                  {service.description}
                </p>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium text-stone-700">
                      {service.rating}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({service.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="h-3.5 w-3.5" />
                    {service.deliveryDays} days
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {service.maxRevisions} revisions
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400">Starting from</p>
                    <p className="text-lg font-bold text-stone-900">
                      {formatPrice(service.basePrice)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-stone-700">No services found</p>
          <p className="mt-1 text-sm text-stone-500">Try adjusting your filters.</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
          >
            View all services
          </button>
        </div>
      )}

      {/* How it works */}
      <section className="mt-16 py-12 px-8 bg-stone-50 rounded-xl">
        <h2 className="text-xl font-bold text-stone-900 text-center mb-8">
          How Commissions Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Choose a Service", desc: "Browse artists and select a service that matches your vision." },
            { step: "02", title: "Describe Your Idea", desc: "Share your requirements, references, and preferences." },
            { step: "03", title: "Artist Creates", desc: "The artist works on your piece and shares progress updates." },
            { step: "04", title: "Receive & Review", desc: "Get your artwork, request revisions, and leave a review." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-1 text-xs text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
