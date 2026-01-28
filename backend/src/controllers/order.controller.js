import Order from "../models/Order.js";
import { generateWhatsAppLink } from "../services/whatsapp.service.js";

export const checkoutOrder = async (req, res) => {
  const order = await Order.create({
    ...req.body,
    status: "pending",
    source: "whatsapp",
  });

  const whatsappLink = generateWhatsAppLink(order);
  res.json({ orderId: order._id, whatsappLink });
};

export const getOrders = async (_, res) => {
  const orders = await Order.find().sort("-createdAt");
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};
