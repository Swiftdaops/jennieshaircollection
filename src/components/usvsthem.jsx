"use client";

import { useRef, useState } from "react";

// Example frames showcasing luxurious wigs — before (generic) vs after (our premium collection)
const frames = [
  {
    before: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769795610/Beautiful_Amanda_wow_that_is_Superb___zzyx5h.jpg",
    after: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769795611/I_Promise_to_Protect_This_New_Version_of_Me_Chioma_Good_Hair_Marks_Her_Birthday_with_Empowering_Words_mvrmfd.jpg",
  },
  {
    before: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769795928/Amelie_Johnson_bhz25f.jpg",
    after: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769795927/Luxurious___The_best_hair_on_the_market_has_OFFICIALLY_DROPPED_rbhaircollections_iamrazorbehavior_DM_her_for_inquiries__Currently_available_for_in_ohmgjl.jpg",
  },
  {
    before: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796161/qdtzzysiwo6ty7mxslok.jpg",
    after: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796157/Best_Clip_In_Hair_Extensions_for_a_Glamorous_Look_otc3bt.jpg",
  },
];

function CompareFrame({ before, after }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percent)));
  };

  const smoothMove = (clientX) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updatePosition(clientX));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-black select-none"
      onMouseDown={(e) => { isDragging.current = true; smoothMove(e.clientX); }}
      onMouseMove={(e) => isDragging.current && smoothMove(e.clientX)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={(e) => smoothMove(e.touches[0].clientX)}
      onTouchMove={(e) => smoothMove(e.touches[0].clientX)}
    >
      {/* BEFORE image */}
      <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-xs px-4 py-1 rounded-full">
        Your Vision
      </div>

      {/* AFTER image overlay */}
      <div className="absolute inset-0 overflow-hidden z-20" style={{ width: `${position}%` }}>
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur text-stone-900 text-xs px-4 py-1 rounded-full">
          OUR LUXURY
        </div>
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-30" style={{ left: `${position}%` }} />

      {/* Handle */}
      <div
        className="absolute top-1/2 z-40 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ left: `calc(${position}% - 28px)` }}
      >
        <span className="text-xl font-bold text-stone-700">↔</span>
      </div>
    </div>
  );
}

export default function UsVsThemSection() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + frames.length) % frames.length);
  const next = () => setIndex((i) => (i + 1) % frames.length);

  return (
    <section className="w-full bg-[#f5e4d8] py-16 px-4 rounded-xl border-2 border-[#6b0f1a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            YOUR VISION vs OUR CRAFT
          </h2>
          <p className="mt-4 text-stone-700 max-w-xl mx-auto">
            Explore the transformation — see how our luxurious wig collection elevates style from everyday to extraordinary.
          </p>
        </div>

        {/* Mobile: controlled slider with Prev/Next (no swipe/autoplay) */}
        <div className="md:hidden relative">
          <div>
            <CompareFrame {...frames[index]} />
            <div className="mt-3 bg-white/60 backdrop-blur-md rounded-md border-2 border-[#6b0f1a] px-4 py-2 flex justify-between items-center">
              <div className="text-sm font-medium text-stone-700">Your Vision</div>
              <div className="text-sm font-medium text-stone-700">OUR LUXURY</div>
            </div>
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg text-2xl w-10 h-10 flex items-center justify-center"
          >
            ‹
          </button>

          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg text-2xl w-10 h-10 flex items-center justify-center"
          >
            ›
          </button>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {frames.map((frame, i) => (
            <div key={i}>
              <CompareFrame {...frame} />
              <div className="mt-3 bg-white/60 backdrop-blur-md rounded-md border-2 border-[#6b0f1a] px-4 py-2 flex justify-between items-center">
                <div className="text-sm font-medium text-stone-700">Your Vision</div>
                <div className="text-sm font-medium text-stone-700">OUR LUXURY</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
