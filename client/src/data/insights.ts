// Strategic Insights — three implications each for Telcos, DC Operators and Investors.
// Synthesis derived from the seed dataset and analyst notes.

export interface Insight {
  title: string;
  body: string;
  posture: "Pursue" | "Defend" | "Hedge";
  evidence: string[];
}

export interface InsightSet {
  audience: "Telcos" | "DC Operators" | "Investors";
  headline: string;
  insights: [Insight, Insight, Insight];
}

export const STRATEGIC_INSIGHTS: InsightSet[] = [
  {
    audience: "Telcos",
    headline:
      "License-bearing telcos are the GCC's structural gatekeepers; the window to lock in sovereign-AI partnerships is 12–18 months.",
    insights: [
      {
        title: "Lead with sovereign cloud wrappers, not raw colo",
        body: "PDPL enforcement and CSTC class designations have made the local-license-bearing telco the only credible delivery vehicle for government and BFSI workloads. e&'s Sovereign Launchpad with AWS and du's AED 2B Microsoft DC are the templates. Telcos still pricing themselves as carrier-neutral colo are leaving 30–50% margin on the table.",
        posture: "Pursue",
        evidence: [
          "Saudi PDPL active enforcement; CSTC CSP A/B/C class designations",
          "e&-AWS Sovereign Launchpad; du-Microsoft AED 2B Dubai DC",
          "center3/stc-HUMAIN 1 GW JV positions stc as Saudi sovereign DC champion",
        ],
      },
      {
        title: "Build (or buy) liquid-cooling operational depth",
        body: "AI tenancy at >50 kW/rack is impossible without liquid or immersion cooling in desert climates. Telcos who try to stretch existing air-cooled footprints will lose hyperscaler co-tenancy bids regardless of land or power. Vertiv/Schneider partnerships, ICS Arabia-style immersion, or HUMAIN-aligned liquid designs are now table stakes.",
        posture: "Defend",
        evidence: [
          "DataVolt-Supermicro $20B liquid-cooled servers",
          "ICS Arabia immersion cooling deployments (XDS Riyadh)",
          "HUMAIN liquid-cooled GPU systems standard",
        ],
      },
      {
        title: "Treat HUMAIN as a system integrator, not a competitor",
        body: "HUMAIN is structured as a buy-and-resell platform: it is buying GPUs from NVIDIA and AMD, construction from AirTrunk and DataVolt, and reselling capacity to xAI, AWS and Qualcomm. Telcos that integrate as an upstream supplier (center3 model) capture more value than telcos that compete head-on for AI training tenancy.",
        posture: "Pursue",
        evidence: [
          "HUMAIN buys: NVIDIA 600K GPUs, AirTrunk $3B, DataVolt $5B",
          "HUMAIN sells: xAI 500MW, AWS $5B AI Zone, Qualcomm 200MW",
          "center3-HUMAIN 1GW JV (Sell-With architecture)",
        ],
      },
    ],
  },
  {
    audience: "DC Operators",
    headline:
      "Saudi Arabia and Kuwait are the asymmetric capacity bets; UAE is the execution-quality bet; everywhere else is sovereign or specialty.",
    insights: [
      {
        title: "Saudi Arabia: site for AI training, not for general colo",
        body: "Saudi's $0.05/kWh blended power and ~$0.01/kWh solar create a structural training-cost moat. Operators bringing 50–100 MW of AI-grade colo with sovereign certification can build into HUMAIN's offtake gap (initial capacity already sold). Operators chasing general enterprise colo will be price-compressed by Equinix, center3, Khazna and Alfanar all entering Riyadh/Dammam in 2026–2027.",
        posture: "Pursue",
        evidence: [
          "Saudi $0.05/kWh blended; Al Shuaiba $0.01/kWh solar",
          "HUMAIN initial capacity reportedly sold out",
          "Equinix 100MW + Khazna + center3 + Alfanar competing in Riyadh",
        ],
      },
      {
        title: "Kuwait: 20–50 MW first-mover capture window",
        body: "Kuwait's colocation market is projected to hit 90% occupancy by 2030 with no large-scale projects announced. A 20–50 MW Kuwait City build, properly sequenced with a sovereign-data partner, will achieve day-one anchor tenancy. The execution risk is regulatory friction, not demand.",
        posture: "Pursue",
        evidence: [
          "Kuwait colo $16M (2024) → $95M (2030), 34.6% CAGR",
          "Average occupancy 90% by 2030 = effectively full",
          "No large-scale Kuwait DC projects in seed dataset",
        ],
      },
      {
        title: "UAE: compete on engineering and sovereign certification, not on capacity",
        body: "Khazna's existing 650 MW base and Stargate UAE's confirmed 200 MW Phase 1 set the engineering benchmark. Tier-IV certification, multi-region resilience (post-Bahrain disruption) and clean-energy procurement (Masdar 1 GW path) are the differentiators. Operators chasing pure capacity in UAE will be outpaced by Khazna; operators selling on resilience and certification will win regulated workloads.",
        posture: "Defend",
        evidence: [
          "Khazna ~650 MW existing + 1 GW pipeline",
          "AWS Bahrain disruption (March 2026) raised resilience bar",
          "Wood Mackenzie: UAE clean-energy regulatory gap binding by 2030",
        ],
      },
    ],
  },
  {
    audience: "Investors",
    headline:
      "The GCC AI-DC thesis lives or dies on US chip-export politics; everything else is timing risk on a high-conviction structural trend.",
    insights: [
      {
        title: "Position size against US BIS rulemaking, not against announced GW totals",
        body: "Every Saudi and UAE AI-DC investment thesis presupposes BIS authorization for Blackwell-class GPU exports. This is a discretionary US foreign-policy instrument, not a rule-based entitlement. Position sizing should reflect the binary: full Stargate UAE 5 GW only if US-UAE technology-ties concerns are resolved; HUMAIN-NVIDIA 600K GPU pipeline only if BIS authorizations continue case-by-case.",
        posture: "Hedge",
        evidence: [
          "BIS rulemaking on AI diffusion 2025-2026 still under review",
          "US Commerce Dept authorized ~35,000 Blackwell-equivalent for HUMAIN (case-by-case)",
          "US security concerns over G42-China ties remain unresolved",
        ],
      },
      {
        title: "Liquid cooling and sovereign cloud middleware are the two derivative plays",
        body: "Direct AI-DC equity is concentrated and hard to access (PIF-backed HUMAIN, G42, DataVolt). The investable exposure is via the supply chain: Vertiv, Schneider, Asetek for cooling; InCountry-style sovereign cloud wrappers for compliance. The cooling thesis is genuinely structural (PUE penalties widen with desert climate + AI density); the middleware thesis depends on PDPL/UAE-PDPL enforcement persistence.",
        posture: "Pursue",
        evidence: [
          "DataVolt-Supermicro $20B liquid cooling at scale",
          "ICS Arabia + XDS immersion cooling deployments",
          "e& Sovereign Launchpad as proof of sovereign middleware demand",
        ],
      },
      {
        title: "Discount Saudi pipeline MW totals by 40–50% for double-counting",
        body: "Headline Saudi pipeline of 3.5–5 GW reflects HUMAIN, center3 JV, DataVolt and SDAIA targets that share land, power and financing. Conservative deployment by 2030 is closer to 1.5–2.5 GW. Investors using 5 GW totals will overweight Saudi versus UAE; the realistic comparison is closer to UAE 2–3 GW deliverable vs Saudi 1.5–2.5 GW deliverable by 2030.",
        posture: "Hedge",
        evidence: [
          "HUMAIN 1.9 GW + center3 1 GW JV likely overlap in delivery",
          "DataVolt 1.5 GW NEOM in announced phase, no anchor tenants beyond HUMAIN",
          "S&P/IMARC demand forecast ~760 MW additional Saudi by 2030",
        ],
      },
    ],
  },
];
