import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CredibilityBadge,
  StageBadge,
  SignalPill,
  CountryBadge,
} from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import {
  dataset,
  COUNTRY_PRIORITY,
  gulfPrioritySort,
  maxAnnouncedMw,
  type Credibility,
  type SupplyEvent,
} from "@/data/dataset";
import { Filter, Search, Building2, MapPin, Calendar, AlertTriangle } from "lucide-react";

export default function SupplyTracker() {
  const [country, setCountry] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [stage, setStage] = useState<string>("All");
  const [credibility, setCredibility] = useState<string>("All");
  const [query, setQuery] = useState("");

  const types = Array.from(new Set(dataset.supply_events.map((e) => e.type))).sort();
  const stages = Array.from(new Set(dataset.supply_events.map((e) => e.stage))).sort();

  const filtered = useMemo(() => {
    let rows: SupplyEvent[] = [...dataset.supply_events];
    if (country !== "All") rows = rows.filter((e) => e.country === country);
    if (type !== "All") rows = rows.filter((e) => e.type === type);
    if (stage !== "All") rows = rows.filter((e) => e.stage === stage);
    if (credibility !== "All")
      rows = rows.filter((e) => e.credibility_score === credibility);
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((e) => {
        const hay = [
          e.company,
          e.partners.join(" "),
          e.city_location,
          e.type,
          e.stage,
          e.timeline,
          e.contradiction_inflation_notes,
          e.id,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return rows.sort(gulfPrioritySort);
  }, [country, type, stage, credibility, query]);

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Supply Tracker"
        title="All known supply events across the GCC"
        description="Every announced, under-construction or live data center event in the current window. Saudi-first sorted; filter by country, type, stage, credibility. Source URLs preserved on every card."
      >
        <span
          className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          data-testid="text-supply-count"
        >
          {filtered.length} / {dataset.supply_events.length} events
        </span>
      </PageHeader>

      {/* Filter bar */}
      <section className="sticky top-14 z-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:px-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              data-testid="input-supply-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, partner, city, ID…"
              className="w-full rounded-md border border-input bg-card py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <FilterSelect
              testId="select-country"
              label="Country"
              value={country}
              onChange={setCountry}
              options={["All", ...COUNTRY_PRIORITY]}
            />
            <FilterSelect
              testId="select-type"
              label="Type"
              value={type}
              onChange={setType}
              options={["All", ...types]}
            />
            <FilterSelect
              testId="select-stage"
              label="Stage"
              value={stage}
              onChange={setStage}
              options={["All", ...stages]}
            />
            <FilterSelect
              testId="select-credibility"
              label="Credibility"
              value={credibility}
              onChange={setCredibility}
              options={["All", "HIGH", "MEDIUM", "LOW"]}
            />
            {(country !== "All" || type !== "All" || stage !== "All" || credibility !== "All" || query) && (
              <button
                data-testid="button-reset-filters"
                onClick={() => {
                  setCountry("All");
                  setType("All");
                  setStage("All");
                  setCredibility("All");
                  setQuery("");
                }}
                className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:border-primary"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="px-4 py-5 lg:px-6">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No supply events match the current filters.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((e) => (
              <SupplyCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SupplyCard({ event: e }: { event: SupplyEvent }) {
  const mw = maxAnnouncedMw(e);
  return (
    <article
      data-testid={`card-supply-${e.id}`}
      className="rounded-lg border border-card-border bg-card transition-colors hover:border-primary/40"
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 p-4">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {e.id}
            </span>
            <CountryBadge country={e.country} />
          </div>
          <h3 className="text-sm font-semibold leading-tight tracking-tight md:text-[15px]">
            {e.company}
          </h3>
          {e.partners.length > 0 && (
            <p className="text-xs text-muted-foreground">
              w/ {e.partners.slice(0, 4).join(", ")}
              {e.partners.length > 4 ? ` +${e.partners.length - 4} more` : ""}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <CredibilityBadge score={e.credibility_score} />
          {mw > 0 && (
            <div className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-right">
              <div className="num font-mono text-base font-semibold tabular-nums leading-none text-primary">
                {mw.toLocaleString()}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-primary/80">
                Ann. MW
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-2.5 p-4">
        <CapacitySplit event={e} />

        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-foreground/90">{e.city_location}</span>
          </div>
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-foreground/90">{e.type}</span>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-foreground/90">{e.timeline}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={e.stage} />
          {e.capacity_mw.confidence && (
            <SignalPill
              tone={
                e.capacity_mw.confidence === "HIGH"
                  ? "live"
                  : e.capacity_mw.confidence === "MEDIUM"
                  ? "watch"
                  : "risk"
              }
            >
              cap conf: {e.capacity_mw.confidence}
            </SignalPill>
          )}
        </div>

        {e.capacity_mw.notes && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">Capacity notes — </span>
            {e.capacity_mw.notes}
          </p>
        )}

        {e.contradiction_inflation_notes && (
          <div className="rounded-md border border-[hsl(var(--signal-risk))]/25 bg-[hsl(var(--signal-risk))]/5 p-2.5">
            <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--signal-risk))]">
              <AlertTriangle className="h-3 w-3" /> Contradiction / inflation note
            </div>
            <p className="text-xs leading-relaxed text-foreground/90">
              {e.contradiction_inflation_notes}
            </p>
          </div>
        )}

        <SourceLinks urls={e.source_urls} />
      </div>
    </article>
  );
}

function formatCapacityValue(value: unknown, suffix = " MW") {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return `${value.toLocaleString()}${suffix}`;
  return String(value);
}

function CapacitySplit({ event }: { event: SupplyEvent }) {
  const c = event.capacity_mw ?? {};
  const chips = [
    ["Live IT", c.mw_it_live],
    ["Announced", c.mw_announced],
    ["Under constr.", c.mw_under_construction_or_commissioning ?? c.mw_under_construction_or_contracted],
    ["Power", c.power_gw_available, " GW"],
  ].filter(([, value]) => value !== undefined && value !== null);
  if (chips.length === 0 && !c.energisation_evidence) return null;
  return (
    <div className="rounded-md border border-border/60 bg-background/35 p-2.5 text-xs">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {chips.map(([label, value, suffix]) => (
          <span key={String(label)} className="inline-flex items-baseline gap-1 rounded border border-border bg-card px-2 py-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="num font-semibold tabular-nums text-foreground/90">{formatCapacityValue(value, String(suffix ?? " MW"))}</span>
          </span>
        ))}
      </div>
      {c.energisation_evidence && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">Evidence:</span> {String(c.energisation_evidence)}
        </p>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  testId: string;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-md border border-input bg-card px-2 py-1 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-foreground focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-popover text-popover-foreground">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
