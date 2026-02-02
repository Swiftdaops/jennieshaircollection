"use client";

import React, { useState } from "react";

function resolveSrc(img) {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.secure_url || img.src || "";
}

export default function ProductCard({ product, alt }) {
  const images = Array.isArray(product.images) ? product.images : [];
  const [index, setIndex] = useState(0);
  const src = resolveSrc(images[index]) || "";

  function prev(e) {
    e.preventDefault(); e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next(e) {
    e.preventDefault(); e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="w-full bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full">
        <div className="w-full aspect-[3/4] bg-gray-50 flex items-center justify-center">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt || product.name} className="w-full h-full object-contain" />
          ) : (
            <div className="text-sm text-stone-400">No image</div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <div onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 cursor-pointer" aria-hidden>
              ‹
            </div>
            <div onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 cursor-pointer" aria-hidden>
              ›
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((it, i) => (
                <button key={i} onClick={(e)=>{e.preventDefault(); e.stopPropagation(); setIndex(i);}} className={`w-8 h-12 rounded overflow-hidden border ${i===index? 'border-stone-900':'border-transparent'}`}>
                  {resolveSrc(it) ? <img src={resolveSrc(it)} alt="thumb" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
