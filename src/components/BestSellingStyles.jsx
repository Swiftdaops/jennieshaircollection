"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const DotLottie = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact || mod.default || mod),
  { ssr: false }
);

import "swiper/css";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://jennieshairsbackend.onrender.com";

function formatPrice(p) {
  if (p?.discount?.isActive) {
    if (p.discount.type === "percentage") {
      return `₦${(p.price - (p.price * p.discount.value) / 100).toLocaleString()}`;
    }
    return `₦${Math.max(p.price - p.discount.value, 0).toLocaleString()}`;
  }
  return `₦${p.price?.toLocaleString()}`;
}

export default function BestSellingStylesCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Try the public best-sellers endpoint first
        const resBest = await fetch(`${apiBase}/api/products/best-sellers`);
        if (resBest.ok) {
          const best = await resBest.json();
          if (mounted && Array.isArray(best) && best.length) {
            setItems(best.slice(0, 10));
            return;
          }
        }

        // Fallback: fetch all products and filter
        const resProducts = await fetch(`${apiBase}/api/products`);
        const products = resProducts.ok ? await resProducts.json() : [];
        const kw = (s) => String(s || "").toLowerCase().includes("wig") || String(s || "").toLowerCase().includes("extension");
        const sellers = (products || []).filter(
          (p) => p.isBestSeller || kw(p.name) || kw(p.description) || kw(p.subCategory) || (p.category && (kw(p.category.name) || kw(p.category.slug)))
        );

        if (mounted) setItems((sellers || []).slice(0, 10));
      } catch (e) {
        console.error('Failed to load best sellers', e);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <section className="relative w-full bg-[#cea88d] py-20 px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-right bg-contain opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/ds2cq1vue/image/upload/v1769779892/_-removebg-preview_ofolsm.png)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
              Best-Selling Luxury Wigs
            </h3>
            <p className="mt-3 text-stone-800">
              Crafted from <strong>100% premium human hair</strong>, our most-loved
              styles are lightweight, natural, and unmistakably luxurious.
            </p>
          </div>

          {/* Shop Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black animate-pulse shadow-xl">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="py-10 text-center text-stone-900">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-stone-900">
            No best sellers yet.
          </div>
        ) : (
          <Swiper
            modules={[FreeMode]}
            freeMode
            grabCursor
            spaceBetween={16}
            slidesPerView={1.3}
            breakpoints={{
              640: { slidesPerView: 2.3 },
              1024: { slidesPerView: 3.3 },
            }}
          >
            {items.map((p) => (
              <SwiperSlide key={p._id || p.slug}>
                <Link
                  href={`/shop/${p.slug}`}
                  className="block bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                >
                  <div className="w-full aspect-[3/4] bg-gray-100">
                    {p.images?.[0]?.url ? (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm text-stone-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="text-sm font-semibold text-stone-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-sm text-stone-800 mt-1">
                      {formatPrice(p)}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            </Swiper>
          )}
          </div>
        </section>

      {/* Discover styles section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Discover styles
          </h3>
          <p className="mt-3 text-stone-700">
            Every look can be iconic
          </p>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Link href="/shop" aria-label="Shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#6b0f0f] text-[#6b0f0f] flex items-center"
              >
                <span>Shop Now</span>

                <span
                  className="ml-2 inline-flex flex-shrink-0 rounded-full overflow-hidden w-8 h-8 sm:w-9 sm:h-9"
                >
                  {DotLottie ? (
                    <DotLottie
                      src="https://lottie.host/b9982647-d3d0-4e0c-882f-9865f03d3adb/JpJWENTX6p.lottie"
                      loop
                      autoplay
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-transparent" />
                  )}
                </span>
              </Button>
            </Link>

          </div>
        </div>
      </section>
    </>
  );
}
