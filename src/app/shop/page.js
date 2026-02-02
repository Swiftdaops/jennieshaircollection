"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiBase } from "@/lib/apiBase";

const apiBase = getApiBase();

function formatPrice(p) {
  if (p?.discount?.isActive) {
    if (p.discount.type === "percentage") {
      return `₦${(p.price - (p.price * p.discount.value) / 100).toLocaleString()}`;
    }
    return `₦${Math.max(p.price - p.discount.value, 0).toLocaleString()}`;
  }
  return `₦${p.price?.toLocaleString()}`;
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({ texture: null, color: null, inches: null });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [resP, resC] = await Promise.all([
          fetch(`${apiBase}/api/products`),
          fetch(`${apiBase}/api/categories`),
        ]);
        const prods = resP.ok ? await resP.json() : [];
        const cats = resC.ok ? await resC.json() : [];
        if (mounted) {
          setProducts(prods || []);
          setCategories(cats || []);
        }
      } catch (e) {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    // listen for category changes from admin and reload categories
    const onCat = () => {
      fetch(`${apiBase}/api/categories`).then(r => r.ok ? r.json() : []).then((cats) => { if (mounted) setCategories(cats || []); }).catch(()=>{});
    };
    window.addEventListener('categoriesUpdated', onCat);
    return () => (mounted = false);
  }, []);

  // derive attribute options from products
  const textures = Array.from(new Set(products.flatMap((p) => (p.attributes?.texture ? [p.attributes.texture] : []))));
  const colors = Array.from(new Set(products.flatMap((p) => (Array.isArray(p.attributes?.colors) ? p.attributes.colors : (p.attributes?.colors ? [p.attributes.colors] : [])))));
  const inches = Array.from(new Set(products.flatMap((p) => (Array.isArray(p.attributes?.inchesOptions) ? p.attributes.inchesOptions : (p.attributes?.inchesOptions ? [p.attributes.inchesOptions] : []))))).sort((a,b)=>a-b);

  function toggleFilter(key, value) {
    setFilters((s) => ({ ...s, [key]: s[key] === value ? null : value }));
  }

  // whether the currently selected category is wig-like
  const isWigCategory = Boolean(selectedCategory && /(wig|weft|extension|extensions|hair-extensions)/i.test(String(selectedCategory)));

  // toast state for category selection notification
  const [categoryToast, setCategoryToast] = useState(null);

  function handleSelectCategory(cat) {
    if (!cat) {
      setSelectedCategory(null);
      setCategoryToast('All');
    } else {
      setSelectedCategory(cat.slug || cat);
      setCategoryToast(cat.name || cat.slug || cat);
    }
    window.setTimeout(() => setCategoryToast(null), 2500);
  }

  // attribute container visibility + simple fade animation control
  const [attributesVisible, setAttributesVisible] = useState(false);

  useEffect(() => {
    let t;
    if (isWigCategory) {
      setAttributesVisible(true);
      // ensure visible class applied on next tick for transition
      t = setTimeout(() => {}, 0);
    } else {
      // wait for fade-out before removing from DOM
      t = setTimeout(() => setAttributesVisible(false), 220);
    }
    return () => clearTimeout(t);
  }, [isWigCategory]);

  const filtered = products.filter((p) => {
    const term = q.trim().toLowerCase();
    if (term) {
      const matchesTerm = (p.name || "").toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term) || (p.slug || "").toLowerCase().includes(term) || ((p.category && (p.category.name || p.category.slug)) || "").toLowerCase().includes(term);
      if (!matchesTerm) return false;
    }

    if (selectedCategory) {
      const sel = String(selectedCategory).toLowerCase();
      const prodCatSlug = typeof p.category === 'string' ? p.category : (p.category?.slug || '');
      const prodCatName = typeof p.category === 'string' ? p.category : (p.category?.name || prodCatSlug || '');
      const prodSlug = String(prodCatSlug).toLowerCase();
      const prodName = String(prodCatName).toLowerCase();
      // match on slug, name, or partial includes to be forgiving
      if (prodSlug !== sel && prodName !== sel && !prodName.includes(sel) && !prodSlug.includes(sel)) return false;
    }

    if (filters.texture) {
      if (String(p.attributes?.texture || "").toLowerCase() !== String(filters.texture).toLowerCase()) return false;
    }
    if (filters.color) {
      const colorsList = Array.isArray(p.attributes?.colors) ? p.attributes.colors.map(String) : (p.attributes?.colors ? [String(p.attributes.colors)] : []);
      if (!colorsList.map(c=>c.toLowerCase()).includes(String(filters.color).toLowerCase())) return false;
    }
    if (filters.inches) {
      const inchesList = Array.isArray(p.attributes?.inchesOptions) ? p.attributes.inchesOptions : (p.attributes?.inchesOptions ? [p.attributes.inchesOptions] : []);
      if (!inchesList.map(String).includes(String(filters.inches))) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#cea88d] text-stone-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Shop</h1>
          <p className="text-sm text-zinc-600">Browse all products</p>
        </header>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full sm:w-1/2 border border-zinc-200 rounded px-3 py-2 focus:outline-none"
          />

          <div className="flex gap-3 overflow-x-auto py-2">
            <button
              onClick={() => handleSelectCategory(null)}
              className={`flex-shrink-0 rounded-full px-4 py-2 border-2 transition-transform duration-150 ${!selectedCategory ? 'bg-white/70 scale-100' : 'bg-white/60'} border-[#6b0f1a] active:scale-95`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleSelectCategory(c)}
                className={`flex-shrink-0 rounded-full px-4 py-2 border-2 transition-transform duration-150 ${selectedCategory === c.slug ? 'bg-white/80 scale-105' : 'bg-white/60'} border-[#6b0f1a] active:scale-95`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {attributesVisible && (
          <div className={`mb-6 ${isWigCategory ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} transform transition-all duration-200 ease-out flex flex-col sm:flex-row md:flex-row sm:items-start md:items-center gap-3 w-full`}>
            {textures.length > 0 && (
              <div className="flex flex-col w-full sm:w-auto">
                <div className="text-sm text-zinc-600 mb-2 sm:mb-0 sm:mr-2 font-semibold text-center sm:text-left">Texture:</div>
                  <div className="flex gap-3 overflow-x-auto py-2 sm:py-0 md:overflow-visible md:flex-wrap md:justify-center">
                  {textures.map((t) => (
                    <button key={t} onClick={() => toggleFilter('texture', t)} aria-pressed={filters.texture===t} className={`flex-shrink-0 text-center font-semibold text-sm rounded-full px-5 py-1 md:px-4 border-2 border-[#6b0f1a] bg-white/60 backdrop-blur-sm shadow-sm transition-transform duration-150 ${filters.texture === t ? 'scale-105 bg-white/80 ring-2 ring-[#6b0f1a]/30' : 'hover:scale-105'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="flex flex-col w-full sm:w-auto">
                <div className="text-sm text-zinc-600 mb-2 sm:mb-0 sm:mr-2 font-semibold">Color:</div>
                <div className="flex gap-3 overflow-x-auto py-2 sm:py-0 md:overflow-visible md:flex-wrap md:justify-center">
                  {colors.map((c) => (
                    <button key={c} onClick={() => toggleFilter('color', c)} aria-pressed={filters.color===c} className={`flex-shrink-0 text-center font-semibold text-sm rounded-full px-5 py-1 md:px-4 border-2 border-[#6b0f1a] bg-white/60 backdrop-blur-sm shadow-sm transition-transform duration-150 ${filters.color === c ? 'scale-105 bg-white/80 ring-2 ring-[#6b0f1a]/30' : 'hover:scale-105'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {inches.length > 0 && (
              <div className="flex flex-col w-full sm:w-auto">
                <div className="text-sm text-zinc-600 mb-2 sm:mb-0 sm:mr-2 font-semibold">Inches:</div>
                <div className="flex gap-3 overflow-x-auto py-2 sm:py-0 md:overflow-visible md:flex-wrap md:justify-center">
                  {inches.map((i) => (
                    <button key={i} onClick={() => toggleFilter('inches', i)} aria-pressed={String(filters.inches)===String(i)} className={`flex-shrink-0 text-center font-semibold text-sm rounded-full px-4 py-1 md:px-3 border-2 border-[#6b0f1a] bg-white/60 backdrop-blur-sm shadow-sm transition-transform duration-150 ${String(filters.inches) === String(i) ? 'scale-105 bg-white/80 ring-2 ring-[#6b0f1a]/30' : 'hover:scale-105'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category toast (fallback if sonner not installed) */}
        {categoryToast && (
          <div className="fixed right-4 bottom-6 z-50">
            <div className="bg-white/95 text-stone-900 px-4 py-2 rounded-lg shadow-lg border border-[#6b0f1a]/10 backdrop-blur-sm">
              <div className="text-sm font-medium">Category</div>
              <div className="text-sm text-zinc-600">{categoryToast}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <Link key={p._id || p.id || p.slug} href={`/shop/${p.slug}`} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md">
                <div className="w-full h-56 sm:h-44 bg-gray-100">
                  {p.images && p.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-stone-400">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-stone-900 truncate">{p.name}</div>
                  <div className="text-sm text-stone-700 mt-1">{formatPrice(p)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
