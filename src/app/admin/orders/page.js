"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://jennieshairsbackend.onrender.com";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch(`${apiBase}/api/orders`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((data) => mounted && setOrders(data || []))
      .catch((err) => {
        console.error("Failed to load orders", err);
        if (mounted) setOrders([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function sanitizePhone(phone) {
    if (!phone) return "";
    const cleaned = phone.toString().trim().replace(/[^0-9+]/g, "");
    return cleaned.replace(/^0+/, "");
  }

  function shareOrder(order) {
    const name = order.customerName || order.customer?.name || "Customer";
    const total = order.totalAmount ?? order.total ?? 0;
    const text = `Hello ${name},\n\nHere’s a summary of your order from our store:\n\nOrder ID: ${order._id}\nTotal: ₦${total}\n\nWe’ll confirm shortly. Thank you for choosing us 💕`;

    const phone = sanitizePhone(order.whatsappNumber || order.customer?.phone || "");
    const encoded = encodeURIComponent(text);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  }

  return (
    <div className="px-4 py-4 sm:p-6 space-y-4 text-stone-950">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((o) => (
          <div key={o._id} className="p-4 bg-white/60 backdrop-blur-sm rounded-md border">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Order {String(o._id).slice(-6)}</div>
              <div className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="mt-2 text-sm">
              <div className="truncate">{o.customerName || o.customer?.name}</div>
              <div className="text-xs text-muted-foreground">{o.whatsappNumber || o.customer?.phone}</div>
              <div className="mt-2">Total: <span className="font-semibold">₦{o.totalAmount ?? o.total}</span></div>
              <div className="mt-1">Status: <span className="inline-block px-2 py-0.5 text-xs rounded bg-muted">{o.status}</span></div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => shareOrder(o)}>Share</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/table: hidden on small screens */}
      <div className="hidden md:block">
        <Table className="text-stone-950">
          <TableHeader className="text-stone-950">
            <TableRow className="text-stone-950">
              <TableHead className="text-stone-950">ID</TableHead>
              <TableHead className="text-stone-950">Customer</TableHead>
              <TableHead className="text-stone-950">WhatsApp</TableHead>
              <TableHead className="text-stone-950">Total</TableHead>
              <TableHead className="text-stone-950">Status</TableHead>
              <TableHead className="text-stone-950">Date</TableHead>
              <TableHead className="text-stone-950" />
            </TableRow>
          </TableHeader>

          <TableBody className="text-stone-950">
            {orders.map((o) => (
              <TableRow key={o._id} className="text-stone-950">
                <TableCell className="text-stone-950">{String(o._id).slice(-6)}</TableCell>
                <TableCell className="text-stone-950">{o.customerName || o.customer?.name}</TableCell>
                <TableCell className="text-stone-950">{o.whatsappNumber || o.customer?.phone}</TableCell>
                <TableCell className="text-stone-950">₦{o.totalAmount ?? o.total}</TableCell>
                <TableCell className="text-stone-950">{o.status}</TableCell>
                <TableCell className="text-stone-950">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-stone-950">
                  <Button size="sm" variant="outline" onClick={() => shareOrder(o)}>
                    Share
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
