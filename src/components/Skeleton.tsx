// Grey pulsing placeholders shaped like the real content, so the layout doesn't jump when data lands.
function Bone({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-md bg-fg/10 ${className}`} />;
}

// Mirrors ProductTable (md and up) and ProductCards (below md).
export function ListSkeleton({ rows = 10 }: { rows?: number }) {
  const items = Array.from({ length: rows });
  return (
    <div role="status" aria-busy="true" aria-label="Loading products">
      <div className="hidden card max-h-[70vh] overflow-hidden md:block">
        <div className="flex gap-3 bg-(--glass-pop) p-3"><Bone className="h-3 w-full" /></div>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-6 border-t border-edge p-3">
            <Bone className="h-10 w-10 shrink-0 rounded-lg" />
            <Bone className="h-4 flex-2" />
            <Bone className="h-4 flex-1" />
            <Bone className="h-4 w-16" />
            <Bone className="h-4 w-12" />
            <Bone className="h-4 w-10" />
            <Bone className="h-8 w-32" />
          </div>
        ))}
      </div>
      <ul className="space-y-3 md:hidden">
        {items.map((_, i) => (
          <li key={i} className="card p-3">
            <div className="flex gap-3">
              <Bone className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-3/4" />
                <Bone className="h-3 w-1/3" />
                <Bone className="h-3 w-2/3" />
              </div>
            </div>
            <Bone className="mt-3 h-8 w-40" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mirrors the product details page.
export function DetailSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading product" className="space-y-6">
      <Bone className="h-4 w-36" />
      <div className="card grid gap-6 p-5 md:grid-cols-2">
        <div className="space-y-3">
          <Bone className="aspect-square w-full rounded-xl" />
          <div className="flex gap-2">{[0, 1, 2, 3].map((i) => <Bone key={i} className="h-14 w-14 rounded-lg" />)}</div>
        </div>
        <div className="space-y-3">
          <Bone className="h-4 w-40" />
          <Bone className="h-8 w-3/4" />
          <Bone className="h-7 w-24" />
          <div className="flex gap-2"><Bone className="h-6 w-16 rounded-full" /><Bone className="h-6 w-24 rounded-full" /></div>
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2"><Bone className="h-9 w-20" /><Bone className="h-9 w-20" /></div>
        </div>
      </div>
      <Bone className="h-6 w-28" />
      {[0, 1].map((i) => <Bone key={i} className="card h-20 w-full" />)}
    </div>
  );
}

// Mirrors ProductForm on the edit page.
export function FormSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading form" className="mx-auto max-w-2xl space-y-4">
      <Bone className="h-9 w-48" />
      <div className="card space-y-4 p-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2"><Bone className="h-3 w-24" /><Bone className={i === 1 ? "h-24 w-full" : "h-10 w-full"} /></div>
        ))}
        <div className="flex justify-end gap-2"><Bone className="h-9 w-20" /><Bone className="h-9 w-28" /></div>
      </div>
    </div>
  );
}
