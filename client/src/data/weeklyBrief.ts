// Curated Weekly Intelligence Brief — analyst synthesis, not summaries.
// Composed by extracting and weighing evidence from the seed dataset; each item
// references concrete events with source URLs preserved for verification.

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
    headline:
      "Stargate UAE 200 MW first phase enters confirmed construction; the remaining 4.8 GW remains hostage to US chip-export politics",
    what_changed:
      "G42's October 2025 update converted the Stargate UAE Phase 1 from 'announced' to confirmed construction with a 2026 delivery target, while leaving the residual 4.8 GW of the 5 GW Abu Dhabi campus contingent on US national-security clearances. The UAE-China technology-ties question — unresolved as of the dataset window — has not been retired.",
    why_it_matters:
      "Operators who had begun pricing the full 5 GW into 2027–2030 demand models must now bifurcate UAE assumptions: a ~200 MW high-confidence near-term band and an additional 4.8 GW conditional band. Capacity planning, GPU procurement and partner positioning should be sequenced against US BIS rulemaking, not against the campus master plan. The Khazna execution team is still the safest UAE counterparty for 2026 deliveries.",
    signal: "watch",
    countries: ["UAE"],
    related_event_ids: ["UAE-001"],
    sources: findUrls(["UAE-001"]),
  },
  {
    rank: 2,
    headline:
      "HUMAIN's announced capacity stack is now the single largest source of GCC pipeline-MW double-counting risk",
    what_changed:
      "Across HUMAIN's own 1.9 GW (2030) and 6.6 GW (2034) targets, the center3/stc 1 GW JV, DataVolt/NEOM 1.5 GW, and SDAIA's Hexagon 480 MW, multiple announcements appear to share land, power and financing assumptions but are reported additively in industry trackers.",
    why_it_matters:
      "Treating the headline 3.5–5 GW Saudi pipeline as additive contracted capacity will produce a ~2x oversupply illusion for 2027–2030. The right framing is HUMAIN-as-system-integrator: the JV with center3 is part of HUMAIN's own footprint, not on top of it. Site selection and tenant negotiation should focus on HUMAIN's actual phased delivery (200 MW Q2 2026) rather than on the cumulative aspirational targets.",
    signal: "risk",
    countries: ["Saudi Arabia"],
    related_event_ids: ["SA-001", "SA-003", "SA-008", "SA-002"],
    sources: findUrls(["SA-001", "SA-003", "SA-008", "SA-002"]),
  },
  {
    rank: 3,
    headline:
      "AWS Bahrain region disruption (March 2026) reframes geographic concentration risk for GCC-anchored workloads",
    what_changed:
      "AWS confirmed an infrastructure disruption affecting its Bahrain (and connected UAE) zones in March 2026, surfacing on third-party operator channels. The event did not appear to cause sustained data loss but exposed the single-region exposure of many GCC-anchored regulated workloads.",
    why_it_matters:
      "Bahrain has functioned as the de-facto cloud anchor for Gulf financial services since 2019; a single-region resilience event raises the bar for active-active multi-region designs and will accelerate sovereign-cloud demand for in-country redundancy in KSA and UAE. Colo operators with second-region pitches can credibly approach BFSI accounts that previously deferred to AWS-Bahrain defaults.",
    signal: "risk",
    countries: ["Bahrain", "UAE"],
    related_event_ids: ["BH-001"],
    sources: findUrls(["BH-001"]),
  },
  {
    rank: 4,
    headline:
      "Saudi Arabia's $0.05/kWh blended power and ~$0.01/kWh solar reset the 2027+ AI training cost curve",
    what_changed:
      "Public reporting (The Economist, December 2025) framed Saudi Arabia as a candidate location for the 'world's cheapest AI data centres,' with Al Shuaiba solar at ~$0.01/kWh feeding the broader $0.05/kWh blended commercial rate. HUMAIN's offtake design is built around this energy stack.",
    why_it_matters:
      "If this energy economics survives Vision 2030 subsidy reform, Saudi Arabia's structural cost advantage for training-class workloads is durable enough to displace a meaningful share of the EU and US training run market. Operators should re-test their LCOE-per-token assumptions; investors should note that this is the first time a sovereign-AI thesis has had genuine commodity-cost backing at this scale.",
    signal: "primary",
    countries: ["Saudi Arabia"],
    sources: [
      "https://www.economist.com/science-and-technology/2025/12/17/saudi-arabia-wants-to-host-the-worlds-cheapest-data-centres",
    ],
  },
  {
    rank: 5,
    headline:
      "Kuwait colocation occupancy projected to hit 90% by 2030 — the GCC's clearest greenfield undersupply signal",
    what_changed:
      "GlobeNewswire's September 2025 Kuwait colocation report has the market growing from $16M (2024) to $95M (2030) at 34.6% CAGR with effective full occupancy by 2030. No large-scale projects have been announced to absorb the excess demand.",
    why_it_matters:
      "This is the single highest-conviction undersupply call in the GCC. A first mover with 20–50 MW in Kuwait City should expect day-one anchor tenancy. The competitive risk is not capacity overbuild but regulatory friction; Kuwait still lacks a dedicated DC framework, so operators will need to negotiate site-level concessions individually.",
    signal: "live",
    countries: ["Kuwait"],
    related_event_ids: ["KW-001"],
    sources: findUrls(["KW-001"]),
  },
  {
    rank: 6,
    headline:
      "DataVolt–Supermicro $20B liquid-cooled server agreement is the largest single supply-chain concentration risk in the regional buildout",
    what_changed:
      "DataVolt's NEOM 1.5 GW commitment is anchored on a $20B Supermicro liquid-cooled server contract. At this scale, a Supermicro quality-control event or production slip would propagate directly into Saudi delivery timelines.",
    why_it_matters:
      "Operators competing with DataVolt should treat Supermicro execution risk as a regional asset; if NEOM Phase 1 slips, there will be a 6–12 month window of constrained AI capacity in KSA in which alternative suppliers (HUMAIN's Cisco/AMD JV, hyperscaler regions) become the only credible delivery vehicle. Hedging with Vertiv/Schneider liquid-cooling supply chains is now table stakes.",
    signal: "risk",
    countries: ["Saudi Arabia"],
    related_event_ids: ["SA-003"],
    sources: findUrls(["SA-003"]),
  },
  {
    rank: 7,
    headline:
      "Saudi PDPL enforcement plus CSTC class designations are converting hyperscalers into local-partner-dependent operators",
    what_changed:
      "SDAIA and NCA's active PDPL enforcement, combined with CSTC CSP class designations (A/B/C), now require foreign operators to either build in-country or partner with locally-licensed entities to access government and financial workloads. AWS, Google, Oracle and Microsoft have committed; smaller foreign entrants face a structural moat.",
    why_it_matters:
      "The competitive landscape in Saudi colo and cloud is consolidating around a small group of license-bearing local champions: HUMAIN, center3/stc, SDAIA, with Khazna for UAE. Telcos who are not on that list (e.g., Mobily for sovereign workloads) face a long catch-up path. Foreign entrants should expect partnership-first market entry, not branch-office expansion.",
    signal: "primary",
    countries: ["Saudi Arabia"],
    related_event_ids: ["REG-001"],
    sources: findUrls(["REG-001"]),
  },
  {
    rank: 8,
    headline:
      "UAE clean-energy procurement gap will bind on AI buildout before power capacity does",
    what_changed:
      "Wood Mackenzie's March 2026 note identifies 'regulatory gaps that constrain clean energy procurement' as the binding constraint for UAE DCs as power demand doubles by 2030. Masdar's 1 GW solar+battery hybrid project (2027) is the structural fix.",
    why_it_matters:
      "UAE operators counting on standard PPA structures to meet hyperscaler RE100 commitments should expect 12–18 months of contractual friction. The credible path is co-investment in the Masdar pipeline or Sovereign Launchpad-style sovereign cloud wrappers that bundle compliance with renewable attribution. ADQ's $25B power infrastructure allocation is the supply-side answer; clean-energy regulatory reform is the demand-side bottleneck.",
    signal: "watch",
    countries: ["UAE"],
    related_event_ids: ["UAE-002"],
    sources: [
      "https://www.woodmac.com/press-releases/uae-data-centre-power-demand-to-double-by-2030-as-regulatory-gaps-constrain-clean-energy-procurement/",
      "https://www.emiratesnbdresearch.com/-/media/emirates_nbd_research_-_macro_economics_10142025.pdf",
    ],
  },
  {
    rank: 9,
    headline:
      "Qatar's Meeza is quietly running a 4x capacity expansion that, by GCC scale, is a Tier-2 dominance play",
    what_changed:
      "Meeza's Q3 2025 investor call confirmed M-Vault 4 (4 MW, H1 2026, sold), the 24 MW Um Garn flagship campus (first 6 MW end-2027), and MV7 at 14 MW. With QIA's Anthropic stake signalling AI ecosystem ambition, Qatar is positioning to be more than a sovereign-colo niche.",
    why_it_matters:
      "Qatar is small in absolute MW but is developing a coherent sovereign-AI thesis (QIA + Meeza + green energy) that other Tier-2 markets (Oman, Bahrain) have not articulated. For DC operators, Meeza is a plausible Sell-With partner for hyperscaler-aligned tenancy in Doha; for investors, the QIA-Anthropic signal is the strongest indication that Qatar will participate in regional AI capital deployment beyond infrastructure.",
    signal: "info",
    countries: ["Qatar"],
    related_event_ids: ["QA-001"],
    sources: findUrls(["QA-001"]),
  },
  {
    rank: 10,
    headline:
      "Liquid-cooling expertise is hardening into the GCC's most defensible operational moat",
    what_changed:
      "DataVolt/NEOM (Red Sea seawater cooling), HUMAIN (liquid-cooled GPU systems), and ICS Arabia (immersion cooling) are converging on liquid as the only viable thermal architecture for >50 kW/rack AI loads in desert climates. PUE penalties for air-cooled designs are widening.",
    why_it_matters:
      "Operators without an in-house liquid/immersion track record will lose AI tenancy bids on cooling alone, regardless of land or power economics. Vertiv, Schneider, Asetek and regional specialists are the procurement priorities. Telcos building DC arms (e&, du, stc) need either to hire-in or to JV with cooling specialists ahead of the 2026 buildout wave.",
    signal: "primary",
    countries: ["Saudi Arabia", "UAE"],
    related_event_ids: ["SA-013", "SA-003", "SA-001"],
    sources: findUrls(["SA-013", "SA-003", "SA-001"]),
  },
];
