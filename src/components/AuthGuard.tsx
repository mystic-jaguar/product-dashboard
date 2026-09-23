"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";
import Loader from "./Loader";

// ponytail: client-side guard because the token lives in localStorage; use a cookie + proxy if server-side auth is needed.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (getToken()) setOk(true);
    else router.replace("/login");
  }, [router]);

  return ok ? children : <Loader />;
}
