"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/services/products";

export default function NewProductPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Add product</h1>
      <ProductForm
        submitLabel="Add product"
        onCancel={() => router.back()}
        onSubmit={async (input) => {
          const created = await createProduct(input);
          router.replace(`/products/${created.id}`);
        }}
      />
    </div>
  );
}
