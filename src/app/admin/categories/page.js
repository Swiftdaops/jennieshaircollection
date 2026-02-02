"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch(`${apiBase}/api/categories`)
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((data) => mounted && setCategories(data || []))
      .catch((err) => {
        console.error("Failed to load categories", err);
        if (mounted) setCategories([]);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6 text-stone-950">
      <h1 className="text-xl font-semibold mb-4">Categories</h1>

      {categories.map((c) => (
        <div key={c._id} className="flex items-center justify-between border-b py-2">
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-zinc-500">{c.slug}</div>
            {c.description ? <div className="text-xs text-zinc-600">{c.description}</div> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(c.slug)}>Copy slug</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (!confirm(`Delete category "${c.name}"? This cannot be undone.`)) return;
                try {
                  const res = await fetch(`${apiBase}/api/categories/${c._id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  if (!res.ok) throw new Error('Failed to delete');
                  setCategories((prev) => prev.filter((x) => x._id !== c._id));
                  // notify other pages to refresh categories
                  try { window.dispatchEvent(new Event('categoriesUpdated')); } catch(e) {}
                } catch (err) {
                  console.error(err);
                  alert('Failed to delete category');
                }
              }}
            >
              Delete
            </Button>
            {editingId === c._id ? (
              <>
                <Button size="sm" onClick={async () => {
                  try {
                    const res = await fetch(`${apiBase}/api/categories/${c._id}`, {
                      method: 'PUT',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: editingName, description: editingDescription }),
                    });
                    if (!res.ok) throw new Error('Failed to update');
                    const updated = await res.json();
                    setCategories((prev) => prev.map((it) => it._id === updated._id ? updated : it));
                    setEditingId(null);
                    try { window.dispatchEvent(new Event('categoriesUpdated')); } catch(e) {}
                  } catch (err) {
                    console.error(err);
                    alert('Failed to update category');
                  }
                }}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
              </>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => {
                setEditingId(c._id);
                setEditingName(c.name || '');
                setEditingDescription(c.description || '');
              }}>Edit</Button>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4">
        <Button
          className="bg-[#cea88d] text-stone-950 hover:bg-[#bfa178]"
          style={{ backgroundColor: '#cea88d', color: '#111827' }}
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Close' : 'New Category'}
        </Button>

        {showForm && (
          <div className="mt-3 p-4 border rounded bg-white">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={async () => {
                try {
                  const res = await fetch(`${apiBase}/api/categories`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                  });
                  if (!res.ok) throw new Error('Failed to create');
                  const created = await res.json();
                  setCategories((prev) => [created, ...prev]);
                  try { window.dispatchEvent(new Event('categoriesUpdated')); } catch(e) {}
                  setName('');
                  setDescription('');
                  setShowForm(false);
                } catch (err) {
                  console.error(err);
                  alert('Failed to create category');
                }
              }}>Create</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setName(''); setDescription(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
