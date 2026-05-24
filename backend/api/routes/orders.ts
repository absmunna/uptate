import { Router, type IRouter } from "express";
import { db, cartTotals, genId } from "../lib/db";

const router: IRouter = Router();

router.get("/orders", (_req, res) => {
  res.json(
    [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
});

router.get("/orders/:id", (req, res) => {
  const order = db.orders.find((o) => (o as any).id === req.params["id"]);
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json(order);
});

router.post("/orders", (req, res) => {
  const {
    deliveryAddress,
    deliveryDistrict,
    paymentMethod,
    notes,
    termsAccepted,
  } = req.body ?? {};

  // BD compliance: terms must be accepted at checkout
  if (!termsAccepted) {
    return res.status(400).json({ error: "terms must be accepted before placing an order" });
  }

  const totals = cartTotals();
  if (!totals.items.length) {
    return res.status(400).json({ error: "empty_cart" });
  }

  if (!deliveryAddress) {
    return res.status(400).json({ error: "deliveryAddress required" });
  }

  // BD compliance: price breakdown (base + VAT 5% + shipping)
  const subtotal = totals.subtotal;
  const vatRate = 0.05; // 5% VAT
  const vatAmount = Math.round(subtotal * vatRate);
  const isInsideDhaka = (String(deliveryDistrict ?? "")).toLowerCase().includes("dhaka");
  const shippingFee = subtotal >= 1000 ? 0 : isInsideDhaka ? 60 : 120;
  const total = subtotal + vatAmount + shippingFee;

  // BD compliance: max delivery commitment
  const maxDeliveryDays = isInsideDhaka ? 3 : 7;
  const expectedDelivery = new Date(Date.now() + maxDeliveryDays * 86400000).toISOString();

  const order = {
    id: genId("ord"),
    orderNo: `PKM-${Date.now().toString(36).toUpperCase()}`,
    buyerId: db.currentUser.id,
    items: totals.items,
    status: "pending",
    // BD compliance: full BDT price transparency
    subtotal,
    vatRate: (vatRate * 100).toFixed(0) + "%",
    vatAmount,
    shippingFee,
    discountAmount: 0,
    total,
    currency: "BDT",
    priceBreakdown: {
      basePrice: subtotal,
      vat: `${(vatRate * 100).toFixed(0)}% VAT = ৳${vatAmount}`,
      shipping: shippingFee === 0 ? "Free (order above ৳1,000)" : `৳${shippingFee} (${isInsideDhaka ? "inside Dhaka" : "outside Dhaka"})`,
      total: `৳${total}`,
    },
    deliveryAddress: deliveryAddress ?? "",
    deliveryDistrict: deliveryDistrict ?? "",
    maxDeliveryDays,
    expectedDelivery,
    deliveryPolicy: isInsideDhaka
      ? "Delivery within 3 working days inside Dhaka"
      : "Delivery within 7 working days outside Dhaka",
    paymentMethod: paymentMethod ?? "cod",
    notes: notes ?? "",
    termsAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  db.cart = [];

  db.notifications.unshift({
    id: genId("n"),
    type: "order",
    title: "অর্ডার সম্পন্ন হয়েছে",
    body: `অর্ডার ${order.orderNo} তৈরি হয়েছে। মোট: ৳${total} (VAT + ডেলিভারি সহ)। ডেলিভারি: ${maxDeliveryDays} কর্মদিবস।`,
    read: false,
    createdAt: order.createdAt,
  });

  res.status(201).json(order);
});

export default router;
