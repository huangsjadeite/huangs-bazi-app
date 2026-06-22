// TopStrengthsV1.js
// Consumer-facing strengths engine.
// No UI logic. No React. No BaZi jargon in output.
// Generates "Your Natural Advantages" based on Ten Profiles, Structure,
// Daymaster Strength and Useful God.

const PROFILE_ALIASES = {
  Friend: ["Friend", "Companion", "Parallel"],
  RobWealth: ["Rob Wealth", "RobWealth", "Competitor", "Warrior"],
  EatingGod: ["Eating God", "EatingGod", "Creator"],
  HurtingOfficer: ["Hurting Officer", "HurtingOfficer", "Performer"],
  DirectWealth: ["Direct Wealth", "DirectWealth", "Provider"],
  IndirectWealth: ["Indirect Wealth", "IndirectWealth", "Pioneer"],
  DirectOfficer: ["Direct Officer", "DirectOfficer", "Leader"],
  SevenKillings: ["Seven Killings", "SevenKillings", "Challenger"],
  DirectResource: ["Direct Resource", "DirectResource", "Supporter"],
  IndirectResource: ["Indirect Resource", "IndirectResource", "Thinker"],
};

const STRENGTH_LIBRARY = {
  BUILDING_TRUST: {
    title: "Building Trust",
    description:
      "You naturally create confidence through consistency, sincerity and the way you show up over time.",
  },
  LONG_TERM_PLANNING: {
    title: "Long-Term Planning",
    description:
      "You are able to think beyond the present moment and make choices that support future stability.",
  },
  REMAINING_CALM: {
    title: "Remaining Calm Under Pressure",
    description:
      "You can stay steady when situations become stressful, which helps others feel more secure around you.",
  },
  TAKING_RESPONSIBILITY: {
    title: "Taking Responsibility",
    description:
      "You are willing to step up when something matters, especially when others need direction or support.",
  },
  EMOTIONAL_AWARENESS: {
    title: "Emotional Awareness",
    description:
      "You are sensitive to subtle feelings, moods and relationship dynamics that others may overlook.",
  },
  CREATIVE_EXPRESSION: {
    title: "Creative Expression",
    description:
      "You have a natural ability to express ideas, feelings or personality in a way that feels engaging and memorable.",
  },
  INDEPENDENT_THINKING: {
    title: "Independent Thinking",
    description:
      "You are not easily shaped by other people’s opinions. You need to understand things for yourself before deciding.",
  },
  STRATEGIC_JUDGEMENT: {
    title: "Strategic Judgement",
    description:
      "You can assess situations carefully and notice what is practical, useful or worth pursuing.",
  },
  CONNECTING_WITH_PEOPLE: {
    title: "Connecting With People",
    description:
      "You have a natural ability to build rapport, create familiarity and make people feel included.",
  },
  GROWING_OPPORTUNITIES: {
    title: "Growing Opportunities",
    description:
      "You are good at spotting potential, opening new paths and turning movement into progress.",
  },
  PROTECTING_WHAT_MATTERS: {
    title: "Protecting What Matters",
    description:
      "You have a strong instinct to defend your values, your people and the future you are building.",
  },
  LEARNING_AND_REFLECTING: {
    title: "Learning And Reflecting",
    description:
      "You grow through observation, self-awareness and the ability to understand things beneath the surface.",
  },
  PRACTICAL_PROBLEM_SOLVING: {
    title: "Practical Problem Solving",
    description:
      "You are able to simplify problems and focus on what can actually be done next.",
  },
  PERSONAL_MAGNETISM: {
    title: "Personal Magnetism",
    description:
      "You can attract attention when you express yourself with confidence, warmth and authenticity.",
  },
  CONSISTENT_SUPPORT: {
    title: "Consistent Support",
    description:
      "You are able to provide steady emotional or practical support, especially when people need reliability.",
  },
};

const DEFAULT_STRENGTHS = [
  {
    key: "BUILDING_TRUST",
    ...STRENGTH_LIBRARY.BUILDING_TRUST,
  },
  {
    key: "PRACTICAL_PROBLEM_SOLVING",
    ...STRENGTH_LIBRARY.PRACTICAL_PROBLEM_SOLVING,
  },
  {
    key: "LONG_TERM_PLANNING",
    ...STRENGTH_LIBRARY.LONG_TERM_PLANNING,
  },
];

function normalizeKey(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getProfileScore(tenProfiles = {}, profileKey) {
  const aliases = PROFILE_ALIASES[profileKey] || [profileKey];

  for (const alias of aliases) {
    if (tenProfiles[alias] !== undefined) {
      return Number(tenProfiles[alias]) || 0;
    }
  }

  const normalizedAliases = aliases.map(normalizeKey);

  for (const [key, value] of Object.entries(tenProfiles || {})) {
    if (normalizedAliases.includes(normalizeKey(key))) {
      return Number(value) || 0;
    }
  }

  return 0;
}

function getTopProfiles(tenProfiles = {}) {
  return Object.keys(PROFILE_ALIASES)
    .map((key) => ({
      key,
      score: getProfileScore(tenProfiles, key),
    }))
    .sort((a, b) => b.score - a.score);
}

function getStructureName(structure = {}) {
  if (typeof structure === "string") return structure;

  return (
    structure?.name ||
    structure?.primary ||
    structure?.type ||
    structure?.dominantStructure ||
    ""
  );
}

function getStrengthCategory(daymasterStrength = {}) {
  if (typeof daymasterStrength === "string") return daymasterStrength;

  return (
    daymasterStrength?.category ||
    daymasterStrength?.label ||
    daymasterStrength?.strengthCategory ||
    daymasterStrength?.level ||
    ""
  );
}

function getStrengthScore(daymasterStrength = {}) {
  return Number(
    daymasterStrength?.score ??
      daymasterStrength?.finalScore ??
      daymasterStrength?.percentage ??
      0
  );
}

function isStrongDaymaster(daymasterStrength = {}) {
  const category = normalizeKey(getStrengthCategory(daymasterStrength));
  const score = getStrengthScore(daymasterStrength);

  return (
    category.includes("strong") ||
    category.includes("verystrong") ||
    score >= 60
  );
}

function isWeakDaymaster(daymasterStrength = {}) {
  const category = normalizeKey(getStrengthCategory(daymasterStrength));
  const score = getStrengthScore(daymasterStrength);

  return category.includes("weak") || (score > 0 && score < 45);
}

function getUsefulGodElements(usefulGod = {}) {
  if (Array.isArray(usefulGod)) return usefulGod;

  return (
    usefulGod?.elements ||
    usefulGod?.favourableElements ||
    usefulGod?.favorableElements ||
    usefulGod?.supportiveElements ||
    usefulGod?.usefulElements ||
    []
  );
}

function includesUsefulElement(usefulGod = {}, element) {
  return getUsefulGodElements(usefulGod)
    .map((item) => normalizeKey(item?.element || item?.name || item))
    .includes(normalizeKey(element));
}

function scoreStrengths({
  tenProfiles = {},
  structure = {},
  daymasterStrength = {},
  usefulGod = {},
}) {
  const score = {};

  const add = (key, points) => {
    score[key] = (score[key] || 0) + points;
  };

  const friend = getProfileScore(tenProfiles, "Friend");
  const robWealth = getProfileScore(tenProfiles, "RobWealth");
  const eatingGod = getProfileScore(tenProfiles, "EatingGod");
  const hurtingOfficer = getProfileScore(tenProfiles, "HurtingOfficer");
  const directWealth = getProfileScore(tenProfiles, "DirectWealth");
  const indirectWealth = getProfileScore(tenProfiles, "IndirectWealth");
  const directOfficer = getProfileScore(tenProfiles, "DirectOfficer");
  const sevenKillings = getProfileScore(tenProfiles, "SevenKillings");
  const directResource = getProfileScore(tenProfiles, "DirectResource");
  const indirectResource = getProfileScore(tenProfiles, "IndirectResource");

  // Ten Profile influence
  add("CONNECTING_WITH_PEOPLE", friend * 1.2);
  add("CONSISTENT_SUPPORT", friend * 0.9);
  add("INDEPENDENT_THINKING", robWealth * 1.2);
  add("PROTECTING_WHAT_MATTERS", robWealth * 0.8);

  add("CREATIVE_EXPRESSION", eatingGod * 1.2);
  add("PERSONAL_MAGNETISM", eatingGod * 0.8);
  add("PERSONAL_MAGNETISM", hurtingOfficer * 1.2);
  add("CREATIVE_EXPRESSION", hurtingOfficer * 0.9);

  add("LONG_TERM_PLANNING", directWealth * 1.2);
  add("BUILDING_TRUST", directWealth * 1.0);
  add("GROWING_OPPORTUNITIES", indirectWealth * 1.3);
  add("STRATEGIC_JUDGEMENT", indirectWealth * 0.8);

  add("TAKING_RESPONSIBILITY", directOfficer * 1.2);
  add("LONG_TERM_PLANNING", directOfficer * 0.9);
  add("REMAINING_CALM", directOfficer * 0.8);

  add("PROTECTING_WHAT_MATTERS", sevenKillings * 1.2);
  add("REMAINING_CALM", sevenKillings * 0.9);
  add("TAKING_RESPONSIBILITY", sevenKillings * 0.8);

  add("CONSISTENT_SUPPORT", directResource * 1.2);
  add("LEARNING_AND_REFLECTING", directResource * 0.8);
  add("LEARNING_AND_REFLECTING", indirectResource * 1.3);
  add("EMOTIONAL_AWARENESS", indirectResource * 1.0);

  // Top profile bonus
  const topProfiles = getTopProfiles(tenProfiles).slice(0, 3);

  topProfiles.forEach((profile, index) => {
    const bonus = index === 0 ? 16 : index === 1 ? 10 : 6;

    switch (profile.key) {
      case "Friend":
        add("CONNECTING_WITH_PEOPLE", bonus);
        break;
      case "RobWealth":
        add("INDEPENDENT_THINKING", bonus);
        break;
      case "EatingGod":
        add("CREATIVE_EXPRESSION", bonus);
        break;
      case "HurtingOfficer":
        add("PERSONAL_MAGNETISM", bonus);
        break;
      case "DirectWealth":
        add("LONG_TERM_PLANNING", bonus);
        break;
      case "IndirectWealth":
        add("GROWING_OPPORTUNITIES", bonus);
        break;
      case "DirectOfficer":
        add("TAKING_RESPONSIBILITY", bonus);
        break;
      case "SevenKillings":
        add("PROTECTING_WHAT_MATTERS", bonus);
        break;
      case "DirectResource":
        add("CONSISTENT_SUPPORT", bonus);
        break;
      case "IndirectResource":
        add("LEARNING_AND_REFLECTING", bonus);
        break;
      default:
        break;
    }
  });

  // Structure influence
  const structureName = normalizeKey(getStructureName(structure));

  if (structureName.includes("connector")) {
    add("CONNECTING_WITH_PEOPLE", 18);
    add("BUILDING_TRUST", 10);
    add("CONSISTENT_SUPPORT", 8);
  }

  if (structureName.includes("thinker")) {
    add("LEARNING_AND_REFLECTING", 18);
    add("STRATEGIC_JUDGEMENT", 12);
    add("EMOTIONAL_AWARENESS", 8);
  }

  if (structureName.includes("supporter")) {
    add("CONSISTENT_SUPPORT", 18);
    add("BUILDING_TRUST", 12);
    add("REMAINING_CALM", 8);
  }

  if (structureName.includes("leader")) {
    add("TAKING_RESPONSIBILITY", 18);
    add("PROTECTING_WHAT_MATTERS", 10);
    add("LONG_TERM_PLANNING", 8);
  }

  if (structureName.includes("creator")) {
    add("CREATIVE_EXPRESSION", 18);
    add("PERSONAL_MAGNETISM", 10);
    add("GROWING_OPPORTUNITIES", 8);
  }

  if (structureName.includes("performer")) {
    add("PERSONAL_MAGNETISM", 18);
    add("CREATIVE_EXPRESSION", 12);
    add("CONNECTING_WITH_PEOPLE", 8);
  }

  if (structureName.includes("pioneer")) {
    add("GROWING_OPPORTUNITIES", 18);
    add("STRATEGIC_JUDGEMENT", 10);
    add("INDEPENDENT_THINKING", 8);
  }

  // Daymaster strength influence
  if (isStrongDaymaster(daymasterStrength)) {
    add("REMAINING_CALM", 12);
    add("TAKING_RESPONSIBILITY", 10);
    add("INDEPENDENT_THINKING", 10);
    add("PROTECTING_WHAT_MATTERS", 8);
  }

  if (isWeakDaymaster(daymasterStrength)) {
    add("EMOTIONAL_AWARENESS", 12);
    add("CONSISTENT_SUPPORT", 10);
    add("LEARNING_AND_REFLECTING", 8);
    add("BUILDING_TRUST", 8);
  }

  // Useful God influence
  if (includesUsefulElement(usefulGod, "Water")) {
    add("EMOTIONAL_AWARENESS", 10);
    add("LEARNING_AND_REFLECTING", 8);
    add("REMAINING_CALM", 8);
  }

  if (includesUsefulElement(usefulGod, "Wood")) {
    add("GROWING_OPPORTUNITIES", 10);
    add("LEARNING_AND_REFLECTING", 8);
    add("CONNECTING_WITH_PEOPLE", 6);
  }

  if (includesUsefulElement(usefulGod, "Fire")) {
    add("PERSONAL_MAGNETISM", 10);
    add("CREATIVE_EXPRESSION", 8);
    add("CONNECTING_WITH_PEOPLE", 6);
  }

  if (includesUsefulElement(usefulGod, "Earth")) {
    add("BUILDING_TRUST", 10);
    add("LONG_TERM_PLANNING", 8);
    add("CONSISTENT_SUPPORT", 6);
  }

  if (includesUsefulElement(usefulGod, "Metal")) {
    add("STRATEGIC_JUDGEMENT", 10);
    add("PRACTICAL_PROBLEM_SOLVING", 8);
    add("TAKING_RESPONSIBILITY", 6);
  }

  return score;
}

function buildReason(key, context = {}) {
  const { structure = {}, daymasterStrength = {}, usefulGod = {} } = context;
  const structureName = normalizeKey(getStructureName(structure));

  const reasons = {
    BUILDING_TRUST:
      "This comes from your steady nature and your ability to make people feel that they can rely on you.",
    LONG_TERM_PLANNING:
      "This comes from your ability to think ahead instead of only reacting to what is happening now.",
    REMAINING_CALM:
      "This comes from your capacity to stay composed when situations require patience and judgement.",
    TAKING_RESPONSIBILITY:
      "This comes from your natural willingness to step up when something needs direction.",
    EMOTIONAL_AWARENESS:
      "This comes from your sensitivity to mood, timing and the emotional atmosphere around you.",
    CREATIVE_EXPRESSION:
      "This comes from your ability to express yourself in a way that feels personal and memorable.",
    INDEPENDENT_THINKING:
      "This comes from your need to make choices based on your own judgement, not just outside pressure.",
    STRATEGIC_JUDGEMENT:
      "This comes from your ability to evaluate what is useful, realistic and worth your energy.",
    CONNECTING_WITH_PEOPLE:
      "This comes from your ability to create familiarity, trust and emotional rapport with others.",
    GROWING_OPPORTUNITIES:
      "This comes from your ability to notice potential and turn movement into progress.",
    PROTECTING_WHAT_MATTERS:
      "This comes from your instinct to defend the people, values and future that matter to you.",
    LEARNING_AND_REFLECTING:
      "This comes from your ability to observe, understand and improve through self-awareness.",
    PRACTICAL_PROBLEM_SOLVING:
      "This comes from your ability to simplify complicated situations into practical next steps.",
    PERSONAL_MAGNETISM:
      "This comes from your expressive presence and the way people notice you when you are confident.",
    CONSISTENT_SUPPORT:
      "This comes from your ability to provide steady care, patience and reliability over time.",
  };

  let reason = reasons[key] || "";

  if (structureName.includes("connector") && key === "CONNECTING_WITH_PEOPLE") {
    reason += " Your chart especially supports relationship-based growth and people-facing opportunities.";
  }

  if (structureName.includes("thinker") && key === "LEARNING_AND_REFLECTING") {
    reason += " You may grow strongly through observation, analysis and inner understanding.";
  }

  if (structureName.includes("supporter") && key === "CONSISTENT_SUPPORT") {
    reason += " People may naturally look to you when they need steadiness or reassurance.";
  }

  if (isStrongDaymaster(daymasterStrength) && key === "TAKING_RESPONSIBILITY") {
    reason += " Because your personal energy is strong, others may sense that you can handle pressure.";
  }

  if (isWeakDaymaster(daymasterStrength) && key === "EMOTIONAL_AWARENESS") {
    reason += " Because you are more sensitive to your environment, your emotional radar can be one of your advantages.";
  }

  if (includesUsefulElement(usefulGod, "Earth") && key === "BUILDING_TRUST") {
    reason += " Grounded, steady choices help you access this strength even more.";
  }

  if (includesUsefulElement(usefulGod, "Water") && key === "REMAINING_CALM") {
    reason += " Calmness and emotional flow help you use this strength more naturally.";
  }

  if (includesUsefulElement(usefulGod, "Fire") && key === "PERSONAL_MAGNETISM") {
    reason += " Warmth and visibility help this side of you become more noticeable.";
  }

  if (includesUsefulElement(usefulGod, "Wood") && key === "GROWING_OPPORTUNITIES") {
    reason += " Growth, learning and forward movement help this strength develop further.";
  }

  if (includesUsefulElement(usefulGod, "Metal") && key === "STRATEGIC_JUDGEMENT") {
    reason += " Clarity, standards and structure help sharpen this advantage.";
  }

  return reason;
}

export function buildTopStrengthsV1(input = {}) {
  const {
    tenProfiles = {},
    structure = {},
    daymasterStrength = {},
    usefulGod = {},
    limit = 3,
  } = input;

  const scored = scoreStrengths({
    tenProfiles,
    structure,
    daymasterStrength,
    usefulGod,
  });

  const ranked = Object.entries(scored)
    .filter(([, score]) => score > 0)
    .map(([key, score]) => ({
      key,
      score: Math.round(score),
      ...STRENGTH_LIBRARY[key],
      reason: buildReason(key, {
        tenProfiles,
        structure,
        daymasterStrength,
        usefulGod,
      }),
    }))
    .filter((item) => item.title && item.description)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return DEFAULT_STRENGTHS.slice(0, limit).map((item) => ({
      ...item,
      score: 0,
      source: "TopStrengthsV1",
      reason:
        "This is a foundational strength that helps create stability, trust and practical progress.",
    }));
  }

  return ranked.slice(0, limit).map((item, index) => ({
    rank: index + 1,
    source: "TopStrengthsV1",
    ...item,
  }));
}

export default buildTopStrengthsV1;