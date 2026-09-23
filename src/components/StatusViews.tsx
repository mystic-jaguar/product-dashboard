export function EmptyState({ message = "No products found." }: { message?: string }) {
  return <p className="py-16 text-center text-gray-500">{message}</p>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-red-600">{message}</p>
      <button className="btn" onClick={onRetry}>Retry</button>
    </div>
  );
}
