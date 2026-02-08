import { Package, Clock, MapPin, Shield } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">Shipping Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Package className="h-8 w-8 text-amber-600 mb-3" />
          <h2 className="text-lg font-semibold text-stone-900 mb-2">Free Shipping</h2>
          <p className="text-sm text-stone-600">Orders above ₹2,000 qualify for free standard shipping across India.</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Clock className="h-8 w-8 text-amber-600 mb-3" />
          <h2 className="text-lg font-semibold text-stone-900 mb-2">Delivery Time</h2>
          <p className="text-sm text-stone-600">Standard delivery takes 5-7 business days. Express delivery is available for select locations (2-3 days).</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <MapPin className="h-8 w-8 text-amber-600 mb-3" />
          <h2 className="text-lg font-semibold text-stone-900 mb-2">Delivery Areas</h2>
          <p className="text-sm text-stone-600">We deliver across India. International shipping is available for select products — contact us for details.</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Shield className="h-8 w-8 text-amber-600 mb-3" />
          <h2 className="text-lg font-semibold text-stone-900 mb-2">Secure Packaging</h2>
          <p className="text-sm text-stone-600">All artwork is carefully packaged with protective materials to ensure it arrives in perfect condition.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Shipping Rates</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              <th className="text-left py-2 font-medium text-stone-600">Order Value</th>
              <th className="text-left py-2 font-medium text-stone-600">Standard (5-7 days)</th>
              <th className="text-left py-2 font-medium text-stone-600">Express (2-3 days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            <tr><td className="py-3 text-stone-900">Below ₹2,000</td><td className="py-3 text-stone-600">₹200</td><td className="py-3 text-stone-600">₹400</td></tr>
            <tr><td className="py-3 text-stone-900">₹2,000 - ₹5,000</td><td className="py-3 text-emerald-600 font-medium">Free</td><td className="py-3 text-stone-600">₹300</td></tr>
            <tr><td className="py-3 text-stone-900">Above ₹5,000</td><td className="py-3 text-emerald-600 font-medium">Free</td><td className="py-3 text-emerald-600 font-medium">Free</td></tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-stone-500">
        <p>Digital products are delivered instantly via download link after purchase. No shipping required.</p>
      </div>
    </div>
  );
}
