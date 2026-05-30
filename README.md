# PaikarMart Super App

PaikarMart is a modern, high-performance social commerce and premium e-commerce super app built with React, Vite, Tailwind CSS, and Zustand. It features a stunning glassmorphism UI, seamless cross-portal state management, and a highly responsive design bridging desktop and mobile experiences perfectly.

## 🚀 Features

- **Glassmorphism UI**: Beautiful, translucent, and premium aesthetics across all components.
- **Dynamic Portals**:
  - **Global Marketplace**: (New) The central commerce hub aggregating products, stores, services, and factories from all other portals.
  - **B2C Feed**: Geolocation-filtered social feed, marketplace, and dynamic promotions.
  - **PK Store**: Exclusive premium brand portal with PK Coin cashbacks.
  - **B2B Wholesale**: Bulk order management and factory-direct sourcing.
  - **Nearby Shop**: Hyper-local commerce for physical stores with trade license verification.
- **Super Wallet Dashboard**: Dual-currency wallet managing fiat (BDT) and reward points (PK Coins) with live transactions.
- **Global Cart System**: Slide-out cart drawer accessible anywhere, managing multi-portal items via Zustand state.
- **Responsive Architecture**: Strict mobile-first but fully desktop-optimized layout with fixed viewport scroll areas for a native app feel.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Zustand (Persisted Storage)
- **Backend API**: Node.js, Express
- **Database**: PostgreSQL (hosted on Supabase), paired with Prisma ORM
- **Routing**: React Router DOM v7

## 🚀 Deployment Strategy

- **Frontend**: Vercel (Deployed via GitHub Push)
- **Backend**: Railway (Node.js/Express)
- **Database**: Supabase
- **Local Dev File Sync**: Create an `.env` matching `.env.example` using your respective Vercel, Railway, and Supabase credentials.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Postgres (Local or Supabase account)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client (run if schema changes):
   ```bash
   npx prisma generate
   ```
4. Start the development server (Frontend + Backend concurrently):
   ```bash
   npm run dev
   ```

## 🏗️ Pending Features & Agent Notes
- Check `IN_BUILD_FEATURES.md` for the roadmap of features currently under development (e.g., Live Wallet, Live Chat, Real Payment Gateways).
- Check `AGENTS.md` for AI Assistant guidelines and security notes regarding the stack.

## 🏗️ Proposed Modular Architecture

The application is currently transitioning to a more modular architecture for enhanced scalability:

```text
src/
├── components/                      # 🏛️ Core Global UI (Buttons, Inputs, GlassCard)
├── modules/                         # 🚀 Core Portal System
│   ├── commerce-core/               # 🔄 Shared Marketplace Base (B2C & B2B Shared)
│   ├── retail-b2c/                  # 🛍️ Retail Portal (B2C Specific)
│   ├── wholesale-b2b/               # 📦 Wholesale Portal (B2B Specific)
│   ├── digital-ott/                 # 🎬 OTT & Subscription Portal
│   └── logistics-ride/              # 🚗 Ride Sharing & Delivery Portal
```

### Building for Production

```bash
npm run build
```

## 📐 Architecture & Layout Rules

The application uses a strict layout definition in `RootLayout.tsx` to ensure proper native-app-like scrolling:
- The outer viewport is fixed (`h-[100dvh] overflow-hidden`).
- Sidebars (desktop only) and the main content area (`<main>`) have independent scroll states (`overflow-y-auto`).
- Absolute/Sticky elements (like Navbar and BottomNav) are constrained within their relative parent containers to avoid viewport overlapping bugs.

## 🤝 Contribution

Make sure to run `npm run lint` before committing any changes. Keep UI modifications strictly within the defined CSS variables (`var(--pm-bg)`, `var(--pm-accent)`, etc.) to preserve the global theme switcher functionality.
