// Curated Weekly Intelligence Brief — analyst synthesis for the Aug 26 refresh.
// Each item references concrete records with source URLs preserved for verification.

import { dataset } from "./dataset";

export interface BriefItem {
  rank: number;
  headline: string;
  what_changed: string;
  why_it_matters: string;
  signal: "primary" | "watch" | "risk" | "live" | "info";
  countries: string[];
  related_event_ids?: string[];
  sources: string[];
}

const findUrls = (ids: string[]) => {
  const urls = new Set<string>();
  const all = [
    ...dataset.supply_events,
    ...dataset.demand_signals,
    ...dataset.regulation_policy,
    ...dataset.partnerships_ecosystem,
  ] as Array<{ id: string; source_urls?: string[] }>;
  for (const id of ids) {
    const item = all.find((x) => x.id === id);
    if (item?.source_urls) item.source_urls.forEach((u) => urls.add(u));
  }
  return Array.from(urls);
};

export const WEEKLY_BRIEF: BriefItem[] = [
  {
    rank: 1,
    headline: "MIS x HUMAIN moves from 50 MW to 250 MW, but the Aug 26 delta is announced-only",
    what_changed: "The approved package adds a 250 MW letter of award and explicitly tracks +200 MW incremental scope as 0 MW live until a binding contract and energisation evidence are available.",
    why_it_matters: "This is the cleanest example of the new schema: mw_it_live stays at zero while mw_announced captures the award scope, preventing a non-binding project from inflating Saudi live capacity.",
    signal: "watch",
    countries: ["Saudi Arabia"],
    related_event_ids: ["SA-MIS-HUMAIN-260826"],
    sources: findUrls(["SA-MIS-HUMAIN-260826"]),
  },
  {
    rank: 2,
    headline: "Saudi live capacity is now shown as contested: 467 MW headline versus ~410 MW industry estimate",
    what_changed: "The dashboard preserves both the MCIT-linked 467 MW headline and the Alvarez & Marsal ~410 MW / ~40-facility figure instead of collapsing them into a single denominator.",
    why_it_matters: "Saudi ambition remains the largest regional story, but credible market sizing now needs a range/footnote before comparing KSA with UAE live capacity or valuing pipeline conversion.",
    signal: "risk",
    countries: ["Saudi Arabia"],
    related_event_ids: ["SA-LIVE-DENOM-260826"],
    sources: findUrls(["SA-LIVE-DENOM-260826"]),
  },
  {
    rank: 3,
    headline: "Khazna provides the GCC's clearest operator-level split: ~300 MW live and ~370 MW under construction/commissioning",
    what_changed: "UAE current state separates national ~510 MW live capacity from Khazna's ~300 MW operational footprint and ~370 MW non-live construction/commissioning pipeline.",
    why_it_matters: "Khazna is now the execution benchmark for GCC AI infrastructure: it has material live capacity, visible near-term delivery and the 5 GW AI Campus/Stargate narrative around it.",
    signal: "live",
    countries: ["UAE"],
    related_event_ids: ["UAE-KHAZNA-260826", "UAE-NATIONAL-LIVE-260826"],
    sources: findUrls(["UAE-KHAZNA-260826", "UAE-NATIONAL-LIVE-260826"]),
  },
  {
    rank: 4,
    headline: "OpenAI UAE inference residency is live, but no MW should be inferred",
    what_changed: "OpenAI's UAE inference residency signal is promoted as a live service-region/demand record, not as a capacity record.",
    why_it_matters: "Residency is strategically important for regulated AI workloads and sovereign-cloud positioning, but it belongs in demand and strategic context until operator MW is disclosed.",
    signal: "primary",
    countries: ["UAE"],
    related_event_ids: ["UAE-OPENAI-INFERENCE-260826", "D-OPENAI-UAE-260826"],
    sources: findUrls(["UAE-OPENAI-INFERENCE-260826", "D-OPENAI-UAE-260826"]),
  },
  {
    rank: 5,
    headline: "Qatar becomes measurable: Syntys/Ooredoo and MEEZA lift live estimate to ~44.1 MW with ~61.9 MW pipeline",
    what_changed: "The Aug 26 baseline combines Ooredoo/Syntys group disclosures with MEEZA's inferred current footprint and QAR 1.6bn facility for a cleaner Qatar live-versus-pipeline split.",
    why_it_matters: "Qatar is no longer a vague small-market note; its telco platform and bank-financed build-out create one of the more credible Tier-2 GCC capacity stories.",
    signal: "primary",
    countries: ["Qatar"],
    related_event_ids: ["QA-SYNTYS-260826", "QA-MEEZA-260826"],
    sources: findUrls(["QA-SYNTYS-260826", "QA-MEEZA-260826"]),
  },
  {
    rank: 6,
    headline: "Oman AI SEZ is a policy option, not a MW number",
    what_changed: "Royal Decree 50/2026 and the AI special economic zone are added with land/investment context and 0 disclosed MW.",
    why_it_matters: "Oman is positioning for later-dated AI infrastructure, but the current dashboard correctly waits for anchor tenant, power and capacity disclosure before adding MW.",
    signal: "info",
    countries: ["Oman"],
    related_event_ids: ["OM-AI-SEZ-260826", "REG-OM-SEZ-260826"],
    sources: findUrls(["OM-AI-SEZ-260826", "REG-OM-SEZ-260826"]),
  },
  {
    rank: 7,
    headline: "AWS Bahrain availability remains a resilience risk, not a capacity deduction",
    what_changed: "Elastic status-page evidence is used to flag Bahrain/AWS selection and access issues, while low-cred strike reports are kept separate from verified status evidence.",
    why_it_matters: "Resilience now belongs on the capacity dashboard because service availability changes deployability, even where no public MW impact is disclosed.",
    signal: "risk",
    countries: ["Bahrain", "UAE"],
    related_event_ids: ["UAE-AWS-RISK-260826", "BH-AWS-REGION-260803"],
    sources: findUrls(["UAE-AWS-RISK-260826", "BH-AWS-REGION-260803"]),
  },
  {
    rank: 8,
    headline: "DataVolt NEOM Oxagon remains a 1.5 GW ambition with no live MW",
    what_changed: "The Aug 26 package keeps DataVolt Oxagon as announced/pre-construction after reports that ground had not yet broken and first-phase capacity was undisclosed.",
    why_it_matters: "The project is a powerful Saudi ambition marker but should not be summed with live or near-term deliverable capacity until phase, construction and energisation evidence improve.",
    signal: "watch",
    countries: ["Saudi Arabia"],
    related_event_ids: ["SA-DATAVOLT-OXAGON-260826"],
    sources: findUrls(["SA-DATAVOLT-OXAGON-260826"]),
  },
  {
    rank: 9,
    headline: "Kuwait power/substation activity is enabling infrastructure only",
    what_changed: "Kuwait cloud-hub substation/tender records are tracked as grid-enablement assets with no IT-load MW assigned.",
    why_it_matters: "Grid readiness can unlock future campuses, but back-solving capacity from power assets would recreate the exact inflation problem the new schema is designed to prevent.",
    signal: "info",
    countries: ["Kuwait"],
    related_event_ids: ["KW-CLOUD-POWER-260826", "REG-KW-GRID-260826"],
    sources: findUrls(["KW-CLOUD-POWER-260826", "REG-KW-GRID-260826"]),
  },
  {
    rank: 10,
    headline: "Outbound/non-GCC capacity is retained but excluded from Gulf totals",
    what_changed: "Ooredoo/Zankore Indonesia, Mubadala/Akita Japan, Khazna x Eni Italy, Core42 Buffalo and DataVolt Uzbekistan are kept as strategy/exclusion records, not GCC MW.",
    why_it_matters: "The archive now supports global-capital context without letting non-GCC announcements contaminate the public GulfDC live and announced capacity totals.",
    signal: "info",
    countries: ["UAE", "Qatar", "Saudi Arabia"],
    related_event_ids: ["EXCL-OORD-INDONESIA-260826", "EXCL-MUBADALA-JAPAN-260826", "EXCL-KHAZNA-ENI-ITALY-260826"],
    sources: findUrls(["EXCL-OORD-INDONESIA-260826", "EXCL-MUBADALA-JAPAN-260826", "EXCL-KHAZNA-ENI-ITALY-260826"]),
  },
];
