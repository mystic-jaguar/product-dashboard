type Props = { label: string; error?: string; children: React.ReactNode };

// Label + input + error message. The input is passed as children.
export default function Field({ label, error, children }: Props) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
