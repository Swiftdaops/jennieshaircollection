"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicSearch from "@/components/PublicSearch";
import { ShoppingBag } from "lucide-react";

function CartContents() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    } catch { setItems([]); }
    const onUpdate = () => setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, []);

  if (!items || items.length === 0) return <div className="text-sm text-zinc-600">Your cart is empty.</div>;

  const total = items.reduce((s,i)=>s + ((i.price||0) * (i.qty||1)), 0);

  return (
    <div>
      <ul className="space-y-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <img src={it.image} alt={it.name} className="w-14 h-14 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-zinc-600">₦{it.price?.toLocaleString()} × {it.qty}</div>
            </div>
            <div className="font-semibold">₦{((it.price||0) * (it.qty||1)).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between font-semibold">Total <span>₦{total.toLocaleString()}</span></div>
      <div className="mt-4">
        <Link href="/checkout">
          <button className="w-full bg-[#6b0f1a] text-white px-4 py-2 rounded">Proceed to checkout</button>
        </Link>
      </div>
    </div>
  );
}

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function readCart() {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(c.reduce((s, i) => s + (i.qty || 0), 0));
      } catch { setCartCount(0); }
    }
    readCart();
    const onUpdate = () => readCart();
    const onOpen = () => setDrawerOpen(true);
    window.addEventListener('cartUpdated', onUpdate);
    window.addEventListener('openCart', onOpen);
    return () => {
      window.removeEventListener('cartUpdated', onUpdate);
      window.removeEventListener('openCart', onOpen);
    };
  }, []);

  return (
    <header className="w-full card sticky top-0 z-40 border-b border-white/20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            className="md:hidden p-2 rounded hover:bg-black/5"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-900"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>

          <Link href="/" className="text-lg font-bold text-stone-950">Jennie's Hairs Collection</Link>
        </div>

        <div className="hidden md:block flex-1">
          <PublicSearch />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            aria-label="Search"
            className="md:hidden p-2 rounded hover:bg-black/5"
            onClick={() => setMobileSearch((s) => !s)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-900"><circle cx="11" cy="11" r="6" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>

          <button aria-label="Cart" className="md:hidden p-2 rounded hover:bg-black/5" onClick={()=>setDrawerOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M3 11h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" /></svg>
          </button>

          <div className="hidden sm:flex items-center">
            <button onClick={()=>setDrawerOpen(true)} aria-label="Cart" className="relative w-10 h-10 flex items-center justify-center rounded-md border-2 border-black text-black">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {mobileSearch && (
        <div className="md:hidden px-4 pb-3">
          <PublicSearch />
        </div>
      )}

      {/* Cart Drawer */}
          <CartDrawer open={drawerOpen} onOpenChange={(v) => setDrawerOpen(Boolean(v))} />

      {/* Mobile drawer/menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="text-lg font-bold">Instant Hair</Link>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2">✕</button>
            </div>

            <nav className="flex flex-col gap-3">
              <PublicSearch />
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded">Shop</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-2 py-2 rounded">Contact</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
