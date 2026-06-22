// src/engine/wealthArchetypeV1.js

const STRUCTURE_WEALTH_MODIFIERS = {
  Connectors: {
    wealthStyle: "Relationship-driven wealth",
    incomePath:
      "Your wealth grows through people, trust, reputation, referrals, partnerships and being remembered by the right network.",
    moneyStrengths: [
      "You can create opportunities through relationships and conversations.",
      "You are able to monetise trust, visibility and reputation over time.",
      "Your earning path improves when you build strong networks instead of working in isolation.",
    ],
    moneyBlindSpots: [
      "You may overcommit to too many people, collaborations or opportunities at once.",
      "You may confuse relationship loyalty with financial responsibility.",
      "You may need clearer boundaries around who deserves your time, energy and resources.",
    ],
    idealIncomeModels: [
      "Client-facing business",
      "Consultation-based services",
      "Sales, partnerships or referrals",
      "Community-driven branding",
      "Relationship-based product sales",
    ],
  },

  Thinkers: {
    wealthStyle: "Knowledge-driven wealth",
    incomePath:
      "Your wealth grows through knowledge, analysis, skill, strategy, research and being recognised for your expertise.",
    moneyStrengths: [
      "You can earn well when your knowledge is trusted and valued.",
      "You are able to spot patterns, risks and details that others miss.",
      "Your income grows when expertise becomes a clear service, product or system.",
    ],
    moneyBlindSpots: [
      "You may wait too long to feel ready before monetising what you already know.",
      "You may overthink pricing, positioning or timing.",
      "You may undervalue your knowledge because it feels natural to you.",
    ],
    idealIncomeModels: [
      "Specialist services",
      "Education or teaching",
      "Research-based consulting",
      "Strategy work",
      "Content that builds authority",
    ],
  },

  Supporters: {
    wealthStyle: "Stability-driven wealth",
    incomePath:
      "Your wealth grows through consistency, reliability, service, care, long-term trust and dependable contribution.",
    moneyStrengths: [
      "You build wealth steadily when people trust your reliability.",
      "You are able to create long-term value through service and consistency.",
      "You are good at maintaining systems, relationships and responsibilities over time.",
    ],
    moneyBlindSpots: [
      "You may undercharge because you focus more on helping than receiving.",
      "You may carry too much responsibility without asking for proper compensation.",
      "You may stay in stable but limiting income paths for too long.",
    ],
    idealIncomeModels: [
      "Retainer-based services",
      "Long-term client care",
      "Operations or management",
      "Service-based business",
      "Stable recurring income models",
    ],
  },

  Warriors: {
    wealthStyle: "Performance-driven wealth",
    incomePath:
      "Your wealth grows through courage, pressure, decisive action, leadership, competition and taking on meaningful challenges.",
    moneyStrengths: [
      "You can act quickly when opportunity requires courage.",
      "You are able to perform under pressure and take ownership.",
      "Your earning path improves when challenge is paired with discipline.",
    ],
    moneyBlindSpots: [
      "You may take financial risks too quickly when pressure activates you.",
      "You may push through stress instead of reviewing the long-term cost.",
      "You may feel that slowing down means losing momentum.",
    ],
    idealIncomeModels: [
      "Leadership roles",
      "High-performance sales",
      "Entrepreneurship",
      "Crisis-solving work",
      "Competitive industries",
    ],
  },

  Creators: {
    wealthStyle: "Expression-driven wealth",
    incomePath:
      "Your wealth grows through creativity, content, personal style, ideas, storytelling, taste and emotional resonance.",
    moneyStrengths: [
      "You can attract money through expression, originality and aesthetic instinct.",
      "You are able to turn ideas, taste or stories into value.",
      "Your income grows when your creativity is supported by consistency.",
    ],
    moneyBlindSpots: [
      "You may lose momentum once the initial excitement fades.",
      "You may resist structure even when structure helps your creativity sell.",
      "You may need clearer systems for pricing, follow-up and conversion.",
    ],
    idealIncomeModels: [
      "Content creation",
      "Creative products",
      "Brand storytelling",
      "Design or aesthetics",
      "Personal brand monetisation",
    ],
  },
};

const PROFILE_WEALTH_ARCHETYPES = {
  "Direct Wealth": {
    wealthArchetype: "Practical Value Builder",
    modifier:
      "You are strongest when money is linked to clear value, ownership, consistency and practical results.",
  },

  "Indirect Wealth": {
    wealthArchetype: "Opportunity Monetizer",
    modifier:
      "You are strongest when you can spot timing, trends, gaps and opportunities before they become obvious.",
  },

  Friend: {
    wealthArchetype: "Community Builder",
    modifier:
      "You are strongest when money grows through peer networks, shared trust, community and aligned people.",
  },

  "Rob Wealth": {
    wealthArchetype: "Independent Competitor",
    modifier:
      "You are strongest when you have autonomy, self-direction and the freedom to compete or differentiate.",
  },

  "Direct Officer": {
    wealthArchetype: "Structured Wealth Builder",
    modifier:
      "You are strongest when money grows through discipline, responsibility, reputation and long-term planning.",
  },

  "Seven Killings": {
    wealthArchetype: "Pressure Performer",
    modifier:
      "You are strongest when money grows through courage, high standards, decisive action and meaningful challenge.",
  },

  "Direct Resource": {
    wealthArchetype: "Trusted Knowledge Holder",
    modifier:
      "You are strongest when money grows through trust, support, learning, guidance and recognised stability.",
  },

  "Indirect Resource": {
    wealthArchetype: "Insight Monetizer",
    modifier:
      "You are strongest when money grows through insight, intuition, research, pattern recognition and deeper understanding.",
  },

  "Eating God": {
    wealthArchetype: "Lifestyle Value Creator",
    modifier:
      "You are strongest when money grows through enjoyment, creativity, comfort, taste and sustainable output.",
  },

  "Hurting Officer": {
    wealthArchetype: "Original Voice Monetizer",
    modifier:
      "You are strongest when money grows through expression, differentiation, sharp ideas and standing out from the norm.",
  },
};

function getStructureName(structureScoringV2) {
  return (
    structureScoringV2?.mainStructure?.name ||
    structureScoringV2?.mainStructure ||
    structureScoringV2?.structure ||
    null
  );
}

function getDominantProfileName(tenProfileScoringV2) {
  return (
    tenProfileScoringV2?.dominantProfile?.name ||
    tenProfileScoringV2?.dominantProfile ||
    tenProfileScoringV2?.profile ||
    null
  );
}

function getDayMasterStatus(dayMasterStrengthV4) {
  return String(
    dayMasterStrengthV4?.status ||
      dayMasterStrengthV4?.label ||
      dayMasterStrengthV4?.strength ||
      ""
  );
}

function getCapacityNote(dayMasterStatus) {
  const status = String(dayMasterStatus || "").toLowerCase();

  if (
    status.includes("strong") ||
    status.includes("excessive") ||
    status.includes("very strong")
  ) {
    return "Because your chart has strong personal capacity, your wealth grows best when you choose fewer but higher-quality opportunities instead of carrying everything at once.";
  }

  if (
    status.includes("weak") ||
    status.includes("under-supported") ||
    status.includes("sensitive")
  ) {
    return "Because your chart needs steadier support, your wealth grows best when you build capability, confidence and structure before expanding too aggressively.";
  }

  return "Your wealth grows best when you balance opportunity with pacing, structure and emotional clarity.";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function buildWealthArchetypeV1({
  wealthEngineV1,
  structureScoringV2,
  tenProfileScoringV2,
  dayMasterStrengthV4,
  usefulGodV4,
}) {
  const mainStructure = getStructureName(structureScoringV2);
  const dominantProfile = getDominantProfileName(tenProfileScoringV2);
  const dayMasterStatus = getDayMasterStatus(dayMasterStrengthV4);

  const structureRule =
    STRUCTURE_WEALTH_MODIFIERS[mainStructure] ||
    STRUCTURE_WEALTH_MODIFIERS.Connectors;

  const profileRule =
    PROFILE_WEALTH_ARCHETYPES[dominantProfile] ||
    PROFILE_WEALTH_ARCHETYPES["Direct Wealth"];

  const primaryUsefulGod =
    usefulGodV4?.primaryUsefulGod || null;

  const secondaryUsefulGod =
    usefulGodV4?.secondaryUsefulGod || null;

  const incomeStyle =
    wealthEngineV1?.incomeStyle ||
    structureRule.wealthStyle;

  const moneyMindset =
    wealthEngineV1?.moneyMindset ||
    "Opportunity-Oriented";

  const wealthBehaviour =
    wealthEngineV1?.wealthBehaviour ||
    profileRule.wealthArchetype;

  const capacityNote = getCapacityNote(dayMasterStatus);

  const wealthArchetype =
    mainStructure === "Connectors" && dominantProfile === "Direct Wealth"
      ? "Relationship Monetizer"
      : mainStructure === "Connectors" && dominantProfile === "Indirect Resource"
      ? "Insight-Based Relationship Builder"
      : mainStructure === "Thinkers" && dominantProfile === "Direct Officer"
      ? "Structured Expertise Monetizer"
      : mainStructure === "Thinkers"
      ? "Knowledge Monetizer"
      : mainStructure === "Supporters"
      ? "Steady Value Builder"
      : mainStructure === "Warriors"
      ? "High-Pressure Wealth Performer"
      : mainStructure === "Creators"
      ? "Creative Value Monetizer"
      : profileRule.wealthArchetype;

  return {
    version: "wealth-archetype-v1",

    wealthArchetype,
    wealthStyle: structureRule.wealthStyle,
    incomePath: structureRule.incomePath,

    incomeStyle,
    moneyMindset,
    wealthBehaviour,

    primaryUsefulGod,
    secondaryUsefulGod,

    moneyStrengths: unique([
      ...(structureRule.moneyStrengths || []),
      profileRule.modifier,
      capacityNote,
    ]).slice(0, 5),

    moneyBlindSpots: unique([
      ...(structureRule.moneyBlindSpots || []),
    ]).slice(0, 4),

    idealIncomeModels: unique([
      ...(structureRule.idealIncomeModels || []),
    ]).slice(0, 5),

    reasoning: [
      mainStructure
        ? `Wealth style is based on ${mainStructure} structure.`
        : "No main structure detected.",
      dominantProfile
        ? `Wealth archetype modifier is based on ${dominantProfile}.`
        : "No dominant profile detected.",
      dayMasterStatus
        ? `Capacity note is based on Day Master status: ${dayMasterStatus}.`
        : "No Day Master strength detected.",
      primaryUsefulGod
        ? `Supportive wealth energy references primary Useful God: ${primaryUsefulGod}.`
        : "No primary Useful God detected.",
    ],

    debug: {
      mainStructure,
      dominantProfile,
      dayMasterStatus,
      sourceWealthEngine: wealthEngineV1?.version || null,
    },
  };
}

export default buildWealthArchetypeV1;