"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Palette,
  FileText,
  MessageSquare,
  Store,
  Download,
  Brush,
  Star,
  Bell,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import type { UserRole } from "@/types";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const adminLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Vendors", href: "/admin/vendors", icon: Store },
  { name: "Categories", href: "/admin/categories", icon: Palette },
  { name: "Commissions", href: "/admin/commissions", icon: Brush },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const vendorLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { name: "Products", href: "/vendor/products", icon: Package },
  { name: "Services", href: "/vendor/services", icon: Brush },
  { name: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { name: "Commissions", href: "/vendor/commissions", icon: MessageSquare },
  { name: "Reviews", href: "/vendor/reviews", icon: Star },
  { name: "Settings", href: "/vendor/settings", icon: Settings },
];

const customerLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Downloads", href: "/dashboard/downloads", icon: Download },
  { name: "Commissions", href: "/dashboard/commissions", icon: Brush },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Star },
  { name: "Addresses", href: "/dashboard/addresses", icon: FileText },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  role: UserRole;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function DashboardSidebar({
  role,
  collapsed = false,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "VENDOR"
        ? vendorLinks
        : customerLinks;

  const title =
    role === "ADMIN"
      ? "Admin Panel"
      : role === "VENDOR"
        ? "Creator Studio"
        : "My Account";

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-stone-200 h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-stone-200">
        {!collapsed && (
          <Link href="/" className="text-lg font-bold text-stone-900 tracking-tight">
            Kala<span className="text-amber-700">vpp</span>
          </Link>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Role label */}
      {!collapsed && (
        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== `/${role.toLowerCase() === "customer" ? "dashboard" : role.toLowerCase()}` &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-700",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.name : undefined}
            >
              <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-stone-200 p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4.5 w-4.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
