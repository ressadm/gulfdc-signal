import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SignalPill, CountryBadge } from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import {
  dataset,
  liveMwByCountry,
  announcedMwByCountry,
  topPlayersByCapacity,
  hyperscaleFootprint,
  credibilityCounts,
  COUNTRY_PRIORITY,
  COUNTRY_CODE,
  CountryKey,
} from "@/data/dataset";
import {
  Activity,
  Server,
  TrendingUp,
  AlertTriangle,
  Building2,
  Globe,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TEAL = "hsl(var(--chart-1))";
const CYAN = "hsl(var(--chart-2))";
const AMBER = "hsl(var(--chart-3))";
const RED = "hsl(var(--chart-4))";
const GREEN = "hsl(var(--chart-5))";
const BORDER = "hsl(var(--border))";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm" style={{ background: p.color }} />
          <span className="text-foreground/90">{p.name}:</span>
          <span className="num font-medium tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function ImbalanceBar({
  country,
  live,
  announced,
}: {
  country: string;
  live: number;
  announced: { low: number; high: number };
}) {
  const max = Math.max(announced.high, live, 100);
  const livePct = (live / max) * 100;
  const lowPct = (announced.low / max) * 100;
  const highPct = (announced.high / max) * 100;
  return (
    <div className="space-y-1.5" data-testid={`row-imbalance-${country}`}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">{country}</span>
        <span className="num font-mono tabular-nums text-muted-foreground">
          live {live} MW · announced {announced.low}{announced.high !== announced.low ? `–${announced.high}` : ""} MW
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-sm border border-border bg-muted/40">
        {/* announced range band */}
        <div
          className="absolute h-full bg-primary/20"
          style={{ left: `${lowPct}%`, width: `${Math.max(highPct - lowPct, 1)}%` }}
        />
        {/* live point */}
        <div
          className="absolute top-0 h-full w-[3px] bg-[hsl(var(--signal-live))]"
          style={{ left: `${Math.min(livePct, 99)}%` }}
        />
      </div>
    </div>
  );
}

export default function MarketDashboard() {
  const live = liveMwByCountry();
  const announced = announcedMwByCountry();
  const players = topPlayersByCapacity();
  const hyperscalers = hyperscaleFootprint();
  const cred = credibilityCounts();

  const totalLive = live.reduce((s, r) => s + (r.mw || 0), 0);
  const totalAnnouncedLow = announced.reduce((s, r) => s + r.low, 0);
  const totalAnnouncedHigh = announced.reduce((s, r) => s + r.high, 0);

  const countryChartData = COUNTRY_PRIORITY.map((c) => {
    const l = live.find((x) => x.country === c);
    const a = announced.find((x) => x.country === c);
    return {
      country: COUNTRY_CODE[c as CountryKey],
      live: l?.mw ?? 0,
      announcedMid: a ? Math.round((a.low + a.high) / 2) : 0,
      announcedLow: a?.low ?? 0,
      announcedHigh: a?.high ?? 0,
    };
  });

  const playerChartData = players
    .filter((p) => p.mw > 0)
    .slice(0, 10)
    .map((p) => ({
      name: p.player.replace(/\s*\(.+?\)/, "").slice(0, 36),
      mw: p.mw,
      country: p.country,
      type: p.type,
    }));

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Market Dashboard"
        title="GCC supply, demand and player concentration"
        description="Total MW announced versus live, top 10 players by known announced capacity, hyperscaler footprint and the supply-versus-demand imbalance picture across the six GCC markets."
      />

      <section className="grid gap-3 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <KpiCard
          label="Live IT load (GCC)"
          value={totalLive.toLocaleString()}
          unit="MW"
          icon={Server}
          tone="live"
          hint={`${dataset.dashboard_metrics.gcc_total_existing_capacity.total_mw} per GlobeNewswire portfolio report`}
          testId="kpi-live-mw"
        />
        <KpiCard
          label="Announced pipeline"
          value={`${(totalAnnouncedLow / 1000).toFixed(1)}–${(totalAnnouncedHigh / 1000).toFixed(1)}`}
          unit="GW"
          icon={TrendingUp}
          tone="primary"
          hint="Treat as illustrative; significant double-counting in Saudi figures."
          testId="kpi-announced-mw"
        />
        <KpiCard
          label="Saudi pipeline share"
          value={`${Math.round(((announced.find((a) => a.country === "Saudi Arabia")?.high ?? 0) / Math.max(totalAnnouncedHigh, 1)) * 100)}%`}
          icon={Activity}
          tone="primary"
          hint="Saudi share of high-end announced GCC pipeline."
          testId="kpi-saudi-share"
        />
        <KpiCard
          label="Investment to 2027"
          value={dataset.dashboard_metrics.gcc_total_existing_capacity.investment_to_2027}
          icon={Building2}
          tone="primary"
          hint={dataset.dashboard_metrics.gcc_total_existing_capacity.source}
          testId="kpi-investment"
        />
      </section>

      <section className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
        {/* Country comparison chart */}
        <div className="lg:col-span-2 rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Country comparison
              </div>
              <h3 className="text-sm font-semibold tracking-tight">
                Saudi Arabia leads pipeline; UAE leads live capacity
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm" style={{ background: GREEN }} />
                Live
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm" style={{ background: TEAL }} />
                Announced (mid)
              </span>
            </div>
          </div>
          <div className="h-[260px]" data-testid="chart-country-comparison">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={countryChartData} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid stroke={BORDER} vertical={false} />
                <XAxis dataKey="country" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: BORDER }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: BORDER }} unit=" MW" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                <Bar dataKey="live" name="Live MW" fill={GREEN} radius={[2, 2, 0, 0]} />
                <Bar dataKey="announcedMid" name="Announced (mid)" fill={TEAL} radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credibility donut-substitute */}
        <div className="rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Source credibility
            </div>
            <h3 className="text-sm font-semibold tracking-tight">
              {dataset.supply_events.length} supply events tracked
            </h3>
          </div>
          <div className="space-y-3">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((k) => {
              const total = dataset.supply_events.length;
              const v = cred[k];
              const pct = Math.round((v / total) * 100);
              const color = k === "HIGH" ? GREEN : k === "MEDIUM" ? AMBER : RED;
              return (
                <div key={k} data-testid={`row-credibility-${k}`}>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="font-medium">{k}</span>
                    <span className="num font-mono tabular-nums text-muted-foreground">
                      {v} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-sm bg-muted/50">
                    <div className="h-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            HIGH = official company/government source. MEDIUM = credible industry/financial media. LOW = aggregator estimate.
          </p>
        </div>
      </section>

      {/* Top players & supply/demand imbalance */}
      <section className="grid gap-4 px-4 py-4 lg:grid-cols-3 lg:px-6">
        <div className="lg:col-span-2 rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Top 10 players
              </div>
              <h3 className="text-sm font-semibold tracking-tight">
                By known announced MW capacity
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground">Excludes undisclosed-MW hyperscalers</span>
          </div>
          <div className="h-[320px]" data-testid="chart-top-players">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerChartData} layout="vertical" margin={{ top: 5, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={BORDER} horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: BORDER }} unit=" MW" />
                <YAxis type="category" dataKey="name" width={150} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: BORDER }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                <Bar dataKey="mw" name="Announced MW" radius={[0, 3, 3, 0]}>
                  {playerChartData.map((p, i) => (
                    <Cell
                      key={i}
                      fill={p.country === "Saudi Arabia" ? TEAL : p.country === "UAE" ? CYAN : AMBER}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm" style={{ background: TEAL }} /> Saudi Arabia
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm" style={{ background: CYAN }} /> UAE
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm" style={{ background: AMBER }} /> Other GCC
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Supply vs demand imbalance
            </div>
            <h3 className="text-sm font-semibold tracking-tight">
              Live capacity vs announced pipeline range
            </h3>
          </div>
          <div className="space-y-4">
            {countryChartData.map((c) => {
              const country = COUNTRY_PRIORITY.find((k) => COUNTRY_CODE[k as CountryKey] === c.country) ?? c.country;
              return (
                <ImbalanceBar
                  key={c.country}
                  country={country}
                  live={c.live}
                  announced={{ low: c.announcedLow, high: c.announcedHigh }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Bar length = announced pipeline range. Tick = current live MW.
          </p>
        </div>
      </section>

      {/* Hyperscaler footprint */}
      <section className="px-4 py-4 lg:px-6">
        <div className="rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Hyperscaler footprint
              </div>
              <h3 className="text-sm font-semibold tracking-tight">
                Where the major US-aligned hyperscalers and AI platforms have a public position
              </h3>
            </div>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {hyperscalers.map((h) => (
              <div
                key={h.hyperscaler}
                className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3"
                data-testid={`row-hyperscaler-${h.hyperscaler}`}
              >
                <div>
                  <div className="text-sm font-medium">{h.hyperscaler}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {h.countries.map((c) => (
                      <CountryBadge key={c} country={c} />
                    ))}
                  </div>
                </div>
                <span className="num font-mono text-xs tabular-nums text-muted-foreground">
                  {h.events} event{h.events === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live capacity sources */}
      <section className="px-4 pb-8 lg:px-6">
        <div className="rounded-lg border border-card-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Live capacity — primary sources
              </div>
              <h3 className="text-sm font-semibold tracking-tight">
                Where the live MW figures come from
              </h3>
            </div>
            <SignalPill tone="info">
              <AlertTriangle className="h-3 w-3" /> Treat ranges as point estimates
            </SignalPill>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Country</th>
                  <th className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live MW (raw)</th>
                  <th className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</th>
                  <th className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Source</th>
                </tr>
              </thead>
              <tbody>
                {live.map((r) => (
                  <tr key={r.country} className="border-b border-border/50 last:border-0" data-testid={`row-live-${r.country}`}>
                    <td className="py-2 pr-3 font-medium">{r.country}</td>
                    <td className="py-2 pr-3 num font-mono tabular-nums">{r.raw}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                          String(r.confidence).startsWith("HIGH")
                            ? "signal-live"
                            : String(r.confidence).startsWith("MEDIUM")
                            ? "signal-watch"
                            : "signal-risk"
                        }`}
                      >
                        {String(r.confidence).split(" ")[0]}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      {r.source_url ? (
                        <a
                          href={r.source_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-primary underline-offset-2 hover:underline"
                          data-testid={`link-source-${r.country}`}
                        >
                          {r.source}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{r.source ?? "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
