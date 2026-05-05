import { PageHeader } from "@/components/PageHeader";
import { SignalPill } from "@/components/Signal";
import { STRATEGIC_INSIGHTS, type Insight } from "@/data/insights";
import { Lightbulb, Shield, Compass, Radio, Building2, TrendingUp } from "lucide-react";

const AUDIENCE_ICON: Record<string, any> = {
  Telcos: Radio,
  "DC Operators": Building2,
  Investors: TrendingUp,
};

const POSTURE_TONE: Record<Insight["posture"], "primary" | "watch" | "live"> = {
  Pursue: "primary",
  Hedge: "watch",
  Defend: "live",
};

const POSTURE_ICON: Record<Insight["posture"], any> = {
  Pursue: Compass,
  Hedge: Shield,
  Defend: Shield,
};

export default function Strategy() {
  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Strategic Insights"
        title="Three implications each for telcos, DC operators and investors"
        description="What the current GCC ecosystem state means for the three primary decision-makers — with a posture (Pursue / Defend / Hedge) and the evidence set behind each call."
      />

      <section className="space-y-6 px-4 py-6 lg:px-6">
        {STRATEGIC_INSIGHTS.map((set) => {
          const Icon = AUDIENCE_ICON[set.audience] ?? Lightbulb;
          return (
            <article
              key={set.audience}
              data-testid={`card-insight-${set.audience}`}
              className="rounded-lg border border-card-border bg-card"
            >
              <header className="flex items-start gap-3 border-b border-border/60 p-5">
                <div className="rounded-md border border-primary/30 bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    For {set.audience}
                  </div>
                  <h2 className="mt-1 text-base font-semibold leading-snug tracking-tight md:text-[17px]">
                    {set.headline}
                  </h2>
                </div>
              </header>

              <div className="grid gap-4 p-5 md:grid-cols-3">
                {set.insights.map((ins, i) => {
                  const PIcon = POSTURE_ICON[ins.posture];
                  return (
                    <div
                      key={i}
                      data-testid={`insight-${set.audience}-${i + 1}`}
                      className="flex flex-col gap-2.5 rounded-md border border-border/60 bg-background/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="num font-mono text-xs font-semibold tabular-nums text-primary">
                          0{i + 1}
                        </span>
                        <SignalPill tone={POSTURE_TONE[ins.posture]}>
                          <PIcon className="h-3 w-3" />
                          {ins.posture}
                        </SignalPill>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug">{ins.title}</h3>
                      <p className="text-xs leading-relaxed text-foreground/85">{ins.body}</p>
                      <div className="mt-auto rounded border border-border/60 bg-card/60 p-2.5">
                        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Evidence
                        </div>
                        <ul className="space-y-1 text-[11px] text-foreground/80">
                          {ins.evidence.map((e, j) => (
                            <li key={j} className="flex gap-1.5">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
