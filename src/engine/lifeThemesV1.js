// src/engine/lifeThemesV1.js

const VERSION = "life-themes-v1";

function safeName(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.name || value?.label || value?.type || value?.profile || null;
}

function normalizeStatus(status) {
  if (!status) return "Unknown";

  const value = String(status).toLowerCase();

  if (value.includes("very strong")) return "Very Strong";
  if (value.includes("strong") || value.includes("excessive")) return "Strong";
  if (value.includes("weak") || value.includes("under")) return "Weak";
  if (value.includes("balanced")) return "Balanced";

  return status;
}

function getStructureCoreTheme(mainStructure) {
  const map = {
    Connectors: {
      core: "Relationships and Connections",
      supporting: [
        "Building Through People",
        "Trust and Reciprocity",
        "Strategic Alliances",
        "Creating Opportunities Through Community",
      ],
    },

    Thinkers: {
      core: "Knowledge and Wisdom",
      supporting: [
        "Developing Expertise",
        "Teaching and Mentorship",
        "Inner Reflection",
        "Guiding Others Through Experience",
      ],
    },

    Supporters: {
      core: "Responsibility and Leadership",
      supporting: [
        "Creating Stability",
        "Service and Contribution",
        "Steady Long-Term Growth",
        "Protecting What Matters",
      ],
    },

    Pioneers: {
      core: "Creating Opportunities",
      supporting: [
        "Calculated Risk Taking",
        "Resourcefulness",
        "Independence and Self-Determination",
        "Growth Through Action",
      ],
    },

    Creators: {
      core: "Creative Expression",
      supporting: [
        "Sharing Ideas",
        "Innovation",
        "Living Authentically",
        "Bringing Inspiration to Others",
      ],
    },
  };

  return (
    map[mainStructure] || {
      core: "Aligning Strengths With Life Direction",
      supporting: [
        "Self-Awareness",
        "Balance and Growth",
        "Clearer Decision Making",
        "Long-Term Personal Development",
      ],
    }
  );
}

function getStrengthGrowthTheme(dayStatus, dominantProfileName, mainStructure) {
  const status = normalizeStatus(dayStatus);
  const profile = safeName(dominantProfileName);

  if (status === "Very Strong" || status === "Strong") {
    if (mainStructure === "Connectors") {
      return "Balancing Independence and Support";
    }

    if (mainStructure === "Supporters") {
      return "Leading Without Carrying Everything Alone";
    }

    if (profile === "Direct Officer") {
      return "Leading Through Responsibility";
    }

    if (profile === "Seven Killings") {
      return "Using Pressure With Courage and Control";
    }

    return "Using Strength With Better Boundaries";
  }

  if (status === "Weak") {
    if (mainStructure === "Thinkers") {
      return "Developing Confidence Through Knowledge";
    }

    if (mainStructure === "Supporters") {
      return "Creating Stability Through Support";
    }

    if (profile === "Direct Resource" || profile === "Indirect Resource") {
      return "Building Confidence Through Support";
    }

    return "Building Support Systems";
  }

  if (profile === "Direct Officer") return "Leading Through Responsibility";
  if (profile === "Indirect Wealth") return "Opportunity Recognition";
  if (profile === "Direct Wealth") return "Building Practical Results";
  if (profile === "Eating God") return "Creative Contribution";
  if (profile === "Hurting Officer") return "Authentic Self-Expression";
  if (profile === "Direct Resource") return "Wisdom and Mastery";
  if (profile === "Indirect Resource") return "Inner Growth and Reflection";
  if (profile === "Seven Killings") return "Courage Under Pressure";
  if (profile === "Friend") return "Growing Through Peer Support";
  if (profile === "Rob Wealth") return "Healthy Independence and Self-Assertion";

  return "Personal Growth Through Self-Awareness";
}

function getUsefulGodBalancingTheme(primaryUsefulGod) {
  const map = {
    Wood: "Growth and Expansion",
    Fire: "Visibility and Influence",
    Earth: "Building Stable Foundations",
    Metal: "Strategic Decision Making",
    Water: "Adaptability and Learning",
  };

  return map[primaryUsefulGod] || "Restoring Balance Through Better Choices";
}

function dedupe(items) {
  return [...new Set(items.filter(Boolean))];
}

export function buildLifeThemesV1({
  dayMasterStrengthV4 = {},
  structureScoringV2 = {},
  tenProfileScoringV2 = {},
  usefulGodV4 = {},
} = {}) {
  const mainStructure = safeName(structureScoringV2?.mainStructure);
  const dayStatus = normalizeStatus(dayMasterStrengthV4?.status);

  const dominantProfile =
    tenProfileScoringV2?.dominantProfile ||
    tenProfileScoringV2?.topProfile ||
    tenProfileScoringV2?.profiles?.[0] ||
    null;

  const dominantProfileName = safeName(dominantProfile);

  const primaryUsefulGod =
    safeName(usefulGodV4?.primaryUsefulGod) ||
    safeName(usefulGodV4?.primary) ||
    null;

  const secondaryUsefulGod =
    safeName(usefulGodV4?.secondaryUsefulGod) ||
    safeName(usefulGodV4?.secondary) ||
    null;

  const structureTheme = getStructureCoreTheme(mainStructure);

  const coreTheme = structureTheme.core;

  const growthTheme = getStrengthGrowthTheme(
    dayStatus,
    dominantProfileName,
    mainStructure
  );

  const balancingTheme = getUsefulGodBalancingTheme(primaryUsefulGod);

  const primaryThemes = dedupe([
    coreTheme,
    growthTheme,
    balancingTheme,
  ]).slice(0, 3);

  const supportingThemes = dedupe(structureTheme.supporting)
    .filter((theme) => !primaryThemes.includes(theme))
    .slice(0, 2);

  const reasoning = [
    mainStructure ? `Main structure is ${mainStructure}.` : null,
    dayStatus ? `Day Master strength is ${dayStatus}.` : null,
    dominantProfileName ? `Dominant profile is ${dominantProfileName}.` : null,
    primaryUsefulGod ? `Primary Useful God is ${primaryUsefulGod}.` : null,
    secondaryUsefulGod ? `Secondary Useful God is ${secondaryUsefulGod}.` : null,
  ].filter(Boolean);

  return {
    primaryThemes,
    supportingThemes,
    reasoning,
    version: VERSION,
  };
}

export default buildLifeThemesV1;