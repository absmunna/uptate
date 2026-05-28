import * as React from "react";
import { ArrowLeft, X, ArrowLeftCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onBack?: () => void;
  className?: string;
  variant?: "glass" | "outline" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
}

/**
 * Premium BackButton with micro-interactions, responsive sizing,
 * theme matching, hover translation shifts, and active clicks.
 */
export function BackButton({ onBack, className, variant = "glass", size = "md", ...props }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onBack) {
      onBack();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const sizeCls = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
  }[size];

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
  }[size];

  const variantCls = {
    glass: "backdrop-blur-md bg-[var(--pm-surface)]/60 border border-[var(--pm-border)] text-[var(--pm-text)]/85 hover:text-primary hover:bg-[var(--pm-surface-hover)] hover:border-primary/40 shadow-sm",
    outline: "bg-transparent border border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:text-primary hover:border-primary/50 hover:bg-[var(--pm-surface-hover)]",
    solid: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md",
    ghost: "bg-transparent text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]",
  }[variant];

  return (
    <button
      onClick={handleBack}
      className={cn(
        "group flex items-center justify-center transition-all duration-300 ease-out active:scale-95 select-none cursor-pointer hover:shadow-xs",
        sizeCls,
        variantCls,
        className
      )}
      aria-label="Go back"
      {...props}
    >
      <ArrowLeft 
        className={cn(
          "stroke-[2.5px] transition-transform duration-300 group-hover:-translate-x-0.5",
          iconSize
        )} 
      />
    </button>
  );
}

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
  className?: string;
  variant?: "glass" | "outline" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
}

/**
 * Premium CloseButton with responsive red state indicators, rotation animation on hover,
 * glass/surface matching, and standard touch areas.
 */
export function CloseButton({ onClose, className, variant = "glass", size = "md", ...props }: CloseButtonProps) {
  const sizeCls = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
  }[size];

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
  }[size];

  const variantCls = {
    glass: "backdrop-blur-md bg-[var(--pm-surface)]/60 border border-[var(--pm-border)] text-[var(--pm-text)]/80 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 shadow-sm",
    outline: "bg-transparent border border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5",
    solid: "bg-rose-500 text-white hover:bg-rose-600 shadow-md",
    ghost: "bg-transparent text-[var(--pm-text-muted)]/80 hover:text-rose-500 hover:bg-rose-500/8 border border-transparent hover:border-rose-500/10",
  }[variant];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className={cn(
        "group flex items-center justify-center transition-all duration-300 ease-out active:scale-95 select-none cursor-pointer",
        sizeCls,
        variantCls,
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X 
        className={cn(
          "stroke-[2.5] transition-transform duration-300 group-hover:rotate-90",
          iconSize
        )} 
      />
    </button>
  );
}
