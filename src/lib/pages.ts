// Page numbers to show, with "…" for gaps: 1 … 4 5 6 … 20
export function pageList(current: number, totalPages: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return pages;
}
