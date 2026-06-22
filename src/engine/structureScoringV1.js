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
  const cycleGenerates = {
    Wood: "Fire",
    Fire: "Earth",
    Earth: "Metal",
    Metal: "Water",
    Water: "Wood",
  };

  const cycleControls = {
    Wood: "Earth",
    Fire: "Metal",
    Earth: "Water",
    Metal: "Wood",
    Water: "Fire",
  };

  if (!dayElement || !targetElement) return null;

  const outputElement = cycleGenerates[dayElement];
  const wealthElement = cycleControls[dayElement];

  const resourceElement = Object.keys(cycleGenerates).find(
    (element) => cycleGenerates[element] === dayElement
  );

  const officerElement = Object.keys(cycleControls).find(
    (element) => cycleControls[element] === dayElement
  );

  if (targetElement === dayElement) return "connectors";
  if (targetElement === outputElement) return "creators";
  if (targetElement === wealthElement) return "managers";
  if (targetElement === officerElement) return "supporters";
  if (targetElement === resourceElement) return "thinkers";

  return null;
}

export function structureScoringV1({
  pillars,
  tenProfileScoringV2,
  dayMasterStrengthV4,
} = {}) {
  const profileScores = tenProfileScoringV2?.profileScores || {};
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

    let score = topProfileScore * 0.55 + averageProfileScore * 0.25;

    if (structure.key === monthCommandStructure) {
      score += 25;
    }

    if (
      status === "Excessive" &&
      (structure.key === "managers" || structure.key === "supporters")
    ) {
      score += 8;
    }

    if (
      status === "Under-supported" &&
      (structure.key === "thinkers" || structure.key === "connectors")
    ) {
      score += 8;
    }

    scores[structure.key] = Math.round(Math.min(score, 100) * 100) / 100;
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
      "StructureScoringV1 separates 5 Structure assessment from raw Ten Profile ranking. It weighs Ten Profile clusters, month command, and Day Master strength condition.",
  };
}

export default structureScoringV1;