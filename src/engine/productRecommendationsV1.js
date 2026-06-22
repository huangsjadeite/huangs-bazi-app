// src/engine/productRecommendationsV1.js

import { PRODUCT_CATEGORY_MAP } from "./productMaps/productCategoryMap.js";
import { STRUCTURE_PRODUCT_TONE_MAP } from "./productMaps/structureProductToneMap.js";
import { PROFILE_PRODUCT_TONE_MAP } from "./productMaps/profileProductToneMap.js";

function getStructureTone(structureName) {
  return (
    STRUCTURE_PRODUCT_TONE_MAP[structureName] ||
    STRUCTURE_PRODUCT_TONE_MAP.Unknown
  );
}

function getProfileTone(profileName) {
  return (
    PROFILE_PRODUCT_TONE_MAP[profileName] ||
    PROFILE_PRODUCT_TONE_MAP.Unknown
  );
}

function getProductCategories(stoneName) {
  return PRODUCT_CATEGORY_MAP[stoneName] || PRODUCT_CATEGORY_MAP.default;
}

function rankCategoriesByPreference(categories, preferredForms) {
  const preferred = categories.filter((category) =>
    preferredForms.includes(category)
  );

  const remaining = categories.filter(
    (category) => !preferredForms.includes(category)
  );

  return [...preferred, ...remaining];
}

const PRODUCT_FORM_MESSAGES = {
  Pendant:
    "A pendant keeps the support close to the upper body, making it useful for visibility, communication, confidence and daily energetic alignment.",

  Bracelet:
    "A bracelet is practical for daily wear and supports consistent action, habits, decisions and interaction with people throughout the day.",

  Bangle:
    "A bangle gives steady, continuous support and is suitable for people who want a stronger daily anchor for balance, stability and presence.",

  Ring:
    "A ring supports personal intention, decision-making and commitment, especially when the wearer wants a subtle but focused reminder.",

  Necklace:
    "A necklace supports presence, expression and personal visibility while still feeling wearable in both casual and business settings.",

  Earrings:
    "Earrings support presentation, refinement and social visibility, especially when the wearer wants the energy to feel lighter and more expressive.",
};

const STONE_PRODUCT_MESSAGES = {
  "White Jadeite":
    "White Jadeite is recommended for calm confidence, reputation, steady decision-making and smoother relationship flow.",

  "Clear Quartz":
    "Clear Quartz is recommended when the wearer needs more focus, clarity and intention. It works well as a clean, versatile amplifier.",

  "White Moonstone":
    "White Moonstone is recommended for emotional softness, intuition, relationship harmony and a gentler personal presence.",

  Selenite:
    "Selenite is recommended for energetic cleansing, calmness and mental spaciousness, especially during emotionally heavy periods.",

  Diamond:
    "Diamond is recommended for confidence, commitment, higher standards and long-term direction. It supports clarity and self-worth.",

  "Black Jadeite":
    "Black Jadeite is recommended for grounding, protection and emotional steadiness when external pressure feels strong.",

  "Blue Jadeite":
    "Blue Jadeite is recommended for calm communication, emotional flow and clearer self-expression.",

  "Green Jadeite":
    "Green Jadeite is recommended for growth, renewal, harmony and steady personal development.",

  Aquamarine:
    "Aquamarine is recommended for calm communication, emotional flow and trust, especially when self-expression needs to feel softer.",

  Morganite:
    "Morganite is recommended for emotional healing, softness and heart-opening relationship energy.",

  Amethyst:
    "Amethyst is recommended for reflection, intuition and emotional clarity, especially when the wearer needs to slow down before reacting.",

  Citrine:
    "Citrine is recommended for confidence, optimism and opportunity awareness, especially when visibility and motivation need support.",

  "Black Obsidian":
    "Black Obsidian is recommended for protection, grounding and stronger energetic boundaries.",

  "Red Agate":
    "Red Agate is recommended for courage, stamina and steady action when more warmth and drive are needed.",

  "Tiger Eye":
    "Tiger Eye is recommended for courage, focus and practical judgement when decisions need both confidence and control.",

  Lapis:
    "Lapis is recommended for wisdom, communication and clearer self-expression.",

  "Lapis Lazuli":
    "Lapis Lazuli is recommended for wisdom, communication and clearer self-expression.",
};

function getProductCustomerMessage({
  stone,
  category,
  recommendationGroup,
  priority,
  structureTone,
  profileTone,
}) {
  const stoneMessage =
    STONE_PRODUCT_MESSAGES[stone.name] ||
    `${stone.name} supports ${recommendationGroup.element} energy, which is marked as ${priority.toLowerCase()} support in this chart.`;

  const formMessage =
    PRODUCT_FORM_MESSAGES[category] ||
    `${category} pieces are useful when the wearer wants this support to feel practical and easy to include in daily life.`;

  const motivation =
    profileTone?.buyingMotivation
      ? ` This is especially suitable when the customer values ${profileTone.buyingMotivation}.`
      : "";

  const tone =
    structureTone?.tone
      ? ` It is also aligned with ${structureTone.tone}.`
      : "";

  return `${stoneMessage} ${formMessage}${motivation}${tone}`;
}

function buildProductGroup({
  recommendationGroup,
  priority,
  structureTone,
  profileTone,
  maxProducts = 3,
}) {
  if (!recommendationGroup?.stones?.length) {
    return [];
  }

  const products = recommendationGroup.stones.map((stone) => {
    const categories = getProductCategories(stone.name);

    const bestCategory =
      rankCategoriesByPreference(
        categories,
        structureTone.preferredForms
      )[0] || "Pendant";

    return {
      stone: stone.name,
      stoneType: stone.type,
      category: bestCategory,
      priority,

      reason: `${stone.name} is recommended because it supports ${recommendationGroup.element} energy, which is marked as ${priority.toLowerCase()} support in the chart.`,

            customerMessage: getProductCustomerMessage({
        stone,
        category: bestCategory,
        recommendationGroup,
        priority,
        structureTone,
        profileTone,
      }),

      productSearchTags: [
        stone.name,
        stone.type,
        bestCategory,
        recommendationGroup.element,
        priority,
      ],
    };
  });

  return products.slice(0, maxProducts);
}

export function buildProductRecommendationsV1({
  stoneRecommendationsV4,
  usefulGodV4,
  structureScoringV2,
  tenProfileScoringV2,
} = {}) {
  const mainStructure =
    structureScoringV2?.mainStructure?.name ||
    stoneRecommendationsV4?.mainStructure ||
    "Unknown";

  const dominantProfile =
    tenProfileScoringV2?.dominantProfile?.name ||
    stoneRecommendationsV4?.dominantProfile ||
    "Unknown";

  const structureTone = getStructureTone(mainStructure);
  const profileTone = getProfileTone(dominantProfile);

  const primaryProducts =
    stoneRecommendationsV4?.primaryRecommendations?.flatMap((group) =>
      buildProductGroup({
        recommendationGroup: group,
        priority: "Primary",
        structureTone,
        profileTone,
        maxProducts: 3,
      })
    ) || [];

  const secondaryProducts =
    stoneRecommendationsV4?.secondaryRecommendations?.flatMap((group) =>
      buildProductGroup({
        recommendationGroup: group,
        priority: "Secondary",
        structureTone,
        profileTone,
        maxProducts: 2,
      })
    ) || [];

  const lifestyleProducts = [
    ...primaryProducts.slice(0, 2),
    ...secondaryProducts.slice(0, 1),
  ];

  return {
    version: "product-recommendations-v1",

    mainStructure,
    dominantProfile,

    primaryElement: stoneRecommendationsV4?.primaryElement || null,
    secondaryElement: stoneRecommendationsV4?.secondaryElement || null,

    primaryProducts,
    secondaryProducts,
    lifestyleProducts,

    topProduct: primaryProducts[0] || secondaryProducts[0] || null,

    recommendationSummary: {
      primaryCount: primaryProducts.length,
      secondaryCount: secondaryProducts.length,
      lifestyleCount: lifestyleProducts.length,
    },

    reasoning: [
      stoneRecommendationsV4?.primaryElement
        ? `Primary products are based on ${stoneRecommendationsV4.primaryElement} as the primary Useful God.`
        : "No primary Useful God product mapping available.",

      stoneRecommendationsV4?.secondaryElement
        ? `Secondary products are based on ${stoneRecommendationsV4.secondaryElement} as secondary support.`
        : "No secondary Useful God product mapping available.",

      mainStructure !== "Unknown"
        ? `Product form preference adjusted for ${mainStructure} structure.`
        : "No structure-based product preference applied.",

      dominantProfile !== "Unknown"
        ? `Customer motivation adjusted for ${dominantProfile} profile.`
        : "No profile-based product motivation applied.",

      "ProductRecommendationsV1 limits output to the strongest product forms to avoid repetitive recommendations.",
    ],

    debug: {
      usefulGodV4,
      structureTone,
      profileTone,
      sourceStoneRecommendations: stoneRecommendationsV4?.version,
    },
  };
}

export default buildProductRecommendationsV1;