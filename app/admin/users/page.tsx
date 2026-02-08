"use client";

import { useState, useEffect } from "react";
import { Eye, Ban, CheckCircle2, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId: string, action: string) => {
    const msg = action === "suspend" ? "Suspend this user?" : "Activate this user?";
    if (!confirm(msg)) return;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countByRole = (role: string) => role === "all" ? users.length : users.filter((u) => u.role === role).length;

  const stats = [
    { label: "Total Users", value: countByRole("all") },
    { label: "Customers", value: countByRole("CUSTOMER") },
    { label: "Vendors", value: countByRole("VENDOR") },
    { label: "Admins", value: countByRole("ADMIN") },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Users</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="VENDOR">Vendor</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">User</div>
          <div>Role</div>
          <div>Joined</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {filtered.map((user: any) => (
            <div key={user.id} className="px-5 py-4 md:grid md:grid-cols-6 md:gap-4 md:items-center space-y-2 md:space-y-0">
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
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.role === "ADMIN" ? "bg-red-50 text-red-700"
                    : user.role === "VENDOR" ? "bg-blue-50 text-blue-700"
                    : "bg-stone-100 text-stone-600"
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="text-sm text-stone-600">
                {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                }`}>
                  {user.isActive !== false ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                {user.isActive !== false ? (
                  <button
                    onClick={() => handleAction(user.id, "suspend")}
                    className="p-1.5 text-stone-400 hover:text-red-600"
                    title="Suspend"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(user.id, "activate")}
                    className="p-1.5 text-stone-400 hover:text-emerald-600"
                    title="Activate"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-400">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}
