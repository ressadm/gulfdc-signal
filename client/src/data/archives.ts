import snapshot20260505 from "./archive/2026-05-05.json";
import { dataset, type Dataset } from "./dataset";

export type ChangeType =
  | "Initial snapshot"
  | "New"
  | "Updated"
  | "Contradicted"
  | "Credibility changed"
  | "MW changed";

export interface ArchiveSnapshot {
  date: string;
  label: string;
  version: string;
  status: "Current" | "Archived";
  dataset: Dataset;
  changelog: {
    headline: string;
    summary: string;
    changes: Array<{
      type: ChangeType;
      area: "Supply" | "Demand" | "Regulation" | "Partnerships" | "Weak Signals";
      title: string;
      detail: string;
      impact: "High" | "Medium" | "Low";
    }>;
    refresh_notes: string[];
  };
}

const initialSnapshot = snapshot20260505 as unknown as Dataset;

export const archiveSnapshots: ArchiveSnapshot[] = [
  {
    date: "2026-05-05",
    label: "2026-05-05 baseline",
    version: initialSnapshot._meta.version,
    status: "Archived",
    dataset: initialSnapshot,
    changelog: {
      headline: "Baseline GCC data center intelligence snapshot created",
      summary:
        "Initial structured seed covering supply, demand, regulation, partnerships, dashboard metrics and weak signals. Future weekly refreshes should diff against this baseline before publishing.",
      changes: [
        {
          type: "Initial snapshot",
          area: "Supply",
          title: "24 supply events normalized",
          detail:
            "Captured announced, under-construction and live GCC data center events with country, MW, type, stage, timeline, credibility and source URLs.",
          impact: "High",
        },
        {
          type: "Initial snapshot",
          area: "Demand",
          title: "9 demand drivers structured",
          detail:
            "Seeded AI, cloud, enterprise, government and mega-project demand signals with horizon and MW impact where available.",
          impact: "High",
        },
        {
          type: "Initial snapshot",
          area: "Regulation",
          title: "6 policy/regulatory enablers tracked",
          detail:
            "Mapped data localization, cloud-first, sovereign cloud and power-policy implications for local vs foreign and telco vs hyperscaler positioning.",
          impact: "Medium",
        },
        {
          type: "Initial snapshot",
          area: "Partnerships",
          title: "14 ecosystem moves classified",
          detail:
            "Classified partnerships as Buy-From, Sell-To or Sell-With to support operator partnership strategy.",
          impact: "Medium",
        },
      ],
      refresh_notes: [
        "This is the first archive snapshot and therefore has no prior-week comparison.",
        "Future snapshots should preserve all previous source URLs and add delta badges for changed records.",
        "Analyst approval should remain required before publishing refreshed data to GitHub Pages.",
      ],
    },
  },
];

export const currentSnapshot: ArchiveSnapshot = {
  date: "2026-05-05",
  label: "Current live dashboard",
  version: dataset._meta.version,
  status: "Current",
  dataset,
  changelog: archiveSnapshots[0].changelog,
};

export const allSnapshots = [currentSnapshot, ...archiveSnapshots];

