import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([]);
    }

    // In a real app we would use user id from token to filter:
    // const userId = req.user.id;
    const orders = await prisma.order.findMany({
      include: {
        product: true
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-user-id'; // using mock user format

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({ id: `ord-${Date.now()}`, productId, userId, status: 'pending' });
    }

    let user = await prisma.user.findFirst();
    if (!user) {
       return res.status(401).json({ error: 'User must exist to place order' });
    }

    const order = await prisma.order.create({
      data: {
        productId,
        userId: user.id,
        status: 'pending'
      },
      include: {
        product: true
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
      return res.json({ message: 'Order updated in dev mode' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
