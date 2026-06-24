// src/engine/wealthEngineV1.js

const VERSION = "wealth-engine-v1";

// Ten-God control cycle: the element the Day Master CONTROLS is its Wealth
// element. This is a fixed structural relationship and must not be confused
// with usefulGodV4.primaryUsefulGod, which is the strength-balancing Useful
// God (用神) - a different concept that can resolve to Output, Officer, etc.
// depending on the Day Master's strength band.
const CONTROLS = {
  Wood: "Earth",
  Fire: "Metal",
  Earth: "Water",
  Metal: "Wood",
  Water: "Fire",
};

function safeName(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.name || value?.label || value?.type || value?.profile || null;
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

const DOMINANT_PROFILE_WEALTH_MODIFIER = {
  Friend: "Because Friend energy is active, wealth tends to grow through trusted circles and mutual support rather than competing alone.",
  "Rob Wealth": "Because Rob Wealth energy is active, wealth tends to grow through independent, bold moves rather than waiting for consensus.",
  "Eating God": "Because Eating God energy is active, wealth tends to grow through expertise, quality and a reputation for genuine skill.",
  "Hurting Officer": "Because Hurting Officer energy is active, wealth tends to grow through original ideas and a willingness to challenge the conventional approach.",
  "Direct Wealth": "Because Direct Wealth energy is active, wealth tends to grow through consistency, discipline and steady, measurable progress.",
  "Indirect Wealth": "Because Indirect Wealth energy is active, wealth tends to grow through timing, flexibility and recognising opportunities others miss.",
  "Direct Officer": "Because Direct Officer energy is active, wealth tends to grow through responsibility, structure and a reputation for doing things properly.",
  "Seven Killings": "Because Seven Killings energy is active, wealth tends to grow through decisive action taken at the right moment, more than slow accumulation.",
  "Direct Resource": "Because Direct Resource energy is active, wealth tends to grow through preparation, research and well-considered decisions.",
  "Indirect Resource": "Because Indirect Resource energy is active, wealth tends to grow through intuition, pattern recognition and seeing what others overlook.",
};

function getWealthStrategy(mainStructure, wealthElement, dominantProfile) {
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

  const wealthElementModifier = {
    Wood: "Your Wealth element is Wood, so opportunities tend to grow through expansion, planning and long-term development.",
    Fire: "Your Wealth element is Fire, so opportunities tend to grow through visibility, confidence and market presence.",
    Earth:
      "Your Wealth element is Earth, so opportunities tend to grow through grounded, practical, stability-focused decisions.",
    Metal:
      "Your Wealth element is Metal, so opportunities tend to grow through discipline, refinement and financial structure.",
    Water:
      "Your Wealth element is Water, so opportunities tend to grow through adaptability, communication and strategic flow.",
  };

  const base =
    structureStrategy[mainStructure] ||
    "Build wealth by matching personal strengths with practical, sustainable financial strategy.";

  const modifier = wealthElementModifier[wealthElement];
  const profileModifier = DOMINANT_PROFILE_WEALTH_MODIFIER[dominantProfile];

  return [base, modifier, profileModifier].filter(Boolean).join(" ");
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
  const dayMasterElement = usefulGodV4?.dayMasterElement || null;
  const wealthElement = CONTROLS[dayMasterElement] || null;

  return {
    version: VERSION,

    wealthBehaviour: getWealthBehaviour(mainStructure, dominantProfile),
    incomeStyle: getIncomeStyle(mainStructure, dominantProfile),
    moneyMindset: getMoneyMindset(mainStructure, dayStatus),

    wealthStrengths: getWealthStrengths(mainStructure),
    wealthRisks: getWealthRisks(mainStructure, dayStatus),
    wealthStrategy: getWealthStrategy(mainStructure, wealthElement, dominantProfile),
    wealthElement,

    debug: {
      mainStructure,
      dominantProfile,
      dayStatus,
      dayMasterElement,
      wealthElement,
      primaryUsefulGod,
      secondaryUsefulGod,
      note:
        "WealthEngineV1 translates frozen Engine V2 outputs into practical wealth and income interpretation. It does not affect pillars, strength, structure or useful god.",
    },
  };
}

export default buildWealthEngineV1;