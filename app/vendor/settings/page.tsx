"use client";

import { useState } from "react";
import { Save, User, Store, CreditCard } from "lucide-react";

export default function VendorSettingsPage() {
  const [storeData, setStoreData] = useState({
    storeName: "Priya's Canvas",
    storeSlug: "priyas-canvas",
    bio: "Contemporary artist specializing in vibrant oil paintings and mixed media.",
    phone: "9876543210",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Store Settings</h1>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <Store className="h-4 w-4" /> Store Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
              <input
                value={storeData.storeName}
                onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Store URL</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 border border-r-0 border-stone-300 rounded-l-md bg-stone-50 text-xs text-stone-500">
                  kalavpp.com/artists/
                </span>
                <input
                  value={storeData.storeSlug}
                  onChange={(e) => setStoreData({ ...storeData, storeSlug: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-r-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
              <textarea
                rows={3}
                value={storeData.bio}
                onChange={(e) => setStoreData({ ...storeData, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
            <Save className="h-4 w-4" /> Update Store
          </button>
        </div>

        {/* Payout Settings */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4" /> Payout Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">UPI ID</label>
              <input
                value={storeData.upiId}
                onChange={(e) => setStoreData({ ...storeData, upiId: e.target.value })}
                placeholder="yourname@upi"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-stone-500 mt-2">Or enter bank details:</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Bank Name</label>
              <input
                value={storeData.bankName}
                onChange={(e) => setStoreData({ ...storeData, bankName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Account Number</label>
              <input
                value={storeData.accountNumber}
                onChange={(e) => setStoreData({ ...storeData, accountNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">IFSC Code</label>
              <input
                value={storeData.ifscCode}
                onChange={(e) => setStoreData({ ...storeData, ifscCode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
            <Save className="h-4 w-4" /> Save Payout Info
          </button>
        </div>
      </div>
    </div>
  );
}
