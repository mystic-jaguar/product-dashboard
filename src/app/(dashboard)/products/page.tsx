import { Suspense } from "react";
import { ListSkeleton } from "@/components/Skeleton";
import ProductList from "./ProductList";

// useSearchParams() in a client component needs a Suspense boundary above it.
export default function ProductsPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <ProductList />
    </Suspense>
  );
}
