export type ThemeMode = "dark" | "midnight" | "forest" | "sunset" | "light";

export interface ThemePreset {
  id: ThemeMode;
  label: string;
  labelBn: string;
  description: string;
  htmlClass: string;
  /** Swatch colors for the picker */
  swatch: [string, string, string];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "dark",
    label: "Cyber Dark",
    labelBn: "সাইবার ডার্ক",
    description: "Deep navy with cyan neon",
    htmlClass: "dark",
    swatch: ["#04070f", "#22d3ee", "#60a5fa"],
  },
  {
    id: "midnight",
    label: "Midnight",
    labelBn: "মিডনাইট",
    description: "Deep purple with violet glow",
    htmlClass: "midnight",
    swatch: ["#0d0520", "#a78bfa", "#ec4899"],
  },
  {
    id: "forest",
    label: "Forest",
    labelBn: "ফরেস্ট",
    description: "Dark teal with emerald accent",
    htmlClass: "forest",
    swatch: ["#040f0b", "#34d399", "#6ee7b7"],
  },
  {
    id: "sunset",
    label: "Sunset",
    labelBn: "সানসেট",
    description: "Warm dark with amber glow",
    htmlClass: "sunset",
    swatch: ["#0f0702", "#fbbf24", "#fb923c"],
  },
  {
    id: "light",
    label: "Light",
    labelBn: "লাইট",
    description: "Clean bright UI",
    htmlClass: "light",
    swatch: ["#f8fafc", "#0891b2", "#6366f1"],
  },
];

export const THEME_STORAGE_KEY = "pm.theme.v1";
