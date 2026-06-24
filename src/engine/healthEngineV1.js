// src/engine/healthEngineV1.js

const VERSION = "health-engine-v1";

function safeName(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.name || value?.label || value?.type || value?.profile || null;
}

function getVitalityLevel(dayStatus, elementBalanceV3 = {}) {
  const balanceScore = elementBalanceV3?.balanceScore ?? null;

  if (dayStatus === "Excessive") return "Resilient but easily overextended";
  if (dayStatus === "Very Strong") return "Resilient";
  if (dayStatus === "Balanced") return "Balanced";
  if (dayStatus === "Weak" || dayStatus === "Under-supported") return "Sensitive";

  if (typeof balanceScore === "number") {
    if (balanceScore >= 6.5) return "Balanced";
    if (balanceScore >= 4) return "Variable";
    return "Sensitive";
  }

  return "Variable";
}

function getStressPattern(mainStructure, dayStatus) {
  if (mainStructure === "Connectors") return "People and opportunity overload";
  if (mainStructure === "Thinkers") return "Mental overload";
  if (mainStructure === "Supporters") return "Responsibility overload";
  if (mainStructure === "Creators") return "Stimulation and emotional overload";
  if (mainStructure === "Managers") return "Control and performance overload";

  if (dayStatus === "Excessive") return "Overextension pattern";
  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    return "Energy depletion pattern";
  }

  return "General stress accumulation";
}

function getRecoveryStyle(primaryUsefulGod) {
  const map = {
    Wood: "Growth, movement and gentle routine",
    Fire: "Warmth, visibility, joy and emotional expression",
    Earth: "Grounding, stability, nourishment and consistency",
    Metal: "Boundaries, structure, quiet focus and disciplined routines",
    Water: "Rest, reflection, flexibility and emotional flow",
  };

  return map[primaryUsefulGod] || "Balanced rest and consistent lifestyle rhythm";
}

function getWellnessStrengths(mainStructure, dayStatus) {
  const map = {
    Connectors: [
      "Can recover well through meaningful connection and emotional expression.",
      "Responds well when daily routines include variety and movement.",
      "Can stay motivated when wellness habits feel purposeful and socially supported.",
    ],
    Thinkers: [
      "Can understand personal patterns deeply when given time to reflect.",
      "Responds well to calm environments and thoughtful routines.",
      "Benefits from knowledge-based wellness habits and self-awareness.",
    ],
    Supporters: [
      "Can build stable wellness habits through consistency and care.",
      "Responds well to nurturing environments and predictable routines.",
      "Often improves when rest, food and daily rhythm are kept steady.",
    ],
    Creators: [
      "Can release stress through expression, creativity and movement.",
      "Responds well when wellness routines feel flexible rather than restrictive.",
      "Benefits from emotional honesty and space for self-expression.",
    ],
    Managers: [
      "Can maintain health well when routines, goals and systems are clear.",
      "Responds well to structured exercise, planning and measurable habits.",
      "Often improves when stress is managed through order and consistency.",
    ],
  };

  const strengths =
    map[mainStructure] || [
      "Can improve wellness through self-awareness and consistent habits.",
      "Responds well when lifestyle choices match natural energy patterns.",
      "Benefits from balancing effort with proper recovery.",
    ];

  if (dayStatus === "Excessive") {
    return [
      ...strengths,
      "Has strong drive and stamina when energy is managed properly.",
    ].slice(0, 3);
  }

  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    return [
      ...strengths,
      "Can improve significantly when support, rest and pacing are prioritised.",
    ].slice(0, 3);
  }

  return strengths.slice(0, 3);
}

function getWellnessRisks(mainStructure, dayStatus) {
  const risks = [];

  if (mainStructure === "Connectors") {
    risks.push("May overextend energy through people, opportunities or social demands.");
    risks.push("May struggle to slow down when life feels exciting or busy.");
  }

  if (mainStructure === "Thinkers") {
    risks.push("May stay mentally active even when the body needs rest.");
    risks.push("May overthink stress instead of physically decompressing.");
  }

  if (mainStructure === "Supporters") {
    risks.push("May carry other people's needs or responsibilities for too long.");
    risks.push("May neglect personal recovery while caring for others.");
  }

  if (mainStructure === "Creators") {
    risks.push("May experience energy swings when routines are inconsistent.");
    risks.push("May resist structure even when structure would support recovery.");
  }

  if (mainStructure === "Managers") {
    risks.push("May push through stress to maintain control or performance.");
    risks.push("May ignore emotional fatigue when focused on outcomes.");
  }

  if (dayStatus === "Excessive") {
    risks.push("May ignore early signs of fatigue until stress accumulates.");
  }

  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    risks.push("May need stronger rest, support and pacing before taking on heavy demands.");
  }

  return risks.slice(0, 3);
}

function getHealthStrategy(mainStructure, dayStatus, primaryUsefulGod) {
  const recoveryStyle = getRecoveryStyle(primaryUsefulGod);

  const structureMap = {
    Connectors:
      "Maintain wellness by managing social energy, reducing overcommitment and creating space between responsibilities.",
    Thinkers:
      "Maintain wellness by reducing mental overload, creating quiet recovery time and turning reflection into practical rest.",
    Supporters:
      "Maintain wellness by setting emotional boundaries, keeping stable routines and avoiding carrying too much for others.",
    Creators:
      "Maintain wellness by balancing creative expression with steady routines, movement and proper rest.",
    Managers:
      "Maintain wellness by balancing discipline with recovery, reducing pressure and allowing flexibility inside structure.",
  };

  let base =
    structureMap[mainStructure] ||
    "Maintain wellness through consistent recovery habits, balanced routines and self-awareness.";

  if (dayStatus === "Excessive") {
    base +=
      " Because the chart shows strong drive, the key is not doing more, but knowing when to pause.";
  }

  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    base +=
      " Because the chart is more sensitive, the key is pacing, support and avoiding prolonged depletion.";
  }

  return `${base} Recovery is supported through: ${recoveryStyle}.`;
}

export function buildHealthEngineV1({
  dayMasterStrengthV4 = {},
  structureScoringV2 = {},
  usefulGodV4 = {},
  elementBalanceV3 = {},
} = {}) {
  const mainStructure = safeName(structureScoringV2?.mainStructure);
  const dayStatus = dayMasterStrengthV4?.status || null;
  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;

  return {
    version: VERSION,

    vitalityLevel: getVitalityLevel(dayStatus, elementBalanceV3),
    stressPattern: getStressPattern(mainStructure, dayStatus),
    recoveryStyle: getRecoveryStyle(primaryUsefulGod),

    wellnessStrengths: getWellnessStrengths(mainStructure, dayStatus),
    wellnessRisks: getWellnessRisks(mainStructure, dayStatus),
    healthStrategy: getHealthStrategy(
      mainStructure,
      dayStatus,
      primaryUsefulGod
    ),

    debug: {
      mainStructure,
      dayStatus,
      primaryUsefulGod,
      secondaryUsefulGod,
      balanceScore: elementBalanceV3?.balanceScore ?? null,
      note:
        "HealthEngineV1 provides lifestyle and energy-management interpretation only. It does not diagnose, treat or predict medical conditions.",
    },
  };
}

export default buildHealthEngineV1;