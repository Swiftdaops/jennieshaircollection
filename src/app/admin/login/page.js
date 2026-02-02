"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers";

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, push to admin dashboard automatically
  useEffect(() => {
    if (!loading && user?.role === "admin") {
      router.push("/admin");
    }
  }, [user, loading, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) return setError("Please provide email and password.");
    
    setSubmitting(true);
    try {
      // The login function in AuthProvider calls fetchMe() internally
      await login({ email, password });
      
      // Successfully logged in; the useEffect above will handle redirection,
      // but we call it here as well for immediate feedback.
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#e6b7af" }} // Your custom --color-nude
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Jennie's Hairs</h1>
          <p className="text-stone-500 mt-2">Admin Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Admin Email
            </label>
            <input
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@jennieshairs.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-stone-400 uppercase tracking-widest">
          Secure Access Only
        </p>
      </div>
    </div>
  );
}
