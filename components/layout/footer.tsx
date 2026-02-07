import Link from "next/link";

const footerLinks = {
  shop: [
    { name: "Original Artworks", href: "/shop?category=original-artworks" },
    { name: "Prints & Reproductions", href: "/shop?category=prints-reproductions" },
    { name: "Digital Art", href: "/shop?category=digital-art" },
    { name: "Handcrafted Items", href: "/shop?category=handcrafted-items" },
    { name: "Art Merchandise", href: "/shop?category=art-merchandise" },
  ],
  services: [
    { name: "Custom Portraits", href: "/services?type=PORTRAIT" },
    { name: "Sculptures", href: "/services?type=SCULPTURE" },
    { name: "Murals", href: "/services?type=MURAL" },
    { name: "Brand Design", href: "/services?type=BRANDING" },
    { name: "Art Consultancy", href: "/services?type=CONSULTANCY" },
  ],
  company: [
    { name: "About Kalavpp", href: "/about" },
    { name: "Sell on Kalavpp", href: "/vendor/register" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact Us", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Newsletter */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Stay connected with the art world
              </h3>
              <p className="mt-1 text-sm text-stone-400">
                Get updates on new artworks, exclusive offers, and artist spotlights.
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-2.5 rounded-md bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600"
              />
              <button className="px-6 py-2.5 rounded-md bg-amber-700 text-white text-sm font-medium hover:bg-amber-600 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight">
              Kala<span className="text-amber-500">vpp</span>
            </span>
            <span className="text-xs text-stone-500">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>Celebrating Indian Art & Craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
