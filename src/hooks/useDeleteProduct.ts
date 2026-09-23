"use client";

import { useRef, useState } from "react";
import { deleteProduct, type Product } from "@/services/products";

// State for "ask first, then delete". The ref blocks double clicks on Confirm.
export function useDeleteProduct(onDeleted: (p: Product) => void) {
  const [target, setTarget] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const running = useRef(false);

  async function confirm() {
    if (!target || running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    try {
      await deleteProduct(target.id);
      onDeleted(target);
      setTarget(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return {
    target,
    busy,
    error,
    ask: (p: Product) => {
      setError("");
      setTarget(p);
    },
    cancel: () => setTarget(null),
    confirm,
  };
}
