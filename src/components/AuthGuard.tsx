"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";
import { ListSkeleton } from "./Skeleton";

const noSubscribe = () => () => {};

// ponytail: client-side guard because the token lives in localStorage; use a cookie + proxy if server-side auth is needed.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // undefined on the server, then the real token (or null) in the browser.
  const token = useSyncExternalStore(noSubscribe, getToken, () => undefined);

  useEffect(() => {
    if (token === null) router.replace("/login");
  }, [token, router]);

  return token ? children : <ListSkeleton />;
}
