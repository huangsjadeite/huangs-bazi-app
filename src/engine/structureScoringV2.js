import { FIVE_STRUCTURES } from "./structureDefinitions.js";

function safeNumber(value, fallback = 0) {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function getTopProfileScore(profileScores = {}, profileKeys = []) {
  return Math.max(...profileKeys.map((key) => safeNumber(profileScores[key])), 0);
}

function getAverageProfileScore(profileScores = {}, profileKeys = []) {
  if (!profileKeys.length) return 0;

  const total = profileKeys.reduce(
    (sum, key) => sum + safeNumber(profileScores[key]),
    0
  );

  return total / profileKeys.length;
}

function getMonthBranchElement(pillars) {
  return pillars?.month?.branch?.element || null;
}

function getDayMasterElement(pillars) {
  return pillars?.day?.stem?.element || null;
}

function elementToStructureForDayMaster(dayElement, targetElement) {
  const generates = {
    Wood: "Fire",
    Fire: "Earth",
    Earth: "Metal",
    Metal: "Water",
    Water: "Wood",
  };

  const controls = {
    Wood: "Earth",
    Fire: "Metal",
    Earth: "Water",
    Metal: "Wood",
    Water: "Fire",
  };

  if (!dayElement || !targetElement) return null;

  const outputElement = generates[dayElement];
  const wealthElement = controls[dayElement];

  const resourceElement = Object.keys(generates).find(
    (element) => generates[element] === dayElement
  );

  const influenceElement = Object.keys(controls).find(
    (element) => controls[element] === dayElement
  );

  if (targetElement === wealthElement) return "managers";
  if (targetElement === resourceElement) return "supporters";
  if (targetElement === influenceElement) return "thinkers";
  if (targetElement === outputElement) return "creators";
  if (targetElement === dayElement) return "connectors";

  return null;
}

export function structureScoringV2({
  pillars,
  tenProfileScoringV2,
  dayMasterStrengthV4,
} = {}) {
  const normalizedScores = tenProfileScoringV2?.normalizedScores || {};

  const dayElement = getDayMasterElement(pillars);
  const monthElement = getMonthBranchElement(pillars);

  const monthCommandStructure = elementToStructureForDayMaster(
    dayElement,
    monthElement
  );

  const strengthScore = safeNumber(dayMasterStrengthV4?.strengthScore);
  const strengthLabel = dayMasterStrengthV4?.strengthLabel || "Unknown";
  const status = dayMasterStrengthV4?.status || "Unknown";

  const scores = {};

  for (const structure of Object.values(FIVE_STRUCTURES)) {
    const topProfileScore = getTopProfileScore(
      normalizedScores,
      structure.profiles
    );

    const averageProfileScore = getAverageProfileScore(
      normalizedScores,
      structure.profiles
    );

    let score = topProfileScore * 0.5 + averageProfileScore * 0.2;

    if (structure.key === monthCommandStructure) {
      score += 35;
    }

    if (status === "Excessive") {
      if (structure.key === "managers") score += 10;
      if (structure.key === "creators") score += 6;
      if (structure.key === "connectors") score -= 10;
      if (structure.key === "supporters") score -= 6;
    }

    if (status === "Under-supported") {
      if (structure.key === "supporters") score += 10;
      if (structure.key === "connectors") score += 6;
      if (structure.key === "managers") score -= 8;
      if (structure.key === "creators") score -= 5;
    }

    scores[structure.key] = Math.round(Math.max(0, Math.min(score, 100)) * 100) / 100;
  }

  const sortedStructures = Object.values(FIVE_STRUCTURES)
    .map((structure) => ({
      ...structure,
      score: scores[structure.key] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const mainStructure = sortedStructures[0];

  return {
    mainStructure,
    structures: sortedStructures,
    structureScores: scores,
    monthCommandStructure,
    dayElement,
    monthElement,
    dayMasterStrength: {
      strengthScore,
      strengthLabel,
      status,
    },
    explanation:
      "StructureScoringV2 maps month command and Ten Profile clusters into Joey-style 5 Structures: Managers, Supporters, Thinkers, Creators, and Connectors.",
  };
}

export default structureScoringV2;