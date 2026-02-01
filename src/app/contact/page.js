"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "2348169793790";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = `
Hi, my name is ${form.name}.
Email: ${form.email}
Phone: ${form.phone}

Message:
${form.message}
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");
  };

  return (
    <section className="w-full bg-[#cea88d] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-stone-900">
            Contact Us
          </h1>
          <p className="mt-4 text-stone-800">
            Questions about our luxury wigs or your order?  
            Send us a message directly on WhatsApp.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              required
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              name="phone"
              required
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <textarea
              name="message"
              required
              rows={4}
              placeholder="Your Message"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Send via WhatsApp
            </button>
          </form>

          <p className="mt-4 text-xs text-stone-500 text-center">
            This will open WhatsApp with your message pre-filled.
          </p>
        </div>
      </div>
    </section>
  );
}
