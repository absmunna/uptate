import * as React from "react";
import { Check, Palette } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/config/theme.config";

export function ThemeSwitcher({ onClose }: { onClose?: () => void }) {
  const { mode, setMode, presets } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">
        {t("theme.title")}
      </p>
      <div className="grid grid-cols-5 gap-2">
        {presets.map((p) => {
          const active = mode === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { setMode(p.id as ThemeMode); onClose?.(); }}
              title={p.label}
              className={cn(
                "flex flex-col items-center gap-1.5 group cursor-pointer",
              )}
            >
              {/* Swatch circle */}
              <div
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 transition-all duration-200 overflow-hidden",
                  active
                    ? "border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "border-white/20 hover:border-white/50 hover:scale-105",
                )}
                style={{ background: p.swatch[0] }}
              >
                {/* Split swatch: 2 accent colors */}
                <div
                  className="absolute left-0 top-0 w-1/2 h-full"
                  style={{ background: p.swatch[1], opacity: 0.9 }}
                />
                <div
                  className="absolute right-0 bottom-0 w-1/2 h-1/2"
                  style={{ background: p.swatch[2], opacity: 0.8 }}
                />
                {active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="h-4 w-4 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <span className={cn(
                "text-[9px] font-medium text-center leading-tight transition-colors",
                active ? "text-white" : "text-white/45 group-hover:text-white/70",
              )}>
                {p.labelBn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Compact icon trigger for the header */
export function ThemeToggleBtn({ onClick }: { onClick: () => void }) {
  const { mode, presets } = useTheme();
  const preset = presets.find((p) => p.id === mode);

  return (
    <button
      onClick={onClick}
      title="Change theme"
      className="relative h-9 w-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-white/25 transition-all group"
      style={{ background: preset?.swatch[0] ?? "#04070f" }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-70"
        style={{ background: `linear-gradient(135deg, ${preset?.swatch[1] ?? "#22d3ee"}33, ${preset?.swatch[2] ?? "#60a5fa"}22)` }}
      />
      <Palette className="h-3.5 w-3.5 text-white/80 relative z-10 group-hover:text-white transition-colors" />
    </button>
  );
}
