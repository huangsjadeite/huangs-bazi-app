// FocusRankingV1.js
// Consumer-facing 2026 priorities engine.
// No UI logic. No React. No traditional BaZi jargon in output.
// Generates "Your 2026 Priorities" ranked across:
// Career, Wealth, Relationship, Wellness.

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

const AREA_LIBRARY = {
  CAREER: {
    area: "Career & Visibility",
    description:
      "This area is about work direction, reputation, confidence, leadership, visibility and how you show your value to the world.",
  },
  WEALTH: {
    area: "Wealth Growth",
    description:
      "This area is about income, opportunities, business decisions, money habits and how you turn effort into tangible results.",
  },
  RELATIONSHIP: {
    area: "Relationships",
    description:
      "This area is about emotional connection, trust, communication, social support and the people who influence your growth.",
  },
  WELLNESS: {
    area: "Wellness & Balance",
    description:
      "This area is about energy management, emotional steadiness, rest, boundaries and your ability to stay grounded.",
  },
};

const DEFAULT_RANKING = [
  {
    key: "CAREER",
    rank: 1,
    area: AREA_LIBRARY.CAREER.area,
    description: AREA_LIBRARY.CAREER.description,
    priority: "Primary Focus",
    reason:
      "This is the area where your direction, confidence and outer growth need the most conscious attention.",
    action:
      "Focus on showing up clearly, building credibility and making your next step easier for others to understand.",
  },
  {
    key: "RELATIONSHIP",
    rank: 2,
    area: AREA_LIBRARY.RELATIONSHIP.area,
    description: AREA_LIBRARY.RELATIONSHIP.description,
    priority: "Important Support",
    reason:
      "The people around you can strongly influence your emotional clarity and sense of direction.",
    action:
      "Choose relationships that feel steady, sincere and supportive of your growth.",
  },
  {
    key: "WEALTH",
    rank: 3,
    area: AREA_LIBRARY.WEALTH.area,
    description: AREA_LIBRARY.WEALTH.description,
    priority: "Growth Area",
    reason:
      "Money growth improves when your choices are consistent and connected to clear opportunities.",
    action:
      "Build practical systems around income, spending and opportunity selection.",
  },
  {
    key: "WELLNESS",
    rank: 4,
    area: AREA_LIBRARY.WELLNESS.area,
    description: AREA_LIBRARY.WELLNESS.description,
    priority: "Maintenance Area",
    reason:
      "Your energy needs regular care so that progress does not become pressure.",
    action:
      "Protect your rest, emotional balance and daily rhythm.",
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

function getAnnualFocusInput(input = {}) {
  return (
    input?.annualOverlay ||
    input?.annual ||
    input?.yearOverlay ||
    input?.currentYear ||
    input?.overlay2026 ||
    {}
  );
}

function getAnnualLifeAreas(input = {}) {
  const annual = getAnnualFocusInput(input);

  return (
    annual?.lifeAreas ||
    annual?.areas ||
    annual?.focusAreas ||
    annual?.priorities ||
    input?.annualLifeAreas ||
    {}
  );
}

function readAreaSignal(lifeAreas = {}, possibleKeys = []) {
  for (const key of possibleKeys) {
    if (lifeAreas[key] !== undefined) return lifeAreas[key];
  }

  const normalizedKeys = possibleKeys.map(normalizeKey);

  for (const [key, value] of Object.entries(lifeAreas || {})) {
    if (normalizedKeys.includes(normalizeKey(key))) {
      return value;
    }
  }

  return null;
}

function signalToScore(signal) {
  if (signal === null || signal === undefined) return 0;

  if (typeof signal === "number") return signal;

  if (typeof signal === "object") {
    const numeric =
      signal?.score ??
      signal?.value ??
      signal?.percentage ??
      signal?.strength ??
      signal?.rankScore;

    if (numeric !== undefined) return Number(numeric) || 0;

    const status =
      signal?.status ||
      signal?.label ||
      signal?.state ||
      signal?.level ||
      signal?.summary ||
      "";

    return signalToScore(status);
  }

  const text = normalizeKey(signal);

  if (text.includes("verystrong")) return 90;
  if (text.includes("strong")) return 75;
  if (text.includes("active")) return 70;
  if (text.includes("high")) return 70;
  if (text.includes("developing")) return 58;
  if (text.includes("moderate")) return 55;
  if (text.includes("balanced")) return 55;
  if (text.includes("steady")) return 52;
  if (text.includes("supportive")) return 50;
  if (text.includes("low")) return 35;
  if (text.includes("weak")) return 30;
  if (text.includes("needbalance")) return 68;
  if (text.includes("needsbalance")) return 68;
  if (text.includes("caution")) return 62;
  if (text.includes("pressure")) return 66;

  return 0;
}

function scoreFocusAreas(input = {}) {
  const {
    tenProfiles = {},
    structure = {},
    daymasterStrength = {},
    usefulGod = {},
  } = input;

  const lifeAreas = getAnnualLifeAreas(input);
  const structureName = normalizeKey(getStructureName(structure));

  const score = {
    CAREER: 0,
    WEALTH: 0,
    RELATIONSHIP: 0,
    WELLNESS: 0,
  };

  const reasons = {
    CAREER: [],
    WEALTH: [],
    RELATIONSHIP: [],
    WELLNESS: [],
  };

  const actions = {
    CAREER: [],
    WEALTH: [],
    RELATIONSHIP: [],
    WELLNESS: [],
  };

  const add = (key, points, reason = "", action = "") => {
    score[key] += points;

    if (reason) reasons[key].push(reason);
    if (action) actions[key].push(action);
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

  // AnnualOverlayV3 / annual life area influence if available.
  const careerSignal = readAreaSignal(lifeAreas, [
    "Career",
    "Career & Visibility",
    "career",
    "careerVisibility",
  ]);

  const wealthSignal = readAreaSignal(lifeAreas, [
    "Wealth",
    "Wealth Growth",
    "wealth",
    "wealthGrowth",
  ]);

  const relationshipSignal = readAreaSignal(lifeAreas, [
    "Relationship",
    "Relationships",
    "relationship",
    "relationships",
  ]);

  const wellnessSignal = readAreaSignal(lifeAreas, [
    "Wellness",
    "Wellness & Balance",
    "wellness",
    "balance",
    "health",
  ]);

  const annualCareer = signalToScore(careerSignal);
  const annualWealth = signalToScore(wealthSignal);
  const annualRelationship = signalToScore(relationshipSignal);
  const annualWellness = signalToScore(wellnessSignal);

  if (annualCareer) {
    add(
      "CAREER",
      annualCareer * 1.2,
      "Your yearly influence highlights career direction, confidence or visibility.",
      "Make your work, value and next step easier for others to recognise."
    );
  }

  if (annualWealth) {
    add(
      "WEALTH",
      annualWealth * 1.2,
      "Your yearly influence activates money decisions, income movement or opportunity growth.",
      "Focus on practical money choices, clearer offers and better opportunity selection."
    );
  }

  if (annualRelationship) {
    add(
      "RELATIONSHIP",
      annualRelationship * 1.2,
      "Your yearly influence brings attention to relationships, trust or emotional connection.",
      "Choose sincere connections and communicate needs earlier instead of leaving things unclear."
    );
  }

  if (annualWellness) {
    add(
      "WELLNESS",
      annualWellness * 1.2,
      "Your yearly influence reminds you to protect your emotional and physical balance.",
      "Create more space for rest, boundaries and energy management."
    );
  }

  // Profile influence
  add(
    "RELATIONSHIP",
    friend * 0.9,
    friend >= 50
      ? "Your natural growth is strongly affected by the people around you."
      : "",
    friend >= 50
      ? "Spend more time with people who make you feel steady, supported and clear."
      : ""
  );

  add(
    "RELATIONSHIP",
    robWealth * 0.5,
    robWealth >= 50
      ? "Your relationships may involve independence, boundaries and learning how to share space without losing yourself."
      : "",
    robWealth >= 50
      ? "Protect your individuality, but do not isolate yourself from genuine support."
      : ""
  );

  add(
    "CAREER",
    eatingGod * 0.7,
    eatingGod >= 50
      ? "Your expression and creativity can support your visibility this year."
      : "",
    eatingGod >= 50
      ? "Let people see your ideas, taste and personality more clearly."
      : ""
  );

  add(
    "CAREER",
    hurtingOfficer * 0.9,
    hurtingOfficer >= 50
      ? "Your voice, presence and self-expression can become important for career visibility."
      : "",
    hurtingOfficer >= 50
      ? "Use visibility with intention instead of reacting emotionally."
      : ""
  );

  add(
    "WEALTH",
    directWealth * 1.0,
    directWealth >= 50
      ? "Your chart supports wealth through consistency, structure and steady execution."
      : "",
    directWealth >= 50
      ? "Build repeatable systems instead of depending only on sudden opportunities."
      : ""
  );

  add(
    "WEALTH",
    indirectWealth * 1.1,
    indirectWealth >= 50
      ? "Your chart supports wealth through movement, initiative and spotting new openings."
      : "",
    indirectWealth >= 50
      ? "Explore opportunities, but filter them carefully before committing resources."
      : ""
  );

  add(
    "CAREER",
    directOfficer * 1.0,
    directOfficer >= 50
      ? "Your career growth is connected to responsibility, reputation and how others trust your standards."
      : "",
    directOfficer >= 50
      ? "Lead with calm authority and make your standards visible."
      : ""
  );

  add(
    "CAREER",
    sevenKillings * 1.0,
    sevenKillings >= 50
      ? "Your career path may require courage, pressure management and decisive action."
      : "",
    sevenKillings >= 50
      ? "Channel pressure into focused action instead of letting it become urgency."
      : ""
  );

  add(
    "WELLNESS",
    directResource * 0.9,
    directResource >= 50
      ? "Your energy improves when you have enough support, recovery and emotional steadiness."
      : "",
    directResource >= 50
      ? "Do not treat rest as something you only earn after everything is done."
      : ""
  );

  add(
    "WELLNESS",
    indirectResource * 1.0,
    indirectResource >= 50
      ? "Your inner world may become very active, so mental clarity and emotional grounding matter."
      : "",
    indirectResource >= 50
      ? "Give yourself space to process instead of overthinking every signal."
      : ""
  );

  // Structure influence
  if (structureName.includes("connector")) {
    add(
      "RELATIONSHIP",
      28,
      "Your structure grows through people, trust and relationship-based opportunities.",
      "Build stronger relationships instead of trying to progress alone."
    );
    add("CAREER", 14);
    add("WEALTH", 10);
  }

  if (structureName.includes("thinker")) {
    add(
      "WELLNESS",
      24,
      "Your structure needs mental clarity, reflection and emotional space to function well.",
      "Create quiet time so your mind can organise what matters."
    );
    add("CAREER", 12);
  }

  if (structureName.includes("supporter")) {
    add(
      "WELLNESS",
      20,
      "Your structure improves when you feel supported, rested and emotionally steady.",
      "Make stability part of the plan, not an afterthought."
    );
    add("RELATIONSHIP", 18);
  }

  if (structureName.includes("leader")) {
    add(
      "CAREER",
      28,
      "Your structure is activated through responsibility, standards and visible direction.",
      "Step into leadership without becoming overly rigid."
    );
    add("WEALTH", 12);
  }

  if (structureName.includes("creator")) {
    add(
      "CAREER",
      24,
      "Your structure is activated through expression, creativity and visibility.",
      "Show more of your ideas, style and personal voice."
    );
    add("RELATIONSHIP", 10);
  }

  if (structureName.includes("performer")) {
    add(
      "CAREER",
      26,
      "Your structure is activated when people can see your personality, ideas and presence.",
      "Use visibility intentionally and consistently."
    );
    add("RELATIONSHIP", 10);
  }

  if (structureName.includes("pioneer")) {
    add(
      "WEALTH",
      26,
      "Your structure is activated through initiative, opportunity and movement.",
      "Move toward new openings, but stay selective."
    );
    add("CAREER", 16);
  }

  // Daymaster strength influence
  if (isStrongDaymaster(daymasterStrength)) {
    add(
      "CAREER",
      14,
      "Your personal energy is strong, so 2026 may ask you to direct your strength more consciously.",
      "Use your strength to lead clearly, not to carry everything alone."
    );
    add(
      "WELLNESS",
      12,
      "Strong energy still needs balance, otherwise pressure can build quietly.",
      "Release pressure before it becomes emotional heaviness or burnout."
    );
  }

  if (isWeakDaymaster(daymasterStrength)) {
    add(
      "WELLNESS",
      18,
      "Your personal energy is more sensitive to your environment, so balance becomes important for making good decisions.",
      "Protect your energy before committing to too many demands."
    );
    add(
      "RELATIONSHIP",
      12,
      "Supportive people can strongly affect your confidence and emotional steadiness.",
      "Stay close to people who make life feel clearer, not heavier."
    );
  }

  // Useful God influence
  if (includesUsefulElement(usefulGod, "Water")) {
    add(
      "WELLNESS",
      12,
      "Calm, recovery and emotional flow help you make better choices this year.",
      "Slow down enough to hear what you actually feel."
    );
    add("RELATIONSHIP", 8);
  }

  if (includesUsefulElement(usefulGod, "Wood")) {
    add(
      "RELATIONSHIP",
      10,
      "Growth-oriented connections can help you feel more hopeful and supported.",
      "Choose people who support your development instead of keeping you small."
    );
    add("CAREER", 8);
  }

  if (includesUsefulElement(usefulGod, "Fire")) {
    add(
      "CAREER",
      12,
      "Visibility, warmth and confidence help you access more opportunities.",
      "Let people see your presence instead of staying hidden."
    );
    add("RELATIONSHIP", 8);
  }

  if (includesUsefulElement(usefulGod, "Earth")) {
    add(
      "WEALTH",
      10,
      "Grounded choices and stable routines help you turn effort into real results.",
      "Make your money decisions more structured and less reactive."
    );
    add("WELLNESS", 8);
  }

  if (includesUsefulElement(usefulGod, "Metal")) {
    add(
      "CAREER",
      10,
      "Clear standards and stronger boundaries help you move with more authority.",
      "Define what deserves your time before saying yes."
    );
    add("WEALTH", 8);
  }

  return { score, reasons, actions };
}

function priorityLabel(rank) {
  if (rank === 1) return "Primary Focus";
  if (rank === 2) return "Important Support";
  if (rank === 3) return "Growth Area";
  return "Maintenance Area";
}

function fallbackReason(key) {
  const reasons = {
    CAREER:
      "This area supports your direction, confidence and ability to be recognised for what you bring.",
    WEALTH:
      "This area supports your ability to turn effort, choices and opportunities into practical results.",
    RELATIONSHIP:
      "This area supports your emotional clarity, trust and the quality of people around you.",
    WELLNESS:
      "This area supports your energy, steadiness and ability to keep progressing without becoming overwhelmed.",
  };

  return reasons[key] || "";
}

function fallbackAction(key) {
  const actions = {
    CAREER:
      "Show up more clearly, strengthen your credibility and make your value easier to understand.",
    WEALTH:
      "Focus on practical systems, better decisions and opportunities that can produce real returns.",
    RELATIONSHIP:
      "Choose people who feel sincere, steady and supportive of who you are becoming.",
    WELLNESS:
      "Protect your rest, emotional balance and daily rhythm so your growth remains sustainable.",
  };

  return actions[key] || "";
}

function uniqueFirst(items = []) {
  const seen = new Set();

  return items.filter((item) => {
    const key = normalizeKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildFocusRankingV1(input = {}) {
  const { limit = 4 } = input;

  const { score, reasons, actions } = scoreFocusAreas(input);

  const ranked = Object.entries(score)
    .map(([key, value]) => ({
      key,
      score: Math.round(value),
      area: AREA_LIBRARY[key]?.area || key,
      description: AREA_LIBRARY[key]?.description || "",
      reasons: uniqueFirst(reasons[key] || []),
      actions: uniqueFirst(actions[key] || []),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      const fallbackOrder = ["CAREER", "RELATIONSHIP", "WEALTH", "WELLNESS"];
      return fallbackOrder.indexOf(a.key) - fallbackOrder.indexOf(b.key);
    });

  const hasMeaningfulScore = ranked.some((item) => item.score > 0);

  if (!hasMeaningfulScore) {
    return DEFAULT_RANKING.slice(0, limit).map((item) => ({
      ...item,
      source: "FocusRankingV1",
      score: 0,
    }));
  }

  return ranked.slice(0, limit).map((item, index) => ({
    key: item.key,
    rank: index + 1,
    source: "FocusRankingV1",
    area: item.area,
    description: item.description,
    priority: priorityLabel(index + 1),
    score: item.score,
    reason: item.reasons[0] || fallbackReason(item.key),
    action: item.actions[0] || fallbackAction(item.key),
  }));
}

export default buildFocusRankingV1;