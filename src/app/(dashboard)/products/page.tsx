import { Suspense } from "react";
import Loader from "@/components/Loader";
import ProductList from "./ProductList";

// useSearchParams() in a client component needs a Suspense boundary above it.
export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductList />
    </Suspense>
  );
}
