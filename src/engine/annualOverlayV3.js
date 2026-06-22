// /src/engine/annualOverlayV3.js

import { normalizePillars } from "./normalizePillars.js";
import { calculateTenGods } from "./tenGodCalculator.js";

const STEM_ELEMENT = {
  甲: "Wood",
  乙: "Wood",
  丙: "Fire",
  丁: "Fire",
  戊: "Earth",
  己: "Earth",
  庚: "Metal",
  辛: "Metal",
  壬: "Water",
  癸: "Water",
};

const STEM_POLARITY = {
  甲: "Yang",
  乙: "Yin",
  丙: "Yang",
  丁: "Yin",
  戊: "Yang",
  己: "Yin",
  庚: "Yang",
  辛: "Yin",
  壬: "Yang",
  癸: "Yin",
};

const BRANCH_ELEMENT = {
  子: "Water",
  丑: "Earth",
  寅: "Wood",
  卯: "Wood",
  辰: "Earth",
  巳: "Fire",
  午: "Fire",
  未: "Earth",
  申: "Metal",
  酉: "Metal",
  戌: "Earth",
  亥: "Water",
};

const BRANCH_HIDDEN_ELEMENTS = {
  子: ["Water"],
  丑: ["Earth", "Water", "Metal"],
  寅: ["Wood", "Fire", "Earth"],
  卯: ["Wood"],
  辰: ["Earth", "Wood", "Water"],
  巳: ["Fire", "Earth", "Metal"],
  午: ["Fire", "Earth"],
  未: ["Earth", "Fire", "Wood"],
  申: ["Metal", "Water", "Earth"],
  酉: ["Metal"],
  戌: ["Earth", "Metal", "Fire"],
  亥: ["Water", "Wood"],
};

const ELEMENT_GENERATES = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const ELEMENT_CONTROLS = {
  Wood: "Earth",
  Fire: "Metal",
  Earth: "Water",
  Metal: "Wood",
  Water: "Fire",
};

function getProducingElement(element) {
  return Object.keys(ELEMENT_GENERATES).find(
    (producer) => ELEMENT_GENERATES[producer] === element
  );
}

function getControlledElement(element) {
  return ELEMENT_CONTROLS[element] || null;
}

function getControllingElement(element) {
  return (
    Object.keys(ELEMENT_CONTROLS).find(
      (controller) => ELEMENT_CONTROLS[controller] === element
    ) || null
  );
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function hasElement(list = [], element) {
  return Array.isArray(list) && list.includes(element);
}

function getElementPercent(elementBalanceV3, element) {
  return Number(
    elementBalanceV3?.percentages?.[element] ??
      elementBalanceV3?.[element] ??
      0
  );
}

function getStrengthText(dayMasterStrengthV3, usefulGodV3) {
  return String(
    dayMasterStrengthV3?.label ||
      dayMasterStrengthV3?.status ||
      usefulGodV3?.strengthState ||
      ""
  ).toLowerCase();
}

function getSupportElements(usefulGodV3) {
  return unique([
    ...(usefulGodV3?.favourableElements || []),
    usefulGodV3?.primaryUsefulElement,
    usefulGodV3?.secondaryUsefulElement,
  ]);
}

function buildAnnualElementScores({ stem, branch }) {
  const scores = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  const stemElement = STEM_ELEMENT[stem];
  const branchElement = BRANCH_ELEMENT[branch];
  const hiddenElements = BRANCH_HIDDEN_ELEMENTS[branch] || [];

  if (stemElement) {
    scores[stemElement] += 1;
  }

  if (branchElement) {
    scores[branchElement] += 1;
  }

  hiddenElements.forEach((element) => {
    scores[element] += 0.5;
  });

  return scores;
}

function getDayMasterModifier(dayMasterElement, area) {
  const modifiers = {
    Wood: {
      career: 4,
      wealth: 2,
      relationship: 3,
      wellness: -2,
    },
    Fire: {
      career: 5,
      wealth: 3,
      relationship: 2,
      wellness: -5,
    },
    Earth: {
      career: 2,
      wealth: 4,
      relationship: 2,
      wellness: -3,
    },
    Metal: {
      career: 4,
      wealth: 3,
      relationship: -2,
      wellness: 1,
    },
    Water: {
      career: 2,
      wealth: 1,
      relationship: 4,
      wellness: 3,
    },
  };

  return modifiers?.[dayMasterElement]?.[area] || 0;
}

function calculateCareerScore({
  dayMasterStrengthV3,
  usefulGodV3,
  annualElements = [],
  dayMasterElement,
}) {
  let score = 60;

  const strength = getStrengthText(dayMasterStrengthV3, usefulGodV3);
  const supportElements = getSupportElements(usefulGodV3);
  const avoidElements = usefulGodV3?.avoidElements || [];

  if (strength.includes("strong")) score += 8;
  if (strength.includes("weak")) score -= 4;

  if (hasElement(annualElements, "Fire")) score += 8;
  if (hasElement(annualElements, "Metal")) score += 6;

  if (annualElements.some((el) => supportElements.includes(el))) score += 10;
  if (annualElements.some((el) => avoidElements.includes(el))) score -= 8;

  score += getDayMasterModifier(dayMasterElement, "career");
  return clampScore(score);
}

function calculateWealthScore({
  dayMasterStrengthV3,
  usefulGodV3,
  annualElements = [],
  dayMasterElement,
}) {
  let score = 58;

  const strength = getStrengthText(dayMasterStrengthV3, usefulGodV3);
  const supportElements = getSupportElements(usefulGodV3);
  const avoidElements = usefulGodV3?.avoidElements || [];

  if (hasElement(annualElements, "Earth")) score += 8;
  if (hasElement(annualElements, "Metal")) score += 6;

  if (strength.includes("strong")) score += 8;
  if (strength.includes("weak")) score -= 6;

  if (annualElements.some((el) => supportElements.includes(el))) score += 8;
  if (annualElements.some((el) => avoidElements.includes(el))) score -= 10;

  score += getDayMasterModifier(dayMasterElement, "wealth");
  return clampScore(score);
}

function calculateRelationshipScore({
  usefulGodV3,
  elementBalanceV3,
  annualElements = [],
  dayMasterElement,
}) {
  let score = 60;

  const water = getElementPercent(elementBalanceV3, "Water");
  const fire = getElementPercent(elementBalanceV3, "Fire");
  const wood = getElementPercent(elementBalanceV3, "Wood");
  const metal = getElementPercent(elementBalanceV3, "Metal");
  const earth = getElementPercent(elementBalanceV3, "Earth");

  const supportElements = getSupportElements(usefulGodV3);
  const avoidElements = usefulGodV3?.avoidElements || [];

  if (water >= 22) score += 10;
  else if (water >= 15) score += 5;
  else if (water <= 8) score -= 8;

  if (fire >= 18 && fire <= 28) score += 6;
  if (fire > 32) score -= 8;

  if (wood >= 18) score += 5;
  if (wood > 32) score -= 5;

  if (metal >= 20 && metal <= 30) score += 4;
  if (metal > 35) score -= 7;

  if (earth >= 18 && earth <= 28) score += 4;
  if (earth > 35) score -= 8;

  if (hasElement(annualElements, "Water")) score += 8;
  if (hasElement(annualElements, "Wood")) score += 6;
  if (hasElement(annualElements, "Fire")) score += 3;
  if (hasElement(annualElements, "Metal")) score -= 3;
  if (hasElement(annualElements, "Earth")) score -= 2;

  if (annualElements.some((el) => supportElements.includes(el))) score += 8;
  if (annualElements.some((el) => avoidElements.includes(el))) score -= 8;

  score += getDayMasterModifier(dayMasterElement, "relationship");
  return clampScore(score);
}

function calculateWellnessScore({
  dayMasterStrengthV3,
  usefulGodV3,
  elementBalanceV3,
  annualElements = [],
  dayMasterElement,
}) {
  let score = 65;

  const strength = getStrengthText(dayMasterStrengthV3, usefulGodV3);
  const fire = getElementPercent(elementBalanceV3, "Fire");
  const earth = getElementPercent(elementBalanceV3, "Earth");
  const avoidElements = usefulGodV3?.avoidElements || [];

  if (strength.includes("weak")) score -= 8;
  if (strength.includes("strong")) score += 3;

  if (fire >= 25) score -= 6;
  if (earth >= 25) score -= 4;

  if (hasElement(annualElements, "Fire")) score -= 5;
  if (hasElement(annualElements, "Water")) score += 5;

  if (annualElements.some((el) => avoidElements.includes(el))) score -= 6;

  score += getDayMasterModifier(dayMasterElement, "wellness");
  return clampScore(score);
}

export function buildAnnualOverlayV3({
  pillars,
  annualPillar,
  selectedYear,
  dayMasterStrengthV3,
  usefulGodV3,
  elementBalanceV3,
}) {
  const normalizedPillars = normalizePillars(pillars);
  const dayElement = normalizedPillars?.day?.stemElement;
  const dayMasterElement = dayElement;

  const annualStemKey =
    annualPillar?.stem?.key ||
    annualPillar?.stem?.name ||
    annualPillar?.stem;

  const annualBranchKey =
    annualPillar?.branch?.key ||
    annualPillar?.branch?.name ||
    annualPillar?.branch?.label ||
    annualPillar?.branch;

  const annualStemElement =
    annualPillar?.stem?.element ||
    STEM_ELEMENT[annualStemKey] ||
    null;

  const annualBranchElement =
    annualPillar?.branch?.element ||
    BRANCH_ELEMENT[annualBranchKey] ||
    null;

  const annualElementScores = buildAnnualElementScores({
    stem: annualStemKey,
    branch: annualBranchKey,
  });

  const resourceElement = getProducingElement(dayElement);
  const outputElement = ELEMENT_GENERATES[dayElement];
  const wealthElement = getControlledElement(dayElement);
  const officerElement = getControllingElement(dayElement);

  const annualElements = unique([
    annualStemElement,
    annualBranchElement,
    ...Object.entries(annualElementScores)
      .filter(([, score]) => score > 0)
      .map(([element]) => element),
  ]);

  const amplifiedElements = unique([
    ...(elementBalanceV3?.dominantElement?.element
      ? [elementBalanceV3.dominantElement.element]
      : []),
    ...annualElements,
  ]);

  const favourableElements = usefulGodV3?.favourableElements || [];
  const avoidElements = usefulGodV3?.avoidElements || [];

  const supportiveAnnualElements = annualElements.filter((el) =>
    favourableElements.includes(el)
  );

  const challengingAnnualElements = annualElements.filter((el) =>
    avoidElements.includes(el)
  );

  const normalizedAnnualPillar = {
    stem: {
      key: annualStemKey || null,
      element: annualStemElement,
      polarity: STEM_POLARITY[annualStemKey] || null,
    },
    branch: {
      key: annualBranchKey || null,
      label: annualBranchKey || null,
      element: annualBranchElement,
      hiddenStems: BRANCH_HIDDEN_ELEMENTS[annualBranchKey] || [],
    },
  };

  const annualTenGods =
    annualPillar && pillars
      ? calculateTenGods({
          year: normalizedAnnualPillar,
          month: null,
          day: normalizedPillars.day,
          hour: null,
        })?.byPillar?.year
      : null;

  let annualTheme = "Mixed Influence";

  if (supportiveAnnualElements.length && !challengingAnnualElements.length) {
    annualTheme = "Supportive Year";
  } else if (
    challengingAnnualElements.length &&
    !supportiveAnnualElements.length
  ) {
    annualTheme = "Pressure Year";
  } else if (
    supportiveAnnualElements.length &&
    challengingAnnualElements.length
  ) {
    annualTheme = "Growth Through Pressure";
  }

  const scoringInput = {
    dayMasterStrengthV3,
    usefulGodV3,
    elementBalanceV3,
    annualElements,
    dayMasterElement,
  };

  return {
    selectedYear: selectedYear || null,
    dayElement,

    annualPillar,
    normalizedAnnualPillar,

    annualStemElement,
    annualBranchElement,

    annualElements,
    annualElementScores,
    elementScores: annualElementScores,

    amplifiedElements,
    supportiveAnnualElements,
    challengingAnnualElements,
    annualTenGods,
    annualTheme,

    career: {
      title: "Career Direction",
      score: calculateCareerScore(scoringInput),
    },

    wealth: {
      title: "Wealth Momentum",
      score: calculateWealthScore(scoringInput),
    },

    relationship: {
      title: "Relationship Flow",
      score: calculateRelationshipScore(scoringInput),
    },

    wellness: {
      title: "Wellness Balance",
      score: calculateWellnessScore(scoringInput),
    },

    dayMasterState: dayMasterStrengthV3?.label || null,
    usefulStrategy: usefulGodV3?.strategy || null,

    profileImpact:
      annualTheme === "Supportive Year"
        ? "This year strengthens elements that help support your chart."
        : annualTheme === "Pressure Year"
        ? "This year activates elements that may feel more demanding or pressurising."
        : annualTheme === "Growth Through Pressure"
        ? "This year brings both support and pressure, creating growth through adaptation."
        : "This year brings a mixed energetic influence.",

    relationshipToDayMaster: {
      resourceElement,
      outputElement,
      wealthElement,
      officerElement,
    },

    method: "engine-v4-annual-overlay-scored-life-themes",
  };
}