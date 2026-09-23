import type { Review } from "@/services/products";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <p className="text-sm text-fg-2">No reviews yet.</p>;

  return (
    <ul className="space-y-3">
      {reviews.map((r, i) => (
        <li key={i} className="card p-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{r.reviewerName}</span>
            <span className="text-star" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
          </div>
          <p className="mt-1 text-sm text-fg-2">{r.comment}</p>
          <p className="mt-1 text-xs text-muted">{new Date(r.date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
