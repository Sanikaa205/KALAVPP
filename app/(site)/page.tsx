import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  Truck,
  Shield,
  Palette,
  Download,
  Star,
} from "lucide-react";

// Force dynamic rendering - homepage fetches from DB
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalavpp - Premium ArtCommerce Platform",
  description:
    "Discover, buy, and commission original artworks, handcrafted items, digital art, and creative services from talented Indian artists and creators.",
};

const features = [
  {
    icon: Palette,
    title: "Curated Collection",
    description: "Every piece is handpicked for quality and authenticity",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Protected payments with buyer guarantee",
  },
  {
    icon: Truck,
    title: "Careful Shipping",
    description: "Art-safe packaging with insured delivery",
  },
  {
    icon: Download,
    title: "Instant Digital Access",
    description: "Download digital art instantly after purchase",
  },
];

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({ where: { featured: true, status: "ACTIVE" }, include: { category: true, vendor: { include: { user: { select: { name: true } } } } }, take: 8 });
  const allProducts = await prisma.product.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, include: { category: true, vendor: { include: { user: { select: { name: true } } } } }, take: 8 });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  const vendors = await prisma.vendorProfile.findMany({ where: { status: "APPROVED" }, include: { user: { select: { name: true, avatar: true } } }, take: 3 });
  const services = await prisma.service.findMany({ where: { isActive: true }, include: { vendor: true }, take: 6 });

  return (
    <div>
      {/* ─── Hero Section ────────────────────────────────────── */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-4">
              India&apos;s Premier Art Marketplace
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Where Art Finds
              <br />
              Its True <span className="text-amber-400">Home</span>
            </h1>
            <p className="mt-6 text-lg text-stone-300 max-w-xl leading-relaxed">
              Discover original artworks, handcrafted treasures, and digital
              creations from India&apos;s finest artists. Commission bespoke pieces
              that tell your story.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-700 text-white rounded-md font-medium hover:bg-amber-600 transition-colors"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-stone-500 text-white rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Commission Art
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Bar ────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-stone-100">
                  <feature.icon className="h-5 w-5 text-stone-700" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Find exactly what speaks to you
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category: { id: string; slug: string; name: string; _count: { products: number } }) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-200"
            >
              <img
                src={`https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  {category._count?.products || 0} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ───────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Featured Artworks
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Handpicked pieces from our collection
              </p>
            </div>
            <Link
              href="/shop?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Artist Spotlight ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Featured Artists
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Meet the creators behind the art
            </p>
          </div>
          <Link
            href="/artists"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/artists/${vendor.storeSlug}`}
              className="group bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-lg font-bold text-stone-600">
                  {vendor.storeName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {vendor.storeName}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs text-stone-600">{vendor.rating}</span>
                    <span className="text-xs text-stone-400">
                      ({vendor.totalOrders} orders)
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-500 line-clamp-2">
                {vendor.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {vendor.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Creative Services ───────────────────────────────── */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Creative Services
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Commission custom art and creative work
              </p>
            </div>
            <Link
              href="/services"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-400 hover:text-white"
            >
              Explore services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-stone-800/50 border border-stone-700 rounded-lg p-6 hover:bg-stone-800 hover:border-stone-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    {service.type.replace("_", " ")}
                  </span>
                  {service.deliveryDays && (
                    <span className="text-xs text-stone-500">
                      {service.deliveryDays} days
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-stone-400 line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold text-white">
                    from {formatPrice(service.basePrice)}
                  </p>
                  {service.vendor && (
                    <span className="text-xs text-stone-500">
                      by {service.vendor.storeName}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Products ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Latest Additions
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Fresh artworks added to our collection
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            Shop all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Are you an artist or creator?
            </h2>
            <p className="mt-3 text-stone-600">
              Join Kalavpp and reach thousands of art enthusiasts. Sell your
              artworks, offer services, and grow your creative business with our
              platform.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vendor/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 transition-colors"
              >
                Start Selling
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-white transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
