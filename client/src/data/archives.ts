import snapshot20260505 from "./archive/2026-05-05.json";
import snapshot20260720 from "./archive/2026-07-20.json";
import snapshot20260727 from "./archive/2026-07-27.json";
import snapshot20260803 from "./archive/2026-08-03.json";
import snapshot20260826 from "./archive/2026-08-26.json";
import { dataset, normalizeDataset, type Dataset } from "./dataset";

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

function imported(raw: unknown): Dataset {
  return normalizeDataset(raw as any);
}

const initialSnapshot = imported(snapshot20260505);
const july20 = imported(snapshot20260720);
const july27 = imported(snapshot20260727);
const aug03 = imported(snapshot20260803);
const aug26 = imported(snapshot20260826);

export const archiveSnapshots: ArchiveSnapshot[] = [
  {
    date: "2026-08-26",
    label: "2026-08-26 approved package",
    version: aug26._meta.version,
    status: "Archived",
    dataset: aug26,
    changelog: {
      headline: "Aug 26 package promoted to current baseline and frozen as archive",
      summary:
        "Current dashboard now separates live IT load, announced/non-binding MW, power availability and energisation evidence so the MIS x HUMAIN +200 MW delta, contested Saudi denominator, Khazna delivery split and Qatar financing updates do not inflate live capacity.",
      changes: [
        { type: "MW changed", area: "Supply", title: "MIS x HUMAIN scope escalated 50 MW to 250 MW", detail: "+200 MW is tracked as announced-only with 0 MW live until a binding contract and energisation evidence appear.", impact: "High" },
        { type: "Contradicted", area: "Supply", title: "Saudi live denominator marked contested", detail: "Dashboard shows MCIT-linked 467 MW and Alvarez & Marsal ~410 MW note instead of a single unqualified denominator.", impact: "High" },
        { type: "Updated", area: "Supply", title: "UAE and Qatar split by live versus pipeline", detail: "Khazna ~300 MW live and ~370 MW under construction/commissioning; Qatar Syntys + MEEZA split into ~44.1 MW live and ~61.9 MW pipeline.", impact: "High" },
        { type: "New", area: "Regulation", title: "Oman AI SEZ added with no MW", detail: "Royal Decree 50/2026 is tracked as a policy/land signal only; no MW is inferred.", impact: "Medium" },
        { type: "Updated", area: "Weak Signals", title: "Outbound/non-GCC exclusions retained", detail: "Ooredoo Indonesia, Mubadala/Akita Japan, Khazna x Eni Italy, Core42 Buffalo and DataVolt Uzbekistan are excluded from GCC MW totals.", impact: "Medium" },
      ],
      refresh_notes: [
        "Public app URL is preserved at https://ressadm.github.io/gulfdc-signal/.",
        "Repo URL is preserved at https://github.com/ressadm/gulfdc-signal.",
        "Use mw_it_live, mw_announced, power_gw_available and energisation_evidence for future refreshes.",
      ],
    },
  },
  {
    date: "2026-08-03",
    label: "2026-08-03 pending package",
    version: aug03._meta.version,
    status: "Archived",
    dataset: aug03,
    changelog: {
      headline: "Aug 3 package retained before Aug 26 promotion",
      summary: "Adds MEEZA expansion/financing, Hexagon 480 MW Saudi AI factory, AWS Bahrain unavailability, Saudi national targets and regulatory notes as the intermediate archive state.",
      changes: [
        { type: "New", area: "Supply", title: "MEEZA +4 MW and 44 MW financing records", detail: "MEEZA items are retained and rolled into the Aug 26 Qatar live/pipeline split.", impact: "High" },
        { type: "New", area: "Supply", title: "Hexagon/AlBawani 480 MW Saudi AI factory", detail: "Tracked as announced/pre-FID, not live capacity.", impact: "Medium" },
        { type: "New", area: "Weak Signals", title: "AWS Bahrain availability risk", detail: "Elastic status evidence is treated as service availability risk rather than MW change.", impact: "High" },
      ],
      refresh_notes: ["Intermediate state preserved so Aug 26 deltas can be reviewed against prior pending package."],
    },
  },
  {
    date: "2026-07-27",
    label: "2026-07-27 pending package",
    version: july27._meta.version,
    status: "Archived",
    dataset: july27,
    changelog: {
      headline: "Jul 27 package retained with MoUs, partnerships and Qatar/Oman additions",
      summary: "Preserves MIS/SDCF1 48 MW, DataVolt Riyadh East 44 MW, HUMAIN/Cohere, Zoom Saudi, e&/Core42, Syntys/Q Data, Oman-IX and Oman green DC JDA items.",
      changes: [
        { type: "New", area: "Supply", title: "MIS/SDCF1 48 MW MoU", detail: "MoU tracked as announced-only with 0 MW live.", impact: "Medium" },
        { type: "New", area: "Demand", title: "HUMAIN/Cohere and Zoom Saudi demand signals", detail: "Demand records retained without converting to live MW.", impact: "Medium" },
        { type: "New", area: "Supply", title: "Syntys/Q Data and Oman-IX records", detail: "Early Qatar and Oman signals preserved ahead of the Aug 26 split.", impact: "Medium" },
      ],
      refresh_notes: ["Archive keeps prior pending package records available without overwriting later current data."],
    },
  },
  {
    date: "2026-07-20",
    label: "2026-07-20 pending package",
    version: july20._meta.version,
    status: "Archived",
    dataset: july20,
    changelog: {
      headline: "Jul 20 package retained as first post-May refresh state",
      summary: "Preserves early HUMAIN/center3, Zoom Saudi, MEEZA/Ooredoo and Oman/Kuwait setup signals before the later July/August deltas.",
      changes: [
        { type: "New", area: "Supply", title: "HUMAIN/center3 programme tracked", detail: "Programme capacity kept outside live MW and watched for overlap with later HUMAIN awards.", impact: "Medium" },
        { type: "New", area: "Demand", title: "Zoom Saudi localization demand signal", detail: "Enterprise cloud localization retained with no MW disclosed.", impact: "Low" },
      ],
      refresh_notes: ["The July 20 archive prevents loss of pending package context after Aug 26 promotion."],
    },
  },
  {
    date: "2026-05-05",
    label: "2026-05-05 baseline",
    version: initialSnapshot._meta.version,
    status: "Archived",
    dataset: initialSnapshot,
    changelog: {
      headline: "Baseline GCC data center intelligence snapshot created",
      summary: "Initial structured seed covering supply, demand, regulation, partnerships, dashboard metrics and weak signals.",
      changes: [
        { type: "Initial snapshot", area: "Supply", title: "Initial supply events normalized", detail: "Captured announced, under-construction and live GCC data center events with source URLs.", impact: "High" },
        { type: "Initial snapshot", area: "Demand", title: "Initial demand drivers structured", detail: "Initialized AI, cloud, enterprise, government and mega-project demand signals.", impact: "High" },
        { type: "Initial snapshot", area: "Regulation", title: "Policy/regulatory enablers tracked", detail: "Mapped data localization, cloud-first, sovereign cloud and power-policy implications.", impact: "Medium" },
      ],
      refresh_notes: ["Baseline retained as pre-refresh reference."],
    },
  },
];

export const currentSnapshot: ArchiveSnapshot = {
  date: "2026-08-26",
  label: "Current live dashboard",
  version: dataset._meta.version,
  status: "Current",
  dataset,
  changelog: archiveSnapshots[0].changelog,
};

export const allSnapshots = [currentSnapshot, ...archiveSnapshots];
