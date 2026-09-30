// src/engine/stoneRecommendationsV4.js

import { ELEMENT_STONE_MAP } from "./stoneMaps/elementStoneMap.js";
import { STRUCTURE_STONE_TONE_MAP } from "./stoneMaps/structureStoneToneMap.js";
import { PROFILE_STONE_TONE_MAP } from "./stoneMaps/profileStoneToneMap.js";
import { STONE_CATALOG, FOCUS_AREA_LABELS } from "./stoneMaps/stoneCatalog.js";

function getElementName(value) {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value.element || value.name || null;
  }

  return null;
}

function getStoneToneByStructure(structureName) {
  return (
    STRUCTURE_STONE_TONE_MAP[structureName] ||
    STRUCTURE_STONE_TONE_MAP.Unknown
  );
}

function getProfileTone(profileName) {
  return (
    PROFILE_STONE_TONE_MAP[profileName] ||
    PROFILE_STONE_TONE_MAP.Unknown
  );
}

// Features the stones whose life areas best match the client's focus areas,
// weighted by each area's focus score. A stone's first area is its main
// benefit and counts fully; its other areas count half. Each pick halves the
// pull of the areas it covers, so the featured set spreads across the client's
// top areas. With no focus scores, the catalog order is used.
function pickStones(element, focusRanking, limit) {
  const pool = [...(STONE_CATALOG[element] || [])];
  const weight = Object.fromEntries(
    (focusRanking || [])
      .filter((item) => FOCUS_AREA_LABELS[item?.key])
      .map((item) => [item.key, Math.max(0, Number(item.score) || 0)])
  );
  const covered = {};
  const picked = [];
  const pull = (area, index) => (weight[area] || 0) * (index === 0 ? 1 : 0.5) * 0.5 ** (covered[area] || 0);

  while (picked.length < limit && pool.length) {
    const value = (item) => item.areas.reduce((sum, area, index) => sum + pull(area, index), 0);
    let bestIndex = 0;
    pool.forEach((item, index) => {
      if (value(item) > value(pool[bestIndex])) bestIndex = index;
    });
    const [item] = pool.splice(bestIndex, 1);
    const contributions = item.areas.map((area, index) => [area, pull(area, index)]);
    const [pickedFor, strength] = contributions.sort((x, y) => y[1] - x[1])[0] || [];
    item.areas.forEach((area) => {
      covered[area] = (covered[area] || 0) + 1;
    });
    picked.push({ ...item, pickedFor: strength > 0 ? pickedFor : null });
  }

  return { picked, others: pool.map((item) => item.name) };
}

function buildRecommendationGroup({
  element,
  category,
  structureTone,
  focusRanking,
  limit = 5,
}) {
  if (!element || !ELEMENT_STONE_MAP[element]) {
    return null;
  }

  const stoneMap = ELEMENT_STONE_MAP[element];
  const { picked, others } = pickStones(element, focusRanking, limit);

  return {
    element,
    category,

    keywords: stoneMap.keywords,

    stones: picked.map((item) => ({
      name: item.name,
      type: item.type,
      areas: item.areas,
      pickedFor: item.pickedFor,
      pickedForLabel: item.pickedFor ? FOCUS_AREA_LABELS[item.pickedFor] : null,
      reason: `${item.name} supports ${stoneMap.keywords.join(", ")} qualities linked to ${element} energy.`,
      customerMessage: item.message,
    })),

    alsoSuitable: others,

    productStyle:
      structureTone.productStyle ||
      "daily wearable pieces that feel supportive, practical and easy to integrate into normal routines",

    summary: `${element} energy supports ${stoneMap.keywords.join(
      ", "
    )}. These stones are suitable when the chart benefits from strengthening ${element}.`,
  };
}

function buildAvoidRecommendationGroup({ element }) {
  if (!element || !ELEMENT_STONE_MAP[element]) {
    return null;
  }

  const stones = (STONE_CATALOG[element] || []).slice(0, 4).map(({ name, type }) => ({ name, type }));

  return {
    element,
    category: "avoid",

    stones: stones.map((stone) => ({
      ...stone,
      reason: `${stone.name} carries ${element} qualities, which may be too strong if ${element} is already excessive or listed as a caution element.`,
      customerMessage: `Not forbidden, but better worn selectively rather than as the main daily support.`,
    })),

    summary: `${element} stones may amplify qualities that are already strong in the chart, so they should be used with care.`,
  };
}

export function buildStoneRecommendationsV4({
  usefulGodV4,
  structureScoringV2,
  tenProfileScoringV2,
  narrativePersonalization,
  elementBalanceV3,
  focusRankingV1,
} = {}) {
  const primaryElement = getElementName(usefulGodV4?.primaryUsefulGod);
  const secondaryElement = getElementName(usefulGodV4?.secondaryUsefulGod);

  const favourableElements = usefulGodV4?.favourableElements || [];
  const cautionElements = usefulGodV4?.cautionElements || [];

  const mainStructure =
    structureScoringV2?.mainStructure?.name || "Unknown";

  const dominantProfile =
    tenProfileScoringV2?.dominantProfile?.profile ||
    tenProfileScoringV2?.dominantProfile?.name ||
    "Unknown";

  const structureTone = getStoneToneByStructure(mainStructure);
  const profileTone = getProfileTone(dominantProfile);

  const primaryRecommendation = buildRecommendationGroup({
    element: primaryElement,
    category: "primary",
    structureTone,
    focusRanking: focusRankingV1,
    limit: 5,
  });

  const secondaryRecommendation = buildRecommendationGroup({
    element: secondaryElement,
    category: "secondary",
    structureTone,
    focusRanking: focusRankingV1,
    limit: 4,
  });

  const avoidRecommendations = cautionElements
    .map(getElementName)
    .filter(Boolean)
    .filter((element) => element !== primaryElement)
    .filter((element) => element !== secondaryElement)
    .map((element) => buildAvoidRecommendationGroup({ element }))
    .filter(Boolean);

  const primaryRecommendations = primaryRecommendation
    ? [primaryRecommendation]
    : [];

  const secondaryRecommendations = secondaryRecommendation
    ? [secondaryRecommendation]
    : [];

  const topRecommendation =
    primaryRecommendations?.[0]?.stones?.[0]?.name || null;

  const recommendedStones = [
    ...primaryRecommendations.flatMap((group) =>
      group.stones.map((stone) => stone.name)
    ),
    ...secondaryRecommendations.flatMap((group) =>
      group.stones.map((stone) => stone.name)
    ),
  ];

  const uniqueRecommendedStones = Array.from(new Set(recommendedStones));

  return {
    version: "stone-recommendations-v4",

    primaryElement,
    secondaryElement,

    favourableElements,
    cautionElements,

    mainStructure,
    dominantProfile,

    primaryRecommendations,
    secondaryRecommendations,
    avoidRecommendations,

    topRecommendation,
    recommendedStones: uniqueRecommendedStones,

    energyStrategy: {
      focus: primaryElement
        ? `Strengthen ${primaryElement} energy.`
        : "No primary stone focus detected.",

      secondary: secondaryElement
        ? `Use ${secondaryElement} energy as secondary support.`
        : "No secondary stone support detected.",

      avoid:
        cautionElements.length > 0
          ? `Use ${cautionElements
              .map(getElementName)
              .filter(Boolean)
              .join(", ")} stones selectively.`
          : "No major caution stones detected.",

      explanation: primaryElement
        ? `${primaryElement} is prioritised because it is the primary Element to Enhance in the current chart interpretation.`
        : "Stone recommendations could not identify a primary Element to Enhance.",
    },

    reasoning: [
      primaryElement
        ? `Primary recommendations are based on ${primaryElement} as the primary Element to Enhance.`
        : "No primary Element to Enhance detected.",

      secondaryElement
        ? `${secondaryElement} is included as secondary energetic support.`
        : "No secondary Element to Enhance detected.",

      mainStructure !== "Unknown"
        ? `Structure modifier applied: ${mainStructure}.`
        : "No structure modifier applied.",

      dominantProfile !== "Unknown"
        ? `Dominant profile modifier applied: ${dominantProfile}.`
        : "No dominant profile modifier applied.",

      cautionElements.length > 0
        ? `Avoid recommendations are based on caution elements: ${cautionElements
            .map(getElementName)
            .filter(Boolean)
            .join(", ")}.`
        : "No caution elements detected.",
    ],

    narrativePersonalization,

    debug: {
      usefulGodV4,
      elementBalanceRaw: elementBalanceV3?.rawScores,
      structureTone,
      profileTone,
    },
  };
}

export default buildStoneRecommendationsV4;