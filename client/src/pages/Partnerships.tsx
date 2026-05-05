import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CountryBadge, SignalPill } from "@/components/Signal";
import { SourceLinks } from "@/components/SourceLinks";
import { dataset, gulfPrioritySort, type PartnershipItem } from "@/data/dataset";
import { ArrowRight, Handshake, ShoppingCart, Send } from "lucide-react";

type Cls = "Buy-From" | "Sell-To" | "Sell-With";

const TONE: Record<Cls, "primary" | "info" | "watch"> = {
  "Buy-From": "primary",
  "Sell-To": "info",
  "Sell-With": "watch",
};

const ICON: Record<Cls, any> = {
  "Buy-From": ShoppingCart,
  "Sell-To": Send,
  "Sell-With": Handshake,
};

const ROLE_DESC: Record<Cls, string> = {
  "Buy-From":
    "GCC operator buying compute, construction or hardware from a global supplier",
  "Sell-To":
    "GCC operator selling capacity or AI infrastructure to a hyperscaler or AI tenant",
  "Sell-With":
    "Joint platform venture: a GCC operator and a global counterparty co-deliver capacity",
};

export default function Partnerships() {
  const [active, setActive] = useState<Cls | "All">("All");

  const grouped = useMemo(() => {
    const groups: Record<Cls, PartnershipItem[]> = {
      "Buy-From": [],
      "Sell-To": [],
      "Sell-With": [],
    };
    for (const p of dataset.partnerships_ecosystem) {
      const c = p.classification as Cls;
      if (groups[c]) groups[c].push(p);
    }
    for (const k of Object.keys(groups) as Cls[]) {
      groups[k] = groups[k].sort(gulfPrioritySort);
    }
    return groups;
  }, []);

  const visible: Cls[] =
    active === "All" ? (["Buy-From", "Sell-To", "Sell-With"] as Cls[]) : [active];

  return (
    <div className="min-h-full">
      <PageHeader
        eyebrow="Partnerships & Ecosystem"
        title="Buy-From · Sell-To · Sell-With"
        description="Every public partnership classified by direction. The classification reveals each operator's strategic role: who is procuring, who is providing capacity, and who is co-delivering with a global partner."
      />

      <section className="px-4 py-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Buy-From", "Sell-To", "Sell-With"] as const).map((k) => {
            const count =
              k === "All"
                ? dataset.partnerships_ecosystem.length
                : grouped[k as Cls].length;
            return (
              <button
                key={k}
                onClick={() => setActive(k)}
                data-testid={`button-tab-${k}`}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  active === k
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground/80 hover:border-primary/50"
                }`}
              >
                {k}
                <span className="num font-mono tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-6 px-4 pb-8 lg:px-6">
        {visible.map((cls) => {
          const Icon = ICON[cls];
          const list = grouped[cls];
          return (
            <div key={cls} className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SignalPill tone={TONE[cls]}>
                    <Icon className="h-3 w-3" />
                    {cls}
                  </SignalPill>
                  <span className="num font-mono text-xs tabular-nums text-muted-foreground">
                    {list.length} partnership{list.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="hidden max-w-sm text-right text-[11px] text-muted-foreground sm:block">
                  {ROLE_DESC[cls]}
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {list.map((p) => (
                  <PartnershipCard key={p.id} p={p} cls={cls} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function PartnershipCard({ p, cls }: { p: PartnershipItem; cls: Cls }) {
  const left = p.buyer ?? p.party_a ?? "";
  const right = p.seller ?? p.party_b ?? "";
  return (
    <article
      data-testid={`card-partnership-${p.id}`}
      className="rounded-lg border border-card-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {p.id}
          </span>
          <CountryBadge country={p.country} />
        </div>
        <SignalPill tone={TONE[cls]}>{cls}</SignalPill>
      </header>

      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <span className="truncate" title={left}>
          {left || "—"}
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate" title={right}>
          {right || "—"}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-foreground/90">{p.description}</p>
      <SourceLinks urls={p.source_urls} />
    </article>
  );
}
