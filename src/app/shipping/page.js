export const metadata = {
  title: "Shipping & Returns",
  description:
    "Learn about our shipping process and our special-case return policy for luxury wigs and hair products.",
};

import WhatsAppHelp from "@/components/WhatsAppHelp";

export default function ShippingPage() {
  return (
    <section className="w-full bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Shipping & Returns
        </h1>

        {/* SHIPPING */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-stone-900">
            Shipping Information
          </h2>
          <p className="mt-3 text-stone-700 leading-relaxed">
            All orders are carefully processed and shipped within{" "}
            <strong>1–3 business days</strong>. Once your order has been
            dispatched, you will receive a confirmation message with tracking
            details where available.
          </p>

          <p className="mt-3 text-stone-700 leading-relaxed">
            Delivery times may vary depending on your location and courier
            service. Please note that delays caused by couriers, customs, or
            unforeseen circumstances are outside our control.
          </p>
        </div>

        {/* RETURNS */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-stone-900">
            Returns & Exchanges
          </h2>

          <p className="mt-3 text-stone-700 leading-relaxed">
            Due to the nature of our products and for hygiene reasons, we do{" "}
            <strong>not offer open returns or exchanges</strong>.
          </p>

          <p className="mt-4 text-stone-700 leading-relaxed">
            However, we may accept returns{" "}
            <strong>only in special cases</strong> where we can confidently
            confirm that:
          </p>

          <ul className="mt-4 list-disc list-inside text-stone-700 space-y-2">
            <li>The item has <strong>not been worn or used</strong></li>
            <li>The item is <strong>not damaged</strong> in any way</li>
            <li>The item is returned in its <strong>original condition and packaging</strong></li>
          </ul>

          <p className="mt-4 text-stone-700 leading-relaxed">
            All return requests are reviewed on a{" "}
            <strong>case-by-case basis</strong>. Approval is at our sole
            discretion after inspection of the item.
          </p>

          <p className="mt-4 text-stone-700 leading-relaxed">
            If your return request is approved, further instructions will be
            provided. Items sent back without prior approval will not be
            accepted.
          </p>
        </div>

        {/* CONTACT */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-stone-900">
            Need Assistance?
          </h2>
          <p className="mt-3 text-stone-700 leading-relaxed">
            If you have questions about shipping or believe your order qualifies
            for a special-case return, please contact our support team before
            taking any action.
          </p>
          <div className="mt-6">
            <WhatsAppHelp />
          </div>
        </div>
      </div>
    </section>
  );
}
