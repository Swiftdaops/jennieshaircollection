"use client";

import Link from "next/link";

export default function TwoSquares() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/shop?category=wigs"
          className="relative w-full aspect-square rounded-2xl overflow-hidden group"
          aria-label="Shop Wigs"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796442/Wig_shop_c7qdzn.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="relative z-10 flex h-full items-end p-6">
            <div>
              <h4 className="text-2xl font-bold text-white">Wigs</h4>
              <p className="mt-1 text-sm text-white/80">Shop our premium wig collection</p>
              <div className="mt-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-white/90 text-stone-900 px-3 py-2 text-sm font-medium">
                  Shop Wigs
                </button>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/shop?category=hair-extensions"
          className="relative w-full aspect-square rounded-2xl overflow-hidden group"
          aria-label="Shop Hair Extensions"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796638/__3_gzqq3h.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="relative z-10 flex h-full items-end p-6">
            <div>
              <h4 className="text-2xl font-bold text-white">Hair Extensions</h4>
              <p className="mt-1 text-sm text-white/80">Explore our luxury extensions</p>
              <div className="mt-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-white/90 text-stone-900 px-3 py-2 text-sm font-medium">
                  Shop Extensions
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
