export default function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      {label}
    </div>
  );
}
