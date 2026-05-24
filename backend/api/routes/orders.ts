import { Router, type IRouter } from "express";
import { db, cartTotals, genId } from "../lib/db";

const router: IRouter = Router();

router.get("/orders", (_req, res) => {
  res.json(
    [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
});

router.post("/orders", (_req, res) => {
  const totals = cartTotals();
  if (!totals.items.length)
    return res.status(400).json({ error: "empty_cart" });
  const order = {
    id: genId("ord"),
    items: totals.items,
    total: totals.subtotal,
    currency: totals.currency,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(order);
  db.cart = [];
  db.notifications.unshift({
    id: genId("n"),
    type: "order",
    title: "Order placed",
    body: `Order ${order.id} created (BDT ${order.total}).`,
    read: false,
    createdAt: order.createdAt,
  });
  res.status(201).json(order);
});

export default router;
