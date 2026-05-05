import { cn } from "@/lib/utils";

type Tone = "live" | "watch" | "risk" | "info" | "primary" | "neutral";

const toneClass: Record<Tone, string> = {
  live: "signal-live",
  watch: "signal-watch",
  risk: "signal-risk",
  info: "signal-info",
  primary: "signal-primary",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function SignalPill({
  tone = "neutral",
  children,
  className,
  testId,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <span
      data-testid={testId}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function CredibilityBadge({ score }: { score: string }) {
  const tone: Tone =
    score === "HIGH" ? "live" : score === "MEDIUM" ? "watch" : "risk";
  return (
    <SignalPill tone={tone} testId={`badge-credibility-${score}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {score}
    </SignalPill>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let tone: Tone = "info";
  if (s.includes("live") || s.includes("complete")) tone = "live";
  else if (s.includes("under construction")) tone = "primary";
  else if (s.includes("announced") || s.includes("planning") || s.includes("planned"))
    tone = "watch";
  return <SignalPill tone={tone}>{stage}</SignalPill>;
}

export function CountryBadge({ country }: { country: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {country}
    </span>
  );
}
