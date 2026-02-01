"use client";

import { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://jennieshairsbackend.onrender.com";

export default function InnerCircleAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/inner-circle`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this signup?')) return;
    try {
      const res = await fetch(`${apiBase}/api/inner-circle/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete');
      setItems((s) => s.filter(i => i._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Inner Circle Signups</h2>
      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div>No signups yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Joined</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-b">
                  <td className="px-4 py-2">{it.email}</td>
                  <td className="px-4 py-2">{it.name || '-'}</td>
                  <td className="px-4 py-2">{it.phone || '-'}</td>
                  <td className="px-4 py-2">{new Date(it.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(it._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
