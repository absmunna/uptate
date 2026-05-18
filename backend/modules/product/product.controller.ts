import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      // Return empty array for dev fallback
      return res.json([]);
    }

    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, images, isPKStore, category, stock } = req.body;
    
    // In a real application, you would attach the sellerId from the logged-in user's token.
    // Assuming 'dev-seller-id' as a fallback seller id.
    const sellerId = req.headers['x-user-id'] as string || 'dev-seller-id';

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `prod-${Date.now()}`,
        name,
        description,
        price,
        originalPrice,
        images,
        isPKStore,
        category,
        stock,
        sellerId
      });
    }

    // Ensure the dummy seller user exists or link to one.
    // For demo robustness, if no robust user, handle gracefully.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo-seller@paikarmart.com',
          name: 'Demo Seller',
          password: 'hashedpassword',
          role: 'seller'
        }
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || name,
        price,
        originalPrice,
        images: images || [],
        isPKStore: !!isPKStore,
        category: category || null,
        stock: stock || 0,
        sellerId: user.id
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json({ message: 'Product deleted in dev mode' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
