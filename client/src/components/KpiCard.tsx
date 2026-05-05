import { cn } from "@/lib/utils";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  unit,
  delta,
  hint,
  icon: Icon,
  tone = "primary",
  testId,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: { value: string; tone?: "live" | "watch" | "risk" | "neutral" };
  hint?: string;
  icon?: LucideIcon;
  tone?: "primary" | "live" | "watch" | "risk" | "neutral";
  testId?: string;
}) {
  const toneClasses: Record<string, string> = {
    primary: "text-primary",
    live: "text-[hsl(var(--signal-live))]",
    watch: "text-[hsl(var(--signal-watch))]",
    risk: "text-[hsl(var(--signal-risk))]",
    neutral: "text-foreground",
  };
  return (
    <div
      data-testid={testId}
      className="relative flex flex-col gap-2 overflow-hidden rounded-lg border border-card-border bg-card p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className={cn("h-4 w-4", toneClasses[tone])} />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("num text-2xl font-semibold tracking-tight", toneClasses[tone])}>
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {delta && (
        <div
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            delta.tone === "live"
              ? "text-[hsl(var(--signal-live))]"
              : delta.tone === "risk"
              ? "text-[hsl(var(--signal-risk))]"
              : delta.tone === "watch"
              ? "text-[hsl(var(--signal-watch))]"
              : "text-muted-foreground"
          )}
        >
          <ArrowUpRight className="h-3 w-3" />
          {delta.value}
        </div>
      )}
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  );
}
