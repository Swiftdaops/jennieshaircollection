"use client";

import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatMoney(n) {
  return `₦${(n || 0).toLocaleString()}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/orders`, { credentials: 'include' });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    try {
      const res = await fetch(`${apiBase}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((s) => s.map(o => o._id === updated._id ? updated : o));
      }
    } catch (e) { console.error(e); }
  }

  async function removeOrder(id) {
    if (!confirm('Delete this order?')) return;
    try {
      const res = await fetch(`${apiBase}/api/orders/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setOrders((s) => s.filter(o => o._id !== id));
    } catch (e) { console.error(e); }
  }

  async function sendReceipt(order) {
    if (!order.email) return alert('Order has no email to send to.');

    const service = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!service || !template || !publicKey) return alert('EmailJS not configured.');

    const itemsText = (order.items || []).map(it => `${it.name} x${it.quantity} — ₦${it.price}`).join('\n');

    const templateParams = {
      to_name: order.customerName,
      to_email: order.email,
      order_id: order._id,
      items: itemsText,
      total: formatMoney(order.totalAmount),
      status: order.status,
    };

    try {
      await emailjs.send(service, template, templateParams, publicKey);
      alert('Receipt sent');
    } catch (e) {
      console.error(e);
      alert('Failed to send receipt');
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {loading && <div>Loading…</div>}
      {!loading && orders.length === 0 && <div>No orders yet.</div>}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="p-4 bg-white rounded shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{order.customerName} — {order.whatsappNumber} {order.email ? `— ${order.email}` : ''}</div>
                <div className="text-sm text-zinc-600">{new Date(order.createdAt).toLocaleString()}</div>
                <div className="mt-2 text-sm">{(order.items || []).map(it => <div key={it.productId}>{it.name} × {it.quantity} — ₦{it.price}</div>)}</div>
                <div className="mt-2 font-semibold">Total: {formatMoney(order.totalAmount)}</div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-sm">Status: <span className="font-medium">{order.status}</span></div>
                <div className="flex flex-col gap-2 mt-2">
                  <button onClick={() => changeStatus(order._id, 'accepted')} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                  <button onClick={() => changeStatus(order._id, 'in_transit')} className="px-3 py-1 bg-amber-500 text-white rounded">In transit</button>
                  <button onClick={() => changeStatus(order._id, 'delivered')} className="px-3 py-1 bg-sky-600 text-white rounded">Delivered</button>
                  <button onClick={() => removeOrder(order._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  <button onClick={() => sendReceipt(order)} className="px-3 py-1 bg-lime-600 text-white rounded">Send Receipt</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    return () => { mounted = false; };
  }, []);

  function sanitizePhone(phone) {
    if (!phone) return "";
    // keep digits and leading +
    const cleaned = phone.toString().trim().replace(/[^0-9+]/g, "");
    // remove leading zeros
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
