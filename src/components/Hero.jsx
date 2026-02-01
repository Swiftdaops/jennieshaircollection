"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const DotLottie = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact || mod.default || mod),
  { ssr: false }
);

export default function Hero() {
  const router = useRouter();

  function handleShop() {
    router.push("/shop");
  }

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-[#f6efe9]">
      {/* Background Image */}
      <Image
        src="https://res.cloudinary.com/dhssw7nnn/image/upload/v1769761437/ChatGPT_Image_Jan_30_2026_09_23_07_AM_komq74.png"
        alt="Luxury nude wig background"
        fill
        priority
        className="object-cover"
      />

      {/* Nude Overlay (no blur) */}
      <div className="absolute inset-0 bg-[#f6efe9]/40" />

      {/* Subtle Edge Glow */}
      <div className="absolute inset-0 ring-0 shadow-[inset_0_0_60px_rgba(255,255,255)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl h-full px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900"
          >
            Jennie’s Hair Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-6 text-lg sm:text-xl text-stone-700 max-w-xl leading-relaxed"
          >
            We sell luxurious hair — and we make pretty girls for fun.
          </motion.p>

          {/* CTA */}
            <div className="mt-10 relative inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShop}
                className="relative overflow-hidden rounded-full px-6 sm:px-8 py-3 sm:py-4 font-semibold text-stone-900 bg-gradient-to-br from-[#f2e6da]/80 to-white/60 border border-white/50 shadow-lg shadow-black/5 flex items-center"
              >
                <span>Shop Now</span>

                <span className="ml-2 inline-flex flex-shrink-0 rounded-full overflow-hidden w-7 h-7 sm:w-8 sm:h-8">
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
              </motion.button>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
