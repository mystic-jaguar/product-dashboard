"use client";

import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/services/products";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Categories are optional UI; if they fail the list still works without the filter.
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return categories;
}
