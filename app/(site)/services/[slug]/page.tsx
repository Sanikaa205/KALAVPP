"use client";

import { use, useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Star,
  MessageSquare,
  Send,
} from "lucide-react";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [service, setService] = useState<any>(null);
  const [serviceReviews, setServiceReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [commissionForm, setCommissionForm] = useState({
    description: "",
    budget: "",
    deadline: "",
  });
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionMsg, setCommissionMsg] = useState("");
  const [commissionError, setCommissionError] = useState("");

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.service) {
          setService(data.service);
          setServiceReviews(data.service.reviews || []);
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

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Service not found</h1>
        <p className="mt-2 text-stone-500">The service you are looking for does not exist.</p>
        <Link
          href="/services"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/services" className="hover:text-stone-900 transition-colors">
          Services
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{service.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: Gallery + Details */}
        <div className="lg:col-span-3">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-stone-100">
              <img
                src={service.images[selectedImage] || "/images/placeholder.jpg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            {service.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {service.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
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

          {/* Service Info */}
          <div className="mt-8">
            <Badge variant="info">{service.type.replace(/_/g, " ")}</Badge>
            {service.vendor && (
              <Link
                href={`/artists/${service.vendor.storeSlug}`}
                className="ml-2 text-sm text-stone-500 hover:text-amber-700"
              >
                by {service.vendor.storeName}
              </Link>
            )}

            <h1 className="mt-3 text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              {service.title}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarRating rating={service.rating} showValue />
                <span className="text-sm text-stone-400">({service.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <Clock className="h-4 w-4" />
                {service.deliveryDays} days delivery
              </div>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <CheckCircle2 className="h-4 w-4" />
                {service.maxRevisions} revisions
              </div>
            </div>

            <p className="mt-6 text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
              {service.description}
            </p>

            {/* What's included */}
            {service.includes && service.includes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">
                  What is included
                </h3>
                <ul className="space-y-2">
                  {service.includes.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-lg font-bold text-stone-900 mb-6">
              Reviews ({serviceReviews.length})
            </h2>
            {serviceReviews.length > 0 ? (
              <div className="space-y-6">
                {serviceReviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-200 pb-6 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900">{review.user?.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-stone-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500">No reviews yet for this service.</p>
            )}
          </div>
        </div>

        {/* Right: Pricing + Commission Form */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">Starting from</p>
                  <p className="text-3xl font-bold text-stone-900">
                    {formatPrice(service.basePrice)}
                  </p>
                </div>
                {service.isActive && (
                  <Badge variant="success">Available</Badge>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-stone-50 rounded-md">
                  <p className="text-xs text-stone-400">Delivery</p>
                  <p className="font-medium text-stone-900">{service.deliveryDays} days</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-md">
                  <p className="text-xs text-stone-400">Revisions</p>
                  <p className="font-medium text-stone-900">{service.maxRevisions} included</p>
                </div>
              </div>
            </div>

            {/* Commission Form */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Request a Commission
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Describe your project and the artist will get back to you.
              </p>

              <form className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows={4}
                    value={commissionForm.description}
                    onChange={(e) =>
                      setCommissionForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="Describe what you want the artist to create..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Budget (Rs.)
                    </label>
                    <input
                      type="number"
                      value={commissionForm.budget}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          budget: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={commissionForm.deadline}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={commissionLoading}
                  onClick={async () => {
                    setCommissionError("");
                    setCommissionMsg("");

                    if (!commissionForm.description || !commissionForm.budget) {
                      setCommissionError("Please provide a description and budget.");
                      return;
                    }

                    setCommissionLoading(true);
                    try {
                      const res = await fetch("/api/commissions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          vendorId: service.vendorId,
                          serviceId: service.id,
                          title: `Commission for ${service.title}`,
                          description: commissionForm.description,
                          budget: parseFloat(commissionForm.budget),
                          deadline: commissionForm.deadline || undefined,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setCommissionError(data.error || "Failed to submit. Please login first.");
                        return;
                      }
                      setCommissionMsg("Commission request submitted! The artist will review it.");
                      setCommissionForm({ description: "", budget: "", deadline: "" });
                    } catch {
                      setCommissionError("Something went wrong. Please try again.");
                    } finally {
                      setCommissionLoading(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {commissionLoading ? "Submitting..." : "Send Commission Request"}
                </button>
                {commissionMsg && (
                  <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded">{commissionMsg}</p>
                )}
                {commissionError && (
                  <p className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded">{commissionError}</p>
                )}
              </form>
            </div>

            {/* Vendor Card */}
            {service.vendor && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">About the Artist</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-lg font-bold text-stone-600">
                    {service.vendor.storeName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {service.vendor.storeName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      {service.vendor.rating} ({service.vendor.totalSales} sales)
                    </div>
                  </div>
                </div>
                {service.vendor.bio && (
                  <p className="mt-3 text-xs text-stone-500 line-clamp-3">
                    {service.vendor.bio}
                  </p>
                )}
                <Link
                  href={`/artists/${service.vendor.storeSlug}`}
                  className="mt-3 block text-center py-2 border border-stone-300 text-stone-700 rounded-md text-xs font-medium hover:bg-stone-50"
                >
                  View Full Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
