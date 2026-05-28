import * as React from "react";
import { Check, Palette, ChevronDown, Languages, Sparkles, Globe, Settings2 } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/config/theme.config";

interface ThemeSwitcherProps {
  onClose?: () => void;
  defaultOpen?: boolean;
  showTitle?: boolean;
}

/**
 * Highly polished Theme Switcher component.
 * Restores the detailed collapsible accordion "drawer" system you loved.
 * Features customizable active previews, interactive theme-colored indicator jewels,
 * detailed choice description lists, and tactile animation scales.
 */
export function ThemeSwitcher({ onClose, defaultOpen = true }: ThemeSwitcherProps) {
  const { mode, setMode, presets } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const activePreset = presets.find((p) => p.id === mode);

  return (
    <div className="flex flex-col gap-2.5 group/theme w-full">
      {/* 1. Accordion Drawer Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border transition-all duration-300 outline-none cursor-pointer",
          "bg-[var(--pm-surface-hover)]/30 border-[var(--pm-border)] hover:border-primary/40",
          "hover:bg-[var(--pm-surface)] shadow-xs active:scale-[0.99] select-none"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Swatch circular badge illustrating color mix */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-inner border border-white/10 shrink-0 select-none">
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover/theme:rotate-120"
              style={{
                background: `linear-gradient(135deg, ${activePreset?.swatch[0] || "#13131f"} 0%, ${activePreset?.swatch[1] || "#f97316"} 50%, ${activePreset?.swatch[2] || "#a855f7"} 100%)`,
              }}
            />
            <div className="absolute inset-1.5 bg-[var(--pm-surface)] rounded-full flex items-center justify-center">
              <Palette className="w-2.5 h-2.5 text-primary" />
            </div>
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-black text-[var(--pm-text)] tracking-wide flex items-center gap-1.5 uppercase font-mono">
              {t("theme.title")}
              <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
            </span>
            <span className="text-[9.5px] text-[var(--pm-text-muted)] font-semibold leading-none">
              {activePreset?.labelBn} • {activePreset?.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-[var(--pm-text-muted)] transition-transform duration-300 ease-out",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </div>
      </button>

      {/* 2. Collapsible Expanded Drawer containing detailed choice cards */}
      {isOpen && (
        <div className="bg-[var(--pm-surface)]/30 border border-[var(--pm-border)]/50 rounded-2xl p-2.5 grid grid-cols-1 xs:grid-cols-2 gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
          {presets.map((p) => {
            const active = mode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setMode(p.id as ThemeMode);
                  onClose?.();
                }}
                className={cn(
                  "relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 cursor-pointer text-left overflow-hidden",
                  "border bg-[var(--pm-surface)]/80 hover:bg-[var(--pm-surface-hover)] select-none",
                  active
                    ? "border-primary bg-[var(--pm-surface-hover)] shadow-sm ring-1 ring-primary/25 scale-[1.01]"
                    : "border-[var(--pm-border)]/60 hover:border-[var(--pm-text-muted)]/40"
                )}
                title={p.description}
              >
                {/* Advanced Multi-Color Paint Block */}
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-black/10">
                  <div className="absolute inset-0" style={{ backgroundColor: p.swatch[0] }} />
                  <div
                    className="absolute right-0 top-0 w-1/2 h-full opacity-90 transition-all duration-300"
                    style={{ backgroundColor: p.swatch[1] }}
                  />
                  <div
                    className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-80"
                    style={{ backgroundColor: p.swatch[2] }}
                  />
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[0.5px]">
                      <Check className="h-4.5 w-4.5 text-white stroke-[3.5px] drop-shadow-sm" />
                    </div>
                  )}
                </div>

                {/* Info Text Column */}
                <div className="flex flex-col min-w-0 leading-tight">
                  <span
                    className={cn(
                      "text-[10.5px] font-bold leading-normal truncate",
                      active ? "text-primary font-black" : "text-[var(--pm-text)]"
                    )}
                  >
                    {p.labelBn}
                  </span>
                  <span className="text-[8.5px] text-[var(--pm-text-muted)] font-medium truncate leading-none mt-0.5">
                    {p.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 
 * Custom Segmented Language control built for hyper-compact layouts.
 * Renders as a single beautifully-contained capsule block.
 */
export function LanguageSwitcher({ onClose }: { onClose?: () => void }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-2 p-1.5 bg-[var(--pm-surface)]/80 rounded-2xl border border-[var(--pm-border)] min-h-[44px] w-full select-none">
      <span className="text-[10.5px] font-black text-[var(--pm-text-secondary)] px-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
        <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="hidden xs:inline-block leading-none">
          {lang === "bn" ? "ভাষা সেটিংস" : "Language"}
        </span>
      </span>
      
      <div className="flex items-center gap-1 p-0.5 bg-[var(--pm-surface-hover)] rounded-xl border border-[var(--pm-border)]/50 shrink-0">
        {(["en", "bn"] as const).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                onClose?.();
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[10.5px] font-black tracking-widest transition-all cursor-pointer flex items-center gap-1",
                active
                  ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                  : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]"
              )}
            >
              <span>{l === "en" ? "EN" : "বাং"}</span>
              {active && <span className="w-1 h-1 rounded-full bg-current" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Highly compact circular trigger for themes */
export function ThemeToggleBtn({ onClick }: { onClick: () => void }) {
  const { mode, presets } = useTheme();
  const preset = presets.find((p) => p.id === mode);

  return (
    <button
      onClick={onClick}
      title="Toggle settings & themes"
      className={cn(
        "relative h-9 w-9 rounded-xl flex items-center justify-center border transition-all duration-300 group cursor-pointer overflow-hidden active:scale-95",
        "border-[var(--pm-border)] hover:border-primary/40 bg-[var(--pm-surface)] shadow-xs select-none"
      )}
    >
      <div
        className="absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-25"
        style={{
          background: `radial-gradient(circle at center, ${preset?.swatch[1] || "#f97316"} 0%, ${preset?.swatch[2] || "#a855f7"} 100%)`,
        }}
      />
      
      <div 
        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white/20 shadow-xs transition-transform duration-300 group-hover:scale-115"
        style={{
          background: `linear-gradient(135deg, ${preset?.swatch[1] || "#f97316"}, ${preset?.swatch[2] || "#a855f7"})`,
        }}
      />

      <Palette className="h-4.5 w-4.5 text-[var(--pm-text-secondary)] group-hover:text-primary transition-colors relative z-10 duration-200" />
    </button>
  );
}

/** Highly compact toggle button for changing language instantly with a single tap */
export function LanguageToggleBtn({ onClick }: { onClick: () => void }) {
  const { lang } = useLanguage();

  return (
    <button
      onClick={onClick}
      title="Change language preference"
      className={cn(
        "relative h-9 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all duration-300 group cursor-pointer active:scale-95",
        "border-[var(--pm-border)] hover:border-primary/40 bg-[var(--pm-surface)] text-[var(--pm-text-secondary)] hover:text-primary shadow-xs select-none"
      )}
    >
      <Languages className="h-4 w-4 text-primary/80 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
      <span className="text-[10px] font-black tracking-wider uppercase font-mono">
        {lang === "bn" ? "বাং" : "EN"}
      </span>
    </button>
  );
}
