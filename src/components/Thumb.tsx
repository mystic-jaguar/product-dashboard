// Plain <img>: DummyJSON images are already small, so Next image optimisation adds nothing here.
export default function Thumb({ src, alt, size = 48 }: { src: string; alt: string; size?: number }) {
  if (!src) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center rounded-lg bg-field text-xs text-muted ring-1 ring-edge">
        No img
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} loading="lazy" className="rounded-lg bg-white object-cover ring-1 ring-edge" style={{ width: size, height: size }} />;
}
