"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Package, Palette, AlertCircle, Info } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  order: Package,
  commission: Palette,
  alert: AlertCircle,
  info: Info,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.notifications || []);
        setUnreadCount(d.unreadCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", id }),
    });
    fetchNotifications();
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-all-read" }),
    });
    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-stone-500 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 border border-amber-200 rounded-md hover:bg-amber-50"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif: any) => {
            const Icon = TYPE_ICONS[notif.type] || Info;
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  notif.read
                    ? "bg-white border-stone-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-full ${
                  notif.read ? "bg-stone-100 text-stone-500" : "bg-amber-100 text-amber-700"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${notif.read ? "text-stone-700" : "text-stone-900"}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 text-stone-400 hover:text-amber-600"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <Bell className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-stone-700">No notifications</p>
          <p className="mt-1 text-sm text-stone-500">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
