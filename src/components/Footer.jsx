"use client";

import { useState } from "react";
import Link from "next/link";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Footer() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${apiBase}/api/inner-circle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#cea88d]  pt-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Categories */}
        <div className="grid sm:grid-cols-3 text-white gap-6 mb-16">
          {[
            { name: "Luxury Wigs", img: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796442/Wig_shop_c7qdzn.jpg", href: "/shop" },
            { name: "Styling Tools", img: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769799665/Beauty_Supply_Crown_Hair_Sculpture_h2sevp.jpg", href: "/shop" },
            { name: "Accessories", img: "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769800752/__5_m5ipis.jpg", href: "/shop" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-110 transition"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Inner Circle */}
        <div className="border-t border-white/20 pt-12 pb-16">
          <h4 className="text-2xl font-bold text-center">
            Join Our Inner Circle ✨
          </h4>

          <p className="mt-3 text-center text-white/70 max-w-xl mx-auto">
            Get updates on our latest luxury hairs, exclusive drops,
            and private offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number (optional)"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Your Email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />

            <button
              type="submit"
              className="bg-[#cea88d] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Join
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-400 text-center mt-3">
              You’re in! 💫
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 text-center mt-3">
              Something went wrong. Try again.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-white/40 pb-6">
          © {new Date().getFullYear()} Jennie's Hair Collection. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
