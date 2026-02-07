"use client";

import { mockCommissions } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Brush, MessageSquare } from "lucide-react";

export default function CustomerCommissionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">My Commissions</h1>

      <div className="space-y-4">
        {mockCommissions.map((commission) => (
          <div
            key={commission.id}
            className="bg-white rounded-lg border border-stone-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Brush className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    {commission.title}
                  </h3>
                  <p className="text-sm text-stone-500 mt-0.5">
                    Artist: {commission.vendor?.storeName}
                  </p>
                  <p className="text-sm text-stone-500">
                    Service: {commission.service?.title}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  commission.status === "IN_PROGRESS"
                    ? "bg-blue-50 text-blue-700"
                    : commission.status === "PENDING"
                    ? "bg-amber-50 text-amber-700"
                    : commission.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {commission.status.replace("_", " ")}
              </span>
            </div>

            <p className="mt-3 text-sm text-stone-600">{commission.description}</p>

            <div className="mt-4 flex items-center gap-6 text-sm text-stone-500">
              <span>Budget: <strong className="text-stone-900">{formatPrice(commission.budget)}</strong></span>
              {commission.deadline && (
                <span>
                  Deadline:{" "}
                  <strong className="text-stone-900">
                    {new Date(commission.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </span>
              )}
              <span>
                Revisions: {commission.currentRevision}/{commission.maxRevisions}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>Progress</span>
                <span>
                  {commission.status === "COMPLETED"
                    ? "100"
                    : commission.status === "IN_PROGRESS"
                    ? "50"
                    : "10"}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    commission.status === "COMPLETED"
                      ? "bg-emerald-500 w-full"
                      : commission.status === "IN_PROGRESS"
                      ? "bg-blue-500 w-1/2"
                      : "bg-amber-500 w-[10%]"
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-50">
                <MessageSquare className="h-3.5 w-3.5" />
                Message Artist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
