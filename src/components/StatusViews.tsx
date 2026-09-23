export function EmptyState({ message = "No products found." }: { message?: string }) {
  return <p className="card py-16 text-center text-fg-2">{message}</p>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="card flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-danger">{message}</p>
      <button className="btn" onClick={onRetry}>Retry</button>
    </div>
  );
}
