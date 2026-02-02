export function whatsappLink(text) {
  const phoneRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const phone = String(phoneRaw).replace(/\D/g, "");
  const encoded = encodeURIComponent(String(text || ""));
  if (phone) return `https://wa.me/${phone}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}
