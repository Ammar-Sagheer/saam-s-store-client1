"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import Image from "next/image";
import { siteConfig } from "@/app/_lib/siteConfig";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Hard navigation guarantees the new session cookie is sent and the
    // admin layout re-renders on the server with the session present.
    window.location.assign("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.fullName}
            width={120}
            height={40}
            style={{ width: "auto" }}
            priority
          />
          <h1 className="text-xl font-bold text-dark">Admin Panel</h1>
          <p className="text-text-light text-sm">
            Sign in to manage your store
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border border-gray-medium px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-primary hover:bg-primary-hover text-white font-medium py-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
