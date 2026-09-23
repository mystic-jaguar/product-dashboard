"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { ListQuery } from "@/lib/query";
import { getProducts, type ProductList } from "@/services/products";

type Result = { key: string; data: ProductList | null; error: string };

// Loads one page of products for the given query.
// Every new query aborts the previous request, and a request counter makes sure
// only the latest response is ever stored, so slow old searches can never
// replace newer results.
export function useProducts(query: ListQuery) {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<Result>({ key: "", data: null, error: "" });
  const latest = useRef(0);

  const { page, limit, q, category, sortBy, order, delay } = query;
  const key = JSON.stringify([page, limit, q, category, sortBy, order, delay, reloadKey]);

  useEffect(() => {
    const id = ++latest.current;
    const controller = new AbortController();

    getProducts({ page, limit, q, category, sortBy, order, delay }, controller.signal)
      .then((data) => {
        if (id === latest.current) setResult({ key, data, error: "" });
      })
      .catch((err) => {
        if (axios.isCancel(err) || id !== latest.current) return;
        // Keep the old data so the page doesn't go blank behind the error.
        setResult((r) => ({ key, data: r.data, error: (err as Error).message }));
      });

    return () => controller.abort();
  }, [key, page, limit, q, category, sortBy, order, delay]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  // Loading = the stored result is for an older query than the one on screen.
  const loading = result.key !== key;
  return { data: result.data, loading, error: loading ? "" : result.error, retry };
}
