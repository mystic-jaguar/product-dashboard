// Turns URL search params into a safe list query, and back.
// Bad values (?page=abc, ?limit=7, ?sortBy=foo) fall back to defaults instead of breaking the page.

export const PAGE_SIZES = [10, 20, 50] as const;
export const SORT_FIELDS = ["price", "rating", "title"] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type ListQuery = {
  page: number;
  limit: number;
  q: string;
  category: string;
  sortBy: SortField | "";
  order: "asc" | "desc";
  delay: number; // pass-through for testing slow responses (?delay=2000)
};

type Params = { get(name: string): string | null };

function toInt(value: string | null, fallback: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : fallback;
}

export function parseQuery(params: Params): ListQuery {
  const limit = toInt(params.get("limit"), 10);
  const sortBy = params.get("sortBy") ?? "";
  const q = (params.get("q") ?? "").trim();
  return {
    page: Math.max(1, toInt(params.get("page"), 1)),
    limit: (PAGE_SIZES as readonly number[]).includes(limit) ? limit : 10,
    q,
    // Search and category cannot be combined in the API; search wins if both are in the URL.
    category: q ? "" : (params.get("category") ?? "").trim(),
    sortBy: (SORT_FIELDS as readonly string[]).includes(sortBy) ? (sortBy as SortField) : "",
    order: params.get("order") === "desc" ? "desc" : "asc",
    delay: Math.min(toInt(params.get("delay"), 0), 5000),
  };
}

// Only non-default values go into the URL, so links stay short.
export function toSearch(query: ListQuery) {
  const p = new URLSearchParams();
  if (query.page > 1) p.set("page", String(query.page));
  if (query.limit !== 10) p.set("limit", String(query.limit));
  if (query.q) p.set("q", query.q);
  if (query.category) p.set("category", query.category);
  if (query.sortBy) {
    p.set("sortBy", query.sortBy);
    p.set("order", query.order);
  }
  if (query.delay) p.set("delay", String(query.delay));
  const s = p.toString();
  return s ? `?${s}` : "";
}
