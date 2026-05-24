import { Router, type IRouter } from "express";
import { db, cartTotals, genId } from "../lib/db";

const router: IRouter = Router();

router.get("/cart", (_req, res) => res.json(cartTotals()));

router.post("/cart", (req, res) => {
  const { productId, quantity } = req.body ?? {};
  if (!productId || !quantity)
    return res.status(400).json({ error: "invalid" });
  const product = db.products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: "not_found" });
  const existing = db.cart.find((c) => c.productId === productId);
  if (existing) existing.quantity += Number(quantity);
  else
    db.cart.push({ id: genId("ci"), productId, quantity: Number(quantity) });
  res.status(201).json(cartTotals());
});

router.delete("/cart/:itemId", (req, res) => {
  db.cart = db.cart.filter((c) => c.id !== req.params["itemId"]);
  res.json(cartTotals());
});

export default router;
