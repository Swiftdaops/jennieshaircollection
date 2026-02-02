"use client";

import React, { useState } from "react";

function resolveSrc(img) {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.secure_url || img.src || "";
}

export default function ProductGallery({ images = [], alt = "product image" }) {
  const safeImages = Array.isArray(images) ? images : [];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mainSrc = resolveSrc(safeImages[index]) || "";

  return (
    <div className="product-gallery">
      <div className="relative bg-white/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="w-full max-w-md mx-auto p-4">
          <div className="w-full rounded-lg overflow-hidden bg-white/10">
            {mainSrc ? (
              <div className="w-full aspect-[3/4] flex items-center justify-center">
                <img src={mainSrc} alt={alt} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center text-sm text-stone-400">No image</div>
            )}
          </div>
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => setIndex((idx) => (idx - 1 + safeImages.length) % safeImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 text-stone-800 rounded-full p-2 shadow"
            >
              ‹
            </button>

            <button
              aria-label="Next image"
              onClick={() => setIndex((idx) => (idx + 1) % safeImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 text-stone-800 rounded-full p-2 shadow"
            >
              ›
            </button>

            <div className="mt-3 px-4 pb-4 flex items-center justify-center gap-2 overflow-x-auto">
              {safeImages.map((it, i) => {
                const s = resolveSrc(it);
                return (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`shrink-0 rounded-lg overflow-hidden border ${i === index ? 'border-stone-900' : 'border-zinc-200'}`}
                    aria-label={`Show image ${i + 1}`}
                    style={{ width: 84, height: 112 }}
                  >
                    {s ? (
                      <img src={s} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">No</div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
