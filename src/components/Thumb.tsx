// Plain <img>: DummyJSON images are already small, so Next image optimisation adds nothing here.
export default function Thumb({ src, alt, size = 48 }: { src: string; alt: string; size?: number }) {
  if (!src) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
        No img
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} loading="lazy" className="rounded bg-gray-100 object-cover" style={{ width: size, height: size }} />;
}
