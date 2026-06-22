// src/engine/genderInfluenceV1.js

const VERSION = "GenderInfluenceV1";

function normalizeGender(gender) {
  if (!gender || typeof gender !== "string") return "Unspecified";

  const value = gender.trim().toLowerCase();

  if (value === "male" || value === "m") return "Male";
  if (value === "female" || value === "f") return "Female";

  // "other", "non-binary", "nonbinary", "nb", "prefer not to say", etc. are
  // all read with the neutral relationship lens. In BaZi, the day-master and
  // ten-gods analysis does not depend on gender; only the spouse-star /
  // relationship-role framing does, and for these we stay gender-neutral.
  return "Unspecified";
}

function getInterpretationMode(gender) {
  if (gender === "Male") {
    return "maleRelationshipLens";
  }

  if (gender === "Female") {
    return "femaleRelationshipLens";
  }

  return "neutralRelationshipLens";
}

function getRelationshipLens(gender, relationshipEngineV2 = {}) {
  const spouseStar = relationshipEngineV2?.spouseStar || null;
  const spouseStarPresence = relationshipEngineV2?.spouseStarPresence || null;
  const timingNotes = relationshipEngineV2?.timingNotes || [];

  if (gender === "Male") {
    return {
      summary:
        "Relationship interpretation is framed through how partnership, attraction, responsibility, and emotional investment are expressed.",
      spouseStar,
      spouseStarPresence,
      timingNotes,
      lens:
        "For male charts, spouse-star themes are read more through partner attraction, relationship responsibility, and how the chart engages with commitment.",
    };
  }

  if (gender === "Female") {
    return {
      summary:
        "Relationship interpretation is framed through emotional security, partner quality, commitment patterns, and how support is received or negotiated.",
      spouseStar,
      spouseStarPresence,
      timingNotes,
      lens:
        "For female charts, spouse-star themes are read more through partner role, emotional safety, expectations in commitment, and relationship stability.",
    };
  }

  return {
    summary:
      "Relationship interpretation is kept gender-neutral and focused on relational patterns, communication, attraction, and commitment tendencies.",
    spouseStar,
    spouseStarPresence,
    timingNotes,
    lens:
      "Without a specified gender, spouse-star themes are interpreted neutrally without assigning traditional partner-role assumptions.",
  };
}

function getCommunicationStyle(
  gender,
  tenProfileScoringV2 = {},
  structureScoringV2 = {}
) {
  const dominantProfile =
    tenProfileScoringV2?.dominantProfile ||
    tenProfileScoringV2?.topProfile ||
    null;

  const dominantStructure =
    structureScoringV2?.dominantStructure ||
    structureScoringV2?.structure ||
    structureScoringV2?.mainStructure ||
    null;

  let base =
    "Communication style is interpreted from the chart’s dominant personality profile and structure, not from gender alone.";

  if (gender === "Male") {
    base +=
      " Gender lens may slightly emphasize how directness, initiative, protection, or responsibility are expressed in relationships.";
  } else if (gender === "Female") {
    base +=
      " Gender lens may slightly emphasize how emotional receptivity, expectations, boundaries, and relational reassurance are expressed.";
  } else {
    base +=
      " A neutral lens is used, avoiding gendered assumptions.";
  }

  return {
    summary: base,
    dominantProfile,
    dominantStructure,
  };
}

function getRelationshipExpectations(gender, relationshipEngineV2 = {}) {
  const spouseStarPresence = relationshipEngineV2?.spouseStarPresence || null;

  if (gender === "Male") {
    return {
      summary:
        "May expect partnership to bring emotional grounding, loyalty, shared direction, and practical commitment.",
      spouseStarPresence,
    };
  }

  if (gender === "Female") {
    return {
      summary:
        "May expect partnership to bring emotional safety, reliability, protection, clarity, and long-term commitment.",
      spouseStarPresence,
    };
  }

  return {
    summary:
      "Relationship expectations are interpreted neutrally through the spouse-star condition and wider relationship pattern.",
    spouseStarPresence,
  };
}

function getPartnerRoleTendency(gender, relationshipEngineV2 = {}) {
  const spouseStar = relationshipEngineV2?.spouseStar || null;
  const spouseStarPresence = relationshipEngineV2?.spouseStarPresence || null;

  if (gender === "Male") {
    return {
      summary:
        "Partner role tendency is read through how the chart approaches responsibility, attraction, stability, and emotional investment.",
      spouseStar,
      spouseStarPresence,
    };
  }

  if (gender === "Female") {
    return {
      summary:
        "Partner role tendency is read through what kind of partner dynamic feels safe, stable, supportive, and emotionally sustainable.",
      spouseStar,
      spouseStarPresence,
    };
  }

  return {
    summary:
      "Partner role tendency is interpreted without gendered assumptions, focusing instead on relational needs and chart dynamics.",
    spouseStar,
    spouseStarPresence,
  };
}

export function buildGenderInfluenceV1({
  input = {},
  relationshipEngineV2 = {},
  tenProfileScoringV2 = {},
  structureScoringV2 = {},
} = {}) {
  const gender = normalizeGender(input?.gender);

  return {
    version: VERSION,
    gender,
    interpretationMode: getInterpretationMode(gender),

    relationshipLens: getRelationshipLens(gender, relationshipEngineV2),

    communicationStyle: getCommunicationStyle(
      gender,
      tenProfileScoringV2,
      structureScoringV2
    ),

    relationshipExpectations: getRelationshipExpectations(
      gender,
      relationshipEngineV2
    ),

    partnerRoleTendency: getPartnerRoleTendency(
      gender,
      relationshipEngineV2
    ),

    debug: {
      genderInput: input?.gender ?? null,
      normalizedGender: gender,
      affectsCoreChart: false,
      affectsRelationshipInterpretationOnly: true,
      dependencies: {
        hasRelationshipEngineV2: Boolean(relationshipEngineV2),
        hasTenProfileScoringV2: Boolean(tenProfileScoringV2),
        hasStructureScoringV2: Boolean(structureScoringV2),
      },
    },
  };
}

export const genderInfluenceV1 = buildGenderInfluenceV1;

export default buildGenderInfluenceV1;