"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";

const navigation = [
  { name: "Shop", href: "/shop" },
  { name: "Services", href: "/services" },
  { name: "Artists", href: "/artists" },
  { name: "About", href: "/about" },
];

const vendorNavigation = [
  { name: "Dashboard", href: "/vendor" },
  { name: "About", href: "/about" },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ name: string; href: string }[]>([]);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();

  // Fetch categories from DB
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const cats = (data.categories || []).map((c: { name: string; slug: string }) => ({
          name: c.name,
          href: `/shop?category=${c.slug}`,
        }));
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const userRole = (session?.user as { role?: string })?.role;
  const accountHref = session?.user
    ? userRole === "ADMIN" ? "/admin"
    : userRole === "VENDOR" ? "/vendor"
    : "/account"
    : "/login";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isVendor = userRole === "VENDOR";
  const isAdmin = userRole === "ADMIN";
  const isCustomerOrGuest = !isVendor && !isAdmin;
  const activeNavigation = isVendor ? vendorNavigation : isAdmin ? adminNavigation : navigation;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      {/* Top bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="tracking-wide">Free shipping on orders above Rs. 2,000</p>
          <div className="hidden sm:flex items-center gap-4">
            {isCustomerOrGuest && (
              <Link href="/vendor/register" className="hover:text-white transition-colors">
                Sell on Kalavpp
              </Link>
            )}
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-stone-900">
              Kala<span className="text-amber-700">vpp</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {activeNavigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.name === "Shop" && setCategoryOpen(true)
                }
                onMouseLeave={() =>
                  item.name === "Shop" && setCategoryOpen(false)
                }
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors flex items-center gap-1",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  )}
                >
                  {item.name}
                  {item.name === "Shop" && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </Link>

                {/* Category dropdown for Shop */}
                {item.name === "Shop" && categoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="block px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isCustomerOrGuest && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {isCustomerOrGuest && (
              <Link
                href="/account/wishlist"
                className="hidden sm:block p-2 text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {isCustomerOrGuest && (
              <Link
                href="/cart"
                className="relative p-2 text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 flex items-center justify-center rounded-full bg-amber-700 text-white text-[10px] font-bold min-w-[18px] h-[18px]">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {session?.user ? (
              <Link
                href={accountHref}
                className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex px-4 py-1.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks, artists, services..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {activeNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-stone-100 text-stone-900"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                {item.name}
              </Link>
            ))}
            {isCustomerOrGuest && (
              <div className="pt-2 border-t border-stone-200">
                <p className="px-3 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-stone-600 hover:text-stone-900"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            {isCustomerOrGuest && (
              <div className="pt-2 border-t border-stone-200">
                <Link
                  href="/vendor/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-50"
                >
                  Sell on Kalavpp
                </Link>
              </div>
            )}
            {!session?.user && (
              <div className="pt-2 border-t border-stone-200 flex flex-col gap-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-center rounded-md text-sm font-medium text-stone-700 border border-stone-300 hover:bg-stone-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-center rounded-md text-sm font-medium text-white bg-stone-900 hover:bg-stone-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
