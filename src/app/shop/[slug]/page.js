import Link from "next/link";
import AddToCartButton from '@/components/AddToCartButton';

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatPrice(p) {
  if (p?.discount?.isActive) {
    if (p.discount.type === "percentage") {
      return `₦${(p.price - (p.price * p.discount.value) / 100).toLocaleString()}`;
    }
    return `₦${Math.max(p.price - p.discount.value, 0).toLocaleString()}`;
  }
  return `₦${p.price?.toLocaleString()}`;
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let product = null;
  try {
    const res = await fetch(`${apiBase}/api/products/${encodeURIComponent(slug)}`);
    if (res.ok) product = await res.json();
  } catch (e) {
    // ignore
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <p className="mt-2 text-sm text-zinc-600">We couldn't find that product.</p>
          <div className="mt-4">
            <Link href="/shop" className="text-sm text-[#6b0f1a] underline">Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cea88d] text-stone-900 py-8">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full rounded-lg overflow-hidden bg-white shadow">
          {product.images && product.images.length > 0 ? (
              (() => {
                const first = product.images[0];
                const src = typeof first === 'string' ? first : (first?.url || first?.secure_url || '');
                return src ? <img src={src} alt={product.name} className="w-full h-[540px] object-contain object-center bg-white" /> : <div className="w-full h-[420px] flex items-center justify-center text-sm text-stone-400">No image</div>;
              })()
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center text-sm text-stone-400">No image</div>
            )}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-3 text-2xl text-stone-900 font-semibold">{formatPrice(product)}</div>

          <div className="mt-4 text-zinc-700 leading-relaxed">
            {product.description || "No description available."}
          </div>

          {product.attributes && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-700">Attributes</h3>
              <ul className="mt-2 text-sm text-zinc-600 space-y-1">
                {product.attributes.texture && <li>Texture: {product.attributes.texture}</li>}
                {product.attributes.colors && <li>Colors: {Array.isArray(product.attributes.colors) ? product.attributes.colors.join(', ') : product.attributes.colors}</li>}
                {product.attributes.inchesOptions && <li>Lengths: {Array.isArray(product.attributes.inchesOptions) ? product.attributes.inchesOptions.join(', ') : product.attributes.inchesOptions}</li>}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <AddToCartButton product={product} />
            <Link href="/shop" className="text-sm text-zinc-700 underline">Back to shop</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
