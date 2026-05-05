import { PageHeader } from "@/components/PageHeader";
import { CountryBadge, SignalPill } from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import { dataset, gulfPrioritySort } from "@/data/dataset";
import { Scale, Building2, Radio, Lock } from "lucide-react";

export default function Regulation() {
  const rows = [...dataset.regulation_policy].sort(gulfPrioritySort);

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Regulation & Policy"
        title="Local vs foreign and hyperscaler vs telco — barriers to entry"
        description="Each policy card breaks down impact on local versus foreign operators, hyperscaler versus telco positioning, and the practical barriers to entry it creates."
      />

      <section className="grid gap-4 px-4 py-6 lg:px-6 xl:grid-cols-2">
        {rows.map((r) => (
          <article
            key={r.id}
            data-testid={`card-policy-${r.id}`}
            className="rounded-lg border border-card-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <header className="mb-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {r.id}
                </span>
                <CountryBadge country={r.country} />
                <SignalPill tone="primary">
                  <Scale className="h-3 w-3" /> Policy
                </SignalPill>
              </div>
              <h3 className="text-base font-semibold leading-snug tracking-tight">
                {r.policy}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{r.summary}</p>
            </header>

            <div className="grid gap-3 md:grid-cols-2">
              <Block
                icon={Building2}
                tone="info"
                title="Local vs foreign"
                body={r.impact_local_vs_foreign}
              />
              <Block
                icon={Radio}
                tone="watch"
                title="Hyperscaler vs telco"
                body={r.impact_hyperscaler_vs_telco}
              />
              <Block
                icon={Lock}
                tone="risk"
                title="Barriers to entry"
                body={r.barriers_to_entry}
                full
              />
            </div>

            <SourceLinks urls={r.source_urls} />
          </article>
        ))}
      </section>
    </div>
  );
}

function Block({
  icon: Icon,
  tone,
  title,
  body,
  full,
}: {
  icon: any;
  tone: "info" | "watch" | "risk";
  title: string;
  body: string;
  full?: boolean;
}) {
  const accent =
    tone === "info"
      ? "border-[hsl(var(--signal-info))]/30 bg-[hsl(var(--signal-info))]/5"
      : tone === "watch"
      ? "border-[hsl(var(--signal-watch))]/30 bg-[hsl(var(--signal-watch))]/5"
      : "border-[hsl(var(--signal-risk))]/30 bg-[hsl(var(--signal-risk))]/5";
  const text =
    tone === "info"
      ? "text-[hsl(var(--signal-info))]"
      : tone === "watch"
      ? "text-[hsl(var(--signal-watch))]"
      : "text-[hsl(var(--signal-risk))]";
  return (
    <div className={`${full ? "md:col-span-2" : ""} rounded-md border p-3 ${accent}`}>
      <div className={`mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${text}`}>
        <Icon className="h-3 w-3" /> {title}
      </div>
      <p className="text-xs leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}
