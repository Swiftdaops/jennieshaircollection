"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerOverlay,
  DrawerClose,
} from "@/components/ui/drawer";

function formatCurrency(n){
  return `₦${(n||0).toLocaleString()}`;
}

export default function CartDrawer({ open, onOpenChange }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    } catch { setItems([]); }
  }, [open]);

  useEffect(() => {
    // persist whenever items change
    try {
      localStorage.setItem('cart', JSON.stringify(items || []));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {}
  }, [items]);

  function updateQty(idx, qty){
    setItems((cur)=>{
      const copy = [...cur];
      copy[idx] = { ...copy[idx], qty: Math.max(1, Number(qty) || 1) };
      return copy;
    });
  }

  function removeItem(idx){
    setItems((cur)=>cur.filter((_,i)=>i!==idx));
  }

  const total = items.reduce((s,i)=>s + ((i.price||0) * (i.qty||1)), 0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerOverlay />
      <DrawerContent className="right-0">
        <DrawerHeader>
          <div className="flex items-center justify-between w-full">
            <DrawerTitle>Cart</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2">✕</button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4">
          {(!items || items.length === 0) ? (
            <div className="py-8 text-center text-zinc-600">Your cart is empty.</div>
          ) : (
            <ul className="space-y-4">
              {items.map((it, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-zinc-600">{formatCurrency(it.price)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-zinc-600">Qty</label>
                      <input value={it.qty} onChange={(e)=>updateQty(idx, e.target.value)} type="number" min="1" className="w-20 border rounded px-2 py-1 text-sm" />
                      <button onClick={()=>removeItem(idx)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                  <div className="font-semibold">{formatCurrency((it.price||0)*(it.qty||1))}</div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between font-semibold">Total <span>{formatCurrency(total)}</span></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/shop">
                <button onClick={()=>onOpenChange(false)} className="w-full border rounded py-2">Continue shopping</button>
              </Link>
              <Link href="/checkout">
                <button onClick={()=>onOpenChange(false)} className="w-full bg-[#6b0f1a] text-white rounded py-2">Checkout</button>
              </Link>
            </div>
          </div>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
