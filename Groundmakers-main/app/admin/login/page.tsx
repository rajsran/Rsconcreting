"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh(); // reload the admin layout so the navigation bar appears
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-sm shadow-card border border-cream-200 p-8 md:p-10 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Site logo" width={1144} height={675} className="h-20 w-auto object-contain" priority />
        </div>

        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 text-center mb-2">Admin</p>
        <h1 className="font-bold tracking-tight text-2xl text-ink-900 text-center mb-1">
          Welcome <span className="text-violet-600">back.</span>
        </h1>
        <p className="text-sm text-ink-500 text-center mb-7">Log in to manage your website.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 border border-cream-300 rounded-md text-base text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
