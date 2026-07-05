// src/engine/relationshipEngineV2.js

const GENERATES = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const CONTROLS = {
  Wood: "Earth",
  Fire: "Metal",
  Earth: "Water",
  Metal: "Wood",
  Water: "Fire",
};

const CONTROLLED_BY = {
  Wood: "Metal",
  Fire: "Water",
  Earth: "Wood",
  Metal: "Fire",
  Water: "Earth",
};

function normalizeGender(gender) {
  const value = String(gender || "").toLowerCase();

  if (value.includes("female") || value.includes("woman")) return "Female";
  if (value.includes("male") || value.includes("man")) return "Male";

  return "Unspecified";
}

function getWealthElement(dayElement) {
  return CONTROLS[dayElement] || null;
}

function getOfficerElement(dayElement) {
  return CONTROLLED_BY[dayElement] || null;
}

function getAnnualElements(annualOverlayV3) {
  return {
    stemElement:
      annualOverlayV3?.annualStemElement ||
      annualOverlayV3?.annualPillar?.stem?.element ||
      annualOverlayV3?.annualPillar?.stemElement ||
      null,

    branchElement:
      annualOverlayV3?.annualBranchElement ||
      annualOverlayV3?.annualPillar?.branch?.element ||
      annualOverlayV3?.annualPillar?.branchElement ||
      null,
  };
}

function getStemElement(pillar) {
  return pillar?.stem?.element || pillar?.stemElement || null;
}

function getBranchElement(pillar) {
  return pillar?.branch?.element || pillar?.branchElement || null;
}

function getHiddenStemElements(pillar) {
  const hidden =
    pillar?.branch?.hiddenStems ||
    pillar?.branch?.hidden ||
    pillar?.hiddenStems ||
    [];

  if (!Array.isArray(hidden)) return [];

  return hidden
    .map((stem) => stem?.element || stem?.stemElement || stem?.elementName)
    .filter(Boolean);
}

function getSpouseStar({ gender, dayElement }) {
  if (!dayElement) {
    return {
      element: null,
      role: "Partner Star",
      source: null,
      interpretation:
        "Unable to determine the partner star because the Day Master element is missing.",
    };
  }

  if (gender === "Female") {
    const element = getOfficerElement(dayElement);

    return {
      element,
      role: "Partner Star",
      source: "Officer Star",
      interpretation: `${element} represents the partner/spouse star in this chart. It reflects relationship themes connected to commitment, partner dynamics, emotional security and long-term relational patterns.`,
    };
  }

  if (gender === "Male") {
    const element = getWealthElement(dayElement);

    return {
      element,
      role: "Partner Star",
      source: "Wealth Star",
      interpretation: `${element} represents the partner/spouse star in this chart. It reflects relationship themes connected to attraction, partnership, emotional investment and long-term relational patterns.`,
    };
  }

  return {
    element: null,
    role: "Partner Star",
    source: "Unspecified",
    interpretation:
      "Gender was not specified, so the traditional spouse-star element is not assigned here. Relationship interpretation should use the neutral relationship style, partner dynamics and timing notes.",
  };
}

function analyseSpouseStarPresence({ pillars, spouseStar }) {
  const spouseElement = spouseStar?.element;

  if (!spouseElement) {
    return {
      visibleInStems: [],
      presentInBranches: [],
      hiddenInBranches: [],
      presenceLevel: "Unknown",
      interpretation:
        "Partner star presence cannot be checked without a partner star element.",
    };
  }

  const pillarEntries = [
    ["year", pillars?.year],
    ["month", pillars?.month],
    ["day", pillars?.day],
    ["hour", pillars?.hour],
  ].filter(([, pillar]) => Boolean(pillar));

  const visibleInStems = [];
  const presentInBranches = [];
  const hiddenInBranches = [];

  for (const [pillarName, pillar] of pillarEntries) {
    if (getStemElement(pillar) === spouseElement) {
      visibleInStems.push(pillarName);
    }

    if (getBranchElement(pillar) === spouseElement) {
      presentInBranches.push(pillarName);
    }

    if (getHiddenStemElements(pillar).includes(spouseElement)) {
      hiddenInBranches.push(pillarName);
    }
  }

  let presenceLevel = "Absent";

  if (visibleInStems.length > 0) {
    presenceLevel = "Visible";
  } else if (presentInBranches.length > 0) {
    presenceLevel = "Rooted";
  } else if (hiddenInBranches.length > 0) {
    presenceLevel = "Hidden";
  }

  const interpretationMap = {
    Visible:
      "The partner star is visible in the chart, so relationship themes tend to be more noticeable, conscious or externally expressed.",
    Rooted:
      "The partner star is present through branch energy, suggesting relationship themes exist but may develop through circumstances, timing or lived experience.",
    Hidden:
      "The partner star is hidden in the branches, suggesting relationship themes may be private, delayed, subtle or activated through timing.",
    Absent:
      "The partner star is not strongly present in the natal chart, so relationship themes may depend more on luck cycles, annual timing, personal readiness and conscious choices.",
    Unknown: "Partner star presence cannot be evaluated.",
  };

  return {
    visibleInStems,
    presentInBranches,
    hiddenInBranches,
    presenceLevel,
    interpretation: interpretationMap[presenceLevel],
  };
}

function buildRelationshipStyle({ mainStructure, dayStatus }) {
  const strengths = [];
  const cautions = [];

  if (mainStructure === "Connectors") {
    strengths.push(
      "You build relationships through communication, shared experiences and emotional responsiveness."
    );
    cautions.push(
      "Avoid assuming that closeness must always be maintained through constant interaction."
    );
  }

  if (mainStructure === "Thinkers") {
    strengths.push(
      "You value mental connection, thoughtful conversation and emotional understanding."
    );
    cautions.push(
      "Avoid over-analysing relationship signals before allowing the bond to develop naturally."
    );
  }

  if (mainStructure === "Supporters") {
    strengths.push(
      "You bring loyalty, care and emotional consistency into relationships."
    );
    cautions.push(
      "Avoid over-giving or becoming responsible for the other person's emotional stability."
    );
  }

  if (mainStructure === "Creators") {
    strengths.push(
      "You need freedom, expression and emotional authenticity in relationships."
    );
    cautions.push("Avoid withdrawing when you feel misunderstood.");
  }

  if (mainStructure === "Managers") {
    strengths.push(
      "You value reliability, commitment and clear relationship direction."
    );
    cautions.push("Avoid trying to control the pace or outcome too early.");
  }

  if (dayStatus === "Excessive") {
    cautions.push(
      "Because the Day Master is strong, soften control and allow space for mutual emotional exchange."
    );
  }

  if (dayStatus === "Under-supported") {
    cautions.push(
      "Because the Day Master is under-supported, avoid depending too heavily on the relationship for confidence or security."
    );
  }

  return {
    strengths,
    cautions,
    advice:
      strengths[0] ||
      "Relationship growth improves when communication, timing and emotional honesty are balanced.",
  };
}

function buildPartnerDynamics({ spouseStar, primaryUsefulGod }) {
  const traits = {
    Wood: "You tend toward a partner dynamic that feels principled, growth-oriented and emotionally sincere.",
    Fire: "You tend toward a partner dynamic that feels warm, expressive, encouraging and emotionally present.",
    Earth: "You tend toward a partner dynamic that feels steady, grounded, patient and dependable.",
    Metal: "You tend toward a partner dynamic that feels clear, disciplined, responsible and decisive.",
    Water: "You tend toward a partner dynamic that feels adaptable, thoughtful, calm and emotionally perceptive.",
  };

  const favourablePartnerTraits = spouseStar?.element
    ? [traits[spouseStar.element]].filter(Boolean)
    : [];

  const potentialChallenges = [];

  if (
    spouseStar?.element &&
    primaryUsefulGod &&
    spouseStar.element !== primaryUsefulGod
  ) {
    potentialChallenges.push(
      `In this chart, ${spouseStar.element} energy is the partner star — the element that naturally represents relationship and spouse energy. Because ${primaryUsefulGod} — not ${spouseStar.element} — is what supports your own growth, relationships can sometimes feel like they pull in a slightly different direction from personal ambitions. This is healthy self-awareness: the right partner brings complementary energy, not identical energy.`
    );
  }

  return {
    favourablePartnerTraits,
    potentialChallenges,
    advice:
      favourablePartnerTraits[0] ||
      "A suitable relationship should support both emotional safety and personal growth.",
  };
}

function buildTimingNotes({
  spouseStar,
  annualStemElement,
  annualBranchElement,
  cautionElements,
}) {
  const annualElements = [annualStemElement, annualBranchElement].filter(Boolean);

  if (!spouseStar?.element || annualElements.length === 0) {
    return {
      annualInfluence:
        "Annual relationship timing cannot be evaluated because annual element data is incomplete.",
      caution: "",
      activationLevel: "Unknown",
      activatedBy: [],
    };
  }

  const activatedBy = annualElements.filter((el) => el === spouseStar.element);

  if (activatedBy.length > 0) {
    return {
      annualInfluence: `${spouseStar.element} appears in the annual energy, so relationship or partner themes may be more visible this year.`,
      caution:
        "Relationship activation does not automatically mean stable commitment; it means the theme is more noticeable and should be handled consciously.",
      activationLevel: "Strong",
      activatedBy,
    };
  }

  const supportingElements = annualElements.filter(
    (el) => GENERATES[el] === spouseStar.element
  );

  if (supportingElements.length > 0) {
    return {
      annualInfluence: `${supportingElements.join(
        ", "
      )} supports the partner star ${spouseStar.element}, so relationship themes may develop indirectly through support, exposure or emotional readiness.`,
      caution:
        "This is a softer form of activation. It may bring preparation, attraction or emotional openings rather than direct commitment.",
      activationLevel: "Moderate",
      activatedBy: supportingElements,
    };
  }

  const cautionHits = [...new Set(
  annualElements.filter((el) => cautionElements.includes(el))
)];

  if (cautionHits.length > 0) {
    return {
      annualInfluence: `${cautionHits.join(
        ", "
      )} is also part of the caution elements, so relationship decisions may need extra grounding this year.`,
      caution:
        "Avoid rushing into relationship decisions from pressure, loneliness, fantasy or emotional overwhelm.",
      activationLevel: "Caution",
      activatedBy: cautionHits,
    };
  }

  return {
    annualInfluence:
      "The annual elements do not directly activate the partner star this year.",
    caution:
      "Relationship development may still happen, but it is less directly highlighted by the annual element pattern.",
    activationLevel: "Neutral",
    activatedBy: [],
  };
}

export function buildRelationshipEngineV2({
  input,
  pillars,
  dayMasterStrengthV4,
  structureScoringV2,
  usefulGodV4,
  tenProfileScoringV2,
  annualOverlayV3,
}) {
  const gender = normalizeGender(input?.gender);

  const dayElement =
    dayMasterStrengthV4?.dayElement || pillars?.day?.stem?.element || null;

  const dayStatus = dayMasterStrengthV4?.status || null;
  const mainStructure = structureScoringV2?.mainStructure?.name || null;
  const dominantProfile = tenProfileScoringV2?.dominantProfile?.name || null;

  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;
  const cautionElements = usefulGodV4?.cautionElements || [];

  const { stemElement: annualStemElement, branchElement: annualBranchElement } =
    getAnnualElements(annualOverlayV3);

  const spouseStar = getSpouseStar({ gender, dayElement });

  const spouseStarPresence = analyseSpouseStarPresence({
    pillars,
    spouseStar,
  });

  const relationshipStyle = buildRelationshipStyle({
    mainStructure,
    dayStatus,
  });

  const partnerDynamics = buildPartnerDynamics({
    spouseStar,
    primaryUsefulGod,
  });

  const timingNotes = buildTimingNotes({
    spouseStar,
    annualStemElement,
    annualBranchElement,
    cautionElements,
  });

  return {
    version: "relationship-engine-v2",

    gender,

    spouseStar,
    spouseStarPresence,

    relationshipStyle,
    partnerDynamics,
    timingNotes,

    debug: {
      note:
        "RelationshipEngineV2 keeps interpretation mostly neutral. Gender-specific framing is handled by GenderInfluenceV1.",
      dayElement,
      dayStatus,
      mainStructure,
      dominantProfile,
      primaryUsefulGod,
      secondaryUsefulGod,
      annualStemElement,
      annualBranchElement,
      cautionElements,
      dayBranch:
        pillars?.day?.branch?.name || pillars?.day?.branch?.key || null,
    },
  };
}

export default buildRelationshipEngineV2;