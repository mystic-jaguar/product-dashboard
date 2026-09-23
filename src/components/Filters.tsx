import type { Category } from "@/services/products";
import { PAGE_SIZES, type ListQuery } from "@/lib/query";
import GlassSelect from "./GlassSelect";

type Props = {
  query: ListQuery;
  categories: Category[];
  onChange: (patch: Partial<ListQuery>) => void;
};

const SORTS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "title-asc", label: "Title: A–Z" },
  { value: "title-desc", label: "Title: Z–A" },
];

const SIZES = PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} per page` }));

export default function Filters({ query, categories, onChange }: Props) {
  const sortValue = query.sortBy ? `${query.sortBy}-${query.order}` : "";

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <GlassSelect
        aria-label="Category"
        value={query.category}
        options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
        // Picking a category clears the search (the API can't do both at once).
        onChange={(category) => onChange({ category, q: "" })}
      />

      <GlassSelect
        aria-label="Sort"
        value={sortValue}
        options={SORTS}
        onChange={(v) => {
          const [sortBy, order] = v.split("-") as [ListQuery["sortBy"], ListQuery["order"]];
          onChange({ sortBy: sortBy || "", order: order ?? "asc" });
        }}
      />

      <GlassSelect
        aria-label="Page size"
        value={String(query.limit)}
        options={SIZES}
        onChange={(v) => onChange({ limit: Number(v) })}
      />
    </div>
  );
}
