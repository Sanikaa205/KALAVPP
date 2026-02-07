"use client";

import { useState } from "react";
import { User, MapPin, Bell, Shield, Save } from "lucide-react";

export default function CustomerSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Demo Customer",
    email: "customer@kalavpp.com",
    phone: "",
    bio: "",
  });

  const [addresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123, MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <User className="h-4 w-4" /> Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full px-4 py-2.5 rounded-md border border-stone-200 text-sm bg-stone-50 text-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself"
              className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <button className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4" /> Saved Addresses
          </h2>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 border border-stone-200 rounded-md flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">Default</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
                <button className="text-xs text-amber-700 hover:text-amber-800 font-medium">Edit</button>
              </div>
            ))}
            <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">
              + Add New Address
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4" /> Notification Preferences
          </h2>
          <div className="space-y-3">
            {[
              { label: "Order updates", desc: "Get notified when your order status changes" },
              { label: "Commission updates", desc: "Receive artist progress updates" },
              { label: "New arrivals", desc: "Be the first to see new artworks" },
              { label: "Promotion emails", desc: "Discounts and special offers" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-stone-900">{item.label}</p>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-stone-200 peer-focus:ring-2 peer-focus:ring-stone-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-stone-900 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4" /> Security
          </h2>
          <button className="px-6 py-2.5 border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">
            Change Password
          </button>
          <div className="mt-4 pt-4 border-t border-stone-200">
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
