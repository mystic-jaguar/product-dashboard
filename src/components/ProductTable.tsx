import type { Product } from "@/services/products";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductActions from "./ProductActions";
import Thumb from "./Thumb";

type Props = { products: Product[]; onDelete: (p: Product) => void };

// Desktop view (md and up).
export default function ProductTable({ products, onDelete }: Props) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
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
            <tr key={p.id} className="border-t border-gray-100">
              <td className="p-3"><Thumb src={p.thumbnail} alt={p.title} /></td>
              <td className="p-3 font-medium">{p.title}</td>
              <td className="p-3 capitalize">{formatCategory(p.category)}</td>
              <td className="p-3 text-right">{formatPrice(p.price)}</td>
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
