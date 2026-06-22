// src/engine/growthAdviceV1.js

const STRUCTURE_GROWTH_RULES = {
  Connectors: {
    growthFocus:
      "Choose fewer but higher-quality relationships and opportunities.",

    summary:
      "Your next stage of growth comes from focusing your relational energy instead of keeping every door open.",

    growthStrengths: [
      "You naturally build trust, rapport and connection.",
      "People, conversations and networks often become opportunities over time.",
      "Your influence grows when relationships are nurtured consistently.",
    ],

    nextLevelActions: [
      "Invest deeper into fewer relationships instead of spreading yourself too thin.",
      "Prioritise quality over quantity when choosing people, projects or collaborations.",
      "Create simple systems that allow trust, follow-up and visibility to scale.",
    ],

    avoidPatterns: [
      "Keeping too many doors open at once.",
      "Confusing loyalty with obligation.",
      "Saying yes before checking whether the opportunity truly fits your direction.",
    ],
  },

  Thinkers: {
    growthFocus:
      "Turn knowledge into action before everything feels perfect.",

    summary:
      "Your next stage of growth comes from trusting your knowledge enough to apply, share or monetise it earlier.",

    growthStrengths: [
      "You learn deeply and notice patterns that others may miss.",
      "Your perspective becomes valuable when people need clarity or strategy.",
      "You can turn knowledge into guidance, systems or specialist value.",
    ],

    nextLevelActions: [
      "Share what you already know instead of waiting until you feel completely ready.",
      "Launch, teach or test your ideas before perfect certainty arrives.",
      "Turn your expertise into a clear service, content pillar or practical offer.",
    ],

    avoidPatterns: [
      "Waiting for certainty before taking action.",
      "Overthinking timing, pricing or positioning.",
      "Undervaluing knowledge because it feels natural to you.",
    ],
  },

  Supporters: {
    growthFocus:
      "Support others without carrying everything yourself.",

    summary:
      "Your next stage of growth comes from allowing support to become mutual instead of one-directional.",

    growthStrengths: [
      "People trust your reliability, care and consistency.",
      "You create emotional and practical stability around you.",
      "You build long-term value through patience and dependability.",
    ],

    nextLevelActions: [
      "Set clearer boundaries around what you can realistically carry.",
      "Allow others to contribute instead of solving everything alone.",
      "Protect your own energy before taking on more responsibility.",
    ],

    avoidPatterns: [
      "Over-giving before your own needs are considered.",
      "Staying in roles where you are needed but not properly valued.",
      "Mistaking responsibility for love, loyalty or self-worth.",
    ],
  },

  Warriors: {
    growthFocus:
      "Pair courage with patience, timing and strategy.",

    summary:
      "Your next stage of growth comes from using pressure as fuel without letting urgency control your decisions.",

    growthStrengths: [
      "You can act decisively when others hesitate.",
      "You are able to move through pressure and uncertainty.",
      "You can lead when situations require courage and direction.",
    ],

    nextLevelActions: [
      "Slow down before major decisions so your courage becomes strategic.",
      "Use discipline instead of force when pursuing results.",
      "Focus your energy where the outcome truly matters.",
    ],

    avoidPatterns: [
      "Treating every challenge as something that must be conquered immediately.",
      "Moving too quickly because pressure makes you feel activated.",
      "Pushing through stress without checking the long-term cost.",
    ],
  },

  Creators: {
    growthFocus:
      "Transform inspiration into consistent output.",

    summary:
      "Your next stage of growth comes from giving your creativity enough rhythm and structure to become sustainable.",

    growthStrengths: [
      "You generate ideas, expression and emotional resonance naturally.",
      "You can inspire people through style, storytelling or originality.",
      "Your creativity becomes powerful when it is shared consistently.",
    ],

    nextLevelActions: [
      "Build repeatable routines so inspiration has somewhere to land.",
      "Finish more projects instead of only starting new ones.",
      "Use structure to protect your creativity rather than restrict it.",
    ],

    avoidPatterns: [
      "Starting many ideas but not completing enough of them.",
      "Waiting for inspiration before taking practical steps.",
      "Resisting structure even when it would help your ideas reach people.",
    ],
  },
};

const PROFILE_ACTION_MODIFIERS = {
  "Direct Wealth":
    "Focus on measurable value, reliable delivery and long-term consistency.",

  "Indirect Wealth":
    "Choose opportunities with clear timing and avoid chasing every promising possibility.",

  Friend:
    "Build with aligned people, but do not let group expectations dilute your direction.",

  "Rob Wealth":
    "Use independence wisely by choosing collaborations that strengthen rather than restrict you.",

  "Direct Officer":
    "Trust your capabilities before waiting for perfect readiness or external permission.",

  "Seven Killings":
    "Use pressure as fuel, but do not make pressure your default operating mode.",

  "Direct Resource":
    "Let support, knowledge and preparation strengthen you without becoming a reason to delay action.",

  "Indirect Resource":
    "Convert insight into execution more quickly instead of staying in reflection for too long.",

  "Eating God":
    "Create sustainable output by balancing comfort, enjoyment and steady follow-through.",

  "Hurting Officer":
    "Use your originality strategically so your voice creates influence instead of unnecessary resistance.",
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

function getDayMasterAction(dayMasterStatus) {
  const status = String(dayMasterStatus || "").toLowerCase();

  if (
    status.includes("strong") ||
    status.includes("excessive") ||
    status.includes("very strong")
  ) {
    return "Your next level comes from focus, prioritisation and choosing less rather than doing more.";
  }

  if (
    status.includes("weak") ||
    status.includes("under-supported") ||
    status.includes("sensitive")
  ) {
    return "Your next level comes from building confidence, support and structure before expanding too aggressively.";
  }

  return "Your next level comes from balancing ambition with pacing, clarity and emotional steadiness.";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function buildGrowthAdviceV1({
  structureScoringV2,
  tenProfileScoringV2,
  dayMasterStrengthV4,
  usefulGodV4,
  blindSpotsV1,
  wealthArchetypeV1,
}) {
  const mainStructure = getStructureName(structureScoringV2);
  const dominantProfile = getDominantProfileName(tenProfileScoringV2);
  const dayMasterStatus = getDayMasterStatus(dayMasterStrengthV4);

  const structureRule =
    STRUCTURE_GROWTH_RULES[mainStructure] ||
    STRUCTURE_GROWTH_RULES.Connectors;

  const profileAction = PROFILE_ACTION_MODIFIERS[dominantProfile];

  const dayMasterAction = getDayMasterAction(dayMasterStatus);

  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;

  const growthFocus = structureRule.growthFocus;

  const nextLevelActions = unique([
    ...(structureRule.nextLevelActions || []),
    profileAction,
    dayMasterAction,
  ]).slice(0, 5);

  return {
    version: "growth-advice-v1",

    mainStructure,
    dominantProfile,
    dayMasterStatus,

    growthFocus,
    summary: structureRule.summary,

    growthStrengths: unique(structureRule.growthStrengths || []).slice(0, 4),

    nextLevelActions,

    avoidPatterns: unique(structureRule.avoidPatterns || []).slice(0, 4),

    supportiveEnergy: {
      primaryUsefulGod,
      secondaryUsefulGod,
      note: primaryUsefulGod
        ? `Your growth is supported by strengthening ${primaryUsefulGod} energy while using ${secondaryUsefulGod || "secondary"} support carefully.`
        : "Your growth is supported by choosing the right environment, pacing and support system.",
    },

    relatedBlindSpots: Array.isArray(blindSpotsV1?.blindSpots)
      ? blindSpotsV1.blindSpots.slice(0, 3)
      : [],

    wealthConnection: wealthArchetypeV1?.wealthArchetype
      ? `This growth direction also supports your wealth archetype: ${wealthArchetypeV1.wealthArchetype}.`
      : "",

    reasoning: [
      mainStructure
        ? `Growth focus is based on ${mainStructure} structure.`
        : "No main structure detected.",
      dominantProfile
        ? `Growth action modifier is based on ${dominantProfile}.`
        : "No dominant profile detected.",
      dayMasterStatus
        ? `Capacity modifier is based on Day Master status: ${dayMasterStatus}.`
        : "No Day Master strength detected.",
      primaryUsefulGod
        ? `Supportive energy references primary Useful God: ${primaryUsefulGod}.`
        : "No primary Useful God detected.",
    ],
  };
}

export default buildGrowthAdviceV1;