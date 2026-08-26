import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SignalPill } from "@/components/Signal";
import { dataset } from "@/data/dataset";
import {
  Activity,
  Database,
  Cpu,
  Building2,
  Globe,
  FileText,
  Newspaper,
  Eye,
  Workflow,
  Info,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";

interface SourceCategory {
  key: string;
  label: string;
  icon: any;
  examples: string[];
  cadence: "Daily" | "Weekly" | "Monthly" | "Continuous";
  state: "Manual current" | "Stub" | "Planned";
}

const SOURCES: SourceCategory[] = [
  {
    key: "press",
    label: "Official press & investor relations",
    icon: FileText,
    examples: [
      "NVIDIA Newsroom",
      "Microsoft On the Issues",
      "OpenAI Blog",
      "Google Cloud Press Corner",
      "Meeza Investor Calls",
      "center3 Newsroom",
    ],
    cadence: "Daily",
    state: "Manual current",
  },
  {
    key: "research",
    label: "Industry research & financial media",
    icon: Database,
    examples: [
      "S&P Global Market Intelligence",
      "Wood Mackenzie",
      "Emirates NBD Research",
      "IMARC Group",
      "Mordor Intelligence",
      "Reuters",
    ],
    cadence: "Weekly",
    state: "Manual current",
  },
  {
    key: "regulator",
    label: "Regulators & sovereign authorities",
    icon: Building2,
    examples: [
      "SDAIA / NCA (KSA)",
      "CSTC (KSA)",
      "TDRA (UAE)",
      "CBUAE / SAMA / CBB",
      "MTCIT (Oman)",
      "US BIS (chip export rulings)",
    ],
    cadence: "Weekly",
    state: "Stub",
  },
  {
    key: "tenders",
    label: "Tenders & contract awards",
    icon: Workflow,
    examples: ["Etimad (KSA)", "Tejari (UAE)", "Qatar Tenders Portal", "ITP.net deal flow"],
    cadence: "Daily",
    state: "Planned",
  },
  {
    key: "news",
    label: "Curated trade news",
    icon: Newspaper,
    examples: [
      "Data Center Dynamics",
      "Data Center Knowledge",
      "Bloomberg / NYT / WSJ",
      "Arabian Business",
      "MEED",
    ],
    cadence: "Continuous",
    state: "Stub",
  },
  {
    key: "social",
    label: "Operator & analyst social signals",
    icon: Eye,
    examples: [
      "LinkedIn (operator pages, analyst posts)",
      "X / Twitter (chip-policy commentators)",
      "GitHub release notes (cooling vendors)",
    ],
    cadence: "Continuous",
    state: "Planned",
  },
];

const WATCHLISTS = [
  {
    name: "Saudi mega-projects",
    items: ["HUMAIN", "DataVolt / NEOM", "SDAIA Hexagon", "center3 / stc", "Equinix KSA"],
    tone: "primary" as const,
  },
  {
    name: "UAE AI campuses",
    items: ["Stargate UAE / G42", "Khazna pipeline", "du-Microsoft", "e&-AWS Sovereign Launchpad"],
    tone: "info" as const,
  },
  {
    name: "Hyperscaler regions",
    items: ["AWS Bahrain & UAE", "Microsoft KSA AZs", "Google Dammam + AI hub", "Oracle Jeddah/Riyadh/NEOM", "Tencent Riyadh"],
    tone: "primary" as const,
  },
  {
    name: "Tier-2 markets",
    items: ["Meeza (QAT)", "Ooredoo (QAT)", "Oman Digital Triangle", "Gulf Data Hub (OMN/KWT)", "Kuwait colo entrants"],
    tone: "watch" as const,
  },
  {
    name: "Supply chain & cooling",
    items: ["NVIDIA / AMD GPU shipments", "Supermicro DataVolt deliveries", "Vertiv / Schneider", "ICS Arabia immersion"],
    tone: "risk" as const,
  },
  {
    name: "Regulatory & geopolitical",
    items: ["US BIS rulings on Blackwell", "PDPL enforcement actions", "G42 / China ties", "GCC data flow harmonization"],
    tone: "watch" as const,
  },
];

const RUBRIC = [
  {
    score: "HIGH",
    tone: "live" as const,
    definition:
      "Official primary source: company newsroom, regulator gazette, government press release, audited investor disclosure, or named-source reporting in Tier-1 outlet.",
    example: "NVIDIA Newsroom HUMAIN partnership press release",
  },
  {
    score: "MEDIUM",
    tone: "watch" as const,
    definition:
      "Credible industry/financial media or research firm citing primary sources but not the source itself; major brokerage / consultancy report.",
    example: "S&P Global market intelligence; Mordor Intelligence sizing",
  },
  {
    score: "LOW",
    tone: "risk" as const,
    definition:
      "Aggregator estimates, self-promotional vendor materials, single-source LinkedIn posts, or analyst extrapolations without underlying primary citation.",
    example: "GW-scale aspirational projects with no anchor tenants named",
  },
];

const REFRESH_STEPS = [
  {
    n: 1,
    title: "Collect",
    desc: "Pull deltas from each source category since last run; tag with category, country, and entities.",
    state: "stub",
  },
  {
    n: 2,
    title: "Normalize",
    desc: "Extract structured fields (company, MW, location, stage, timeline) into the same schema as the current dataset.",
    state: "stub",
  },
  {
    n: 3,
    title: "Score credibility",
    desc: "Apply HIGH / MEDIUM / LOW rubric per source domain; flag contradictions versus existing records.",
    state: "stub",
  },
  {
    n: 4,
    title: "Diff vs prior week",
    desc: "Compute new, changed and contradicted events; surface to the Weekly Brief composer for analyst editing.",
    state: "stub",
  },
  {
    n: 5,
    title: "Publish",
    desc: "Promote analyst-approved deltas into the live dataset; archive prior version for source-of-truth diffs.",
    state: "stub",
  },
];

export default function Console() {
  const [demoConnect, setDemoConnect] = useState<string | null>(null);

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Monitoring Console"
        title="Source coverage, watchlists, credibility rubric, refresh workflow"
        description="Operational scaffolding for continuous monitoring. Today the dataset is a manually-curated seed; this page documents how the pipeline is structured to be wired to automated collecters, news APIs and regulator feeds."
      >
        <SignalPill tone="watch" testId="status-mode">
          <Info className="h-3 w-3" />
          Mode: Manual current
        </SignalPill>
      </PageHeader>

      <section className="px-4 py-6 lg:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Source categories</h2>
          <span className="text-[11px] text-muted-foreground">
            {SOURCES.length} categories · stubbed connectors below
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                data-testid={`card-source-${s.key}`}
                className="rounded-lg border border-card-border bg-card p-4"
              >
                <header className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold leading-snug">{s.label}</h3>
                  </div>
                  <SignalPill
                    tone={
                      s.state === "Manual current"
                        ? "info"
                        : s.state === "Stub"
                        ? "watch"
                        : "neutral"
                    }
                  >
                    {s.state}
                  </SignalPill>
                </header>
                <ul className="mb-2 space-y-1">
                  {s.examples.map((e) => (
                    <li
                      key={e}
                      className="flex items-center gap-1.5 text-[11px] text-foreground/80"
                    >
                      <Circle className="h-1 w-1 fill-current text-primary" /> {e}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Cadence: {s.cadence}
                  </span>
                  <button
                    data-testid={`button-connect-${s.key}`}
                    onClick={() => setDemoConnect(s.key)}
                    className="inline-flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    Connect
                  </button>
                </div>
                {demoConnect === s.key && (
                  <p className="mt-2 rounded border border-border/60 bg-muted/40 p-2 text-[10px] leading-relaxed text-muted-foreground">
                    Connector stub. In production this would route to a collecter / API
                    integration (RSS, JSON feed, regulator portal, or scheduled
                    headless-browser job). No live connector is wired in this build.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Watchlists</h2>
          <span className="text-[11px] text-muted-foreground">
            Entity sets the next refresh cycle should re-evaluate
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {WATCHLISTS.map((w) => (
            <div
              key={w.name}
              data-testid={`watchlist-${w.name}`}
              className="rounded-lg border border-card-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight">{w.name}</h3>
                <SignalPill tone={w.tone}>{w.items.length}</SignalPill>
              </div>
              <ul className="space-y-1">
                {w.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-1.5 rounded border border-border/40 bg-background/40 px-2 py-1 text-[11px] text-foreground/85"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 px-4 py-4 lg:grid-cols-3 lg:px-6">
        <div className="lg:col-span-2 rounded-lg border border-card-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Weekly refresh workflow</h2>
            <span className="text-[11px] text-muted-foreground">5 stages · automate progressively</span>
          </div>
          <ol className="space-y-2.5">
            {REFRESH_STEPS.map((s) => (
              <li
                key={s.n}
                data-testid={`refresh-step-${s.n}`}
                className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3"
              >
                <span className="num font-mono text-base font-semibold tabular-nums text-primary">
                  {String(s.n).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    <SignalPill tone={s.state === "stub" ? "watch" : "live"}>
                      {s.state === "stub" ? "Stub" : "Live"}
                    </SignalPill>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-md border border-border/60 bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mr-1 inline-block h-3 w-3 align-text-bottom" />
            This build does not fetch live data. The current dataset (<span className="font-mono">{dataset._meta.compiled}</span>)
            is the only source of truth. The console documents the intended pipeline so backend
            collecters / news APIs can be plugged into the same schema without UI changes.
          </p>
          <p className="mt-2 rounded-md border border-primary/20 bg-primary/10 p-3 text-[11px] leading-relaxed text-foreground/85">
            Weekly refreshes are versioned: archive the previous <span className="font-mono">current.json</span>,
            compute deltas against the new candidate dataset, then publish only the analyst-approved
            version to GitHub Pages. See Archives for the dated snapshot and changelog view.
          </p>
        </div>

        <div className="rounded-lg border border-card-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Credibility scoring rubric</h2>
          </div>
          <div className="space-y-3">
            {RUBRIC.map((r) => (
              <div key={r.score} data-testid={`rubric-${r.score}`} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <SignalPill tone={r.tone}>{r.score}</SignalPill>
                </div>
                <p className="text-xs leading-relaxed text-foreground/85">{r.definition}</p>
                <div className="rounded border border-border/40 bg-background/40 p-2 text-[11px] text-muted-foreground">
                  <span className="font-mono text-[10px] uppercase tracking-wider">Example:</span>{" "}
                  {r.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 lg:px-6">
        <div className="rounded-lg border border-card-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Dataset disclosure</h2>
          </div>
          <dl className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Version</dt>
              <dd className="num font-mono tabular-nums">{dataset._meta.version}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Window</dt>
              <dd>{dataset._meta.compiled}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">MW basis</dt>
              <dd>{dataset._meta.mw_note}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Disclaimer</dt>
              <dd>{dataset._meta.disclaimer}</dd>
            </div>
          </dl>
          <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-[hsl(var(--signal-live))]" />
              {dataset.supply_events.length} supply events
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-[hsl(var(--signal-live))]" />
              {dataset.demand_signals.length} demand signals
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-[hsl(var(--signal-live))]" />
              {dataset.regulation_policy.length} policy cards · {dataset.partnerships_ecosystem.length} partnerships
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
