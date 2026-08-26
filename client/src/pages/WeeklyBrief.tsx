import { PageHeader } from "@/components/PageHeader";
import { SignalPill, CountryBadge } from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import { WEEKLY_BRIEF, type BriefItem } from "@/data/weeklyBrief";
import { COUNTRY_PRIORITY, dataset } from "@/data/dataset";
import { TrendingUp, AlertTriangle, ShieldAlert, Zap, Info } from "lucide-react";

const ICONS: Record<BriefItem["signal"], any> = {
  primary: Zap,
  watch: TrendingUp,
  risk: AlertTriangle,
  live: ShieldAlert,
  info: Info,
};

const TONE_LABEL: Record<BriefItem["signal"], string> = {
  primary: "Signal",
  watch: "Watch",
  risk: "Risk",
  live: "Live",
  info: "Info",
};

export default function WeeklyBrief() {
  const issueDate = dataset._meta.compiled;

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow={`Issue ${issueDate}`}
        title="Weekly Intelligence Brief"
        description="Top 10 critical developments across the GCC data center ecosystem this week, with what changed versus last week and why each matters for build, partner and capital decisions. Synthesis-only — no summaries."
      >
        <span
          className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          data-testid="text-brief-issue"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {WEEKLY_BRIEF.length} developments · {COUNTRY_PRIORITY.length} markets
        </span>
      </PageHeader>

      <section className="px-4 py-6 lg:px-6">
        <div className="grid gap-4">
          {WEEKLY_BRIEF.map((item) => {
            const Icon = ICONS[item.signal];
            return (
              <article
                key={item.rank}
                data-testid={`card-brief-${item.rank}`}
                className="group relative overflow-hidden rounded-lg border border-card-border bg-card transition-colors hover:border-primary/40"
              >
                <div className="grid gap-4 p-5 lg:grid-cols-[60px_1fr] lg:p-6">
                  <div className="flex shrink-0 lg:flex-col lg:items-start lg:gap-3">
                    <span className="num font-mono text-2xl font-semibold tabular-nums text-primary lg:text-3xl">
                      {String(item.rank).padStart(2, "0")}
                    </span>
                    <SignalPill tone={item.signal}>
                      <Icon className="h-3 w-3" />
                      {TONE_LABEL[item.signal]}
                    </SignalPill>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.countries.map((c) => (
                        <CountryBadge key={c} country={c} />
                      ))}
                    </div>

                    <h2 className="text-base font-semibold leading-snug tracking-tight md:text-lg">
                      {item.headline}
                    </h2>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-border/60 bg-background/40 p-3">
                        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          What changed
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {item.what_changed}
                        </p>
                      </div>
                      <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                          Why it matters
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {item.why_it_matters}
                        </p>
                      </div>
                    </div>

                    {item.sources.length > 0 && <SourceLinks urls={item.sources} />}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Brief composed from the seed research dataset (window: {issueDate}). All headline
          claims are traceable to linked source URLs. Items rank-ordered by analyst-judged
          impact on build, partner and capital decisions for a senior GCC strategy desk.
        </p>
      </section>
    </div>
  );
}
