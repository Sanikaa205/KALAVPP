"use client";

import { useState, useEffect } from "react";
import { Star, Search, MessageSquare } from "lucide-react";

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = reviews.filter((r) => {
    const matchSearch = !search ||
      r.product?.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === "all" || r.rating === Number(ratingFilter);
    return matchSearch && matchRating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDist = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Reviews</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-stone-900">{avgRating}</p>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
            ))}
          </div>
          <p className="text-sm text-stone-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 p-6">
          <div className="space-y-2">
            {ratingDist.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-sm text-stone-600 w-12">{d.stars} star</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: reviews.length > 0 ? `${(d.count / reviews.length) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm text-stone-500 w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Review List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 overflow-hidden">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      review.user?.name?.charAt(0)?.toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{review.user?.name || "Anonymous"}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-stone-500 mb-1">
                  Product: <span className="font-medium text-stone-700">{review.product?.title}</span>
                </p>
                {review.title && <p className="text-sm font-medium text-stone-900">{review.title}</p>}
                {review.comment && <p className="text-sm text-stone-600 mt-1">{review.comment}</p>}
              </div>
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img: string, i: number) => (
                    <div key={i} className="w-16 h-16 rounded-md overflow-hidden bg-stone-100">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">No reviews yet</p>
          <p className="mt-1 text-sm text-stone-500">Reviews from customers will appear here.</p>
        </div>
      )}
    </div>
  );
}
