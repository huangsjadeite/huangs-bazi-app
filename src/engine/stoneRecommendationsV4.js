// src/engine/stoneRecommendationsV4.js

import { ELEMENT_STONE_MAP } from "./stoneMaps/elementStoneMap.js";
import { STRUCTURE_STONE_TONE_MAP } from "./stoneMaps/structureStoneToneMap.js";
import { PROFILE_STONE_TONE_MAP } from "./stoneMaps/profileStoneToneMap.js";

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

const STONE_CUSTOMER_MESSAGES = {
  "White Jadeite":
    "Supports calm confidence, clean decision-making, reputation and steady relationship flow. Good as a main daily support when you need balance without feeling too forceful.",

  "Clear Quartz":
    "Helps amplify focus, intention and mental clarity. Best when you want a simple, versatile support that strengthens the effect of your chosen direction.",

  "White Moonstone":
    "Supports emotional softness, intuition and smoother connection with others. Helpful when you want to stay receptive without losing your centre.",

  Selenite:
    "Supports energetic cleansing, calmness and mental spaciousness. Best when you feel mentally crowded, emotionally heavy or need a lighter daily reset.",

  Diamond:
    "Supports commitment, confidence, standards and long-term direction. Best when you need clarity, discipline and a stronger sense of self-worth.",

  "Black Jadeite":
    "Supports grounding, protection and emotional steadiness. Helpful when you need to feel safer, more contained and less affected by external pressure.",

  "Blue Jadeite":
    "Supports communication, emotional flow and calm expression. Helpful when your growth depends on speaking clearly, connecting gently and staying composed.",

  "Green Jadeite":
    "Supports growth, renewal, harmony and steady personal development. Good when you want a softer form of progress that still feels grounded.",

  Aquamarine:
    "Supports calm communication, emotional flow and trust. Helpful when you need to express yourself clearly without becoming defensive or overwhelmed.",

  Morganite:
    "Supports softness, heart-opening and emotional healing. Best when relationship energy needs more warmth, gentleness and receptivity.",

  Amethyst:
    "Supports reflection, intuition and emotional clarity. Helpful when you need to slow down, understand your inner world and avoid impulsive reactions.",

  Citrine:
    "Supports confidence, optimism and opportunity awareness. Best when you need more motivation, visibility and openness to growth.",

  "Black Obsidian":
    "Supports protection, grounding and energetic boundaries. Useful when you need to cut through emotional noise and stay centred.",

  "Red Agate":
    "Supports courage, stamina and steady action. Best when you need more drive, warmth and confidence to move forward.",

  "Tiger Eye":
    "Supports courage, focus and practical judgement. Helpful when you need to make decisions with both confidence and control.",

  Lapis:
    "Supports wisdom, communication and clear self-expression. Best when your growth depends on speaking with authority and inner truth.",

  "Lapis Lazuli":
    "Supports wisdom, communication and clear self-expression. Best when your growth depends on speaking with authority and inner truth.",
};

function getStoneCustomerMessage({ stone, element, stoneMap, structureTone, profileTone }) {
  const specificMessage = STONE_CUSTOMER_MESSAGES[stone.name];

  if (specificMessage) {
    return specificMessage;
  }

  return `${stone.name} supports ${stoneMap.keywords.join(
    ", "
  )} qualities linked to ${element} energy. This can help with ${profileTone} while also supporting ${structureTone.tone}.`;
}

function flattenStoneGroups(element) {
  const map = ELEMENT_STONE_MAP[element];

  if (!map) {
    return [];
  }

  return [
    ...map.jadeite.map((name) => ({
      name,
      type: "Jadeite",
    })),
    ...map.crystals.map((name) => ({
      name,
      type: "Crystal",
    })),
    ...map.gemstones.map((name) => ({
      name,
      type: "Gemstone",
    })),
    ...map.dziBeads.map((name) => ({
      name,
      type: "Dzi Bead",
    })),
  ];
}

function buildRecommendationGroup({
  element,
  category,
  structureTone,
  profileTone,
  limit = 5,
}) {
  if (!element || !ELEMENT_STONE_MAP[element]) {
    return null;
  }

  const stoneMap = ELEMENT_STONE_MAP[element];
  const stones = flattenStoneGroups(element).slice(0, limit);

  return {
    element,
    category,

    keywords: stoneMap.keywords,

        stones: stones.map((stone) => ({
      ...stone,
      reason: `${stone.name} supports ${stoneMap.keywords.join(
        ", "
      )} qualities linked to ${element} energy.`,
      customerMessage: getStoneCustomerMessage({
        stone,
        element,
        stoneMap,
        structureTone,
        profileTone,
      }),
    })),

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

  const stoneMap = ELEMENT_STONE_MAP[element];
  const stones = flattenStoneGroups(element).slice(0, 4);

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
} = {}) {
  const primaryElement = getElementName(usefulGodV4?.primaryUsefulGod);
  const secondaryElement = getElementName(usefulGodV4?.secondaryUsefulGod);

  const favourableElements = usefulGodV4?.favourableElements || [];
  const cautionElements = usefulGodV4?.cautionElements || [];

  const mainStructure =
    structureScoringV2?.mainStructure?.name || "Unknown";

  const dominantProfile =
    tenProfileScoringV2?.dominantProfile?.name || "Unknown";

  const structureTone = getStoneToneByStructure(mainStructure);
  const profileTone = getProfileTone(dominantProfile);

  const primaryRecommendation = buildRecommendationGroup({
    element: primaryElement,
    category: "primary",
    structureTone,
    profileTone,
    limit: 5,
  });

  const secondaryRecommendation = buildRecommendationGroup({
    element: secondaryElement,
    category: "secondary",
    structureTone,
    profileTone,
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
        ? `${primaryElement} is prioritised because it is the primary Useful God in the current chart interpretation.`
        : "Stone recommendations could not identify a primary Useful God.",
    },

    reasoning: [
      primaryElement
        ? `Primary recommendations are based on ${primaryElement} as the primary Useful God.`
        : "No primary Useful God detected.",

      secondaryElement
        ? `${secondaryElement} is included as secondary energetic support.`
        : "No secondary Useful God detected.",

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