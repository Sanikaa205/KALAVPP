"use client";

import { useState, useEffect } from "react";
import { Eye, Ban, MoreVertical, Search, UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(data => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Users</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: "1,245" },
          { label: "Customers", value: "1,089" },
          { label: "Vendors", value: "148" },
          { label: "Admins", value: "8" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <select className="px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none">
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="VENDOR">Vendor</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">User</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {users.map((user: any) => (
            <div
              key={user.id}
              className="px-5 py-4 md:grid md:grid-cols-6 md:gap-4 md:items-center space-y-2 md:space-y-0"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-red-50 text-red-700"
                      : user.role === "VENDOR"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-sm text-stone-600">
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="p-1.5 text-stone-400 hover:text-stone-900">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-red-600">
                  <Ban className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-stone-900">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
