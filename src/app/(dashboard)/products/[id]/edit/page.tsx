"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { updateProduct } from "@/services/products";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { ErrorState } from "@/components/StatusViews";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { product, loading, error, notFound, retry } = useProduct(id);

  if (notFound) return <NotFound />;
  if (loading) return <Loader />;
  if (error || !product) return <ErrorState message={error || "Something went wrong"} onRetry={retry} />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Edit product</h1>
      <ProductForm
        submitLabel="Save changes"
        initial={{
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand ?? "",
          price: String(product.price),
          stock: String(product.stock),
        }}
        onCancel={() => router.back()}
        onSubmit={async (input) => {
          await updateProduct(product.id, input);
          router.replace(`/products/${product.id}`);
        }}
      />
    </div>
  );
}
