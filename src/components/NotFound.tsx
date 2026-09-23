import Link from "next/link";

export default function NotFound({ message = "This product doesn't exist or was deleted." }: { message?: string }) {
  return (
    <div className="card mx-auto my-10 flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
      <p className="text-fg-2">{message}</p>
      <Link href="/products" className="btn">Back to products</Link>
    </div>
  );
}
