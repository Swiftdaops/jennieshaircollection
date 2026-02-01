"use client";

import { useState } from "react";

export default function AddToCartButton({ product }) {
  const [adding, setAdding] = useState(false);

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  }

  function saveCart(items) {
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  async function handleAdd() {
    setAdding(true);
    const cart = getCart();
    const img = product.images && product.images[0] ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || '')) : '';
    const existing = cart.find((c) => c.id === product._id || c.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: product._id || product.id || product.slug, name: product.name, price: product.price, qty: 1, image: img });
    }
    saveCart(cart);
    // open drawer
    window.dispatchEvent(new CustomEvent('openCart'));
    setTimeout(() => setAdding(false), 300);
  }

  return (
    <button onClick={handleAdd} disabled={adding} className="rounded-full px-6 py-3 bg-lime-600 text-white font-semibold">
      {adding ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
