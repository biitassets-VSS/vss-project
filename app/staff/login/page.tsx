"use client";

import { useState, Suspense }           from "react";
import { useRouter, useSearchParams }   from "next/navigation";
import { createClientComponentClient }  from "@supabase/auth-helpers-nextjs";
import { BRAND }                        from "@/lib/constants";

function LoginForm() {
  const supabase      = createClientComponentClient();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const isDeactivated = searchParams.get("reason") === "deactivated";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email, password,
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles").select("role, active")
      .eq("id", data.user.id).single();

    if (!profile?.active) {
      await supabase.auth.signOut();
      setError("Your account has been deactivated. Contact your administrator.");
      setLoading(false);
      return;
    }

    router.push(profile?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white
                    to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md
                      p-8 space-y-6 border border-gray-100 animate-in">

        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br
                          from-blue-600 to-blue-700 mx-auto flex
                          items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">VSS</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{BRAND.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{BRAND.tagline}</p>
          </div>
        </div>

        {/* Deactivated Warning */}
        {isDeactivated && (
          <div className="bg-red-50 border border-red-200 rounded-xl
                          p-4 flex gap-2 text-sm text-red-700">
            <span className="flex-shrink-0 text-lg">🚫</span>
            <span>
              Your account has been deactivated.
              Please contact your administrator.
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
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm p-3 rounded-xl flex gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2"
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
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-gray-400 flex gap-2 items-center">
          <span className="text-2xl" style={{ animation: "spin 1s linear infinite" }}>⏳</span> Loading login...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
