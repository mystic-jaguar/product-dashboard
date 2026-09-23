"use client";

import { useEffect, useState } from "react";

type Props = { value: string; onSearch: (q: string) => void; delay?: number };

// Keeps its own text while typing and only calls onSearch after the user stops for `delay` ms.
export default function SearchBox({ value, onSearch, delay = 400 }: Props) {
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // If the URL changes from outside (back button, picking a category), show that value.
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  useEffect(() => {
    if (text.trim() === value) return;
    const t = setTimeout(() => onSearch(text.trim()), delay);
    return () => clearTimeout(t);
  }, [text, value, delay, onSearch]);

  return (
    <input
      type="search"
      className="input"
      placeholder="Search products…"
      aria-label="Search products"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
