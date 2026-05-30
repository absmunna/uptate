import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import morgan from 'morgan';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { corsMiddleware } from './middleware/cors';
import { auditMiddleware } from './middleware/audit';
import { sanitizeMiddleware } from './middleware/sanitize';
import { db } from './config/database';
import { authRoutes } from './modules/auth/auth.routes';
import { roleRoutes } from './modules/auth/role.routes';
import { productRoutes } from './modules/product/product.routes';
import { orderRoutes } from './modules/order/order.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import { escrowRoutes } from './modules/escrow/escrow.routes';
import { storageRoutes } from './modules/storage/storage.routes';
import { socialRoutes } from './modules/social/social.routes';
import { contentRoutes } from './modules/content/content.routes';
import { feedRoutes } from './modules/feed/feed.routes';
import { engagementRoutes } from './modules/engagement/engagement.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { intelligenceRoutes } from './modules/intelligence/intelligence.routes';
import { governanceRoutes } from './modules/governance/governance.routes';
import { nearbyRoutes } from './modules/nearby/nearby.routes';
import { deliveryRoutes } from './modules/delivery/delivery.routes';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io initialization
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join_room", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined room ${conversationId}`);
    });
    socket.on("send_message", (data) => {
      // Broadcast to room
      io.to(data.conversationId).emit("receive_message", data);
    });
  });

  // Initialize Database
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.set('trust proxy', 1);
  app.set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next();
  });
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined'));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);
  app.use(express.json());

  // Legacy versioned API routes (for production compatibility)
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/escrow', escrowRoutes);
  app.use('/api/v1/storage', storageRoutes);
  app.use('/api/v1/social', socialRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/feed', feedRoutes);
  app.use('/api/v1/engagement', engagementRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/intelligence', intelligenceRoutes);
  app.use('/api/v1/governance', governanceRoutes);
  app.use('/api/v1/nearby', nearbyRoutes);
  app.use('/api/v1/delivery', deliveryRoutes);
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "Paikar Mart API running" });
  });

  // Frontend-compatible API routes (used by the new UI)
  const { default: apiRouter } = await import('./api/routes/index.js');
  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();
