"use client";

import { useState } from "react";
import Thumb from "./Thumb";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return <Thumb src="" alt={title} size={320} />;

  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={title} className="aspect-square w-full rounded-lg border border-gray-200 bg-white object-contain" />
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`rounded border-2 ${i === active ? "border-blue-600" : "border-transparent"}`}
            >
              <Thumb src={src} alt="" size={56} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
