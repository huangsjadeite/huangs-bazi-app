import { normalizePillars } from "./normalizePillars.js";

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

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

const BRANCH_MAIN_QI = {
  Zi: "Water",
  Chou: "Earth",
  Yin: "Wood",
  Mao: "Wood",
  Chen: "Earth",
  Si: "Fire",
  Wu: "Fire",
  Wei: "Earth",
  Shen: "Metal",
  You: "Metal",
  Xu: "Earth",
  Hai: "Water",
};

const BRANCH_ALIAS = {
  zi: "Zi",
  chou: "Chou",
  yin: "Yin",
  mao: "Mao",
  chen: "Chen",
  si: "Si",
  wu: "Wu",
  wei: "Wei",
  shen: "Shen",
  you: "You",
  xu: "Xu",
  hai: "Hai",

  子: "Zi",
  丑: "Chou",
  寅: "Yin",
  卯: "Mao",
  辰: "Chen",
  巳: "Si",
  午: "Wu",
  未: "Wei",
  申: "Shen",
  酉: "You",
  戌: "Xu",
  亥: "Hai",
};

const HIDDEN_STEMS = {
  Zi: [{ element: "Water", weight: 1 }],
  Chou: [
    { element: "Earth", weight: 0.6 },
    { element: "Water", weight: 0.25 },
    { element: "Metal", weight: 0.15 },
  ],
  Yin: [
    { element: "Wood", weight: 0.6 },
    { element: "Fire", weight: 0.25 },
    { element: "Earth", weight: 0.15 },
  ],
  Mao: [{ element: "Wood", weight: 1 }],
  Chen: [
    { element: "Earth", weight: 0.6 },
    { element: "Wood", weight: 0.25 },
    { element: "Water", weight: 0.15 },
  ],
  Si: [
    { element: "Fire", weight: 0.6 },
    { element: "Earth", weight: 0.25 },
    { element: "Metal", weight: 0.15 },
  ],
  Wu: [
    { element: "Fire", weight: 0.7 },
    { element: "Earth", weight: 0.3 },
  ],
  Wei: [
    { element: "Earth", weight: 0.6 },
    { element: "Fire", weight: 0.25 },
    { element: "Wood", weight: 0.15 },
  ],
  Shen: [
    { element: "Metal", weight: 0.6 },
    { element: "Water", weight: 0.25 },
    { element: "Earth", weight: 0.15 },
  ],
  You: [{ element: "Metal", weight: 1 }],
  Xu: [
    { element: "Earth", weight: 0.6 },
    { element: "Metal", weight: 0.25 },
    { element: "Fire", weight: 0.15 },
  ],
  Hai: [
    { element: "Water", weight: 0.7 },
    { element: "Wood", weight: 0.3 },
  ],
};

const STEM_ELEMENT = {
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water",

  jia: "Wood",
  yi: "Wood",
  bing: "Fire",
  ding: "Fire",
  wu: "Earth",
  ji: "Earth",
  geng: "Metal",
  xin: "Metal",
  ren: "Water",
  gui: "Water",

  甲: "Wood",
  乙: "Wood",
  丙: "Fire",
  丁: "Fire",
  戊: "Earth",
  己: "Earth",
  庚: "Metal",
  辛: "Metal",
  壬: "Water",
  癸: "Water",
};

const POSITION_WEIGHTS = {
  yearStem: 0.6,
  yearBranch: 0.7,
  monthStem: 1.1,
  monthBranch: 2.2,
  dayStem: 0,
  dayBranch: 1.4,
  hourStem: 0.8,
  hourBranch: 1,
};

function round(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function extractValue(value) {
  if (!value) return null;
  if (typeof value === "string") return value;

  return (
    value.name ||
    value.zh ||
    value.en ||
    value.key ||
    value.value ||
    value.label ||
    null
  );
}

function normalizeBranch(branch) {
  const value = extractValue(branch);
  if (!value) return null;

  if (BRANCH_ALIAS[value]) return BRANCH_ALIAS[value];

  const lower = String(value).toLowerCase();
  if (BRANCH_ALIAS[lower]) return BRANCH_ALIAS[lower];

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getPillarStem(pillar) {
  return pillar?.stem || pillar?.heavenlyStem || pillar?.stemName || null;
}

function getPillarBranch(pillar) {
  return pillar?.branch || pillar?.earthlyBranch || pillar?.branchName || null;
}

function getStemElement(stem) {
  if (!stem) return null;

  if (typeof stem === "object") {
    return (
      stem.element ||
      stem.elementName ||
      STEM_ELEMENT[stem.name] ||
      STEM_ELEMENT[stem.zh] ||
      STEM_ELEMENT[stem.key] ||
      null
    );
  }

  return STEM_ELEMENT[stem] || STEM_ELEMENT[String(stem).toLowerCase()] || null;
}

function getBranchElement(branch) {
  if (!branch) return null;

  if (typeof branch === "object") {
    return (
      branch.element ||
      branch.elementName ||
      branch.mainElement ||
      branch.mainQi ||
      BRANCH_MAIN_QI[normalizeBranch(branch)] ||
      null
    );
  }

  return BRANCH_MAIN_QI[normalizeBranch(branch)] || null;
}

function getHiddenStems(branch) {
  return HIDDEN_STEMS[normalizeBranch(branch)] || [];
}

function emptyElementScores() {
  return ELEMENTS.reduce((acc, element) => {
    acc[element] = 0;
    return acc;
  }, {});
}

function getResourceElement(dayElement) {
  return Object.entries(GENERATES).find(
    ([, generated]) => generated === dayElement
  )?.[0];
}

function getOfficerElement(dayElement) {
  return Object.entries(CONTROLS).find(
    ([, controlled]) => controlled === dayElement
  )?.[0];
}

function getRelationshipElementMap(dayElement) {
  return {
    companion: dayElement,
    resource: getResourceElement(dayElement),
    output: GENERATES[dayElement],
    wealth: CONTROLS[dayElement],
    officer: getOfficerElement(dayElement),
  };
}

function scoreSeasonCommand(dayElement, seasonElement, map) {
  if (seasonElement === dayElement) return 1;
  if (seasonElement === map.resource) return 0.8;
  if (seasonElement === map.output) return -0.45;
  if (seasonElement === map.wealth) return -0.55;
  if (seasonElement === map.officer) return -0.65;
  return 0;
}

function calculateElementScores(pillars) {
  const scores = emptyElementScores();

  const positions = [
    ["year", pillars.year],
    ["month", pillars.month],
    ["day", pillars.day],
    ["hour", pillars.hour],
  ];

  for (const [position, pillar] of positions) {
    if (!pillar) continue;

    const stemElement = getStemElement(getPillarStem(pillar));
    const branch = getPillarBranch(pillar);
    const branchElement = getBranchElement(branch);

    if (stemElement) {
      scores[stemElement] += POSITION_WEIGHTS[`${position}Stem`] || 0;
    }

    if (branchElement) {
      scores[branchElement] += POSITION_WEIGHTS[`${position}Branch`] || 0;
    }

    for (const hidden of getHiddenStems(branch)) {
      scores[hidden.element] +=
        (POSITION_WEIGHTS[`${position}Branch`] || 0) * hidden.weight * 0.65;
    }
  }

  return Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [key, round(value)])
  );
}

function calculateRelationshipScores(elementScores, dayElement) {
  const map = getRelationshipElementMap(dayElement);

  return {
    companion: round(elementScores[map.companion] || 0),
    resource: round(elementScores[map.resource] || 0),
    output: round(elementScores[map.output] || 0),
    wealth: round(elementScores[map.wealth] || 0),
    officer: round(elementScores[map.officer] || 0),
  };
}

function calculateRootStrength(pillars, dayElement) {
  const detail = {
    monthBranch: 0,
    dayBranch: 0,
    hourBranch: 0,
    hiddenStemRoot: 0,
  };

  const branches = {
    month: getPillarBranch(pillars.month),
    day: getPillarBranch(pillars.day),
    hour: getPillarBranch(pillars.hour),
  };

  for (const [position, branch] of Object.entries(branches)) {
    if (!branch) continue;

    if (getBranchElement(branch) === dayElement) {
      if (position === "month") detail.monthBranch += 1;
      if (position === "day") detail.dayBranch += 0.85;
      if (position === "hour") detail.hourBranch += 0.65;
    }

    const hiddenRoot = getHiddenStems(branch)
      .filter((stem) => stem.element === dayElement)
      .reduce((sum, stem) => sum + stem.weight, 0);

    if (position === "month") detail.hiddenStemRoot += hiddenRoot * 0.75;
    if (position === "day") detail.hiddenStemRoot += hiddenRoot * 0.65;
    if (position === "hour") detail.hiddenStemRoot += hiddenRoot * 0.45;
  }

  const raw =
    detail.monthBranch +
    detail.dayBranch +
    detail.hourBranch +
    detail.hiddenStemRoot;

  return {
    score: round(Math.min(raw / 2.8, 1) * 100),
    raw: round(raw),
    detail: Object.fromEntries(
      Object.entries(detail).map(([key, value]) => [key, round(value)])
    ),
  };
}

function getStrengthLabel(score) {
  if (score >= 75) return "Very Strong";
  if (score >= 60) return "Strong";
  if (score >= 45) return "Balanced";
  return "Weak";
}

function getStatus(score) {
  if (score >= 75) return "Excessive";
  if (score >= 60) return "Supported";
  if (score >= 45) return "Balanced";
  return "Under-supported";
}

function calculateStrength({ seasonCommandScore, rootStrength, relationshipScores }) {
  const base = 45;

  const seasonCommand = seasonCommandScore * 28;
  const rootSupport = (rootStrength.score / 100) * 22;
  const companionSupport = Math.min(relationshipScores.companion / 5, 1) * 18;
  const resourceSupport = Math.min(relationshipScores.resource / 5, 1) * 18;
  const outputDrain = Math.min(relationshipScores.output / 5, 1) * -12;
  const wealthDrain = Math.min(relationshipScores.wealth / 5, 1) * -10;
  const officerPressure = Math.min(relationshipScores.officer / 5, 1) * -12;

  const raw =
    base +
    seasonCommand +
    rootSupport +
    companionSupport +
    resourceSupport +
    outputDrain +
    wealthDrain +
    officerPressure;

  return {
    strengthScore: Math.max(0, Math.min(100, round(raw))),
    factors: [
      { name: "Base Score", value: base },
      { name: "Season Command", value: round(seasonCommand) },
      { name: "Root Support", value: round(rootSupport) },
      { name: "Companion Support", value: round(companionSupport) },
      { name: "Resource Support", value: round(resourceSupport) },
      { name: "Output Drain", value: round(outputDrain) },
      { name: "Wealth Drain", value: round(wealthDrain) },
      { name: "Officer Pressure", value: round(officerPressure) },
    ],
  };
}

export function dayMasterStrengthV4(rawPillars) {
  const pillars = normalizePillars(rawPillars);

  const dayElement = getStemElement(getPillarStem(pillars.day));
  const seasonElement = getBranchElement(getPillarBranch(pillars.month));

  if (!dayElement) {
    throw new Error("dayMasterStrengthV4: Unable to determine Day Master element.");
  }

  if (!seasonElement) {
    throw new Error(
      "dayMasterStrengthV4: Unable to determine season element from month branch."
    );
  }

  const supportingElement = getResourceElement(dayElement);
  const relationshipMap = getRelationshipElementMap(dayElement);

  const elementScores = calculateElementScores(pillars);
  const relationshipScores = calculateRelationshipScores(elementScores, dayElement);
  const rootStrength = calculateRootStrength(pillars, dayElement);

  const seasonCommandScore = scoreSeasonCommand(
    dayElement,
    seasonElement,
    relationshipMap
  );

  const { strengthScore, factors } = calculateStrength({
    seasonCommandScore,
    rootStrength,
    relationshipScores,
  });

  const strengthLabel = getStrengthLabel(strengthScore);

  return {
    strengthScore,
    strengthLabel,
    status: getStatus(strengthScore),
    dayElement,
    seasonElement,
    supportingElement,
    elementScores,
    relationshipScores,
    rootStrength,
    factors,
    explanation: `Day Master is ${dayElement}. Month command is ${seasonElement}. Strength is calculated from season command, root support, companion support, resource support, output drain, wealth drain, and officer pressure. Final score is ${strengthScore}, classified as ${strengthLabel}.`,
  };
}

export default dayMasterStrengthV4;