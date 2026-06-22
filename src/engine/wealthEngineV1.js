// src/engine/wealthEngineV1.js

const VERSION = "wealth-engine-v1";

function safeName(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.name || value?.label || value?.type || null;
}

function getWealthBehaviour(mainStructure, dominantProfile) {
  if (mainStructure === "Connectors") return "Relationship Monetizer";
  if (mainStructure === "Thinkers") return "Knowledge Monetizer";
  if (mainStructure === "Supporters") return "Steady Value Builder";
  if (mainStructure === "Creators") return "Creative Opportunity Builder";
  if (mainStructure === "Managers") return "Systematic Accumulator";

  if (dominantProfile) return `${dominantProfile} Wealth Pattern`;

  return "Adaptive Wealth Builder";
}

function getIncomeStyle(mainStructure, dominantProfile) {
  if (mainStructure === "Connectors") return "Network-driven income";
  if (mainStructure === "Thinkers") return "Expertise-driven income";
  if (mainStructure === "Supporters") return "Service-driven income";
  if (mainStructure === "Creators") return "Creative income";
  if (mainStructure === "Managers") return "Structure-driven income";

  if (dominantProfile) return `${dominantProfile}-influenced income`;

  return "Flexible income style";
}

function getMoneyMindset(mainStructure, dayStatus) {
  if (mainStructure === "Connectors") return "Opportunity-Oriented";
  if (mainStructure === "Thinkers") return "Knowledge-Oriented";
  if (mainStructure === "Supporters") return "Security-Oriented";
  if (mainStructure === "Creators") return "Possibility-Oriented";
  if (mainStructure === "Managers") return "Control-Oriented";

  if (dayStatus === "Excessive") return "Self-Directed";
  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    return "Stability-Seeking";
  }

  return "Balanced";
}

function getWealthStrengths(mainStructure) {
  const map = {
    Connectors: [
      "Recognises opportunities through people, timing and networks.",
      "Builds trust that can become long-term business value.",
      "Can create wealth through communication, influence and relationships.",
    ],
    Thinkers: [
      "Can monetise knowledge, research and specialised expertise.",
      "Makes thoughtful financial decisions when given enough information.",
      "Understands patterns, systems and long-term strategy well.",
    ],
    Supporters: [
      "Builds wealth steadily through reliability and consistent contribution.",
      "Creates value by supporting people, clients or systems over time.",
      "Can develop financial stability through patience and commitment.",
    ],
    Creators: [
      "Can generate income through ideas, originality and personal expression.",
      "Spots unconventional opportunities before others do.",
      "Can turn creativity, branding or content into value.",
    ],
    Managers: [
      "Builds wealth through structure, discipline and measurable results.",
      "Can manage resources, systems and responsibilities effectively.",
      "Works well with clear financial goals and practical execution.",
    ],
  };

  return (
    map[mainStructure] || [
      "Can build wealth by aligning work style with practical strategy.",
      "Benefits from understanding personal financial patterns clearly.",
      "Can improve wealth outcomes through consistent decision-making.",
    ]
  ).slice(0, 3);
}

function getWealthRisks(mainStructure, dayStatus) {
  const risks = [];

  if (mainStructure === "Connectors") {
    risks.push("May chase too many opportunities at once.");
    risks.push("May overcommit resources through people, deals or excitement.");
  }

  if (mainStructure === "Thinkers") {
    risks.push("May delay financial action due to overthinking.");
    risks.push("May stay too long in planning mode before monetising knowledge.");
  }

  if (mainStructure === "Supporters") {
    risks.push("May undercharge or undervalue personal contribution.");
    risks.push("May prioritise stability even when growth opportunities appear.");
  }

  if (mainStructure === "Creators") {
    risks.push("May have inconsistent income if structure is lacking.");
    risks.push("May rely too much on inspiration instead of repeatable systems.");
  }

  if (mainStructure === "Managers") {
    risks.push("May become overly cautious or controlling with money.");
    risks.push("May focus too much on security and miss new opportunities.");
  }

  if (dayStatus === "Excessive") {
    risks.push("May rely too heavily on personal judgment and resist advice.");
  }

  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    risks.push("May need stronger support systems before taking major financial risks.");
  }

  return risks.slice(0, 3);
}

function getWealthStrategy(mainStructure, primaryUsefulGod) {
  const structureStrategy = {
    Connectors:
      "Build wealth through relationships, visibility, trust and disciplined follow-through.",
    Thinkers:
      "Build wealth through specialised knowledge, strategy, research and consistent monetisation.",
    Supporters:
      "Build wealth through reliability, service, long-term trust and stable contribution.",
    Creators:
      "Build wealth through creativity, branding, expression and repeatable business systems.",
    Managers:
      "Build wealth through structure, discipline, planning and practical execution.",
  };

  const usefulGodModifier = {
    Wood: "Growth improves when wealth decisions support learning, planning and long-term development.",
    Fire: "Growth improves when visibility, confidence and market presence are used wisely.",
    Earth:
      "Growth improves when financial decisions are grounded, practical and stability-focused.",
    Metal:
      "Growth improves when discipline, refinement, standards and financial structure are strengthened.",
    Water:
      "Growth improves when adaptability, communication, movement and strategic flow are used well.",
  };

  const base =
    structureStrategy[mainStructure] ||
    "Build wealth by matching personal strengths with practical, sustainable financial strategy.";

  const modifier = usefulGodModifier[primaryUsefulGod];

  return modifier ? `${base} ${modifier}` : base;
}

export function buildWealthEngineV1({
  dayMasterStrengthV4 = {},
  tenProfileScoringV2 = {},
  structureScoringV2 = {},
  usefulGodV4 = {},
} = {}) {
  const mainStructure = safeName(structureScoringV2?.mainStructure);
  const dominantProfile = safeName(tenProfileScoringV2?.dominantProfile);
  const dayStatus = dayMasterStrengthV4?.status || null;
  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;

  return {
    version: VERSION,

    wealthBehaviour: getWealthBehaviour(mainStructure, dominantProfile),
    incomeStyle: getIncomeStyle(mainStructure, dominantProfile),
    moneyMindset: getMoneyMindset(mainStructure, dayStatus),

    wealthStrengths: getWealthStrengths(mainStructure),
    wealthRisks: getWealthRisks(mainStructure, dayStatus),
    wealthStrategy: getWealthStrategy(mainStructure, primaryUsefulGod),

    debug: {
      mainStructure,
      dominantProfile,
      dayStatus,
      primaryUsefulGod,
      secondaryUsefulGod,
      note:
        "WealthEngineV1 translates frozen Engine V2 outputs into practical wealth and income interpretation. It does not affect pillars, strength, structure or useful god.",
    },
  };
}

export default buildWealthEngineV1;