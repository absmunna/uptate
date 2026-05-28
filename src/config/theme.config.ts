export type ThemeMode = "dark" | "midnight" | "forest" | "sunset" | "light" | "deepDark" | "colourful" | "nakshiLight" | "greenField";

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
    swatch: ["#0d0520", "#a78bfa", "#ec4899"],
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
  {
    id: "deepDark",
    label: "Deep Dark",
    labelBn: "ডিপ ডার্ক",
    description: "Original deep dark theme",
    htmlClass: "deepDark",
    swatch: ["#0d0d1a", "#f97316", "#a855f7"],
  },
  {
    id: "colourful",
    label: "Colourful",
    labelBn: "কালারফুল",
    description: "Vivid and colorful theme",
    htmlClass: "colourful",
    swatch: ["#fff1f2", "#e11d48", "#be185d"],
  },
  {
    id: "nakshiLight",
    label: "Nakshi Light",
    labelBn: "নকশী লাইট",
    description: "Soft elegant light theme",
    htmlClass: "nakshiLight",
    swatch: ["#fefcf5", "#b45309", "#92400e"],
  },
  {
    id: "greenField",
    label: "Green Field",
    labelBn: "সবুজ মাঠ",
    description: "Lush green natural theme",
    htmlClass: "greenField",
    swatch: ["#064e3b", "#34d399", "#10b981"],
  },
];

export const THEME_STORAGE_KEY = "pm.theme.v1";
