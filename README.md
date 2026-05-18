# PaikarMart Super App

PaikarMart is a modern, high-performance social commerce and premium e-commerce super app built with React, Vite, Tailwind CSS, and Zustand. It features a stunning glassmorphism UI, seamless cross-portal state management, and a highly responsive design bridging desktop and mobile experiences perfectly.

## 🚀 Features

- **Glassmorphism UI**: Beautiful, translucent, and premium aesthetics across all components.
- **Dynamic Portals**:
  - **B2C Feed**: Geolocation-filtered social feed, marketplace, and dynamic promotions.
  - **PK Store**: Exclusive premium brand portal with PK Coin cashbacks.
  - **B2B Wholesale**: (Upcoming) Bulk order management.
- **Super Wallet Dashboard**: Dual-currency wallet managing fiat (BDT) and reward points (PK Coins) with live transactions.
- **Global Cart System**: Slide-out cart drawer accessible anywhere, managing multi-portal items via Zustand state.
- **Responsive Architecture**: Strict mobile-first but fully desktop-optimized layout with fixed viewport scroll areas for a native app feel.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion (for micro-interactions)
- **State Management**: Zustand (Persisted Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
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
