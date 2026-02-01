"use client";

import { useEffect, useMemo, useState } from "react";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0, category: '', tags: '', discount: '' });
  const [newImagesFiles, setNewImagesFiles] = useState([]);
  const colorOptions = [
    'Platinum Blonde',
    'Jet Black',
    'Natural Black',
    'Brown',
    'Honey Brown',
    'Dark Brown',
    'Ash Blonde',
  ];

  // store selected colors for new product
  const [newProductColors, setNewProductColors] = useState([]);

  /* ----------------------------- responsive page size ----------------------------- */
  useEffect(() => {
    const applySize = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setPageSize(isMobile ? 10 : 20);
      setPage(1);
    };
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  /* -------------------------------- data loading -------------------------------- */
  useEffect(() => {
    fetch(`${apiBase}/api/products`, { credentials: "include" })
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));

    // load categories for admin filter
    fetch(`${apiBase}/api/categories`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
    // refresh categories when updated elsewhere
    const onCat = () => {
      fetch(`${apiBase}/api/categories`).then(r => r.ok ? r.json() : []).then(setCategories).catch(()=>{});
    };
    window.addEventListener('categoriesUpdated', onCat);
    return () => window.removeEventListener('categoriesUpdated', onCat);
  }, []);

  /* -------------------------------- filtering -------------------------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q) {
        const match = (p.name || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedCategory) {
        const prodCat = typeof p.category === 'string' ? p.category : (p.category?.slug || p.category?.name || '');
        const sel = String(selectedCategory).toLowerCase();
        if (!String(prodCat).toLowerCase().includes(sel)) return false;
      }

      return true;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /* -------------------------------- pagination -------------------------------- */
  const changePage = (next) => {
    if (next === page) return;
    setIsExiting(true);
    setTimeout(() => {
      setPage(next);
      setIsExiting(false);
    }, 150);
  };

  /* -------------------------------- api helpers -------------------------------- */
  async function updateStock(id, stock) {
    try {
      await fetch(`${apiBase}/api/products/${id}/stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock }),
      });
    } catch {
      alert("Failed to update stock");
    }
  }

  // update product general fields
  async function saveProduct(id, values) {
    try {
      await fetch(`${apiBase}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      // optimistic update locally
      setProducts((prev) => prev.map(p => p._id === id ? { ...p, ...values } : p));
      setEditingId(null);
    } catch (e) {
      alert('Failed to save product');
    }
  }

  // upload image file(s) to backend (Cloudinary) and return array of urls
  async function uploadImages(files) {
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const res = await fetch(`${apiBase}/api/uploads/product-images`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const urls = await res.json();
      return urls.map((u) => ({ url: u, publicId: '' }));
    } catch (e) {
      alert('Image upload failed');
      return [];
    }
  }

  async function createProduct(payload) {
    try {
      const res = await fetch(`${apiBase}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('create failed');
      const created = await res.json();
      setProducts((p) => [created, ...p]);
      setAdding(false);
      setNewProduct({ name: '', price: 0, stock: 0, category: '', tags: '' });
    } catch (e) {
      alert('Failed to create product');
    }
  }

  function formatPriceValue(p) {
    if (p === undefined || p === null) return '';
    return `₦${Number(p).toLocaleString()}`;
  }

  /* -------------------------------- render -------------------------------- */
  return (
    <div className="min-h-screen px-3 py-4 sm:p-6 space-y-4 text-stone-950 overflow-x-hidden">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">Stock</h1>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            className="flex-1 sm:flex-none w-full sm:w-72 border rounded px-3 py-2"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={selectedCategory || ""}
            onChange={(e) => {
              const v = e.target.value || null;
              setSelectedCategory(v);
              setPage(1);
            }}
            className="w-full sm:w-48 border rounded px-3 py-2 bg-white"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-zinc-500">No products found</div>
      )}

      {/* add product */}
      <div className="">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdding((s) => !s)}
            className="bg-[#cea88d] text-stone-950 px-4 py-2 rounded-md shadow-sm hover:shadow-md hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-[#cea88d]/40 active:scale-95"
          >
            {adding ? 'Close' : 'Add product'}
          </button>
        </div>

        {adding && (
          <div className="mt-3 bg-[#cea88d]/20 p-3 rounded space-y-3">
            {/* Primary inputs: Name, Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-sm block mb-1 font-medium">Name</label>
                <input className="w-full border rounded px-2 py-1" placeholder="Product name" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name:e.target.value})} aria-label="Name" />
              </div>
              <div>
                <label className="text-sm block mb-1 font-medium">Price</label>
                <input type="number" className="w-full border rounded px-2 py-1" placeholder="Price" value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct, price:Number(e.target.value)})} aria-label="Price" />
              </div>
              <div>
                <label className="text-sm block mb-1 font-medium">Stock</label>
                <input type="number" className="w-full border rounded px-2 py-1" placeholder="Stock" value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock:Number(e.target.value)})} aria-label="Stock" />
              </div>
            </div>

            {/* Secondary inputs: Category, Discount, Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-sm block mb-1 font-medium">Category</label>
                <select className="w-full border rounded px-2 py-1" value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct, category:e.target.value})} aria-label="Category">
                  <option value="">Select category</option>
                  {categories.map(c=> <option key={c._id} value={c.slug || c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1 font-medium">Discount %</label>
                <input type="number" min={1} max={100} className="w-full border rounded px-2 py-1" placeholder="1-100" value={newProduct.discount} onChange={(e)=>setNewProduct({...newProduct, discount: e.target.value})} aria-label="Discount percent" />
                <div className="text-xs text-zinc-500">Leave empty for no discount</div>
              </div>
              <div>
                <label className="text-sm block mb-1 font-medium">Tags</label>
                <input className="w-full border rounded px-2 py-1" placeholder="Tags (comma separated)" value={newProduct.tags} onChange={(e)=>setNewProduct({...newProduct, tags:e.target.value})} aria-label="Tags" />
              </div>
            </div>

            {/* Colors selector for wigs */}
            {String(newProduct.category || '').toLowerCase().includes('wig') && (
              <div>
                <label className="text-sm block mb-1 font-medium">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => {
                    const selected = newProductColors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setNewProductColors((s) =>
                            s.includes(c) ? s.filter((x) => x !== c) : [...s, c]
                          );
                        }}
                        className={`px-2 py-1 rounded border ${selected ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {c}
                      </button>
                    );
                  })}
                  <input
                    placeholder="Add color..."
                    className="border rounded px-2 py-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const v = e.target.value.trim();
                        if (v && !newProductColors.includes(v)) setNewProductColors((s) => [...s, v]);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-2">
              <label className="text-sm block mb-1 font-medium">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewImagesFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="w-full"
              />
              {newImagesFiles && newImagesFiles.length > 0 && (
                <div className="text-xs text-zinc-600 mt-1">{newImagesFiles.length} file(s) selected</div>
              )}
            </div>

                <div className="flex justify-end">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transform transition active:scale-95" onClick={async ()=>{
                const d = newProduct.discount === '' ? null : Number(newProduct.discount);
                if (d !== null && (isNaN(d) || d < 1 || d > 100)) { alert('Discount must be a number between 1 and 100'); return; }
                const payload = { ...newProduct, tags: newProduct.tags ? newProduct.tags.split(',').map(t=>t.trim()) : [] };
                if (d !== null) payload.discount = { type: 'percentage', value: d, isActive: true };
                // include colors into attributes when category is wigs
                if (String(newProduct.category || '').toLowerCase().includes('wig') && newProductColors.length > 0) {
                  payload.attributes = { ...(payload.attributes || {}), colors: newProductColors };
                }
                // normalize category string to ObjectId
                if (payload.category && typeof payload.category === 'string') {
                  const cat = categories.find(c => (c.slug || c.name).toString().toLowerCase() === String(payload.category).toLowerCase());
                  if (cat) payload.category = cat._id;
                }
                // upload images first if any selected
                try {
                  if (newImagesFiles && newImagesFiles.length > 0) {
                    const urls = await uploadImages(newImagesFiles);
                    if (urls && urls.length > 0) payload.images = urls;
                  }
                } catch (e) {
                  console.error('Image upload failed', e);
                  alert('Image upload failed');
                  return;
                }
                await createProduct(payload);
                setNewImagesFiles([]);
                setNewProductColors([]);
              }}>Create</button>
            </div>
          </div>
        )}
      </div>

      {/* list */}
      <div
        className={`space-y-3 transition-all duration-300 ${
          isExiting ? "opacity-0 translate-y-3" : "opacity-100"
        }`}
      >
        {pageItems.map((p, idx) => (
          <div
            key={p._id}
            className="bg-[#cea88d]/10 shadow rounded p-3 sm:p-4 max-w-full overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* left */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-full">
                <div className="text-xs text-zinc-500 w-6 flex-shrink-0">
                  {(currentPage - 1) * pageSize + idx + 1}.
                </div>

                <img
                  src={p.images?.[0]?.url || "/file.svg"}
                  alt=""
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                  <div className="font-medium break-words line-clamp-2">
                    {p.name}
                  </div>

                  <div className="text-sm text-zinc-600 mt-1 flex flex-wrap gap-3">
                    <div className="text-xs">{formatPriceValue(p.price)}</div>
                    <div className="text-xs">Stock: <span className="font-medium">{p.stock ?? 0}</span></div>
                    <div className="text-xs">Category: <span className="font-medium">{(typeof p.category === 'string') ? p.category : (p.category?.name || p.category?.slug)}</span></div>
                    {p.tags?.length > 0 && <div className="text-xs">Tags: <span className="font-medium">{Array.isArray(p.tags)?p.tags.join(', '):String(p.tags)}</span></div>}
                    {p.sku && <div className="text-xs">SKU: <span className="font-medium">{p.sku}</span></div>}
                  </div>

                  {p.attributes && (
                    <table className="text-sm mt-1 w-full table-fixed">
                      <tbody>
                        {Object.entries(p.attributes).map(([k, v]) => (
                          <tr key={k}>
                            <th className="pr-2 font-semibold whitespace-nowrap">
                              {k}
                            </th>
                            <td className="text-zinc-700 break-words truncate">
                              {Array.isArray(v)
                                ? v.join(", ")
                                : String(v)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* right */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="number"
                  defaultValue={p.stock}
                  className="w-full sm:w-24 border rounded px-2 py-1"
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    setProducts((prev) =>
                      prev.map((x) =>
                        x._id === p._id ? { ...x, stock: v } : x
                      )
                    );
                    updateStock(p._id, v);
                  }}
                />

                <button
                  className="border px-3 py-1 rounded"
                  onClick={() => {
                    setEditingId(p._id);
                    // normalize images to objects {url, publicId}
                    const imgs = (p.images || []).map((it) => {
                      if (!it) return null;
                      if (typeof it === 'string') return { url: it, publicId: '' };
                      if (it.url) return it;
                      // fallback: try to read secure_url or toString
                      return { url: String(it), publicId: '' };
                    }).filter(Boolean);
                    setEditValues({ ...p, images: imgs });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* edit panel */}
            {editingId === p._id && (
              <div className="mt-3 bg-[#cea88d]/20 p-3 rounded space-y-2">
                  {/* Primary inputs: Name, Price, Stock (edit) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm block mb-1 font-medium">Name</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={editValues.name || ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1 font-medium">Price</label>
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={editValues.price || 0}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1 font-medium">Stock</label>
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={editValues.stock || 0}
                        onChange={(e) => setEditValues({ ...editValues, stock: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Secondary: Category */}
                  <div className="mt-2">
                    <label className="text-sm block mb-1 font-medium">Category</label>
                    <select className="w-full border rounded px-2 py-1" value={editValues.category?.slug || editValues.category || ''} onChange={(e)=>{
                      const v = e.target.value;
                      setEditValues({...editValues, category: v});
                    }}>
                      <option value="">Choose category</option>
                      {categories.map(c => <option key={c._id} value={c.slug || c.name}>{c.name}</option>)}
                    </select>
                  </div>

                <div className="flex gap-2">
                  <input className="flex-1 border rounded px-2 py-1" placeholder="Tags (comma separated)" value={Array.isArray(editValues.tags) ? editValues.tags.join(', ') : (editValues.tags || '')} onChange={(e)=>{ setEditValues({...editValues, tags: e.target.value}); }} />
                </div>
                {/* Image upload */}
                <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex gap-2 items-start flex-wrap">
                          {(editValues.images || []).length > 0 ? (
                            (editValues.images || []).map((img, i) => {
                              const url = typeof img === 'string' ? img : img.url || img.secure_url || '';
                              return (
                                <div key={i} className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => {
                                    // remove image locally
                                    setEditValues((s) => ({ ...s, images: (s.images || []).filter((_, idx) => idx !== i) }));
                                  }} className="absolute top-0 right-0 bg-white text-black rounded-bl px-2 py-1 text-xs">Delete</button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs text-zinc-500">No image</div>
                          )}

                          <div className="flex flex-col">
                            <label className="cursor-pointer inline-flex items-center">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files || files.length === 0) return;
                                  const imgs = await uploadImages(files);
                                  if (imgs.length > 0) setEditValues((s) => ({ ...s, images: [...(s.images || []), ...imgs] }));
                                }}
                              />
                              <span className="bg-black text-white px-4 py-2 rounded font-medium">Upload Image</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => setEditValues((s) => ({ ...s, images: [] }))}
                              className="bg-white text-black border px-3 py-2 rounded mt-2"
                            >
                              Remove All
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-zinc-500 mt-2">Or paste an image URL to use instead</div>
                        <input
                          type="text"
                          placeholder="Paste image URL"
                          value={(editValues.images && editValues.images[0]) ? (typeof editValues.images[0] === 'string' ? editValues.images[0] : (editValues.images[0].url || '')) : ''}
                          onChange={(e) => setEditValues((s) => ({ ...s, images: [{ url: e.target.value, publicId: '' }, ...(s.images || []).slice(1)] }))}
                          className="mt-2 border rounded px-2 py-2 w-full"
                        />
                      </div>
                    </div>
                </div>
                {/* Colors selector for wigs in edit */}
                {String(editValues.category || '').toLowerCase().includes('wig') && (
                  <div className="mt-2">
                    <label className="text-sm block mb-1 font-medium">Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((c) => {
                        const current = editValues.attributes?.colors || editValues.colors || [];
                        const selected = Array.isArray(current) && current.includes(c);
                        return (
                          <button key={c} type="button" onClick={() => {
                            setEditValues((s) => {
                              const prev = s.attributes?.colors || s.colors || [];
                              const next = prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c];
                              return { ...s, attributes: { ...(s.attributes || {}), colors: next } };
                            });
                          }} className={`px-2 py-1 rounded border ${selected ? 'bg-black text-white' : 'bg-white text-black'}`}>{c}</button>
                        );
                      })}
                      <input placeholder="Add color..." className="border rounded px-2 py-1" onKeyDown={(e)=>{ if (e.key==='Enter'){ e.preventDefault(); const v=e.target.value.trim(); if(v){ setEditValues((s)=>({ ...s, attributes:{ ...(s.attributes||{}), colors: [ ...(s.attributes?.colors||[]), v ] } })); } e.target.value=''; } }} />
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Discount %</label>
                    <input type="number" min={1} max={100} className="w-28 border rounded px-2 py-1" value={editValues.discount?.value ?? (editValues.discount || '')} onChange={(e)=>{
                      const v = e.target.value;
                      // store as nested discount object preview
                      setEditValues({...editValues, discount: v === '' ? null : { type: 'percentage', value: Number(v), isActive: true }});
                    }} />
                  </div>

                  <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={() => {
                    // assemble payload
                    const payload = {
                      name: editValues.name,
                      price: Number(editValues.price || 0),
                      stock: Number(editValues.stock || 0),
                      category: editValues.category || undefined,
                      tags: editValues.tags ? (Array.isArray(editValues.tags) ? editValues.tags : String(editValues.tags).split(',').map(t=>t.trim())) : [],
                    };
                    if (editValues.images && editValues.images.length > 0) payload.images = editValues.images;
                    // include attributes (colors etc.) if present
                    if (editValues.attributes) payload.attributes = editValues.attributes;
                    // normalize category to ObjectId when category is a slug/name string
                    if (payload.category && typeof payload.category === 'string') {
                      const cat = categories.find(c => (c.slug || c.name).toString().toLowerCase() === String(payload.category).toLowerCase());
                      if (cat) payload.category = cat._id;
                    }
                    const disc = editValues.discount;
                    if (disc && disc.value !== undefined && disc.value !== null) {
                      const v = Number(disc.value);
                      if (isNaN(v) || v < 1 || v > 100) { alert('Discount must be between 1 and 100'); return; }
                      payload.discount = { type: 'percentage', value: v, isActive: true };
                    } else {
                      payload.discount = { isActive: false, value: 0 };
                    }
                    saveProduct(editingId, payload);
                  }}>
                    Save
                  </button>
                  <button
                    className="border px-3 py-1 rounded"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between text-sm pt-4">
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
