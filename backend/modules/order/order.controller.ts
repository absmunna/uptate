import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { eventBus } from '../../services/eventBus';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'dev-user-id';

    if (!process.env.DATABASE_URL) {
      return res.json([
        {
          id: "ord-mock-1",
          orderNo: "PM-17482",
          status: "pending",
          total: 1510,
          subtotal: 1450,
          shippingFee: 60,
          deliveryAddress: "Mirpur 10, Dhaka",
          deliveryDistrict: "Dhaka",
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item-mock-1",
              title: "Premium Cotton Panjabi for Men (Regular Fit)",
              price: 1450,
              qty: 1
            }
          ]
        }
      ]);
    }

    // Filter orders by either buyerId or sellerId based on context
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        buyer: {
          select: { fullName: true, phone: true }
        },
        seller: {
          select: { shopName: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json({
        id,
        orderNo: "PM-17482",
        status: "pending",
        total: 1510,
        subtotal: 1450,
        shippingFee: 60,
        deliveryAddress: "Mirpur 10, Dhaka",
        deliveryDistrict: "Dhaka",
        paymentMethod: "cod",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        items: [
          {
            id: "item-mock-1",
            title: "Premium Cotton Panjabi for Men (Regular Fit)",
            price: 1450,
            qty: 1
          }
        ]
      });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        buyer: {
          select: { fullName: true, phone: true }
        },
        seller: {
          select: { shopName: true, fullName: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch Order Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch order detail' });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { productId, sellerId, total, deliveryAddress, deliveryDistrict, items, paymentMethod } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-user-id';

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `ord-${Date.now()}`,
        orderNo: `PM-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'pending',
        total: total || 100,
        items: items || [{ productId: productId || 'unknown', title: 'Product Lot', qty: 1, price: total }]
      });
    }

    // Fetch user or associate
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) {
      return res.status(401).json({ error: 'User must exist to place order' });
    }

    // Process order creation. Supports split multi-merchant orders!
    if (items && Array.isArray(items) && items.length > 0) {
      // Group items by vendor/seller to handle multi-seller split checkout!
      const sellerGroups: { [key: string]: any[] } = {};
      
      for (const item of items) {
        let sId = item.sellerId || item.vendor?.id;
        if (!sId) {
          // fetch product context if needed
          const prodObj = await prisma.product.findUnique({ where: { id: item.productId } });
          sId = prodObj?.sellerId || 'pk-store-ex';
        }
        if (!sellerGroups[sId]) {
          sellerGroups[sId] = [];
        }
        sellerGroups[sId].push(item);
      }

      const createdOrders = [];
      for (const [sId, groupItems] of Object.entries(sellerGroups)) {
        // Find or create default seller profile user
        let sellerUser = await prisma.user.findUnique({ where: { id: sId } });
        if (!sellerUser) {
          sellerUser = await prisma.user.findFirst({ where: { role: 'seller' } });
        }
        const sActualId = sellerUser?.id || sId;

        const subtotalSum = groupItems.reduce((acc, current) => acc + (Number(current.price) * (current.quantity || current.qty || 1)), 0);
        const orderTotal = subtotalSum + 60; // adding ৳60 shipping per merchant

        const order = await prisma.order.create({
          data: {
            buyerId: user.id,
            sellerId: sActualId,
            subtotal: subtotalSum,
            total: orderTotal,
            deliveryAddress: deliveryAddress || 'Pending Address',
            deliveryDistrict: deliveryDistrict || 'Dhaka',
            status: 'pending',
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
            items: {
              create: groupItems.map(item => ({
                productId: item.productId || item.id,
                title: item.title || item.name || 'Product Snapshot',
                price: Number(item.price),
                qty: Number(item.quantity || item.qty || 1)
              }))
            }
          },
          include: {
            items: true
          }
        });
        createdOrders.push(order);
        // Emit event for the newly created order
        await eventBus.emitEvent('ORDER_CREATED', {
          orderId: order.id,
          buyerId: order.buyerId,
          sellerId: order.sellerId,
          total: order.total
        });
      }

      return res.status(201).json(createdOrders.length === 1 ? createdOrders[0] : { multiple: true, orders: createdOrders });
    }

    // Backward compatibility code (single item creation fallback)
    let finalSellerId = sellerId || 'pk-store-ex';
    const subtotal = total || 0;

    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        sellerId: finalSellerId,
        subtotal: subtotal,
        total: total || 0,
        deliveryAddress: deliveryAddress || 'Pending Address',
        deliveryDistrict: deliveryDistrict || 'Dhaka',
        status: 'pending',
        paymentMethod: paymentMethod || 'cod',
        items: {
          create: [
            {
              productId: productId || 'unknown',
              title: 'Product Title',
              price: subtotal,
              qty: 1
            }
          ]
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Add Order Error:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.json({ id, status, message: 'Order updated in dev mode' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    // Emit event: ORDER_STATUS_UPDATED/SPECIFIC STATUS
    const eventName = `ORDER_${status.toUpperCase()}`;
    await eventBus.emitEvent(eventName, {
      orderId: order.id,
      status: order.status
    });

    res.json(order);
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

