import { pageList } from "@/lib/pages";

type Props = {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
};

export default function Pagination({ page, limit, total, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-gray-600">Showing {from}–{to} of {total}</p>
      <div className="flex flex-wrap items-center gap-1">
        <button className="btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              aria-current={p === page ? "page" : undefined}
              className={p === page ? "btn-primary" : "btn"}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button className="btn" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </nav>
  );
}
