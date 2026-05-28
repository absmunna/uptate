import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import morgan from 'morgan';
import { helmetMiddleware } from './backend/middleware/helmet';
import { rateLimitMiddleware } from './backend/middleware/rateLimit';
import { corsMiddleware } from './backend/middleware/cors';
import { auditMiddleware } from './backend/middleware/audit';
import { sanitizeMiddleware } from './backend/middleware/sanitize';
import { db } from './backend/config/database';
import { authRoutes } from './backend/modules/auth/auth.routes';
import { productRoutes } from './backend/modules/product/product.routes';
import { orderRoutes } from './backend/modules/order/order.routes';
import { demandRoutes } from './backend/modules/demand/demand.routes';
import { feedRoutes } from './backend/modules/feed/feed.routes';
import { walletRoutes } from './backend/modules/wallet/wallet.routes';
import fs from "fs";

/* --------------------------------------------------------------
   ১️⃣  Environment Variables Load
   -------------------------------------------------------------- */
dotenv.config(); // Railway এবং Cloud Run এ এটি অটোমেটিক এনভায়রনমেন্ট ভেরিয়েবল লোড করবে।


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize Database
  // Don't await this if it fails or there is no DB, so it doesn't block startup
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined', {
    skip: (req) => !req.url.startsWith('/api/v1/')
  }));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);
  app.use(express.json());

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/demands', demandRoutes);
  app.use('/api/v1/feed', feedRoutes);
  app.use('/api/v1/wallet', walletRoutes);

  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "Paikar Mart API running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve frontend from dist
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
