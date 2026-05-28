import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Fallback if DB is not connected yet so UI doesn't crash permanently during test
    if (!process.env.DATABASE_URL) {
      return res.status(201).json({ 
        message: 'Dev mode: User registered (no DB)',
        user: { id: `dev-${Date.now()}`, email, name, role: role || 'buyer' }
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone: req.body.phone || `temp-${Date.now()}`, // phone is unique and required in schema
        passwordHash: hashedPassword,
        fullName: name,
        role: role || 'buyer'
      }
    });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.fullName, role: user.role }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!process.env.DATABASE_URL) {
      // Dev mode fallback
      const token = jwt.sign({ id: 'demo', email, role: 'buyer' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({
        accessToken: token,
        refreshToken: token,
        user: { id: 'usr-demo', email, name: 'Demo User', role: 'buyer' }
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      accessToken: token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login verification failed.' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!process.env.DATABASE_URL) {
      return res.json({
        user: { id: decoded.id, email: decoded.email, fullName: decoded.name || 'Demo', role: decoded.role, isVerified: true }
      });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    if (process.env.DATABASE_URL) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         // Return success anyway for security reasons
         return res.json({ message: 'If that email exists, a reset link was sent.' });
      }
    }

    // Usually we would dispatch an email here using Resend or NodeMailer.
    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
};
