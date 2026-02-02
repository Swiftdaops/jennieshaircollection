"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient, getAxiosErrorMessage } from "@/lib/apiClient";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2340000000000"; // replace with real number in env

function formatCurrency(n) {
  return `₦${(n || 0).toLocaleString()}`;
}

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(cart);
    } catch {
      setItems([]);
    }
  }, []);

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  function handlePay() {
    // Simulate a payment flow. In production, integrate a real payment gateway.
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 1200);
  }

  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (e) {
      // fallback
      prompt('Copy the text below', text);
    }
  }

  function openWhatsApp() {
    // Save order to backend, send admin email, then open WhatsApp confirmation
    (async () => {
      if (!name.trim()) return alert("Please enter your name");
      if (!phone.trim()) return alert("Please enter your WhatsApp number");
      if (!address.trim()) return alert("Please enter your delivery address");
      if (items.length === 0) return alert("Your cart is empty");

      const payload = {
        customerName: name.trim(),
        whatsappNumber: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        items: items.map((it) => ({
          productId: it.id,
          name: it.name,
          price: Number(it.price || 0),
          quantity: Number(it.qty || 1),
        })),
        totalAmount: Number(total || 0),
        shipping: 0,
        tax: 0,
      };

      setSubmitting(true);
      try {
        const { data } = await apiClient.post(
          "/api/orders/checkout",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        try {
          localStorage.removeItem("cart");
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch {
          // ignore
        }

        const url = data?.whatsappLink || `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello Jennie, I just placed an order. My name is ${name.trim()}.`)}`;
        window.open(url, "_blank");
      } catch (e) {
        alert(getAxiosErrorMessage(e, "Network error. Please try again."));
      } finally {
        setSubmitting(false);
      }
    })();
  }

  return (
    <div className="min-h-screen bg-[#cea88d] text-stone-900 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-zinc-700">Review your order and complete payment to confirm.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-700">Your cart is empty.</p>
            <div className="mt-4">
              <Link href="/shop" className="text-sm text-[#6b0f1a] underline">Continue shopping</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <ul className="space-y-4">
              {items.map((it, i) => (
                <li key={i} className="flex items-center gap-4">
                  <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-zinc-600">Qty: {it.qty}</div>
                  </div>
                  <div className="font-medium">{formatCurrency((it.price || 0) * (it.qty || 1))}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-zinc-700">Total</div>
              <div className="text-2xl font-semibold">{formatCurrency(total)}</div>
            </div>

            <div className="mt-6">
              {!paid ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
                    <h3 className="font-semibold">Payment details</h3>
                    <p className="text-sm text-zinc-700 mt-2">Please send payment to the following account:</p>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div><strong>Bank:</strong> Access Bank</div>
                      <div><strong>Account number:</strong> 8169793790 <button onClick={() => copyToClipboard('8169793790')} className="ml-2 text-xs text-[#6b0f1a]">Copy</button></div>
                      <div><strong>Account name:</strong> Nweke Chiemerie Jennifer <button onClick={() => copyToClipboard('Nweke Chiemerie Jennifer')} className="ml-2 text-xs text-[#6b0f1a]">Copy</button></div>
                    </div>
                    <p className="mt-3 text-xs text-zinc-600">After sending payment, click "I have paid" and send the confirmation via WhatsApp.</p>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full bg-[#6b0f1a] text-white py-3 rounded-md font-semibold hover:opacity-95"
                  >
                    {processing ? "Processing..." : "Mark as paid (simulate)"}
                  </button>
                  <p className="mt-2 text-sm text-zinc-600">This demo simulates payment state; replace with a real gateway for production.</p>
                </>
              ) : (
                <div>
                  <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200">
                    <p className="text-sm text-zinc-700">Payment recorded. Please confirm your payment to complete the order by sending a WhatsApp message.</p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm text-zinc-700 mb-2">Your name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full border rounded px-3 py-2" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm text-zinc-700 mb-2">WhatsApp number</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 2348169793790" className="w-full border rounded px-3 py-2" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm text-zinc-700 mb-2">Email (optional)</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border rounded px-3 py-2" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm text-zinc-700 mb-2">Delivery address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your delivery address" className="w-full border rounded px-3 py-2 min-h-[90px]" />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={openWhatsApp}
                      disabled={submitting}
                      className="ml-auto text-[#d4af37] font-semibold text-lg disabled:opacity-60"
                    >
                      {submitting ? "Saving order..." : "I have paid"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
