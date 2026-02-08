import { Newspaper, Mail } from "lucide-react";

export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Press & Media</h1>
      <p className="text-lg text-stone-600 mb-8">Latest news and media resources about KALAVPP.</p>

      <div className="bg-white rounded-lg border border-stone-200 p-8 text-center mb-8">
        <Newspaper className="h-12 w-12 text-stone-300 mx-auto mb-4" />
        <p className="text-lg font-semibold text-stone-700">Press Kit Coming Soon</p>
        <p className="text-sm text-stone-500 mt-2">We&apos;re preparing our media resources. Check back soon for brand assets, press releases, and media coverage.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="font-semibold text-stone-900 flex items-center gap-2"><Mail className="h-4 w-4" /> Media Inquiries</h2>
        <p className="text-sm text-stone-600 mt-2">For press and media inquiries, please contact <span className="font-medium text-amber-700">press@kalavpp.com</span></p>
      </div>
    </div>
  );
}
