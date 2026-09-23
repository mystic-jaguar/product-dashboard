import type { Product } from "@/services/products";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductActions from "./ProductActions";
import Thumb from "./Thumb";

type Props = { products: Product[]; onDelete: (p: Product) => void };

// Desktop view (md and up).
export default function ProductTable({ products, onDelete }: Props) {
  return (
    <div className="hidden card max-h-[70vh] overflow-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-(--glass-pop) text-xs uppercase tracking-wide text-fg-2 backdrop-blur-xl">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">Rating</th>
            <th className="p-3 text-right">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-edge transition-colors hover:bg-fg/5">
              <td className="p-3"><Thumb src={p.thumbnail} alt={p.title} /></td>
              <td className="max-w-xs truncate p-3 font-medium" title={p.title}>{p.title}</td>
              <td className="p-3 capitalize text-fg-2">{formatCategory(p.category)}</td>
              <td className="p-3 text-right font-medium tabular-nums">{formatPrice(p.price)}</td>
              <td className="p-3 text-right">{p.rating ? `★ ${p.rating.toFixed(1)}` : "–"}</td>
              <td className="p-3 text-right">{p.stock}</td>
              <td className="p-3"><ProductActions product={p} onDelete={onDelete} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
