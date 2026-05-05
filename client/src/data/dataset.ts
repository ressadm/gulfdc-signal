// Static-bundled dataset access. Vite imports JSON natively at build time.
// current.json is the live dashboard state; dated snapshots live in archive/.
import currentJson from "./current.json";

export type Credibility = "HIGH" | "MEDIUM" | "LOW";
export type CountryKey =
  | "Saudi Arabia"
  | "UAE"
  | "Qatar"
  | "Oman"
  | "Bahrain"
  | "Kuwait";

export interface SupplyEvent {
  id: string;
  company: string;
  partners: string[];
  country: string;
  city_location: string;
  capacity_mw: Record<string, unknown> & {
    confidence?: string;
    notes?: string;
  };
  type: string;
  stage: string;
  timeline: string;
  credibility_score: Credibility;
  contradiction_inflation_notes: string;
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
}

export interface PartnershipItem {
  id: string;
  classification: "Buy-From" | "Sell-To" | "Sell-With" | string;
  buyer?: string;
  seller?: string;
  description: string;
  country: string;
  source_urls: string[];
  // Some entries use party_a/party_b for joint ventures
  party_a?: string;
  party_b?: string;
}

export interface DashboardMetrics {
  live_mw_by_country: Record<string, any>;
  announced_mw_by_country: Record<string, any>;
  top_players_by_known_announced_capacity: Array<{
    rank: number;
    player: string;
    capacity_mw: string;
    country: string;
    type: string;
  }>;
  gcc_total_existing_capacity: {
    total_mw: string;
    upcoming_to_2028: string;
    investment_to_2027: string;
    source: string;
    source_url: string;
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
    priority_order: CountryKey[];
    credibility_scale: string;
    mw_note: string;
    disclaimer: string;
  };
  supply_events: SupplyEvent[];
  demand_signals: DemandSignal[];
  regulation_policy: RegulationItem[];
  partnerships_ecosystem: PartnershipItem[];
  dashboard_metrics: DashboardMetrics;
  watch_items: WatchItems;
  analyst_notes: AnalystNotes;
}

export const dataset = currentJson as unknown as Dataset;

export const COUNTRY_PRIORITY: CountryKey[] = [
  "Saudi Arabia",
  "UAE",
  "Qatar",
  "Oman",
  "Bahrain",
  "Kuwait",
];

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
  const ar = ai === -1 ? 99 : ai;
  const br = bi === -1 ? 99 : bi;
  return ar - br;
}

export function normalizeCountry(c: string): string {
  if (!c) return c;
  if (c.includes("Saudi") && c.includes("UAE")) return "Saudi Arabia"; // multi-country picks first
  if (c.includes("/")) return c.split("/")[0].trim();
  return c.trim();
}

// Parse the messy MW strings from announced_pipeline_mw / capacity strings
// Returns { low, high, point } in MW where possible.
export function parseMwRange(s: string | number | undefined | null): {
  low?: number;
  high?: number;
  point?: number;
  raw: string;
} {
  if (s === undefined || s === null) return { raw: "" };
  if (typeof s === "number") return { point: s, raw: String(s) };
  const raw = String(s);
  const cleaned = raw.replace(/,/g, "");
  // Range like 3500-5000
  const range = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return { low: a, high: b, point: (a + b) / 2, raw };
  }
  // GW patterns ("5GW", "1 GW")
  const gw = cleaned.match(/(\d+(?:\.\d+)?)\s*GW/i);
  if (gw) {
    return { point: Number(gw[1]) * 1000, raw };
  }
  const mw = cleaned.match(/(\d+(?:\.\d+)?)\s*MW/i);
  if (mw) return { point: Number(mw[1]), raw };
  // bare number
  const num = cleaned.match(/^(\d+(?:\.\d+)?)/);
  if (num) return { point: Number(num[1]), raw };
  return { raw };
}

// Compute live MW number where parseable per country
export function liveMwByCountry(): Array<{
  country: string;
  mw: number;
  confidence: Credibility | string;
  raw: string;
  source?: string;
  source_url?: string;
}> {
  const m = dataset.dashboard_metrics.live_mw_by_country;
  const rows: any[] = [];
  for (const k of Object.keys(m)) {
    if (k === "notes") continue;
    const entry = m[k];
    const country = k.replace(/_/g, " ");
    const parsed = parseMwRange(entry.live_mw);
    rows.push({
      country,
      mw: parsed.point ?? 0,
      confidence: entry.confidence ?? "HIGH",
      raw: String(entry.live_mw),
      source: entry.source,
      source_url: entry.source_url,
    });
  }
  return rows.sort((a, b) => {
    const ai = COUNTRY_PRIORITY.indexOf(a.country as CountryKey);
    const bi = COUNTRY_PRIORITY.indexOf(b.country as CountryKey);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function announcedMwByCountry(): Array<{
  country: string;
  low: number;
  high: number;
  raw: string;
  confidence: string;
}> {
  const m = dataset.dashboard_metrics.announced_mw_by_country;
  const rows: any[] = [];
  for (const k of Object.keys(m)) {
    if (k === "notes") continue;
    const entry = m[k];
    const country = k.replace(/_/g, " ");
    const parsed = parseMwRange(entry.announced_pipeline_mw);
    rows.push({
      country,
      low: parsed.low ?? parsed.point ?? 0,
      high: parsed.high ?? parsed.point ?? 0,
      raw: String(entry.announced_pipeline_mw),
      confidence: entry.confidence ?? "—",
    });
  }
  return rows.sort((a, b) => {
    const ai = COUNTRY_PRIORITY.indexOf(a.country as CountryKey);
    const bi = COUNTRY_PRIORITY.indexOf(b.country as CountryKey);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

// Pull the largest MW figure from a supply event's capacity_mw object
export function maxAnnouncedMw(ev: SupplyEvent): number {
  let max = 0;
  for (const [k, v] of Object.entries(ev.capacity_mw)) {
    if (k === "confidence" || k === "notes") continue;
    if (typeof v === "number" && v > max) max = v;
    if (typeof v === "string") {
      const p = parseMwRange(v);
      const cand = p.point ?? p.high ?? 0;
      if (cand > max) max = cand;
    }
  }
  return max;
}

// Hyperscaler list to detect footprint
export const HYPERSCALERS = [
  "AWS",
  "Microsoft",
  "Google",
  "Google Cloud",
  "Oracle",
  "Tencent",
  "Tencent Cloud",
  "Meta",
  "IBM",
  "OpenAI",
  "xAI",
  "NVIDIA",
];

export function hyperscaleFootprint(): Array<{
  hyperscaler: string;
  countries: string[];
  events: number;
}> {
  const map = new Map<string, { countries: Set<string>; events: number }>();
  for (const ev of dataset.supply_events) {
    const all = [ev.company, ...(ev.partners || [])];
    for (const name of all) {
      const match = HYPERSCALERS.find((h) =>
        name.toLowerCase().includes(h.toLowerCase())
      );
      if (match) {
        const e = map.get(match) ?? { countries: new Set(), events: 0 };
        e.countries.add(normalizeCountry(ev.country));
        e.events += 1;
        map.set(match, e);
      }
    }
  }
  return Array.from(map.entries())
    .map(([k, v]) => ({
      hyperscaler: k,
      countries: Array.from(v.countries),
      events: v.events,
    }))
    .sort((a, b) => b.events - a.events);
}

export function topPlayersByCapacity() {
  return dataset.dashboard_metrics.top_players_by_known_announced_capacity
    .map((p) => ({
      ...p,
      mw: parseMwRange(p.capacity_mw).point ?? parseMwRange(p.capacity_mw).high ?? 0,
    }))
    .sort((a, b) => (b.mw || 0) - (a.mw || 0));
}

export function credibilityCounts() {
  const c: Record<Credibility, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const ev of dataset.supply_events) {
    const score = (ev.credibility_score || "MEDIUM") as Credibility;
    if (score in c) c[score] += 1;
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

// Heuristic: classify supply event type into broader buckets
export function typeBucket(t: string): "AI" | "Hyperscale" | "Colo" | "Sovereign" | "Edge" | "Other" {
  const s = t.toLowerCase();
  if (s.includes("edge")) return "Edge";
  if (s.includes("sovereign") || s.includes("gov")) return "Sovereign";
  if (s.includes("hyperscale")) return "Hyperscale";
  if (s.includes("ai")) return "AI";
  if (s.includes("colo")) return "Colo";
  return "Other";
}
