import type { Category } from "@/services/products";
import { PAGE_SIZES, type ListQuery } from "@/lib/query";

type Props = {
  query: ListQuery;
  categories: Category[];
  onChange: (patch: Partial<ListQuery>) => void;
};

const SORTS = [
  ["", "Default order"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating-desc", "Rating: high to low"],
  ["rating-asc", "Rating: low to high"],
  ["title-asc", "Title: A–Z"],
  ["title-desc", "Title: Z–A"],
] as const;

export default function Filters({ query, categories, onChange }: Props) {
  const sortValue = query.sortBy ? `${query.sortBy}-${query.order}` : "";

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <select
        className="input"
        aria-label="Category"
        value={query.category}
        // Picking a category clears the search (the API can't do both at once).
        onChange={(e) => onChange({ category: e.target.value, q: "" })}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        className="input"
        aria-label="Sort"
        value={sortValue}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split("-") as [ListQuery["sortBy"], ListQuery["order"]];
          onChange({ sortBy: sortBy || "", order: order ?? "asc" });
        }}
      >
        {SORTS.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className="input"
        aria-label="Page size"
        value={query.limit}
        onChange={(e) => onChange({ limit: Number(e.target.value) })}
      >
        {PAGE_SIZES.map((n) => (
          <option key={n} value={n}>{n} per page</option>
        ))}
      </select>
    </div>
  );
}
