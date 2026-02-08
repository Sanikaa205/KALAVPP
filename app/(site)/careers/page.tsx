import { Briefcase, Heart, Zap, Globe } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Careers at KALAVPP</h1>
      <p className="text-lg text-stone-600 mb-8">Join our mission to empower artists and art enthusiasts worldwide.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Heart className="h-6 w-6 text-amber-600 mb-3" />
          <h3 className="font-semibold text-stone-900">Creative Culture</h3>
          <p className="text-sm text-stone-600 mt-1">Work alongside people who are passionate about art and technology.</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Zap className="h-6 w-6 text-amber-600 mb-3" />
          <h3 className="font-semibold text-stone-900">Innovation First</h3>
          <p className="text-sm text-stone-600 mt-1">Build cutting-edge solutions at the intersection of art and commerce.</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Globe className="h-6 w-6 text-amber-600 mb-3" />
          <h3 className="font-semibold text-stone-900">Remote Friendly</h3>
          <p className="text-sm text-stone-600 mt-1">Work from anywhere. We believe in flexibility and trust.</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-6">
          <Briefcase className="h-6 w-6 text-amber-600 mb-3" />
          <h3 className="font-semibold text-stone-900">Growth Path</h3>
          <p className="text-sm text-stone-600 mt-1">Clear career progression with mentorship and learning opportunities.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
        <p className="text-lg font-semibold text-stone-900">No open positions right now</p>
        <p className="text-sm text-stone-600 mt-2">But we&apos;re always looking for exceptional talent. Send your resume to <span className="font-medium text-amber-700">careers@kalavpp.com</span></p>
      </div>
    </div>
  );
}
