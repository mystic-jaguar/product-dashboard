"use client";

import { useState } from "react";
import Thumb from "./Thumb";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return <Thumb src="" alt={title} size={320} />;

  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={title} className="aspect-square w-full rounded-xl border border-edge bg-white/70 object-contain" />
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`rounded-lg border-2 transition ${i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Thumb src={src} alt="" size={56} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
