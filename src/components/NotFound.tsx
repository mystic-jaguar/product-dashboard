import Link from "next/link";

export default function NotFound({ message = "This product doesn't exist or was deleted." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-gray-600">{message}</p>
      <Link href="/products" className="btn">Back to products</Link>
    </div>
  );
}
