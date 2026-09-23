"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/token";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 px-4 pt-4">
      <div className="card mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/products" className="flex items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
          </span>
          Product Admin
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
          className="btn"
          onClick={() => {
            clearToken();
            router.replace("/login");
          }}
        >
          Log out
          </button>
        </div>
      </div>
    </header>
  );
}
