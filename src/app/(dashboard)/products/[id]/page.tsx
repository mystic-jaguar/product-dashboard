"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { formatCategory, formatPrice } from "@/lib/format";
import { DetailSkeleton } from "@/components/Skeleton";
import NotFound from "@/components/NotFound";
import ProductGallery from "@/components/ProductGallery";
import ReviewList from "@/components/ReviewList";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ErrorState } from "@/components/StatusViews";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { product, loading, error, notFound, retry } = useProduct(id);
  const del = useDeleteProduct(() => router.replace("/products"));

  if (notFound) return <NotFound />;
  if (loading) return <DetailSkeleton />;
  if (error || !product) return <ErrorState message={error || "Something went wrong"} onRetry={retry} />;

  return (
    <div className="space-y-6">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">← Back to products</Link>

      <div className="card grid gap-6 p-5 md:grid-cols-2">
        <ProductGallery images={product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []} title={product.title} />

        <div className="space-y-3">
          <p className="text-sm font-medium capitalize text-accent">{formatCategory(product.category)}{product.brand && ` · ${product.brand}`}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
          <p className="text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
          <p className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-field px-2.5 py-0.5 ring-1 ring-edge">{product.rating ? <><span className="text-star">★</span> {product.rating.toFixed(1)}</> : "No rating"}</span>
            <span className={`rounded-full px-2.5 py-0.5 ring-1 ring-edge ${product.stock > 0 ? "text-good" : "text-danger"}`}>{product.stock} in stock</span>
          </p>
          <p className="leading-relaxed text-fg-2">{product.description}</p>
          <div className="flex gap-2 pt-2">
            <Link href={`/products/${product.id}/edit`} className="btn-primary">Edit</Link>
            <button className="btn text-danger" onClick={() => del.ask(product)}>Delete</button>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Reviews</h2>
        <ReviewList reviews={product.reviews ?? []} />
      </section>

      <ConfirmDialog
        open={!!del.target}
        title="Delete product?"
        message={`"${product.title}" will be removed. This can't be undone.`}
        busy={del.busy}
        error={del.error}
        onConfirm={del.confirm}
        onCancel={del.cancel}
      />
    </div>
  );
}
