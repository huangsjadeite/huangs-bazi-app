// src/engine/blindSpotsEngineV1.js

const STRUCTURE_BLIND_SPOTS = {
  Connectors: [
    "You may stay connected to people, projects or opportunities longer than necessary because loyalty and relationship flow matter deeply to you.",
    "You may overextend yourself by trying to keep too many doors, conversations or possibilities open at the same time.",
    "Your growth improves when you learn which connections deserve your energy and which ones only create noise.",
  ],

  Thinkers: [
    "You may delay action until you feel fully prepared, even when you already know enough to move forward.",
    "You may see risks, gaps or complications before you allow yourself to see the opportunity.",
    "Your growth improves when you trust your existing knowledge instead of waiting for complete certainty.",
  ],

  Supporters: [
    "You may take on responsibility quietly and only realise you are tired after you have already carried too much.",
    "You may over-adapt to others because being reliable can become part of how you prove your value.",
    "Your growth improves when support flows both ways instead of always coming from you.",
  ],

  Warriors: [
    "You may push through pressure even when slowing down would give you better control.",
    "You may become overly guarded when you feel that others are not moving with enough strength or urgency.",
    "Your growth improves when courage is paired with patience, timing and emotional regulation.",
  ],

  Creators: [
    "You may start many ideas with excitement but struggle to finish them when the initial inspiration fades.",
    "You may resist structure because it can feel restrictive, even though the right structure helps your creativity become sustainable.",
    "Your growth improves when expression is supported by rhythm, consistency and follow-through.",
  ],
};

const PROFILE_BLIND_SPOTS = {
  "Direct Wealth":
    "Because you value results and practical progress, you may judge yourself too harshly when outcomes take longer than expected.",

  "Indirect Wealth":
    "Because you can sense opportunities quickly, you may feel pulled toward too many possibilities before one has fully matured.",

  Friend:
    "Because connection matters to you, you may sometimes absorb other people's pace, opinions or expectations too easily.",

  "Rob Wealth":
    "Because independence is strong in you, you may resist support even when collaboration would make things easier.",

  "Direct Officer":
    "Because responsibility matters to you, you may become too hard on yourself when life does not follow the correct order.",

  "Seven Killings":
    "Because pressure activates you, you may normalise stress and only realise later how much you have been carrying.",

  "Direct Resource":
    "Because you seek stability and reassurance, you may wait for more support before trusting your own readiness.",

  "Indirect Resource":
    "Because your mind sees deeper layers, you may overthink situations that only require a simple next step.",

  "Eating God":
    "Because comfort and natural flow matter to you, you may avoid difficult but necessary decisions until they become urgent.",

  "Hurting Officer":
    "Because your expression is sharp and independent, you may challenge systems before deciding whether the battle is worth your energy.",
};

const STRUCTURE_GROWTH_ADVICE = {
  Connectors:
    "Choose fewer but stronger relationships, and let trust build through quality rather than constant availability.",

  Thinkers:
    "Turn your knowledge into action before everything feels perfect; clarity often comes after movement.",

  Supporters:
    "Let support become mutual instead of one-directional, especially when people already trust your reliability.",

  Warriors:
    "Use pressure as fuel, but do not let urgency make every situation feel like a battle.",

  Creators:
    "Protect your creative flow with simple routines so inspiration can become something sustainable.",
};

function getStructureName(structureScoringV2) {
  return (
    structureScoringV2?.mainStructure?.name ||
    structureScoringV2?.mainStructure ||
    structureScoringV2?.structure ||
    null
  );
}

function getDominantProfileName(tenProfileScoringV2) {
  return (
    tenProfileScoringV2?.dominantProfile?.name ||
    tenProfileScoringV2?.dominantProfile ||
    tenProfileScoringV2?.profile ||
    null
  );
}

function getDayMasterStatus(dayMasterStrengthV4) {
  return String(
    dayMasterStrengthV4?.status ||
      dayMasterStrengthV4?.label ||
      dayMasterStrengthV4?.strength ||
      ""
  );
}

function getStrengthBlindSpot(dayMasterStatus) {
  const status = String(dayMasterStatus || "").toLowerCase();

  if (
    status.includes("strong") ||
    status.includes("excessive") ||
    status.includes("very strong")
  ) {
    return "You may underestimate how much pressure you are carrying because capability can make exhaustion look normal.";
  }

  if (
    status.includes("weak") ||
    status.includes("under-supported") ||
    status.includes("sensitive")
  ) {
    return "You may underestimate your own ability and wait for more certainty or support than is actually necessary.";
  }

  return "You may move between confidence and hesitation depending on the situation, so clarity improves when you slow down and prioritise.";
}

function getBlindSpotSummary({ mainStructure, dominantProfile, dayMasterStatus }) {
  if (mainStructure === "Connectors") {
    return "Your blind spots are mostly connected to people, loyalty, overextension and knowing which opportunities truly deserve your energy.";
  }

  if (mainStructure === "Thinkers") {
    return "Your blind spots are mostly connected to overthinking, waiting for certainty and delaying action even when your knowledge is already strong enough.";
  }

  if (mainStructure === "Supporters") {
    return "Your blind spots are mostly connected to responsibility, over-giving and carrying more than you need to carry alone.";
  }

  if (mainStructure === "Warriors") {
    return "Your blind spots are mostly connected to pressure, urgency, control and pushing through when slowing down would give better results.";
  }

  if (mainStructure === "Creators") {
    return "Your blind spots are mostly connected to consistency, follow-through and turning inspiration into something sustainable.";
  }

  return `Your blind spots are shaped by your ${dominantProfile || "dominant profile"} pattern and ${dayMasterStatus || "current energy"} state.`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function buildBlindSpotsV1({
  structureScoringV2,
  tenProfileScoringV2,
  dayMasterStrengthV4,
}) {
  const mainStructure = getStructureName(structureScoringV2);
  const dominantProfile = getDominantProfileName(tenProfileScoringV2);
  const dayMasterStatus = getDayMasterStatus(dayMasterStrengthV4);

  const structureBlindSpots =
    STRUCTURE_BLIND_SPOTS[mainStructure] ||
    [
      "You may repeat familiar patterns until life pushes you to choose with more awareness.",
      "Your growth improves when you understand not only your strengths, but also the situations that drain or distract you.",
      "You may benefit from clearer boundaries, better pacing and more intentional decision-making.",
    ];

  const profileBlindSpot = PROFILE_BLIND_SPOTS[dominantProfile];

  const strengthBlindSpot = getStrengthBlindSpot(dayMasterStatus);

  const growthAdvice =
    STRUCTURE_GROWTH_ADVICE[mainStructure] ||
    "Your growth improves when you notice what drains your energy and choose your next step more intentionally.";

  const blindSpots = unique([
    ...structureBlindSpots,
    profileBlindSpot,
    strengthBlindSpot,
  ]).slice(0, 5);

  return {
    version: "blind-spots-v1",

    mainStructure,
    dominantProfile,
    dayMasterStatus,

    summary: getBlindSpotSummary({
      mainStructure,
      dominantProfile,
      dayMasterStatus,
    }),

    blindSpots,

    growthAdvice,

    reasoning: [
      mainStructure
        ? `Main structure blind spots are based on ${mainStructure}.`
        : "No main structure detected.",
      dominantProfile
        ? `Dominant profile modifier applied: ${dominantProfile}.`
        : "No dominant profile detected.",
      dayMasterStatus
        ? `Day Master strength modifier applied: ${dayMasterStatus}.`
        : "No Day Master strength detected.",
    ],
  };
}

export default buildBlindSpotsV1;