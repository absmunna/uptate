import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_PRESETS, THEME_STORAGE_KEY, type ThemeMode, type ThemePreset } from "@/config/theme.config";

/* Ensure bg-background body class toggles per theme */
const BG_OVERRIDES: Partial<Record<ThemeMode, string>> = {
  dark:     "#04070f",
  midnight: "#0d0520",
  forest:   "#040f0b",
  sunset:   "#0f0702",
  light:    "#f8fafc",
};

interface ThemeCtx {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  presets: ThemePreset[];
}

const ThemeContext = createContext<ThemeCtx | null>(null);

function readStored(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (v && THEME_PRESETS.some((p) => p.id === v)) return v;
  } catch {}
  return "dark";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  THEME_PRESETS.forEach((p) => html.classList.remove(p.htmlClass));
  const preset = THEME_PRESETS.find((p) => p.id === mode);
  if (preset) html.classList.add(preset.htmlClass);
  html.dataset.theme = mode;
  // Sync <meta theme-color> and body bg for overscroll areas
  const bg = BG_OVERRIDES[mode];
  if (bg) {
    document.body.style.backgroundColor = bg;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    meta.content = bg;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored());

  useEffect(() => {
    applyTheme(mode);
    try { window.localStorage.setItem(THEME_STORAGE_KEY, mode); } catch {}
  }, [mode]);

  const value = useMemo<ThemeCtx>(() => ({
    mode,
    setMode: (m) => setModeState(m),
    presets: THEME_PRESETS,
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
