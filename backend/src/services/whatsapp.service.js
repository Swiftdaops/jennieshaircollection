export const generateWhatsAppLink = order => {
  const lines = order.items.map(
    item => `• ${item.name} x${item.quantity} – ₦${item.price}`
  );

  const message = `
Hello 👋

My name is ${order.customerName}.
I want to confirm my order:

${lines.join("\n")}

Total: ₦${order.totalAmount}

Thank you 💖
`;

  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encoded}`;
};
