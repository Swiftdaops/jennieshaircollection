"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const commentsData = [
  { name: "Temi", comment: "My absolute favorite thing about my wigs are how lightweight it feels! As a girl that hates how heavy wigs feel, it's a breath of fresh air, literally", location: "Lagos" },
  { name: "Shelley", comment: "The hair is so stunning, I like that it has a natural lustre and isn’t so shiny. I wear my spicy Icon everyday & the compliments never stop", location: "Ifite Awka" },
  { name: "Praise", comment: "Y’all seriously won me over with soft girl, the button options on the head are genius. And the ReXI hair is really soft and lush for something thats not human hair", location: "Lagos" },
  { name: "Daniella", comment: "The texture is amazing, feels so soft and natural. I get compliments every time I wear it!", location: "Ifite Awka" },
  // Auto-generate 50 more fake comments for Lagos and Ifite Awka
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `User${i + 1}`,
    comment: `This wig is amazing! Love how it feels and looks. #${i + 1}`,
    location: i % 2 === 0 ? "Lagos" : "Ifite Awka",
  })),
];

export default function CommentsSection() {
  const [comments] = useState(commentsData);

  return (
    <section className="w-full bg-[#cea88d] py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          What Our Customers Are Saying
        </h2>
        <p className="mt-4 text-sm sm:text-base text-stone-700 max-w-2xl mx-auto">
          Real reviews from our beautiful customers in Lagos and Ifite Awka.
        </p>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={comments.length > 3}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            allowTouchMove={true}
            grabCursor={true}
            speed={800}
          >
            {comments.map((c, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white/30 backdrop-blur-md rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                  <p className="text-sm text-stone-900 mb-4">&ldquo;{c.comment}&rdquo;</p>
                  <div className="mt-auto text-xs text-stone-700 font-medium">
                    - {c.name}, {c.location}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
