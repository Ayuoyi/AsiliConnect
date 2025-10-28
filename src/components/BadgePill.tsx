import React from "react";
import { cn } from "@/lib/utils";

type Variant = "yellow" | "emerald" | "red" | "sky" | "default";

interface BadgePillProps {
  icon?: React.ReactElement;
  label: string;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const variantClasses: Record<Variant, string> = {
  yellow: "bg-yellow-50 text-yellow-800",
  emerald: "bg-emerald-50 text-emerald-800",
  red: "bg-red-50 text-red-800",
  sky: "bg-sky-50 text-sky-800",
  default: "bg-muted text-foreground",
};

const BadgePill = ({ icon, label, variant = "default", className, ariaLabel, title }: BadgePillProps) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel || label}
      title={title || label}
      className={cn("inline-flex items-center gap-2 px-2 py-0.5 rounded-full shadow", variantClasses[variant], className)}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export default BadgePill;
