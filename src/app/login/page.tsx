"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { getToken, setToken } from "@/lib/token";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="flex flex-1 items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Admin login</h1>
        <label className="block text-sm">
          Username
          <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label className="block text-sm">
          Password
          <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="text-xs text-gray-500">Demo: emilys / emilyspass</p>
      </form>
    </main>
  );
}
