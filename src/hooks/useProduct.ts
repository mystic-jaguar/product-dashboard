"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getProduct, type Product } from "@/services/products";

type State = { key: string; product: Product | null; error: string; notFound: boolean };

// Loads one product by the raw id from the URL. Anything that isn't a positive whole number is "not found".
export function useProduct(rawId: string) {
  const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN;
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<State>({ key: "", product: null, error: "", notFound: false });
  const key = `${id}-${reloadKey}`;

  useEffect(() => {
    if (Number.isNaN(id)) return;
    let active = true;
    getProduct(id)
      .then((product) => active && setState({ key, product, error: "", notFound: false }))
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setState({ key, product: null, error: (err as Error).message, notFound });
      });
    return () => {
      active = false;
    };
  }, [id, key]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  if (Number.isNaN(id)) return { product: null, loading: false, error: "", notFound: true, retry };
  // Loading = the stored result belongs to a different id (or an older retry).
  const loading = state.key !== key;
  if (loading) return { product: null, loading, error: "", notFound: false, retry };
  return { product: state.product, loading, error: state.error, notFound: state.notFound, retry };
}
