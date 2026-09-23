"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { getToken, setToken } from "@/lib/token";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // A ref changes instantly, so a fast second click is blocked before React re-renders.
  const busy = useRef(false);

  useEffect(() => {
    if (getToken()) router.replace("/products");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const user = await login(username.trim(), password);
      setToken(user.accessToken);
      router.replace("/products");
    } catch (err) {
      setError((err as Error).message);
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="relative flex flex-1 items-center justify-center p-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-7">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
          <p className="text-sm text-fg-2">Sign in to manage your products.</p>
        </div>
        <label className="block text-sm font-medium">
          Username
          <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <span className="relative mt-1 block">
            <input className="input pr-11" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            <button
              type="button"
              className="eye-toggle absolute inset-y-0 right-0 grid w-11 cursor-pointer place-items-center rounded-r-[10px] text-muted outline-none transition-colors hover:text-fg focus-visible:text-accent"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((s) => !s)}
            >
              {/* Eye blinks, then the slash draws in (hidden) or out (visible). */}
              <svg key={String(showPassword)} className="eye-blink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
                <path className={`eye-slash ${showPassword ? "" : "on"}`} d="M4 4l16 16" pathLength="1" />
              </svg>
            </button>
          </span>
        </label>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="text-center text-xs text-muted">Demo: emilys / emilyspass</p>
      </form>
    </main>
  );
}
