"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { formatCategory, formatPrice } from "@/lib/format";
import Loader from "@/components/Loader";
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
  if (loading) return <Loader />;
  if (error || !product) return <ErrorState message={error || "Something went wrong"} onRetry={retry} />;

  return (
    <div className="space-y-6">
      <Link href="/products" className="text-sm text-blue-600 hover:underline">← Back to products</Link>

      <div className="grid gap-6 md:grid-cols-2">
        <ProductGallery images={product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []} title={product.title} />

        <div className="space-y-3">
          <p className="text-sm capitalize text-gray-500">{formatCategory(product.category)}{product.brand && ` · ${product.brand}`}</p>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="text-sm text-gray-600">
            {product.rating ? `★ ${product.rating.toFixed(1)}` : "No rating"} · {product.stock} in stock
          </p>
          <p className="text-gray-700">{product.description}</p>
          <div className="flex gap-2 pt-2">
            <Link href={`/products/${product.id}/edit`} className="btn-primary">Edit</Link>
            <button className="btn text-red-600" onClick={() => del.ask(product)}>Delete</button>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reviews</h2>
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
