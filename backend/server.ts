import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import morgan from 'morgan';
import { helmetMiddleware } from './middleware/helmet';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { corsMiddleware } from './middleware/cors';
import { auditMiddleware } from './middleware/audit';
import { sanitizeMiddleware } from './middleware/sanitize';
import { db } from './config/database';
import { authRoutes } from './modules/auth/auth.routes';
import { productRoutes } from './modules/product/product.routes';
import { orderRoutes } from './modules/order/order.routes';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5000', 10);

  // Initialize Database
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined'));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);
  app.use(express.json());

  // Legacy versioned API routes (for production compatibility)
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();
