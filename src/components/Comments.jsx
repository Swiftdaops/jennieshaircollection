"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const commentsData = [
  { name: "Temi", comment: "My absolute favorite thing about my wigs are how lightweight it feels! As a girl that hates how heavy wigs feel, it's a breath of fresh air, literally." },
  { name: "Shelley", comment: "The hair is so stunning, I like that it has a natural lustre and isn’t so shiny. I wear my spicy Icon everyday & the compliments never stop." },
  { name: "Praise", comment: "Y’all seriously won me over with soft girl, the button options on the head are genius. And the ReXI hair is really soft and lush for something thats not human hair." },
  { name: "Daniella", comment: "The texture is amazing, feels so soft and natural. I get compliments every time I wear it!" },
  { name: "Chioma", comment: "Finally a frontal that actually looks like my scalp! The lace melted so perfectly, nobody believed it was a wig." },
  { name: "Amaka", comment: "I've had my unit for 2 years now and the curls still pop like it's brand new. Best investment I've made for my hair." },
  { name: "Favour", comment: "The density is perfect. Not too thin but not unnaturally bulky either. It just looks like I grew it myself!" },
  { name: "Blessing", comment: "Customer service was top-notch. They helped me pick the right length for my height and it's perfect." },
  { name: "Tayo", comment: "The glueless option is a lifesaver. I can take it off every night and my edges are finally growing back." },
  { name: "Nneka", comment: "Literally no shedding. I've brushed it so many times and the hair stays intact. The quality is 10/10." },
  { name: "Zainab", comment: "That bouncy bob is everything! It keeps its shape even after a long day in the sun." },
  { name: "Khadijah", comment: "The packaging was so luxury, I felt like a queen just unboxing it. The hair smells amazing too." },
  { name: "Ebere", comment: "I'm a beginner and this wig was so easy to install. Literally just cut the lace and go." },
  { name: "Simi", comment: "The hair color is so rich. It hasn't faded even after a few washes. Truly premium quality." },
  { name: "Titi", comment: "Everyone at the wedding kept asking who my stylist was. Little did they know it was a ready-to-wear unit!" },
  { name: "Ronke", comment: "Softest hair I've ever felt. I can't stop running my fingers through it. Definitely buying another one." },
  { name: "Uju", comment: "The wig cap is so breathable. I don't feel sweaty even after wearing it for 12 hours straight." },
  { name: "Ify", comment: "The waves stay even without product. I just shake it and the style comes right back to life." },
  { name: "Funmi", comment: "I was worried about the price, but seeing the quality, it's worth every kobo. You get what you pay for!" },
  { name: "Yinka", comment: "This is the first time I've bought a wig online that looks exactly like the picture. No cap." },
  { name: "Chisom", comment: "The closure is so neat. No visible knots and the parting space is generous." },
  { name: "Doyin", comment: "The shipping was so fast! It arrived just in time for my birthday photoshoot." },
  { name: "Bisi", comment: "The hair is so thick from top to bottom. No thin ends here! Very impressed with the volume." },
  { name: "Anjola", comment: "I love how the hair moves. It has that natural bounce you only get with real high-grade hair." },
  { name: "Precious", comment: "My husband actually noticed this one! He said I look younger with the fringe unit. Thanks Jennie!" },
  { name: "Muna", comment: "The knots were already bleached so well. I didn't have to do any extra work on it." },
  { name: "Sade", comment: "The cap fits my small head perfectly. Usually, wigs are too big, but this one is snug and secure." },
  { name: "Bola", comment: "It styles so easily. I can switch from straight to curls and the hair holds the style all day." },
  { name: "Tife", comment: "The lace is so transparent, it literally disappeared into my skin. High definition indeed!" },
  { name: "Mide", comment: "This hair doesn't tangle at the nape of the neck, which is a miracle for long hair. I'm obsessed." },
];

export default function CommentsSection() {
  const [comments] = useState(commentsData);

  return (
    <section className="w-full bg-[#cea88d] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
          Voices of our Glow Girls ✨
        </h2>
        <p className="mt-4 text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">
          See why thousands of women trust Jennie's Hairs for their luxury look.
        </p>

        <div className="mt-12">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            grabCursor={true}
            speed={1000}
          >
            {comments.map((c, idx) => (
              <SwiperSlide key={`${c.name}-${idx}`} className="h-auto" aria-label={`Comment by ${c.name}`}>
                <div className="bg-white/70 backdrop-blur-sm border border-stone-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="text-pink-400 mb-4 flex gap-1">
                    {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                  </div>
                  <p className="text-stone-800 leading-relaxed italic mb-6">
                    &ldquo;{c.comment}&rdquo;
                  </p>
                  <div className="mt-auto pt-4 border-t border-stone-50">
                    <span className="text-sm font-bold text-stone-950 tracking-wide">
                      {c.name}
                    </span>
                    <span className="ml-2 text-[10px] text-pink-600 font-bold uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
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