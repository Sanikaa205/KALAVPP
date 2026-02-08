"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-stone-600 mb-8">Have a question or need help? Reach out to us and we&apos;ll get back to you as soon as possible.</p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><Mail className="h-4 w-4 text-amber-700" /></div>
              <div><p className="text-sm font-medium text-stone-900">Email</p><p className="text-sm text-stone-600">support@kalavpp.com</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><Phone className="h-4 w-4 text-amber-700" /></div>
              <div><p className="text-sm font-medium text-stone-900">Phone</p><p className="text-sm text-stone-600">+91 98765 43210</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><MapPin className="h-4 w-4 text-amber-700" /></div>
              <div><p className="text-sm font-medium text-stone-900">Address</p><p className="text-sm text-stone-600">Art District, Creative Hub<br/>Mumbai, Maharashtra 400001</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-stone-900">Message Sent!</p>
              <p className="text-sm text-stone-500 mt-1">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input required className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input required type="email" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Subject</label>
                <input required className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
