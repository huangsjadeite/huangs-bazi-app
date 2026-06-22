// src/engine/practicalGuidanceV6.js

export function buildPracticalGuidanceV6({
  dayMasterStrengthV4,
  elementBalanceV3,
  structureScoringV2,
  usefulGodV4,
  tenProfileScoringV2,
}) {
  const structure = structureScoringV2?.mainStructure?.name || "Unknown";
  const dominantProfile =
    tenProfileScoringV2?.dominantProfile?.name || "Unknown";

  const dayMasterStatus =
    dayMasterStrengthV4?.status ||
    dayMasterStrengthV4?.strengthLabel ||
    "Unknown";

  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;

  const supportiveElements = usefulGodV4?.favourableElements || [];
  const cautionElements = usefulGodV4?.cautionElements || [];

  // --------------------------------------------------
  // Career
  // --------------------------------------------------

  const careerStrengths = [];
  const careerCautions = [];

  if (structure === "Connectors") {
    careerStrengths.push(
      "Your career growth is strongest when communication, visibility and relationship-building are part of your work."
    );
    careerStrengths.push(
      "You are able to create momentum by bringing the right people, ideas and opportunities together."
    );
  }

  if (structure === "Thinkers") {
    careerStrengths.push(
      "Your career growth is strongest when your thinking, knowledge and problem-solving ability are properly valued."
    );
    careerStrengths.push(
      "You are able to understand situations deeply and notice patterns that others may miss."
    );
  }

  if (structure === "Supporters") {
    careerStrengths.push(
      "Your career growth is strongest when your reliability, care and long-term contribution are recognised."
    );
    careerStrengths.push(
      "You create value through practical support, steadiness and the ability to make others feel guided."
    );
  }

  if (structure === "Creators") {
    careerStrengths.push(
      "Your career growth is strongest when you are able to express ideas, create solutions and bring fresh perspective into your work."
    );
    careerStrengths.push(
      "You are able to turn observation, creativity and communication into useful output."
    );
  }

  if (structure === "Managers") {
    careerStrengths.push(
      "Your career growth is strongest when you are trusted to organise, lead and turn plans into concrete results."
    );
    careerStrengths.push(
      "You are able to create stability by bringing structure, direction and accountability into your work."
    );
  }

  if (dayMasterStatus === "Excessive") {
    careerCautions.push(
      "Avoid controlling every outcome personally, as this may create unnecessary pressure or resistance."
    );
  }

  if (dayMasterStatus === "Under-supported" || dayMasterStatus === "Weak") {
    careerCautions.push(
      "Avoid taking on excessive responsibility before building enough support, structure or recovery capacity."
    );
  }

  // --------------------------------------------------
  // Wealth
  // --------------------------------------------------

  const wealthStrengths = [];
  const wealthCautions = [];

  if (dominantProfile.includes("Wealth")) {
    wealthStrengths.push(
      "Your wealth pattern is closely linked to spotting opportunities, creating value and knowing where effort can produce results."
    );
  }

  if (dominantProfile.includes("Officer")) {
    wealthStrengths.push(
      "Your financial strength grows through discipline, responsibility, consistency and long-term planning."
    );
  }

  if (dominantProfile.includes("Resource")) {
    wealthStrengths.push(
      "Your wealth pattern grows through knowledge, skill and recognised expertise."
    );
  }

  if (structure === "Connectors") {
    wealthStrengths.push(
      "Financial growth tends to come through trust, reputation and the relationships you build over time."
    );
  }

  if (structure === "Thinkers") {
    wealthStrengths.push(
      "Your earning potential grows when you develop knowledge or skills that people recognise as valuable."
    );
  }

  if (structure === "Supporters") {
    wealthStrengths.push(
      "Your financial strength improves through consistency, reliability and long-term contribution."
    );
  }

  if (dayMasterStatus === "Excessive") {
    wealthCautions.push(
      "Avoid overconfidence, rushing decisions or forcing financial outcomes before timing and conditions are clear."
    );
  }

  if (dayMasterStatus === "Under-supported" || dayMasterStatus === "Weak") {
    wealthCautions.push(
      "Focus on strengthening capability, support and consistency before pursuing aggressive expansion."
    );
  }

  // --------------------------------------------------
  // Relationship
  // --------------------------------------------------

  const relationshipStrengths = [];
  const relationshipCautions = [];

  if (structure === "Connectors") {
    relationshipStrengths.push(
      "Your relationship growth is closely connected to communication, trust and shared experiences."
    );
  }

  if (structure === "Thinkers") {
    relationshipStrengths.push(
      "Your relationship growth comes from allowing emotional connection to develop alongside understanding."
    );
  }

  if (structure === "Supporters") {
    relationshipStrengths.push(
      "Your relationship growth comes from learning that care should flow both ways."
    );
  }

  if (structure === "Creators") {
    relationshipStrengths.push(
      "Your relationship growth comes from honest expression, emotional responsiveness and allowing space for individuality."
    );
  }

  if (structure === "Managers") {
    relationshipStrengths.push(
      "Your relationship growth comes from balancing responsibility with emotional softness and shared decision-making."
    );
  }

  if (dayMasterStatus === "Excessive") {
    relationshipCautions.push(
      "Be mindful of dominating decisions, carrying the momentum alone or expecting others to move at your pace."
    );
  }

  if (dayMasterStatus === "Under-supported" || dayMasterStatus === "Weak") {
    relationshipCautions.push(
      "Avoid over-giving, over-adapting or neglecting your own needs in order to keep the relationship stable."
    );
  }

  // --------------------------------------------------
  // Wellness
  // --------------------------------------------------

  const wellnessStrengths = [];
  const wellnessCautions = [];

  if (primaryUsefulGod) {
    wellnessStrengths.push(
      `Supporting ${primaryUsefulGod} energy helps your system return to better balance.`
    );
  }

  if (secondaryUsefulGod) {
    wellnessStrengths.push(
      `${secondaryUsefulGod} energy provides additional support, direction and resilience.`
    );
  }

  if (dayMasterStatus === "Excessive") {
    wellnessCautions.push(
      "Your wellbeing improves when you release excess pressure through rest, movement, boundaries and recovery time."
    );
  }

  if (dayMasterStatus === "Under-supported" || dayMasterStatus === "Weak") {
    wellnessCautions.push(
      "Your wellbeing improves when you prioritise rest, nourishment, emotional support and sustainable routines."
    );
  }

  if (cautionElements.length) {
    wellnessCautions.push(
      `Be mindful of too much ${cautionElements.join(
        " and "
      )} energy, as it may create imbalance when over-emphasised.`
    );
  }

  // --------------------------------------------------
  // Final Advice
  // --------------------------------------------------

  const careerAdvice =
    careerStrengths[0] ||
    "Focus on work environments where your natural strengths are recognised and properly used.";

  const wealthAdvice =
    wealthStrengths[0] ||
    "Build wealth gradually through consistency, timing and clear decision-making.";

  const relationshipAdvice =
    relationshipStrengths[0] ||
    "Healthy communication, mutual respect and emotional clarity strengthen your relationships.";

  const wellnessAdvice =
    wellnessStrengths[0] ||
    "Maintain balance between effort, recovery and emotional steadiness.";

  return {
    version: "practical-guidance-v6",

    career: {
      strengths: unique(careerStrengths),
      cautions: unique(careerCautions),
      advice: careerAdvice,
    },

    wealth: {
      strengths: unique(wealthStrengths),
      cautions: unique(wealthCautions),
      advice: wealthAdvice,
    },

    relationship: {
      strengths: unique(relationshipStrengths),
      cautions: unique(relationshipCautions),
      advice: relationshipAdvice,
    },

    wellness: {
      strengths: unique(wellnessStrengths),
      cautions: unique(wellnessCautions),
      advice: wellnessAdvice,
    },

    supportiveElements,
    cautionElements,

    debug: {
      dayMasterStatus,
      mainStructure: structure,
      dominantProfile,
      primaryUsefulGod,
      secondaryUsefulGod,
      supportiveElements,
      cautionElements,
      elementBalanceRaw: elementBalanceV3?.rawScores || {},
    },
  };
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

export default buildPracticalGuidanceV6;