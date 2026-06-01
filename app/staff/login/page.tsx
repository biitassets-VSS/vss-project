"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { BRAND } from "@/lib/constants";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDeactivated = searchParams.get("reason") === "deactivated";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }, []);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!supabase) {
      setError(
        "Supabase environment variables are missing. Please check your .env.local file and restart the dev server."
      );
      return;
    }

    try {
      setLoading(true);

      const { data: authData, error: authErr } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authErr) {
        setError(authErr.message);
        return;
      }

      if (!authData.user) {
        setError("Login failed. User data not returned.");
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role, active")
        .eq("id", authData.user.id)
        .single();

      if (profileErr) {
        setError(profileErr.message);
        await supabase.auth.signOut();
        return;
      }

      if (!profile) {
        setError("Profile not found. Please contact your administrator.");
        await supabase.auth.signOut();
        return;
      }

      if (!profile.active) {
        await supabase.auth.signOut();
        setError("Your account has been deactivated. Contact your administrator.");
        return;
      }

      router.replace(
        profile.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 space-y-4 border border-red-100">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 mx-auto flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-4">
              Supabase Configuration Error
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Please check your <code>.env.local</code> file.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Required variables:</p>
            <pre className="whitespace-pre-wrap break-all text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </div>

          <p className="text-xs text-gray-400 text-center">
            After creating/updating <code>.env.local</code>, restart the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 space-y-6 border border-gray-100 animate-in">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 mx-auto flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">VSS</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{BRAND.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{BRAND.tagline}</p>
          </div>
        </div>

        {/* Deactivated Warning */}
        {isDeactivated && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 text-sm text-red-700">
            <span className="flex-shrink-0 text-lg">🚫</span>
            <span>
              Your account has been deactivated. Please contact your administrator.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="input"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          {BRAND.copyright}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
          <div className="text-gray-400 flex gap-2 items-center">
            <span
              className="text-2xl"
              style={{ animation: "spin 1s linear infinite" }}
            >
              ⏳
            </span>
            Loading login...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
