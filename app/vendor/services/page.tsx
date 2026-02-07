"use client";

import { mockServices } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, Star, Clock } from "lucide-react";

export default function VendorServicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Services</h1>
        <Link
          href="/vendor/services/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" /> Add Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg border border-stone-200 overflow-hidden"
          >
            <div className="aspect-[16/8] bg-stone-100 overflow-hidden">
              <img
                src={service.images[0] || "/images/placeholder.jpg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                  {service.type.replace(/_/g, " ")}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    service.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Paused"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-stone-900">{service.title}</h3>
              <p className="mt-1 text-xs text-stone-500 line-clamp-2">{service.description}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  {service.rating} ({service.reviewCount})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {service.deliveryDays}d delivery
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-stone-900">
                  {formatPrice(service.basePrice)}
                </span>
                <div className="flex items-center gap-1">
                  <Link href={`/services/${service.slug}`} className="p-1.5 text-stone-400 hover:text-stone-900">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-1.5 text-stone-400 hover:text-stone-900">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-stone-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
