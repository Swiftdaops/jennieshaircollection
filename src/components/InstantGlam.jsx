"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { getApiBase } from "@/lib/apiBase";

const apiBase = getApiBase();

function formatPrice(p) {
  if (p?.discount?.isActive) {
    if (p.discount.type === "percentage") {
      return `₦${(p.price - (p.price * p.discount.value) / 100).toLocaleString()}`;
    }
    return `₦${Math.max(p.price - p.discount.value, 0).toLocaleString()}`;
  }
  return `₦${p.price?.toLocaleString()}`;
}

function resolveSrc(img) {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.secure_url || img.src || "";
}

function ProductSlide({ product }) {
  const images = Array.isArray(product.images) ? product.images : [];
  const [index, setIndex] = useState(0);

  const src = resolveSrc(images[index]) || "";

  function prev(e) {
    e && e.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next(e) {
    e && e.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="block bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <div className="w-full aspect-[3/4] bg-gray-50 flex items-center justify-center">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <div className="text-sm text-stone-400">No image</div>
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-stone-800 rounded-full p-1 shadow"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-stone-800 rounded-full p-1 shadow"
            >
              ›
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 px-2">
              {images.map((it, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
                  className={`w-12 h-16 rounded overflow-hidden border ${i === index ? 'border-stone-900' : 'border-transparent'}`}
                >
                  {resolveSrc(it) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveSrc(it)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 bg-white/5 backdrop-blur-sm">
        <div className="text-sm font-medium text-stone-900 truncate">{product.name}</div>
        <div className="text-sm text-stone-700 mt-1">{formatPrice(product)}</div>
      </div>
    </div>
  );
}

export default function WigsSection() {
  const [wigs, setWigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sample, setSample] = useState(null);
  const [showSample, setShowSample] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/products`);
        if (!res.ok) return setWigs([]);
        const data = await res.json();

        const keywords = ["wig", "weft", "extension", "extensions", "bundle", "hair", "lace", "closure"];
        const containsKeyword = (s) => {
          const text = String(s || "").toLowerCase();
          return keywords.some((k) => text.includes(k));
        };

        const filtered = (data || []).filter((p) => {
          const cat = p?.category;
          const catSlug = typeof cat === "string" ? cat : cat?.slug;
          const catName = typeof cat === "string" ? cat : cat?.name;

          let tagsText = "";
          if (Array.isArray(p?.tags)) tagsText = p.tags.map((t) => String(t)).join(" ");
          else if (typeof p?.tags === "string") tagsText = p.tags;

          let attrsText = "";
          if (Array.isArray(p?.attributes)) {
            attrsText = p.attributes
              .map((a) => (a && typeof a === "object" ? Object.values(a).join(" ") : String(a)))
              .join(" ");
          } else if (p?.attributes && typeof p.attributes === "object") {
            attrsText = Object.values(p.attributes).join(" ");
          } else if (typeof p?.attributes === "string") {
            attrsText = p.attributes;
          }

          return (
            containsKeyword(p.name) ||
            containsKeyword(p.description) ||
            containsKeyword(p.subCategory) ||
            containsKeyword(catSlug) ||
            containsKeyword(catName) ||
            containsKeyword(tagsText) ||
            containsKeyword(attrsText)
          );
        });

        if (mounted) {
          setWigs(filtered);
          setSample((data || [null])[0] || null);
        }
      } catch (err) {
        console.error("Failed to load wigs", err);
        if (mounted) setWigs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-[#cea88d] py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Instant Glam
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-700 max-w-2xl mx-auto">
            Discover our curated wig collection — styled, pre-treated and ready to wear.
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8">Loading wigs…</div>
          ) : wigs.length === 0 ? (
            <div className="text-center py-8">
              <div>No wigs found.</div>
              {sample && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowSample((s) => !s)}
                    className="mt-2 px-3 py-1 bg-zinc-800 text-white rounded text-xs"
                  >
                    {showSample ? "Hide sample product" : "Show sample product"}
                  </button>
                  {showSample && (
                    <pre className="text-xs text-left max-w-full overflow-auto mt-2 bg-white p-3 rounded shadow-inner">
                      {JSON.stringify(sample, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay]}
                spaceBetween={12}
                slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
                // slideshow behavior
                loop={wigs.length > 1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                // touch behavior
                allowTouchMove={true}
                grabCursor={true}
                centeredSlides={false}
                speed={800}
            >
              {wigs.map((p) => (
                <SwiperSlide key={p._id}>
                  <div className="px-2 pb-4">
                    <Link href={`/shop/${p.slug}`} className="block">
                      <ProductSlide product={p} />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
