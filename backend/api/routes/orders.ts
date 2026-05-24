import { Router, type IRouter } from "express";
import { db, cartTotals, computeBreakdown, genId } from "../lib/db";
import type { Order, OrderItem, OrderStatus, StatusHistoryEntry } from "../lib/db";

const router: IRouter = Router();

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
};

// ── GET /api/orders  ─────────────────────────────────────────────────────────
// Returns buyer's own orders (newest first)
router.get("/orders", (_req, res) => {
  const buyer = db.orders.filter((o) => o.buyerId === db.currentUser.id);
  res.json([...buyer].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// ── GET /api/orders/all  ─────────────────────────────────────────────────────
// Admin view: all orders
router.get("/orders/all", (_req, res) => {
  res.json([...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// ── GET /api/orders/seller  ──────────────────────────────────────────────────
// Seller view: orders that contain items from vendor query param (default "v1")
router.get("/orders/seller", (req, res) => {
  const vendorId = (req.query["vendorId"] as string) ?? "v1";
  const sellerOrders = db.orders
    .filter((o) => o.items.some((i) => i.vendorId === vendorId))
    .map((o) => ({
      ...o,
      // Filter items to only those belonging to this vendor
      items: o.items.filter((i) => i.vendorId === vendorId),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(sellerOrders);
});

// ── GET /api/orders/:id  ─────────────────────────────────────────────────────
router.get("/orders/:id", (req, res) => {
  const order = db.orders.find((o) => o.id === req.params["id"]);
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json(order);
});

// ── POST /api/orders  ────────────────────────────────────────────────────────
// Buyer places a new order from their cart.
router.post("/orders", (req, res) => {
  const {
    deliveryAddress,
    deliveryDistrict,
    paymentMethod,
    notes,
    termsAccepted,
  } = req.body ?? {};

  // BD compliance: must accept terms
  if (!termsAccepted) {
    return res.status(400).json({ error: "terms_not_accepted", message: "You must accept the terms and conditions before placing an order." });
  }
  if (!deliveryAddress || String(deliveryAddress).trim().length < 10) {
    return res.status(400).json({ error: "invalid_address", message: "Please provide a full delivery address (min 10 chars)." });
  }

  const totals = cartTotals();
  if (!totals.items.length) {
    return res.status(400).json({ error: "empty_cart", message: "Your cart is empty." });
  }

  // BD compliance: compute full price breakdown
  const isInsideDhaka = String(deliveryDistrict ?? "").toLowerCase().includes("dhaka");
  const breakdown = computeBreakdown(totals.subtotal, isInsideDhaka);

  // Delivery commitment (BD e-commerce law)
  const maxDeliveryDays = isInsideDhaka ? 3 : 7;
  const expectedDelivery = new Date(Date.now() + maxDeliveryDays * 86400000).toISOString();
  const deliveryPolicy = isInsideDhaka
    ? "Delivery within 3 working days inside Dhaka (Bangladesh E-Commerce Policy)"
    : "Delivery within 7 working days outside Dhaka (Bangladesh E-Commerce Policy)";

  // Build order items with vendor linkage
  const orderItems: OrderItem[] = totals.items.map((ci: any, idx: number) => ({
    id: genId("oi"),
    productId: ci.product.id,
    productTitle: ci.product.title,
    productImage: ci.product.images?.[0] ?? "",
    vendorId: ci.product.vendor?.id ?? "v1",
    vendorName: ci.product.vendor?.name ?? "Unknown Vendor",
    unitPrice: ci.product.price,
    quantity: ci.quantity,
    lineTotal: ci.product.price * ci.quantity,
  }));

  const now = new Date().toISOString();
  const order: Order = {
    id: genId("ord"),
    orderNo: `PKM-${Date.now().toString(36).toUpperCase()}`,
    buyerId: db.currentUser.id,
    buyerName: db.currentUser.name,
    items: orderItems,
    breakdown,
    // legacy flat fields
    subtotal: breakdown.subtotal,
    vatAmount: breakdown.vatAmount,
    shippingFee: breakdown.shippingFee,
    total: breakdown.total,
    currency: "BDT",
    status: "pending",
    statusHistory: [{ status: "pending", at: now, note: "Order placed by buyer" }],
    deliveryAddress: String(deliveryAddress).trim(),
    deliveryDistrict: String(deliveryDistrict ?? "").trim(),
    isInsideDhaka,
    maxDeliveryDays,
    expectedDelivery,
    deliveryPolicy,
    paymentMethod: paymentMethod ?? "cod",
    notes: notes ?? "",
    termsAcceptedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(order);
  db.cart = []; // clear cart after successful order

  // Notify buyer
  db.notifications.unshift({
    id: genId("n"),
    type: "order",
    title: "অর্ডার সম্পন্ন হয়েছে",
    body: `${order.orderNo} — মোট ৳${breakdown.total} (৳${breakdown.subtotal} + ৳${breakdown.vatAmount} VAT + ${breakdown.shippingLabel})। ডেলিভারি: ${maxDeliveryDays} কর্মদিবস।`,
    read: false,
    createdAt: now,
  });

  res.status(201).json(order);
});

// ── PATCH /api/orders/:id/status  ────────────────────────────────────────────
// Seller or admin updates order status with validation.
router.patch("/orders/:id/status", (req, res) => {
  const { status, note } = req.body ?? {};
  const order = db.orders.find((o) => o.id === req.params["id"]);

  if (!order) return res.status(404).json({ error: "not_found" });

  const allowed = VALID_TRANSITIONS[order.status as OrderStatus] ?? [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: "invalid_transition",
      message: `Cannot move from '${order.status}' → '${status}'. Allowed: ${allowed.join(", ") || "none"}`,
    });
  }

  const now = new Date().toISOString();
  const histEntry: StatusHistoryEntry = {
    status: status as OrderStatus,
    at: now,
    note: note ?? `Status updated to ${status}`,
  };

  order.status = status as OrderStatus;
  order.statusHistory.push(histEntry);
  order.updatedAt = now;

  // Push notification to buyer
  const statusLabels: Record<string, string> = {
    processing: "প্রক্রিয়াকরণ শুরু হয়েছে",
    shipped: "পণ্য পাঠানো হয়েছে",
    delivered: "পণ্য পৌঁছে গেছে",
    cancelled: "অর্ডার বাতিল হয়েছে",
  };
  db.notifications.unshift({
    id: genId("n"),
    type: "order_status",
    title: statusLabels[status] ?? `Order ${status}`,
    body: `${order.orderNo}: ${histEntry.note}`,
    read: false,
    createdAt: now,
  });

  res.json(order);
});

export default router;
