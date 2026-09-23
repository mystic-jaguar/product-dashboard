export default function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-fg-2">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-edge border-t-accent" />
      {label}
    </div>
  );
}
