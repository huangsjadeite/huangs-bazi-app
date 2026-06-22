const VERSION = "narrative-personalization-v1";

function safeName(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value?.name || value?.label || value?.type || "";
}

export function buildNarrativePersonalizationV1({
  structureScoringV2 = {},
  tenProfileScoringV2 = {},
  usefulGodV4 = {},
} = {}) {
  const structure = safeName(
    structureScoringV2?.mainStructure
  );

  const profile = safeName(
    tenProfileScoringV2?.dominantProfile ||
      tenProfileScoringV2?.topProfile ||
      tenProfileScoringV2?.profiles?.[0]
  );

  const primaryUsefulGod =
    safeName(usefulGodV4?.primaryUsefulGod) ||
    safeName(usefulGodV4?.primary);

  const map = {
    Connectors: {
      "Direct Officer": {
        personalityFlavor: "Trusted Steward",
        careerFlavor: "Reliability",
        wealthFlavor: "Stability",
        relationshipFlavor: "Commitment",
      },

      "Indirect Wealth": {
        personalityFlavor: "Opportunity Builder",
        careerFlavor: "Visibility",
        wealthFlavor: "Networks",
        relationshipFlavor: "Shared Experiences",
      },

      "Direct Wealth": {
        personalityFlavor: "Resource Manager",
        careerFlavor: "Execution",
        wealthFlavor: "Practical Growth",
        relationshipFlavor: "Dependability",
      },

      "Indirect Resource": {
        personalityFlavor: "Relationship Strategist",
        careerFlavor: "Insight",
        wealthFlavor: "Reputation",
        relationshipFlavor: "Emotional Understanding",
      },
    },

    Thinkers: {
      "Eating God": {
        personalityFlavor: "Knowledge Explorer",
        careerFlavor: "Expertise",
        wealthFlavor: "Specialisation",
        relationshipFlavor: "Understanding",
      },

      "Direct Officer": {
        personalityFlavor: "Strategic Observer",
        careerFlavor: "Analysis",
        wealthFlavor: "Practical Wisdom",
        relationshipFlavor: "Clarity",
      },

      "Direct Resource": {
        personalityFlavor: "Wisdom Builder",
        careerFlavor: "Research",
        wealthFlavor: "Knowledge Assets",
        relationshipFlavor: "Trust Through Understanding",
      },

      "Indirect Resource": {
        personalityFlavor: "Reflective Guide",
        careerFlavor: "Insight",
        wealthFlavor: "Ideas and Perspective",
        relationshipFlavor: "Emotional Safety",
      },
    },

    Supporters: {
      "Direct Resource": {
        personalityFlavor: "Reliable Guide",
        careerFlavor: "Service",
        wealthFlavor: "Consistency",
        relationshipFlavor: "Nurturing Stability",
      },

      Friend: {
        personalityFlavor: "Community Builder",
        careerFlavor: "Support Networks",
        wealthFlavor: "Collaborative Growth",
        relationshipFlavor: "Loyalty",
      },

      "Direct Officer": {
        personalityFlavor: "Responsible Anchor",
        careerFlavor: "Accountability",
        wealthFlavor: "Steady Foundations",
        relationshipFlavor: "Commitment",
      },
    },
  };

  const matched = map?.[structure]?.[profile];

  return {
    version: VERSION,

    structure,
    profile,
    primaryUsefulGod,

    personalityFlavor:
      matched?.personalityFlavor ||
      structure ||
      "Balanced Individual",

    careerFlavor:
      matched?.careerFlavor ||
      structure ||
      "Natural Strengths",

    wealthFlavor:
      matched?.wealthFlavor ||
      primaryUsefulGod ||
      "Long-Term Growth",

    relationshipFlavor:
      matched?.relationshipFlavor ||
      structure ||
      "Mutual Support",

    reasoning: [
      structure
        ? `Main structure is ${structure}.`
        : null,

      profile
        ? `Dominant profile is ${profile}.`
        : null,

      primaryUsefulGod
        ? `Primary Useful God is ${primaryUsefulGod}.`
        : null,
    ].filter(Boolean),
  };
}

export default buildNarrativePersonalizationV1;