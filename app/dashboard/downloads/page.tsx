"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, FileDown, Package } from "lucide-react";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((d) => {
        setDownloads(d.downloads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">My Downloads</h1>

      {downloads.length > 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Downloads</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Expires</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {downloads.map((dl) => {
                const expired = dl.expiresAt && new Date(dl.expiresAt) < new Date();
                const maxedOut = dl.downloadCount >= dl.maxDownloads;
                const canDownload = !expired && !maxedOut;

                return (
                  <tr key={dl.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden flex-shrink-0">
                          {dl.product?.images?.[0] ? (
                            <img src={dl.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-stone-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link href={`/shop/${dl.product?.slug || "#"}`} className="font-medium text-stone-900 hover:text-amber-700">
                            {dl.product?.title || "Product"}
                          </Link>
                          {dl.product?.vendor && (
                            <p className="text-xs text-stone-500">by {dl.product.vendor.storeName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {dl.downloadCount} / {dl.maxDownloads}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {dl.expiresAt
                        ? expired
                          ? <span className="text-red-600">Expired</span>
                          : new Date(dl.expiresAt).toLocaleDateString()
                        : "Never"
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canDownload ? (
                        <a
                          href={dl.downloadUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium">Unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <FileDown className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">No downloads yet</p>
          <p className="mt-1 text-sm text-stone-500">Purchase digital products to see them here.</p>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
            Browse Shop
          </Link>
        </div>
      )}
    </div>
  );
}
