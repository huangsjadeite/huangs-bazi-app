import { calculateYearPillar } from "./pillars.js";
import { DEFAULT_YEAR } from "../data/energyYears.js";

const ELEMENT_CYCLE =["Wood", "Fire", "Earth", "Metal", "Water"];

const STEM_ELEMENT_MAP = {
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

const BRANCH_ELEMENT_MAP = {
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

const BRANCH_HIDDEN_ELEMENTS_MAP = {
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

function getStrongestElement(elementBalance) {
  const yearly =
    elementBalance?.yearly ||
    elementBalance?.withAnnual ||
    elementBalance?.natal ||
    {};

  return (
    Object.entries(yearly).sort((a, b) => b[1] - a[1])?.[0]?.[0] ||
    "Fire"
  );
}

function getWeakestElements(elementBalance) {
  const yearly =
    elementBalance?.yearly ||
    elementBalance?.withAnnual ||
    elementBalance?.natal ||
    {};

  return Object.entries(yearly)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([element]) => element);
}

function buildAnnualElementScores({ stem, branch }) {
  const scores = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  const stemElement = STEM_ELEMENT_MAP[stem];
  const branchElement = BRANCH_ELEMENT_MAP[branch];
  const hiddenElements = BRANCH_HIDDEN_ELEMENTS_MAP[branch] || [];

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

function getAmplifiedElements(annualElements) {
  return Object.entries(annualElements)
    .filter(([, score]) => score >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([element]) => element);
}

function getDominantElementFromAnnualElements(annualElements, fallbackElement) {
  return (
    Object.entries(annualElements)
      .sort((a, b) => b[1] - a[1])?.[0]?.[0] ||
    fallbackElement ||
    "Fire"
  );
}

// Hand-written one-line theme per reading year. The pillar and zodiac are
// calculated, so a new year only needs a theme here (or uses the fallback).
const YEAR_THEMES = {
  2026: "Visibility, momentum and emotional activation",
  2027: "Stability, refinement and emotional consolidation",
};

function getYearData(selectedYear) {
  // Mid-year date sits safely after 立春, so this is that year's pillar.
  const pillar = calculateYearPillar({ year: selectedYear, month: 6, day: 15 });

  return {
    pillar: `${pillar.stem.zh}${pillar.branch.zh}`,
    stem: pillar.stem.zh,
    branch: pillar.branch.zh,
    zodiacAnimal: pillar.branch.animal,
    zodiacElement: pillar.stem.element,
    zodiacDisplayName: `${pillar.stem.element} ${pillar.branch.animal}`,
    dominantTheme:
      YEAR_THEMES[selectedYear] || "Annual energy influence and adjustment",
  };
}

export function buildAnnualOverlay(selectedYear = DEFAULT_YEAR, elementBalance = {}) {
  const yearData = getYearData(selectedYear);

  const annualElements = buildAnnualElementScores({
    stem: yearData.stem,
    branch: yearData.branch,
  });

  const dominantElement = getDominantElementFromAnnualElements(
    annualElements,
    getStrongestElement(elementBalance)
  );

  return {
    selectedYear,

    yearPillar: {
      chinese: yearData.pillar,
      stem: yearData.stem,
      branch: yearData.branch,
      stemElement: STEM_ELEMENT_MAP[yearData.stem],
      branchElement: BRANCH_ELEMENT_MAP[yearData.branch],
      hiddenElements: BRANCH_HIDDEN_ELEMENTS_MAP[yearData.branch] || [],
    },

    zodiac: {
      animal: yearData.zodiacAnimal,
      element: yearData.zodiacElement,
      displayName: yearData.zodiacDisplayName,
    },

    annualElements,
    elementScores: annualElements,

    dominantElement,
    dominantTheme: yearData.dominantTheme,

    amplifiedElements: getAmplifiedElements(annualElements),
    weakenedElements: getWeakestElements(elementBalance),

    method: "annualOverlayV3ElementAware",
  };
}