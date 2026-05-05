import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CountryBadge, SignalPill } from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import { dataset, gulfPrioritySort, COUNTRY_PRIORITY } from "@/data/dataset";
import { TrendingUp, Calendar, Layers } from "lucide-react";

export default function DemandSignals() {
  const [country, setCountry] = useState<string>("All");

  const rows = dataset.demand_signals
    .filter((d) => country === "All" || d.country === country || d.country.includes(country))
    .sort(gulfPrioritySort);

  // Tag a tone based on demand_type or impact
  function toneFor(d: { demand_type: string; estimated_mw_impact: string }) {
    const s = (d.demand_type + " " + d.estimated_mw_impact).toLowerCase();
    if (s.includes("undersupply") || s.includes("90%")) return "watch";
    if (s.includes("ai") || s.includes("sovereign") || s.includes("hyperscaler")) return "primary";
    if (s.includes("qualitative")) return "info";
    return "info";
  }

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Demand Signals"
        title="Where the demand is forming and how big it is"
        description="Discrete demand signals classified by type, MW impact (or qualitative impact), horizon and rationale. Sources preserved for verification."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Country
          </span>
          <select
            data-testid="select-demand-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-md border border-input bg-card px-2 py-1 text-xs"
          >
            <option value="All">All</option>
            {COUNTRY_PRIORITY.map((c) => (
              <option key={c} value={c} className="bg-popover">
                {c}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <section className="grid gap-3 px-4 py-6 lg:grid-cols-2 lg:px-6">
        {rows.map((d) => {
          const tone = toneFor(d) as any;
          return (
            <article
              key={d.id}
              data-testid={`card-demand-${d.id}`}
              className="rounded-lg border border-card-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <header className="mb-2 flex items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {d.id}
                    </span>
                    <CountryBadge country={d.country} />
                  </div>
                  <h3 className="text-sm font-semibold leading-snug tracking-tight">
                    {d.demand_type}
                  </h3>
                </div>
                <SignalPill tone={tone}>
                  <TrendingUp className="h-3 w-3" />
                  Demand
                </SignalPill>
              </header>

              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Impact
                    </span>{" "}
                    <span className="text-foreground/90">{d.estimated_mw_impact}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Horizon
                    </span>{" "}
                    <span className="text-foreground/90">{d.time_horizon}</span>
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-foreground/90">{d.rationale}</p>
              <SourceLinks urls={d.source_urls} />
            </article>
          );
        })}
      </section>
    </div>
  );
}
