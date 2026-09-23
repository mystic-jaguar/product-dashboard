"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/token";

export default function Header() {
  const router = useRouter();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/products" className="font-semibold">Product Admin</Link>
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
    </header>
  );
}
