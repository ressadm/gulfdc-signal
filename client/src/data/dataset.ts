// Static-bundled dataset access. Vite imports JSON natively at build time.
// current.json is the live dashboard state; dated snapshots live in archive/.
import currentJson from "./current.json";

export type Credibility = "HIGH" | "MEDIUM" | "LOW";
export type CountryKey = "Saudi Arabia" | "UAE" | "Qatar" | "Oman" | "Bahrain" | "Kuwait";

export interface CapacitySplit {
  mw_it_live?: number | string | null;
  mw_announced?: number | string | null;
  mw_under_construction_or_commissioning?: number | string | null;
  mw_under_construction_or_contracted?: number | string | null;
  programme_ambition_mw?: number | string | null;
  power_gw_available?: number | string | null;
  energisation_evidence?: string;
  [key: string]: unknown;
}

export interface SupplyEvent {
  id: string;
  company: string;
  partners: string[];
  country: string;
  city_location: string;
  capacity_mw: CapacitySplit & { confidence?: string; notes?: string };
  type: string;
  stage: string;
  timeline: string;
  credibility_score: Credibility;
  contradiction_inflation_notes: string;
  strategic_implication?: string;
  source_urls: string[];
}

export interface DemandSignal {
  id: string;
  demand_type: string;
  country: string;
  estimated_mw_impact: string;
  time_horizon: string;
  rationale: string;
  source_urls: string[];
  credibility?: string;
}

export interface RegulationItem {
  id: string;
  policy: string;
  country: string;
  summary: string;
  impact_local_vs_foreign: string;
  impact_hyperscaler_vs_telco: string;
  barriers_to_entry: string;
  source_urls: string[];
  credibility?: string;
}

export interface PartnershipItem {
  id: string;
  classification: "Buy-From" | "Sell-To" | "Sell-With" | string;
  buyer?: string;
  seller?: string;
  description: string;
  country: string;
  source_urls: string[];
  party_a?: string;
  party_b?: string;
}

export interface DashboardMetrics {
  country_mw_split?: Array<Record<string, any>>;
  live_mw_by_country: Record<string, any>;
  announced_mw_by_country: Record<string, any>;
  top_players_by_known_announced_capacity: Array<{
    rank?: number;
    player?: string;
    operator?: string;
    capacity_mw: string;
    country: string;
    type?: string;
    mw_it_live?: number | string | null;
    mw_announced?: number | string | null;
    credibility?: string;
  }>;
  gcc_total_existing_capacity: {
    total_mw: string;
    upcoming_to_2028?: string;
    investment_to_2027?: string;
    method?: string;
    source?: string;
    source_url?: string;
    source_urls?: string[];
  };
}

export interface WatchItems {
  oversupply_undersupply_hypotheses: Array<{
    hypothesis: string;
    direction: string;
    rationale: string;
    mitigants?: string;
    source?: string;
  }>;
  pricing_watch: string[];
  power_watch: string[];
  supply_chain_watch: string[];
  regulatory_watch: string[];
}

export interface AnalystNotes {
  synthesis: string;
  key_risks: string[];
  strategic_opportunities: string[];
}

export interface Dataset {
  _meta: {
    dataset: string;
    version: string;
    compiled: string;
    window?: string;
    public_url?: string;
    repo_url?: string;
    schema_version?: string;
    priority_order?: string[] | Record<string, unknown>;
    credibility_scale?: string | Record<string, string>;
    mw_note: string;
    disclaimer: string;
    release_notes?: string[];
  };
  supply_events: SupplyEvent[];
  demand_signals: DemandSignal[];
  regulation_policy: RegulationItem[];
  partnerships_ecosystem: PartnershipItem[];
  dashboard_metrics: DashboardMetrics;
  watch_items: WatchItems;
  analyst_notes: AnalystNotes;
}

const raw = currentJson as any;

export function normalizeCountry(c: string): CountryKey | string {
  if (!c) return c;
  const s = String(c).trim();
  const first = s.includes("/") ? s.split("/")[0].trim() : s;
  if (/united arab emirates|\buae\b/i.test(first)) return "UAE";
  if (/saudi/i.test(first)) return "Saudi Arabia";
  if (/qatar/i.test(first)) return "Qatar";
  if (/oman/i.test(first)) return "Oman";
  if (/bahrain/i.test(first)) return "Bahrain";
  if (/kuwait/i.test(first)) return "Kuwait";
  return first;
}

function normalizeCred(v: unknown): Credibility {
  const s = String(v ?? "MEDIUM").toUpperCase();
  if (s.includes("HIGH")) return "HIGH";
  if (s.includes("LOW")) return "LOW";
  return "MEDIUM";
}

function titleCaseStatus(s: string) {
  return String(s || "Unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function normalizeSupplyEvent(e: any): SupplyEvent {
  return {
    id: String(e.id),
    company: e.company ?? e.title ?? e.operator ?? String(e.id),
    partners: Array.isArray(e.partners) ? e.partners : [],
    country: normalizeCountry(e.country) as string,
    city_location: e.city_location ?? e.location ?? e.country ?? "GCC",
    capacity_mw: e.capacity_mw ?? {},
    type: e.type ?? e.category ?? "capacity_signal",
    stage: e.stage ?? titleCaseStatus(e.status),
    timeline: e.timeline ?? e.date ?? raw._meta?.compiled ?? "2026-08-26",
    credibility_score: normalizeCred(e.credibility_score ?? e.credibility),
    contradiction_inflation_notes:
      e.contradiction_inflation_notes ?? e.inflation_notes ?? e.notes ?? "No contradiction note recorded.",
    strategic_implication: e.strategic_implication ?? "",
    source_urls: Array.isArray(e.source_urls) ? e.source_urls : [],
  };
}

function normalizeDemand(d: any): DemandSignal {
  return {
    id: String(d.id),
    demand_type: d.demand_type ?? d.title ?? "Demand signal",
    country: normalizeCountry(d.country) as string,
    estimated_mw_impact: d.estimated_mw_impact ?? d.impact ?? "No MW disclosed",
    time_horizon: d.time_horizon ?? d.date ?? "TBD",
    rationale: d.rationale ?? d.summary ?? "",
    source_urls: Array.isArray(d.source_urls) ? d.source_urls : [],
    credibility: d.credibility,
  };
}

function normalizeRegulation(r: any): RegulationItem {
  const title = r.policy ?? r.title ?? r.policy_type ?? "Policy signal";
  const impact = r.impact ?? r.summary ?? "";
  return {
    id: String(r.id),
    policy: title,
    country: normalizeCountry(r.country) as string,
    summary: r.summary ?? impact,
    impact_local_vs_foreign: r.impact_local_vs_foreign ?? impact,
    impact_hyperscaler_vs_telco: r.impact_hyperscaler_vs_telco ?? impact,
    barriers_to_entry: r.barriers_to_entry ?? impact,
    source_urls: Array.isArray(r.source_urls) ? r.source_urls : [],
    credibility: r.credibility,
  };
}

function normalizePartnership(p: any): PartnershipItem {
  const partners = Array.isArray(p.partners) ? p.partners : [];
  const status = String(p.status ?? p.partnership_type ?? "").toLowerCase();
  let classification: PartnershipItem["classification"] = p.classification;
  if (!classification) classification = status.includes("outbound") || status.includes("joint") || status.includes("platform") ? "Sell-With" : status.includes("letter") || status.includes("financing") ? "Sell-To" : "Buy-From";
  return {
    id: String(p.id),
    classification,
    buyer: p.buyer ?? partners[0],
    seller: p.seller ?? partners[1],
    party_a: p.party_a ?? partners[0],
    party_b: p.party_b ?? partners[1],
    description: p.description ?? p.title ?? String(p.id),
    country: normalizeCountry(p.country) as string,
    source_urls: Array.isArray(p.source_urls) ? p.source_urls : [],
  };
}

function normalizeWatch(w: any): WatchItems {
  if (w && !Array.isArray(w) && Array.isArray(w.oversupply_undersupply_hypotheses)) return w;
  const arr = Array.isArray(w) ? w : [];
  return {
    oversupply_undersupply_hypotheses: arr.slice(0, 4).map((x: any) => ({
      hypothesis: x.title ?? x.id ?? "Watch item",
      direction: "Execution watch",
      rationale: x.why_it_matters ?? x.rationale ?? "",
      source: Array.isArray(x.source_urls) ? x.source_urls[0] : undefined,
    })),
    pricing_watch: ["Monitor pre-lease discounts versus bank-financed Qatar supply and Khazna near-term commissioning."],
    power_watch: ["Keep power_gw_available separate from MW IT load; track Saudi 12.8 GW claim and project-level interconnects."],
    supply_chain_watch: ["Move announced/non-binding projects only when binding contracts, construction and energisation evidence appear."],
    regulatory_watch: ["Track Oman AI SEZ implementation, Saudi AI regulation and UAE export-control constraints."],
  };
}

function normalizeAnalyst(a: any): AnalystNotes {
  if (a && !Array.isArray(a) && Array.isArray(a.key_risks)) return a;
  const arr = Array.isArray(a) ? a : [];
  return {
    synthesis: arr.map((x: any) => `${x.title}: ${x.body}`).join(" ") || "August 26 baseline separates live, announced, power and evidence fields.",
    key_risks: arr.map((x: any) => x.body ?? x.title).filter(Boolean).slice(0, 6),
    strategic_opportunities: [
      "Pre-leased telco and sovereign AI platforms are the investable core of the GCC pipeline.",
      "Resilience and data residency can differentiate Gulf regions beyond headline MW.",
      "Archive deltas should be used to detect capacity inflation before public reporting.",
    ],
  };
}

export function normalizeDataset(input: any): Dataset {
  return {
    _meta: {
      ...input._meta,
      mw_note: input._meta?.mw_note ?? "MW fields are split into live, announced, power and evidence.",
      disclaimer: input._meta?.disclaimer ?? "Research intelligence only.",
    },
    supply_events: (input.supply_events ?? []).map(normalizeSupplyEvent),
    demand_signals: (input.demand_signals ?? []).map(normalizeDemand),
    regulation_policy: (input.regulation_policy ?? []).map(normalizeRegulation),
    partnerships_ecosystem: (input.partnerships_ecosystem ?? input.partnerships ?? []).map(normalizePartnership),
    dashboard_metrics: input.dashboard_metrics ?? {
      live_mw_by_country: {},
      announced_mw_by_country: {},
      top_players_by_known_announced_capacity: [],
      gcc_total_existing_capacity: { total_mw: "n.a." },
    },
    watch_items: normalizeWatch(input.watch_items),
    analyst_notes: normalizeAnalyst(input.analyst_notes),
  };
}

export const dataset = normalizeDataset(raw);

export const COUNTRY_PRIORITY: CountryKey[] = ["Saudi Arabia", "UAE", "Qatar", "Oman", "Bahrain", "Kuwait"];

export const COUNTRY_CODE: Record<CountryKey, string> = {
  "Saudi Arabia": "KSA",
  UAE: "UAE",
  Qatar: "QAT",
  Oman: "OMN",
  Bahrain: "BHR",
  Kuwait: "KWT",
};

// Saudi-first sort comparator for any list with a country field
export function gulfPrioritySort<T extends { country: string }>(a: T, b: T) {
  const ai = COUNTRY_PRIORITY.indexOf(normalizeCountry(a.country) as CountryKey);
  const bi = COUNTRY_PRIORITY.indexOf(normalizeCountry(b.country) as CountryKey);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
}

// Parse the messy MW strings from announced_pipeline_mw / capacity strings
// Returns { low, high, point } in MW where possible.
export function parseMwRange(s: string | number | undefined | null): { low?: number; high?: number; point?: number; raw: string } {
  if (s === undefined || s === null) return { raw: "" };
  if (typeof s === "number") return { point: s, raw: String(s) };
  const rawText = String(s);
  const cleaned = rawText.replace(/,/g, "");
  const range = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return { low: a, high: b, point: (a + b) / 2, raw: rawText };
  }
  const gw = cleaned.match(/(\d+(?:\.\d+)?)\s*GW/i);
  if (gw) return { point: Number(gw[1]) * 1000, raw: rawText };
  const mw = cleaned.match(/(\d+(?:\.\d+)?)\s*MW/i);
  if (mw) return { point: Number(mw[1]), raw: rawText };
  const num = cleaned.match(/^(\d+(?:\.\d+)?)/);
  if (num) return { point: Number(num[1]), raw: rawText };
  return { raw: rawText };
}

function asNumber(v: unknown): number | undefined {
  const parsed = parseMwRange(v as any);
  return parsed.point ?? parsed.high ?? parsed.low;
}

// Compute live MW number where parseable per country.
export function liveMwByCountry(): Array<{ country: string; mw: number; confidence: Credibility | string; raw: string; source?: string; source_url?: string; source_urls?: string[]; energisation_evidence?: string }> {
  const m = dataset.dashboard_metrics.live_mw_by_country;
  const rows: any[] = [];
  for (const k of Object.keys(m)) {
    if (k === "notes") continue;
    const entry = m[k];
    const country = normalizeCountry(k.replace(/_/g, " ")) as string;
    const value = entry.mw_it_live ?? entry.live_mw;
    const parsed = parseMwRange(value);
    rows.push({
      country,
      mw: parsed.point ?? 0,
      confidence: entry.confidence ?? (entry.denominator_contested ? "MEDIUM" : "HIGH"),
      raw: String(value),
      source: entry.source,
      source_url: entry.source_url ?? entry.source_urls?.[0],
      source_urls: entry.source_urls,
      energisation_evidence: entry.energisation_evidence,
    });
  }
  return rows.sort(gulfPrioritySort);
}

export function announcedMwByCountry(): Array<{ country: string; low: number; high: number; raw: string; confidence: string }> {
  const m = dataset.dashboard_metrics.announced_mw_by_country;
  const rows: any[] = [];
  for (const k of Object.keys(m)) {
    if (k === "notes") continue;
    const entry = m[k];
    const country = normalizeCountry(k.replace(/_/g, " ")) as string;
    const value = entry.mw_announced ?? entry.announced_pipeline_mw;
    const parsed = parseMwRange(value);
    rows.push({
      country,
      low: parsed.low ?? parsed.point ?? 0,
      high: parsed.high ?? parsed.point ?? 0,
      raw: String(value),
      confidence: entry.confidence ?? "—",
    });
  }
  return rows.sort(gulfPrioritySort);
}

// Pull the largest explicit announced/under-construction MW figure from a supply event.
// Live MW, GW power availability and programme ambition are deliberately excluded.
export function maxAnnouncedMw(ev: SupplyEvent): number {
  const c = ev.capacity_mw ?? {};
  const candidates = [c.mw_announced, c.incremental_mw_announced, c.mw_under_construction_or_commissioning, c.mw_under_construction_or_contracted];
  return candidates.reduce<number>((max, v) => Math.max(max, asNumber(v) ?? 0), 0);
}

export const HYPERSCALERS = ["AWS", "Microsoft", "Google", "Google Cloud", "Oracle", "Tencent", "Tencent Cloud", "Meta", "IBM", "OpenAI", "xAI", "NVIDIA", "HUMAIN", "Cohere"];

export function hyperscaleFootprint(): Array<{ hyperscaler: string; countries: string[]; events: number }> {
  const map = new Map<string, { countries: Set<string>; events: number }>();
  for (const ev of dataset.supply_events) {
    const all = [ev.company, ...(ev.partners || [])];
    for (const name of all) {
      const match = HYPERSCALERS.find((h) => name.toLowerCase().includes(h.toLowerCase()));
      if (match) {
        const e = map.get(match) ?? { countries: new Set(), events: 0 };
        e.countries.add(normalizeCountry(ev.country) as string);
        e.events += 1;
        map.set(match, e);
      }
    }
  }
  return Array.from(map.entries()).map(([k, v]) => ({ hyperscaler: k, countries: Array.from(v.countries), events: v.events })).sort((a, b) => b.events - a.events);
}

export function topPlayersByCapacity() {
  return dataset.dashboard_metrics.top_players_by_known_announced_capacity
    .map((p, idx) => ({
      ...p,
      rank: p.rank ?? idx + 1,
      player: p.player ?? p.operator ?? `Player ${idx + 1}`,
      type: p.type ?? "operator/platform",
      mw: asNumber(p.mw_announced) ?? asNumber(p.capacity_mw) ?? 0,
    }))
    .sort((a, b) => (b.mw || 0) - (a.mw || 0));
}

export function credibilityCounts() {
  const c: Record<Credibility, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const ev of dataset.supply_events) {
    const score = normalizeCred(ev.credibility_score);
    c[score] += 1;
  }
  return c;
}

export function uniqueValues(field: keyof SupplyEvent) {
  const set = new Set<string>();
  for (const ev of dataset.supply_events) {
    const v = ev[field];
    if (typeof v === "string") set.add(v);
  }
  return Array.from(set).sort();
}

export function typeBucket(t: string): "AI" | "Hyperscale" | "Colo" | "Sovereign" | "Edge" | "Other" {
  const s = t.toLowerCase();
  if (s.includes("edge")) return "Edge";
  if (s.includes("sovereign") || s.includes("gov")) return "Sovereign";
  if (s.includes("hyperscale")) return "Hyperscale";
  if (s.includes("ai")) return "AI";
  if (s.includes("colo")) return "Colo";
  return "Other";
}
