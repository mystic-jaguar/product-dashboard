"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { parseQuery, toSearch, type ListQuery } from "@/lib/query";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import SearchBox from "@/components/SearchBox";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
import { ListSkeleton } from "@/components/Skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/StatusViews";

export default function ProductList() {
  const router = useRouter();
  const params = useSearchParams();
  // The URL is the single source of truth for page, search, filter and sort.
  const query = useMemo(() => parseQuery(params), [params]);
  const { data, loading, error, retry } = useProducts(query);
  const categories = useCategories();
  const del = useDeleteProduct(retry);

  // Any change except moving between pages goes back to page 1.
  const update = useCallback(
    (patch: Partial<ListQuery>) => {
      const next = { ...query, page: 1, ...patch };
      router.replace(`/products${toSearch(next)}`, { scroll: false });
    },
    [query, router]
  );

  const onSearch = useCallback((q: string) => update({ q, category: "" }), [update]);

  // ?page=999: once we know the real page count, jump to the last page.
  const totalPages = data ? Math.max(1, Math.ceil(data.total / query.limit)) : 1;
  useEffect(() => {
    if (data && !loading && query.page > totalPages) update({ page: totalPages });
  }, [data, loading, query.page, totalPages, update]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          {data && <p className="text-sm text-fg-2">{data.total} items in catalogue</p>}
        </div>
        <Link href="/products/new" className="btn-primary">Add product</Link>
      </div>

      <div className="card relative z-10 space-y-2 p-3">
        <SearchBox value={query.q} onSearch={onSearch} />
        <Filters query={query} categories={categories} onChange={update} />
      </div>
      {query.q && (
        <p className="text-xs text-muted">Searching all categories. Choosing a category clears the search.</p>
      )}

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading || (data && query.page > totalPages) ? (
        <ListSkeleton rows={query.limit} />
      ) : data && data.products.length === 0 ? (
        <EmptyState message={query.q ? `No products match "${query.q}".` : "No products found."} />
      ) : data ? (
        <div>
          <ProductTable products={data.products} onDelete={del.ask} />
          <ProductCards products={data.products} onDelete={del.ask} />
        </div>
      ) : null}

      {data && !error && data.total > 0 && (
        <Pagination page={Math.min(query.page, totalPages)} limit={query.limit} total={data.total} onPage={(page) => update({ page })} />
      )}

      <ConfirmDialog
        open={!!del.target}
        title="Delete product?"
        message={`"${del.target?.title}" will be removed. This can't be undone.`}
        busy={del.busy}
        error={del.error}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </div>
  );
}
