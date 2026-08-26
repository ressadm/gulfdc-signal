// Strategic Insights — Aug 26 baseline synthesis.

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
    headline: "Telcos with power, land and sovereign trust can turn AI demand into pre-leased infrastructure, but only if they keep announced MW separate from live MW.",
    insights: [
      {
        title: "Use sovereign AI procurement as an anchor, not as a headline total",
        body: "The MIS x HUMAIN scope escalation proves that sovereign AI demand can create contractor pull-through, but the +200 MW delta remains announced-only until binding contract and energisation evidence exist.",
        posture: "Pursue",
        evidence: ["MIS x HUMAIN 250 MW letter of award", "0 MW live / +200 MW announced-only treatment", "HUMAIN hosting/service agreement as demand signal"],
      },
      {
        title: "Sell resilience and residency beside capacity",
        body: "OpenAI UAE inference residency and Bahrain/AWS availability risk show that regulated customers are buying deployability, failover and data-residency assurance, not just rack supply.",
        posture: "Defend",
        evidence: ["OpenAI UAE inference residency live", "Elastic AWS Bahrain status-page evidence", "Multi-region GCC failover requirement"],
      },
      {
        title: "Partner around Qatar-style financed expansion",
        body: "MEEZA and Syntys/Ooredoo make Qatar a practical Sell-With market: live capacity is smaller than KSA/UAE but financing, telco platforming and hyperscaler demand are clearer than in several larger announcements.",
        posture: "Pursue",
        evidence: ["MEEZA QAR 1.6bn facility for ~44 MW", "Syntys/Ooredoo ~26.1 MW Qatar live", "120 MW target by 2028"],
      },
    ],
  },
  {
    audience: "DC Operators",
    headline: "Execution proof now matters more than programme ambition; the best dashboards show live, construction, announced and power fields separately.",
    insights: [
      {
        title: "Benchmark against Khazna's split, not the 5 GW masterplan",
        body: "Khazna's ~300 MW operational plus ~370 MW under construction/commissioning is the most useful UAE execution benchmark; Stargate's 5 GW masterplan remains a strategic backdrop, not a live-capacity number.",
        posture: "Defend",
        evidence: ["Khazna ~300 MW operational", "~370 MW under construction/commissioning", "5 GW AI Campus treated as programme ambition"],
      },
      {
        title: "Build an evidence ladder for every project",
        body: "Projects should progress from announced to contracted, under construction, energised and live. DataVolt Oxagon, Oman AI SEZ and Kuwait substations all fail different rungs of that ladder today.",
        posture: "Hedge",
        evidence: ["DataVolt Oxagon pre-construction", "Oman AI SEZ no MW", "Kuwait grid assets no IT-load disclosure"],
      },
      {
        title: "Treat Saudi as high-conviction but high-variance",
        body: "Saudi has the largest policy ambition and power-availability narrative, but the 467 MW versus ~410 MW live denominator and multiple overlapping HUMAIN/DataVolt/center3 claims require conservative capacity accounting.",
        posture: "Hedge",
        evidence: ["467 MW MCIT-linked headline", "~410 MW Alvarez & Marsal estimate", "12.8 GW power availability separated from live MW"],
      },
    ],
  },
  {
    audience: "Investors",
    headline: "The investable GCC AI-DC thesis is shifting from headline GW to bankability, resilience and conversion evidence.",
    insights: [
      {
        title: "Discount non-binding awards until contract and energisation milestones appear",
        body: "The Aug 26 MIS x HUMAIN case is large enough to matter and explicit enough to model, but it should sit in announced MW and not in live capacity or contracted revenue until the binding-agreement condition clears.",
        posture: "Hedge",
        evidence: ["MIS final contracts subject to binding agreement", "+200 MW incremental announced-only", "0 MW live"],
      },
      {
        title: "Prefer financed and operator-confirmed MW over global capital headlines",
        body: "MEEZA's facility, Syntys/Ooredoo's operating base and Khazna's delivery split are more investable than non-GCC outbound headlines, which are now retained as exclusions rather than Gulf capacity.",
        posture: "Pursue",
        evidence: ["MEEZA QAR 1.6bn facility", "Syntys/Ooredoo live/contracted split", "Excluded Indonesia/Japan/Italy/U.S./Uzbekistan records"],
      },
      {
        title: "Make resilience a diligence line item",
        body: "Bahrain/AWS availability issues show that Gulf infrastructure value depends on continuity, region selection and disaster-recovery design as much as nominal MW.",
        posture: "Defend",
        evidence: ["Elastic Bahrain AWS status evidence", "UAE/Bahrain risk record", "OpenAI UAE residency as deployability signal"],
      },
    ],
  },
];
