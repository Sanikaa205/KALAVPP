"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production, this would call an API to send a reset email
    // For now, simulate the flow
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>

        {submitted ? (
          <div className="bg-white rounded-lg border border-stone-200 p-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-stone-900">Check your email</h1>
            <p className="text-sm text-stone-600 mt-2">
              If an account with <span className="font-medium">{email}</span> exists,
              we&apos;ve sent a password reset link to your inbox.
            </p>
            <Link href="/login" className="mt-6 inline-block px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 p-8">
            <h1 className="text-xl font-bold text-stone-900 mb-2">Reset your password</h1>
            <p className="text-sm text-stone-600 mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
