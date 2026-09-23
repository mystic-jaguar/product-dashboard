import type { Product } from "@/services/products";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductActions from "./ProductActions";
import Thumb from "./Thumb";

type Props = { products: Product[]; onDelete: (p: Product) => void };

// Mobile view (below md).
export default function ProductCards({ products, onDelete }: Props) {
  return (
    <ul className="space-y-3 md:hidden">
      {products.map((p) => (
        <li key={p.id} className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex gap-3">
            <Thumb src={p.thumbnail} alt={p.title} size={64} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="text-sm capitalize text-gray-500">{formatCategory(p.category)}</p>
              <p className="mt-1 text-sm">
                {formatPrice(p.price)} · {p.rating ? `★ ${p.rating.toFixed(1)}` : "No rating"} · {p.stock} in stock
              </p>
            </div>
          </div>
          <div className="mt-3"><ProductActions product={p} onDelete={onDelete} /></div>
        </li>
      ))}
    </ul>
  );
}
