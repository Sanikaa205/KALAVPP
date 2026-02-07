"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Demo login: check against mock users
      const validEmails = [
        "admin@kalavpp.com",
        "priya@kalavpp.com",
        "arjun@kalavpp.com",
        "kavya@kalavpp.com",
        "customer@kalavpp.com",
      ];

      if (!validEmails.includes(email)) {
        setError("No account found with this email. Try: admin@kalavpp.com");
        setLoading(false);
        return;
      }

      if (password !== "Kalavpp@123") {
        setError("Invalid password. Demo password: Kalavpp@123");
        setLoading(false);
        return;
      }

      // Route based on role
      if (email === "admin@kalavpp.com") {
        router.push("/admin");
      } else if (
        email === "priya@kalavpp.com" ||
        email === "arjun@kalavpp.com" ||
        email === "kavya@kalavpp.com"
      ) {
        router.push("/vendor");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-stone-900 tracking-tight"
          >
            Kala<span className="text-amber-700">vpp</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-stone-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-6">
          {/* Demo credentials notice */}
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800 font-medium">Demo Credentials</p>
            <p className="text-xs text-amber-700 mt-1">
              Admin: admin@kalavpp.com | Vendor: priya@kalavpp.com | Customer: customer@kalavpp.com
            </p>
            <p className="text-xs text-amber-700">
              Password for all: Kalavpp@123
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-700 hover:text-amber-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="text-amber-700 hover:text-amber-800 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
