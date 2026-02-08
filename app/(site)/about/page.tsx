export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">About KALAVPP</h1>

      <div className="prose prose-stone max-w-none">
        <p className="text-lg text-stone-600 leading-relaxed mb-8">
          KALAVPP is a premier ArtCommerce &amp; Creative Services Platform that bridges the gap between
          talented artists, artisans, and art enthusiasts. We provide a unified marketplace where creativity
          meets commerce, enabling vendors to showcase and sell their artwork while offering bespoke creative services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-3">E-Commerce Vertical</h2>
            <p className="text-sm text-stone-600">
              Browse and purchase original artworks, digital pieces, prints, and handcrafted merchandise
              from verified artists. Each product is authenticated and quality-assured.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Creative Services</h2>
            <p className="text-sm text-stone-600">
              Commission custom artwork, from portraits and sculptures to murals, calligraphy, branding,
              book covers, and exhibition curation — all managed through our platform.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-stone-900 mb-4">Our Mission</h2>
        <p className="text-stone-600 mb-6">
          We believe every artist deserves a platform to showcase their talent and connect with the world.
          KALAVPP empowers creators with tools to manage their portfolio, fulfill orders, and grow their
          creative business — all in one place.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 mb-4">For Artists &amp; Vendors</h2>
        <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
          <li>Dedicated storefront with customizable profile</li>
          <li>Product and service listing management</li>
          <li>Commission workflow tracking</li>
          <li>Order management and analytics</li>
          <li>Secure payment processing</li>
        </ul>

        <h2 className="text-xl font-semibold text-stone-900 mb-4">For Customers</h2>
        <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-6">
          <li>Curated collection of original and digital artwork</li>
          <li>Direct commission requests to artists</li>
          <li>Secure checkout with multiple payment options</li>
          <li>Order tracking and digital downloads</li>
          <li>Wishlist and personalized recommendations</li>
        </ul>
      </div>
    </div>
  );
}
