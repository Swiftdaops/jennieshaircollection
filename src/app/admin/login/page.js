"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers";

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please provide email and password.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setSubmitting(true);
    try {
      console.debug("AdminLogin: submitting", { email });
      await login({ email, password });
      console.debug("AdminLogin: login succeeded, waiting for /api/auth/me to be available");

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      async function waitForMe(attempts = 8, interval = 250) {
        for (let i = 0; i < attempts; i++) {
          try {
            const res = await fetch(`${apiBase}/api/auth/me`, { credentials: "include" });
            if (res.ok) {
              const data = await res.json().catch(() => null);
              if (data) return data;
            }
          } catch (err) {
            // ignore and retry
          }
          await new Promise((r) => setTimeout(r, interval));
        }
        return null;
      }

      const me = await waitForMe(12, 250);
      console.debug("AdminLogin: /api/auth/me result", me);
      router.push("/admin");
    } catch (err) {
      console.debug("AdminLogin: login error", err);
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            className="mt-1 block w-full rounded border px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 block w-full rounded border px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button
          className="w-full bg-foreground text-background py-2 rounded disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
