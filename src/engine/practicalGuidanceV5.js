// /engine/practicalGuidanceV5.js

function getPrimarySupportElement(chart = {}) {
  return (
    chart?.usefulGodV3?.primaryUsefulElement ||
    chart?.usefulGodV3?.secondaryUsefulElement ||
    chart?.usefulGodV3?.favourableElements?.[0] ||
    chart?.energyStrategy?.primarySupportElement ||
    chart?.energyStrategy?.supportiveElements?.[0] ||
    chart?.elements?.supportiveElements?.[0] ||
    null
  );
}

function getCautionElement(chart = {}) {
  return (
    chart?.usefulGodV3?.avoidElements?.[0] ||
    chart?.elementBalanceV3?.dominantElement?.element ||
    chart?.energyStrategy?.cautionElements?.[0] ||
    chart?.elements?.cautionElements?.[0] ||
    null
  );
}

function describeElement(element, fallback) {
  const descriptions = {
    Wood: "Wood qualities: growth, planning, creativity and direction",
    Fire: "Fire qualities: visibility, expression, confidence and warmth",
    Earth: "Earth qualities: stability, responsibility, trust and grounding",
    Metal: "Metal qualities: structure, clarity, standards and refinement",
    Water: "Water qualities: reflection, wisdom, adaptability and emotional flow",
  };

  return descriptions[element] || fallback;
}

function getScore(chart = {}, area) {
  return Number(chart?.annualOverlayV3?.[area]?.score ?? 60);
}

function getScoreBand(score) {
  if (score >= 80) return "strong";
  if (score >= 65) return "steady";
  return "sensitive";
}

function buildArea(title, summary, guidance, watchOut, action) {
  return {
    focus: title,
    title,
    status: "Personalised",
    explanation: summary,
    bullets: [guidance, watchOut, action],

    summary,
    guidance,
    watchOut,
    action,

    description: summary,
    advice: guidance,
    caution: watchOut,
    recommendedAction: action,
  };
}

export function buildPracticalGuidanceV5(chart = {}) {
  const support = getPrimarySupportElement(chart);
  const caution = getCautionElement(chart);

  const supportText = describeElement(
  support,
  "your supportive energy"
);

const cautionText = describeElement(
  caution,
  "overextended energy"
);

const careerScore = getScore(chart, "career");
const wealthScore = getScore(chart, "wealth");
const relationshipScore = getScore(chart, "relationship");
const wellnessScore = getScore(chart, "wellness");

const careerBand = getScoreBand(careerScore);
const wealthBand = getScoreBand(wealthScore);
const relationshipBand = getScoreBand(relationshipScore);
const wellnessBand = getScoreBand(wellnessScore);

function scoreTone(area, band) {
  const tones = {
    career: {
      strong: "This is a stronger year for visibility, career movement, and showing what you can do.",
      steady: "This is a steady year for career refinement, consistency, and building trust over time.",
      sensitive: "This is a year to avoid forcing career moves too quickly. Focus on positioning, skill-building, and reducing unnecessary pressure.",
    },
    wealth: {
      strong: "Financial opportunities may be easier to notice this year, especially when you build from existing strengths.",
      steady: "Wealth growth is possible through patience, structure, and practical decision-making.",
      sensitive: "Be more selective with financial risks this year. Avoid rushed spending, emotional investing, or chasing too many opportunities.",
    },
    relationship: {
      strong: "This year supports more openness, warmth, and meaningful emotional connection.",
      steady: "Relationship growth is possible through consistency, patience, and clearer communication.",
      sensitive: "This year may reveal emotional sensitivity or unclear expectations, so move slowly and observe actions carefully.",
    },
    wellness: {
      strong: "Your recovery rhythm may feel more supported this year, making it easier to maintain healthier routines.",
      steady: "Wellness improves through consistency, sleep, hydration, movement, and emotional pacing.",
      sensitive: "Your energy may be easier to drain this year, so protect your rest, nervous system, and emotional bandwidth.",
    },
  };

  return tones?.[area]?.[band] || "";
}

    const career = buildArea(
  "Career Direction",
  `Your career grows best when you lean into ${supportText}.`,
  scoreTone("career", careerBand),
  `Be careful of environments that trigger too much ${cautionText}, as this may make you feel drained or reactive.`,
  "Prioritise roles, projects, or content directions where your natural strengths can be expressed consistently."
);

const wealth = buildArea(
  "Wealth Strategy",
  `Your wealth path improves when your decisions are guided by ${supportText}, not pressure.`,
  scoreTone("wealth", wealthBand),
  `Avoid making money decisions when ${cautionText} is activated, especially if you feel rushed, anxious, or overly excited.`,
  "Build wealth through repeatable systems, client trust, and offers that feel aligned with your energy."
);

const relationship = buildArea(
  "Relationship Pattern",
  `You feel safest in relationships that bring out your ${supportText} side.`,
  scoreTone("relationship", relationshipBand),
  `Be mindful of people or dynamics that amplify ${cautionText}, especially if you feel you must prove, chase, or defend yourself.`,
  "Choose relationships where consistency, emotional safety, and mutual respect are present."
);

const wellness = buildArea(
  "Wellness Focus",
  `Your body and emotions benefit from strengthening ${supportText}.`,
  scoreTone("wellness", wellnessBand),
  `Too much ${cautionText} may show up as restlessness, tension, emotional overload, or difficulty slowing down.`,
  "Use sleep, hydration, movement, and quiet routines as your foundation before adding more productivity."
);

return {
  version: "practical-guidance-v5",

  career,
  wealth,
  relationship,
  wellness,

  guidanceCards: [career, wealth, relationship, wellness],
  cards: [career, wealth, relationship, wellness],
  items: [career, wealth, relationship, wellness],
};
}