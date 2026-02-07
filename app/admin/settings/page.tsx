"use client";

import { useState } from "react";
import { Save, Globe, Palette, Bell, Shield, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Kalavpp",
    siteDescription: "India's Premier Art Marketplace",
    contactEmail: "support@kalavpp.com",
    vendorCommission: "15",
    enableRegistration: true,
    requireApproval: true,
    maintenanceMode: false,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Platform Settings</h1>

      <div className="space-y-6 max-w-3xl">
        {/* General */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4" /> General Settings
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Site Name</label>
                <input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contact Email</label>
                <input
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Site Description</label>
              <input
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Vendor */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4" /> Vendor & Commission
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Platform Commission (%)
              </label>
              <input
                type="number"
                value={settings.vendorCommission}
                onChange={(e) => setSettings({ ...settings, vendorCommission: e.target.value })}
                className="w-full max-w-xs px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <p className="text-xs text-stone-400 mt-1">Percentage taken from each vendor sale</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-stone-900">Require vendor approval</p>
                <p className="text-xs text-stone-500">New vendors must be approved by admin</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-stone-200 peer-focus:ring-2 peer-focus:ring-stone-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-stone-900 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4" /> Security & Access
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-stone-900">Enable registration</p>
                <p className="text-xs text-stone-500">Allow new users to create accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-stone-200 peer-focus:ring-2 peer-focus:ring-stone-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-stone-900 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-stone-900">Maintenance mode</p>
                <p className="text-xs text-stone-500">Show maintenance page to visitors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-stone-200 peer-focus:ring-2 peer-focus:ring-stone-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-stone-900 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800">
          <Save className="h-4 w-4" /> Save All Settings
        </button>
      </div>
    </div>
  );
}
