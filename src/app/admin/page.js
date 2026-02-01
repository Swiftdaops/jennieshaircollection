"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import AdminWelcome from "../../components/admin/AdminWelcome";

export default function AdminIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [loading, user, router]);


  useEffect(() => {
    async function loadInsights() {
      setLoadingInsights(true);
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "https://jennieshairsbackend.onrender.com") + "/api/orders/insights", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setInsights(data);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoadingInsights(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://jennieshairsbackend.onrender.com";

  async function handleMarkBestSeller() {
    const id = window.prompt("Enter product ID to mark as best seller:");
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isBestSeller: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to update product');
      } else {
        alert('Product updated as best seller');
        // refresh insights
        const r = await fetch(`${apiBase}/api/orders/insights`, { credentials: 'include' });
        if (r.ok) setInsights(await r.json());
      }
    } catch (e) {
      alert(e.message || 'Request failed');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-stone-950">

      <div className="mt-6">
        <AdminWelcome
          pendingOrders={insights?.ordersByStatus?.pending || 0}
          weeklySales={
            insights
              ? (insights.topProducts || []).reduce((s, p) => s + (p.totalSales || 0), 0)
              : 0
          }
        />
      </div>

      <section className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => router.push('/admin/stock')}
          className="bg-zinc-800 text-white px-4 py-2 rounded shadow-sm hover:opacity-90">
          Stock
        </button>

        <button
          onClick={() => router.push('/admin/discounts/new')}
          className="bg-zinc-700 text-white px-4 py-2 rounded shadow-sm hover:opacity-90">
          Add Discount
        </button>

        <button
          onClick={() => router.push('/admin/orders')}
          className="bg-white border border-zinc-200 px-4 py-2 rounded shadow-sm hover:bg-zinc-50">
          View Orders
        </button>

        <button
          onClick={handleMarkBestSeller}
          disabled={actionLoading}
          className="bg-amber-600 text-white px-4 py-2 rounded shadow-sm hover:opacity-90 disabled:opacity-60">
          {actionLoading ? 'Updating...' : 'Mark Best Seller'}
        </button>
      </section>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-zinc-600">Today's Orders</h3>
          <div className="mt-2 text-3xl font-semibold">{insights ? insights.todaysOrders : '—'}</div>
          <p className="mt-1 text-sm text-zinc-500">Orders placed today</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-zinc-600">Pending WhatsApp Confirmations</h3>
          <div className="mt-2 text-3xl font-semibold">{insights ? insights.pendingWhatsAppConfirmations : '—'}</div>
          <p className="mt-1 text-sm text-zinc-500">Awaiting WhatsApp confirmation</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-zinc-600">Low Stock Products</h3>
          <div className="mt-2 text-3xl font-semibold">{insights ? insights.lowStockCount : '—'}</div>
          <p className="mt-1 text-sm text-zinc-500">Products below reorder threshold</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-zinc-600">Active Discounts</h3>
          <div className="mt-2 text-3xl font-semibold">{insights ? insights.activeDiscountsCount : '—'}</div>
          <p className="mt-1 text-sm text-zinc-500">Currently applied discounts</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium ">Best Sellers Count</h3>
          <div className="mt-2 text-3xl font-semibold">{insights ? insights.bestSellersCount : '—'}</div>
          <p className="mt-1 text-sm text-zinc-500">Top selling products</p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Top 5 Selling Products</h2>
          {loadingInsights ? (
            <p className="mt-2 text-sm">Loading...</p>
          ) : ((insights?.topProducts || []).length === 0) ? (
            <p className="mt-3 text-sm text-zinc-500">No sales yet</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(insights?.topProducts || []).map((p) => (
                <li key={String(p._id.id)} className="flex justify-between">
                  <span>{p._id.name}</span>
                  <span className="font-semibold">₦{Number(p.totalSales || 0).toLocaleString('en-NG')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Orders by Status</h2>
          {loadingInsights ? (
            <p className="mt-2 text-sm">Loading...</p>
          ) : (
            <ul className="mt-3 space-y-2">
              <li className="flex justify-between"><span>Pending</span><span className="font-semibold">{insights?.ordersByStatus?.pending || 0}</span></li>
              <li className="flex justify-between"><span>Confirmed</span><span className="font-semibold">{insights?.ordersByStatus?.confirmed || 0}</span></li>
              <li className="flex justify-between"><span>Delivered</span><span className="font-semibold">{insights?.ordersByStatus?.delivered || 0}</span></li>
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Category Performance</h2>
          {loadingInsights ? (
            <p className="mt-2 text-sm">Loading...</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(insights?.categoryPerf || []).map((c) => (
                <li key={c.category} className="flex justify-between">
                  <span>{c.category}</span>
                  <span className="font-semibold">{c.totalQty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
