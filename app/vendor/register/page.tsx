"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Palette, ArrowLeft, CheckCircle } from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Account info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Store info
  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);

  const SPEC_OPTIONS = [
    "Painting", "Sculpture", "Photography", "Digital Art", "Illustration",
    "Calligraphy", "Pottery", "Textile Art", "Jewelry", "Woodwork",
    "Printmaking", "Mixed Media",
  ];

  const toggleSpec = (s: string) => {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role: "VENDOR",
          storeName: storeName || name + "'s Studio",
          bio,
          specializations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created but sign in failed. Please login manually.");
        setLoading(false);
        return;
      }

      router.push("/vendor");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-lg border border-stone-200 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-amber-700" />
            </div>
            <h1 className="text-xl font-bold text-stone-900">Become a Vendor</h1>
            <p className="text-sm text-stone-500 mt-1">
              Join KALAVPP and start selling your art &amp; services
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-amber-600" : "bg-stone-200"}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-amber-600" : "bg-stone-200"}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-stone-700">Step 1: Account Information</h2>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Password *</label>
                  <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!name || !email || !password) { setError("Please fill in all required fields"); return; }
                    setError("");
                    setStep(2);
                  }}
                  className="w-full py-2.5 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-stone-700">Step 2: Store Information</h2>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
                  <input value={storeName} onChange={(e) => setStoreName(e.target.value)}
                    placeholder={name ? `${name}'s Studio` : "My Art Studio"}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">About You</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                    placeholder="Tell customers about yourself and your art..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {SPEC_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpec(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          specializations.includes(s)
                            ? "bg-amber-600 text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 border border-stone-300 text-stone-700 text-sm font-medium rounded-md hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Vendor Account"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-xs text-stone-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-700 hover:text-amber-800 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
