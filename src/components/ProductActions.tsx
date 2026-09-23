import Link from "next/link";
import type { Product } from "@/services/products";

type Props = { product: Product; onDelete: (p: Product) => void };

export default function ProductActions({ product, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <Link href={`/products/${product.id}`} className="btn">View</Link>
      <Link href={`/products/${product.id}/edit`} className="btn">Edit</Link>
      <button className="btn text-danger" onClick={() => onDelete(product)}>Delete</button>
    </div>
  );
}
