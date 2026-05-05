import { useMemo, useState } from "react";
import {
  Archive,
  CalendarClock,
  CheckCircle2,
  FileClock,
  GitCompareArrows,
  History,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SignalPill } from "@/components/Signal";
import { allSnapshots, archiveSnapshots, type ArchiveSnapshot } from "@/data/archives";

const toneByImpact: Record<string, "live" | "watch" | "risk"> = {
  High: "risk",
  Medium: "watch",
  Low: "live",
};

export default function Archives() {
  const [selectedDate, setSelectedDate] = useState(allSnapshots[0].date);
  const selected = useMemo(
    () => allSnapshots.find((s) => s.date === selectedDate) ?? allSnapshots[0],
    [selectedDate]
  );

  const stats = snapshotStats(selected);

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Archives & Weekly Refresh"
        title="Versioned snapshots, changelog and analyst-controlled publishing"
        description="The dashboard now has a current dataset plus dated archives. Each weekly refresh should preserve the old state, compute deltas, and publish only after analyst approval."
      >
        <SignalPill tone="primary" testId="status-archive-count">
          <Archive className="h-3 w-3" />
          {archiveSnapshots.length} archived snapshot
          {archiveSnapshots.length === 1 ? "" : "s"}
        </SignalPill>
      </PageHeader>

      <section className="grid gap-4 px-4 py-6 lg:grid-cols-[320px,1fr] lg:px-6">
        <aside className="space-y-3">
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Snapshots</h2>
            </div>
            <div className="space-y-2">
              {allSnapshots.map((snapshot) => (
                <button
                  key={`${snapshot.status}-${snapshot.date}`}
                  type="button"
                  data-testid={`button-snapshot-${snapshot.date}-${snapshot.status}`}
                  onClick={() => setSelectedDate(snapshot.date)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    selected === snapshot
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/40 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      {snapshot.label}
                    </span>
                    <SignalPill tone={snapshot.status === "Current" ? "live" : "info"}>
                      {snapshot.status}
                    </SignalPill>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {snapshot.version} · {snapshot.dataset._meta.compiled}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Weekly cadence</h2>
            </div>
            <ol className="space-y-3 text-xs text-muted-foreground">
              {[
                "Collect new source signals across supply, demand, regulation, power, pricing, supply chain and partnerships.",
                "Normalize into the current schema and score credibility.",
                "Diff against the previous snapshot and generate a weekly brief draft.",
                "Archive prior current.json, promote approved data to current.json, then publish to GitHub Pages.",
              ].map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border font-mono text-[10px] text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <main className="space-y-4">
          <section className="grid gap-3 md:grid-cols-4">
            <Metric label="Supply events" value={stats.supply} testId="metric-archive-supply" />
            <Metric label="Demand signals" value={stats.demand} testId="metric-archive-demand" />
            <Metric label="Policy items" value={stats.regulation} testId="metric-archive-regulation" />
            <Metric label="Partnerships" value={stats.partnerships} testId="metric-archive-partnerships" />
          </section>

          <section className="rounded-lg border border-card-border bg-card">
            <header className="border-b border-border/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileClock className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold">{selected.changelog.headline}</h2>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    {selected.changelog.summary}
                  </p>
                </div>
                <SignalPill tone={selected.status === "Current" ? "live" : "info"}>
                  {selected.date}
                </SignalPill>
              </div>
            </header>

            <div className="grid gap-3 p-4 lg:grid-cols-2">
              {selected.changelog.changes.map((change, index) => (
                <article
                  key={`${change.area}-${change.title}`}
                  data-testid={`card-change-${index}`}
                  className="rounded-md border border-border bg-background/45 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <SignalPill tone="primary">{change.type}</SignalPill>
                    <SignalPill tone="info">{change.area}</SignalPill>
                    <SignalPill tone={toneByImpact[change.impact] ?? "watch"}>
                      {change.impact} impact
                    </SignalPill>
                  </div>
                  <h3 className="text-sm font-semibold">{change.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{change.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <ProcessCard
              icon={GitCompareArrows}
              title="Diff discipline"
              lines={[
                "Track new, updated, contradicted, MW-changed and credibility-changed records.",
                "Never overwrite a prior snapshot; publish a new dated archive each refresh.",
              ]}
            />
            <ProcessCard
              icon={ShieldCheck}
              title="Analyst approval"
              lines={[
                "Weekly automation should draft the refresh, not autopublish unverified claims.",
                "Inflated GW-scale announcements need explicit contradiction notes before promotion.",
              ]}
            />
            <ProcessCard
              icon={CheckCircle2}
              title="Publishing path"
              lines={[
                "Approved changes update current.json, add archive/YYYY-MM-DD.json and push GitHub Pages.",
                "The public URL stays the same while the dashboard data advances.",
              ]}
            />
          </section>

          <section className="rounded-lg border border-card-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Archive className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Refresh notes</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {selected.changelog.refresh_notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </section>
    </div>
  );
}

function snapshotStats(snapshot: ArchiveSnapshot) {
  return {
    supply: snapshot.dataset.supply_events.length,
    demand: snapshot.dataset.demand_signals.length,
    regulation: snapshot.dataset.regulation_policy.length,
    partnerships: snapshot.dataset.partnerships_ecosystem.length,
  };
}

function Metric({ label, value, testId }: { label: string; value: number; testId: string }) {
  return (
    <div data-testid={testId} className="rounded-lg border border-card-border bg-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-primary">{value}</div>
    </div>
  );
}

function ProcessCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: any;
  title: string;
  lines: string[];
}) {
  return (
    <article className="rounded-lg border border-card-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2 text-xs text-muted-foreground">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

