// src/engine/relationshipEngineV1.js

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

function getSpouseStar({ gender, dayElement }) {
  if (!dayElement) {
    return {
      element: null,
      role: null,
      interpretation:
        "Unable to determine spouse star because Day Master element is missing.",
    };
  }

  if (gender === "Female") {
    const element = getOfficerElement(dayElement);

    return {
      element,
      role: "Officer / Partner Star",
      interpretation: `${element} represents the partner/spouse star for a female chart because it is the element that controls the Day Master.`,
    };
  }

  if (gender === "Male") {
    const element = getWealthElement(dayElement);

    return {
      element,
      role: "Wealth / Partner Star",
      interpretation: `${element} represents the partner/spouse star for a male chart because it is the element controlled by the Day Master.`,
    };
  }

  return {
    element: null,
    role: "Unspecified",
    interpretation:
      "Gender was not specified, so spouse-star interpretation is not applied.",
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
  const favourablePartnerTraits = [];
  const potentialChallenges = [];

  if (spouseStar.element === "Wood") {
    favourablePartnerTraits.push(
      "A partner who is principled, growth-oriented and emotionally sincere."
    );
  }

  if (spouseStar.element === "Fire") {
    favourablePartnerTraits.push(
      "A partner who is warm, expressive, encouraging and emotionally present."
    );
  }

  if (spouseStar.element === "Earth") {
    favourablePartnerTraits.push(
      "A partner who is steady, grounded, patient and dependable."
    );
  }

  if (spouseStar.element === "Metal") {
    favourablePartnerTraits.push(
      "A partner who is clear, disciplined, responsible and decisive."
    );
  }

  if (spouseStar.element === "Water") {
    favourablePartnerTraits.push(
      "A partner who is adaptable, thoughtful, calm and emotionally perceptive."
    );
  }

  if (
    spouseStar.element &&
    primaryUsefulGod &&
    spouseStar.element !== primaryUsefulGod
  ) {
    potentialChallenges.push(
      `The spouse star is ${spouseStar.element}, while the current useful element is ${primaryUsefulGod}. This may show attraction to relationship patterns that require balancing with your personal growth needs.`
    );
  }

  return {
    favourablePartnerTraits,
    potentialChallenges,
    advice:
      favourablePartnerTraits[0] ||
      "A suitable partner should support both emotional safety and personal growth.",
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
      )} supports the spouse star ${spouseStar.element}, so relationship themes may develop indirectly through support, exposure, or emotional readiness.`,
      caution:
        "This is a softer form of activation. It may bring preparation, attraction or emotional openings rather than direct commitment.",
      activationLevel: "Moderate",
      activatedBy: supportingElements,
    };
  }

  const cautionHits = annualElements.filter((el) =>
    cautionElements.includes(el)
  );

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
      "The annual elements do not directly activate the spouse star this year.",
    caution:
      "Relationship development may still happen, but it is less directly highlighted by the annual element pattern.",
    activationLevel: "Neutral",
    activatedBy: [],
  };
}

export function buildRelationshipEngineV1({
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

  const spouseStar = getSpouseStar({
    gender,
    dayElement,
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
    version: "relationship-engine-v1",

    gender,

    spouseStar,

    relationshipStyle,

    partnerDynamics,

    timingNotes,

    debug: {
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

export default buildRelationshipEngineV1;