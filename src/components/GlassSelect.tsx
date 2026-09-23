"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  placeholder?: string;
};

// Apple-style dropdown (same look as the backtester): frosted list, ✓ on the chosen option, bottom sheet on phones.
export default function GlassSelect({ value, options, onChange, placeholder = "Choose…", ...aria }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    // Focus the chosen option so arrow keys start from it.
    const sel = list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]') ?? list.current?.querySelector("button");
    sel?.focus({ preventScroll: true });
    sel?.scrollIntoView({ block: "nearest" });
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function onListKey(e: React.KeyboardEvent) {
    const items = [...(list.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => items[Math.max(0, Math.min(items.length - 1, n))]?.focus();
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
    else if (e.key === "Escape" || e.key === "Tab") return close();
    else return;
    e.preventDefault();
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        className="input glass-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        {...aria}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={`truncate ${current ? "" : "text-muted"}`}>{current?.label ?? placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul ref={list} role="listbox" aria-label={aria["aria-label"]} className="glass-pop glass-list" onKeyDown={onListKey}>
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className="glass-option"
                onClick={() => {
                  if (o.value !== value) onChange(o.value);
                  close();
                }}
              >
                <span className="check" aria-hidden="true">{o.value === value ? "✓" : ""}</span>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
