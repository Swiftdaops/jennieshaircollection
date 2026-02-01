"use client";

import { useState } from "react";

export default function WhatsAppHelp() {
  const defaultMsg =
    "I need assistance with my order. Order number: [insert order#]. Please help me with: ";

  const [message, setMessage] = useState(defaultMsg);
  const defaultPhone = "+2348169793790";
  const phoneRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || defaultPhone;
  // normalize to digits only (wa.me expects country code + number without +)
  const phone = String(phoneRaw).replace(/\D/g, "");

  function openWhatsApp() {
    const encoded = encodeURIComponent(message.trim());
    let url;
    if (phone) {
      // send directly to given number
      url = `https://wa.me/${phone}?text=${encoded}`;
    } else {
      // open share dialog (user picks contact)
      url = `https://wa.me/?text=${encoded}`;
    }

    window.open(url, "_blank");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-semibold">Need Assistance?</h3>
      <p className="mt-2 text-sm text-zinc-600">
        If you have questions about shipping or believe your order qualifies for a special-case return, please contact our support team before taking any action.
      </p>

      <label className="block mt-4 text-sm font-medium">Message (you can edit before sending)</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full mt-2 border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none"
      />

      <div className="mt-4 flex items-center gap-3">
        <button onClick={openWhatsApp} className="rounded bg-[#25D366] text-white px-4 py-2 font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8l1.8 5.2-5.3-1.7a8.5 8.5 0 11-3.1-16.6 8.38 8.38 0 013.7.8" />
          </svg>
          Contact on WhatsApp
        </button>

        <div className="text-sm text-zinc-500">We'll open WhatsApp with your message — you can edit before sending.</div>
      </div>
    </div>
  );
}
