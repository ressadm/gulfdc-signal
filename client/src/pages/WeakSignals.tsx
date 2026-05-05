import { PageHeader } from "@/components/PageHeader";
import { SignalPill, CountryBadge } from "@/components/Signal";
import { dataset } from "@/data/dataset";
import { AlertTriangle, Radio, Sparkles, GitBranch, ShieldAlert } from "lucide-react";

export default function WeakSignals() {
  const watch = dataset.watch_items;
  const inflated = dataset.supply_events.filter(
    (e) =>
      e.contradiction_inflation_notes &&
      (e.contradiction_inflation_notes.toLowerCase().includes("inflation") ||
        e.contradiction_inflation_notes.toLowerCase().includes("aspirational") ||
        e.contradiction_inflation_notes.toLowerCase().includes("unverified") ||
        e.contradiction_inflation_notes.toLowerCase().includes("not contracted") ||
        e.contradiction_inflation_notes.toLowerCase().includes("inconsistencies"))
  );

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Early & Weak Signals"
        title="Emerging trends, contradictions and inflated-project flags"
        description="The forward-looking watchlist: oversupply / undersupply hypotheses, inflated projects, and the four watch streams (pricing, power, supply chain, regulatory)."
      />

      {/* Hypotheses */}
      <section className="px-4 py-6 lg:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Oversupply / undersupply hypotheses</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {watch.oversupply_undersupply_hypotheses.map((h, i) => {
            const tone =
              h.direction.toLowerCase().includes("oversupply")
                ? "risk"
                : h.direction.toLowerCase().includes("undersupply")
                ? "live"
                : h.direction.toLowerCase().includes("execution")
                ? "watch"
                : "info";
            return (
              <article
                key={i}
                data-testid={`card-hypothesis-${i + 1}`}
                className="rounded-lg border border-card-border bg-card p-4"
              >
                <header className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug tracking-tight">
                    {h.hypothesis}
                  </h3>
                  <SignalPill tone={tone as any}>{h.direction}</SignalPill>
                </header>
                <p className="text-xs leading-relaxed text-foreground/90">{h.rationale}</p>
                {h.mitigants && (
                  <div className="mt-2 rounded-md border border-border/60 bg-background/40 p-2.5">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Mitigants
                    </div>
                    <p className="text-xs text-foreground/80">{h.mitigants}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Inflated projects */}
      <section className="px-4 py-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[hsl(var(--signal-risk))]" />
          <h2 className="text-sm font-semibold tracking-tight">
            Inflated-project flags ({inflated.length})
          </h2>
        </div>
        <div className="grid gap-2 lg:grid-cols-2">
          {inflated.map((e) => (
            <div
              key={e.id}
              data-testid={`flag-${e.id}`}
              className="rounded-md border border-[hsl(var(--signal-risk))]/25 bg-[hsl(var(--signal-risk))]/5 p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {e.id}
                </span>
                <CountryBadge country={e.country} />
                <span className="text-xs font-medium text-foreground/90">{e.company}</span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/85">
                {e.contradiction_inflation_notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Four watch streams */}
      <section className="grid gap-4 px-4 py-4 pb-8 lg:grid-cols-2 lg:px-6">
        <WatchList
          title="Pricing watch"
          items={watch.pricing_watch}
          tone="watch"
          icon={Radio}
        />
        <WatchList
          title="Power watch"
          items={watch.power_watch}
          tone="primary"
          icon={Radio}
        />
        <WatchList
          title="Supply chain watch"
          items={watch.supply_chain_watch}
          tone="risk"
          icon={GitBranch}
        />
        <WatchList
          title="Regulatory watch"
          items={watch.regulatory_watch}
          tone="info"
          icon={AlertTriangle}
        />
      </section>

      {/* Key risks from analyst */}
      <section className="px-4 pb-10 lg:px-6">
        <div className="rounded-lg border border-[hsl(var(--signal-risk))]/30 bg-[hsl(var(--signal-risk))]/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--signal-risk))]" />
            <h2 className="text-sm font-semibold tracking-tight">Analyst key risks</h2>
          </div>
          <ol className="space-y-2 text-xs leading-relaxed text-foreground/90">
            {dataset.analyst_notes.key_risks.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="num font-mono text-[hsl(var(--signal-risk))]">{String(i + 1).padStart(2, "0")}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function WatchList({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: "watch" | "primary" | "risk" | "info";
  icon: any;
}) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-4" data-testid={`watch-${title}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        </div>
        <SignalPill tone={tone}>{items.length} items</SignalPill>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-md border border-border/40 bg-background/40 p-2.5 text-xs leading-relaxed text-foreground/85"
          >
            <span className="num mt-0.5 font-mono text-[10px] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
