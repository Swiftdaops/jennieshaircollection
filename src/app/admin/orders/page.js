"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers"; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { apiClient } from "@/lib/apiClient";
import { Loader2, Share2 } from "lucide-react"; // Nice icons for the UI

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we are authenticated
    if (authLoading) return;
    
    let mounted = true;
    setDataLoading(true);

    apiClient
      .get("/api/orders")
      .then(({ data }) => {
        if (mounted) setOrders(data || []);
      })
      .catch((err) => {
        console.error("Failed to load orders", err);
      })
      .finally(() => {
        if (mounted) setDataLoading(false);
      });

    return () => { mounted = false; };
  }, [authLoading]);

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount || 0).replace('NGN', '₦');
  }

  function sanitizePhone(phone) {
    if (!phone) return "";
    const cleaned = phone.toString().trim().replace(/[^0-9]/g, "");
    // If it starts with 0, replace with 234 for WhatsApp international format
    return cleaned.startsWith('0') ? `234${cleaned.slice(1)}` : cleaned;
  }

  function shareOrder(order) {
    const name = order.customerName || order.customer?.name || "Customer";
    const total = formatCurrency(order.totalAmount ?? order.total ?? 0);
    const text = `Hello ${name},\n\nHere’s a summary of your order from Jennie's Hairs:\n\nOrder ID: ${String(order._id).slice(-6)}\nTotal: ${total}\n\nWe’ll confirm shortly. Thank you for choosing us 💕`;

    const phone = sanitizePhone(order.whatsappNumber || order.customer?.phone || "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  async function updateStatus(id, newStatus) {
    try {
      const { data } = await apiClient.put(`/api/orders/${id}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (String(o._id) === String(id) ? { ...o, status: data.status } : o)));
    } catch (err) {
      console.error('Failed to update status', err);
      alert((err?.response && err.response.data && err.response.data.message) || err.message || 'Could not update status');
    }
  }

  // Loading State
  if (authLoading || dataLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-8 space-y-6 text-stone-900 bg-white/50 min-h-screen rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
        <div className="text-sm text-stone-500">{orders.length} total orders</div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-stone-300 text-center">
          <p className="text-stone-500 italic">No orders found in the database.</p>
        </div>
      )}

      {/* Mobile: stacked cards */}
      <div className="space-y-4 md:hidden">
        {orders.map((o) => (
          <div key={o._id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                #{String(o._id).slice(-6)}
              </span>
              <span className="text-xs text-stone-500">
                {new Date(o.createdAt).toLocaleDateString()}
              </span>
            </div>
              <div className="space-y-1">
              <div className="font-semibold text-lg">{o.customerName || o.customer?.name}</div>
              <div className="text-sm text-stone-500 font-mono">{o.whatsappNumber || o.customer?.phone}</div>
              <div className="text-sm text-stone-500">{o.email || o.customer?.email || 'No email'}</div>
              <div className="text-sm text-stone-600 mt-1">{o.address || o.deliveryAddress || o.customer?.address || 'No delivery address'}</div>
              <div className="pt-2 text-stone-900">
                Total: <span className="font-bold">{formatCurrency(o.totalAmount ?? o.total)}</span>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-stone-600">
              <div className="font-medium mb-2">Items</div>
              {o.items?.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <div className="truncate">{it.name} <span className="text-stone-400">x{it.quantity}</span></div>
                  <div className="ml-4 font-mono">{formatCurrency((it.price || 0) * (it.quantity || 1))}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-stone-500">Status</label>
                <select
                  value={o.status || 'pending'}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="w-full mt-1 border rounded px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              <Button 
                className="w-36 bg-stone-900 hover:bg-stone-800"
                size="sm" 
                onClick={() => shareOrder(o)}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/table */}
      {orders.length > 0 && (
        <div className="hidden md:block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-stone-50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id} className="hover:bg-stone-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-stone-400">
                    {String(o._id).slice(-6)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {o.customerName || o.customer?.name}
                  </TableCell>
                  <TableCell className="text-sm text-stone-600">
                    {o.whatsappNumber || o.customer?.phone}
                  </TableCell>
                  <TableCell className="text-sm text-stone-600">
                    {o.email || o.customer?.email || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-stone-600 max-w-xs truncate">
                    {o.address || o.deliveryAddress || o.customer?.address || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-stone-600">
                      {o.items?.slice(0, 3).map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="truncate">{it.name} <span className="text-stone-400">x{it.quantity}</span></div>
                          <div className="ml-3 font-mono">{formatCurrency((it.price || 0) * (it.quantity || 1))}</div>
                        </div>
                      ))}
                      {o.items?.length > 3 && <span className="text-stone-400">+{o.items.length - 3} more</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(o.totalAmount ?? o.total)}
                  </TableCell>
                    <TableCell className="text-sm">
                      <select
                        value={o.status || 'pending'}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </TableCell>
                  <TableCell className="text-sm text-stone-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => shareOrder(o)} className="hover:bg-green-50 hover:text-green-700">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}