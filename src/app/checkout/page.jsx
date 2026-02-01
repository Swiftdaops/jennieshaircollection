"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2340000000000"; // replace with real number in env

function formatCurrency(n) {
  return `₦${(n || 0).toLocaleString()}`;
}

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

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
    const products = items.map((it) => `${it.name} x${it.qty}`).join("; ");
    const txn = `TXN-${Date.now().toString().slice(-6)}`;
    const message = `Hello Jennie, I would like to confirm my payment. My name is ${name || "[your name]"}. Order: ${products}. Total: ${formatCurrency(total)}. Transaction reference: ${txn}.`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WA_NUMBER}?text=${encoded}`;
    window.open(url, "_blank");
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

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={openWhatsApp}
                      className="ml-auto text-[#d4af37] font-semibold text-lg"
                    >
                      I have paid
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
