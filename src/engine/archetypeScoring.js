// /src/engine/archetypeScoring.js

const ELEMENT_GENERATES = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const ELEMENT_CONTROLS = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

const STEM_ELEMENT = {
  Jia: "Wood", 甲: "Wood",
  Yi: "Wood", 乙: "Wood",
  Bing: "Fire", 丙: "Fire",
  Ding: "Fire", 丁: "Fire",
  Wu: "Earth", 戊: "Earth",
  Ji: "Earth", 己: "Earth",
  Geng: "Metal", 庚: "Metal",
  Xin: "Metal", 辛: "Metal",
  Ren: "Water", 壬: "Water",
  Gui: "Water", 癸: "Water",
};

const STEM_POLARITY = {
  Jia: "Yang", 甲: "Yang",
  Yi: "Yin", 乙: "Yin",
  Bing: "Yang", 丙: "Yang",
  Ding: "Yin", 丁: "Yin",
  Wu: "Yang", 戊: "Yang",
  Ji: "Yin", 己: "Yin",
  Geng: "Yang", 庚: "Yang",
  Xin: "Yin", 辛: "Yin",
  Ren: "Yang", 壬: "Yang",
  Gui: "Yin", 癸: "Yin",
};

const BRANCH_HIDDEN_STEMS = {
  Zi: ["Gui"], 子: ["癸"],
  Chou: ["Ji", "Gui", "Xin"], 丑: ["己", "癸", "辛"],
  Yin: ["Jia", "Bing", "Wu"], 寅: ["甲", "丙", "戊"],
  Mao: ["Yi"], 卯: ["乙"],
  Chen: ["Wu", "Yi", "Gui"], 辰: ["戊", "乙", "癸"],
  Si: ["Bing", "Wu", "Geng"], 巳: ["丙", "戊", "庚"],
  Wu: ["Ding", "Ji"], 午: ["丁", "己"],
  Wei: ["Ji", "Ding", "Yi"], 未: ["己", "丁", "乙"],
  Shen: ["Geng", "Ren", "Wu"], 申: ["庚", "壬", "戊"],
  You: ["Xin"], 酉: ["辛"],
  Xu: ["Wu", "Xin", "Ding"], 戌: ["戊", "辛", "丁"],
  Hai: ["Ren", "Jia"], 亥: ["壬", "甲"],
};

const SEASON_ELEMENT_BY_MONTH_BRANCH = {
  Yin: "Wood", 寅: "Wood",
  Mao: "Wood", 卯: "Wood",
  Chen: "Earth", 辰: "Earth",
  Si: "Fire", 巳: "Fire",
  Wu: "Fire", 午: "Fire",
  Wei: "Earth", 未: "Earth",
  Shen: "Metal", 申: "Metal",
  You: "Metal", 酉: "Metal",
  Xu: "Earth", 戌: "Earth",
  Hai: "Water", 亥: "Water",
  Zi: "Water", 子: "Water",
  Chou: "Earth", 丑: "Earth",
};

const REPRESENTATIVE_STEM_BY_ELEMENT = {
  Wood: "Jia",
  Fire: "Bing",
  Earth: "Wu",
  Metal: "Geng",
  Water: "Ren",
};

const TEN_GOD_KEYS = [
  "friend",
  "robWealth",
  "eatingGod",
  "hurtingOfficer",
  "directWealth",
  "indirectWealth",
  "directOfficer",
  "sevenKilling",
  "directResource",
  "indirectResource",
];

const STEM_POSITION_WEIGHT = {
  year: 0.85,
  month: 2.4,
  day: 0,
  hour: 1.0,
};

const BRANCH_POSITION_WEIGHT = {
  year: 0.55,
  month: 2.1,
  day: 0.95,
  hour: 0.75,
};

const HIDDEN_STEM_DECAY = [1, 0.45, 0.25];

function getProducedElement(element) {
  return ELEMENT_GENERATES[element];
}

function getControlledElement(element) {
  return ELEMENT_CONTROLS[element];
}

function getControllingElement(element) {
  return Object.keys(ELEMENT_CONTROLS).find(
    (controller) => ELEMENT_CONTROLS[controller] === element
  );
}

function getProducingElement(element) {
  return Object.keys(ELEMENT_GENERATES).find(
    (producer) => ELEMENT_GENERATES[producer] === element
  );
}

function getTenGodKey(dayStem, targetStem) {
  if (!dayStem || !targetStem) return null;

  const dayElement = STEM_ELEMENT[dayStem];
  const targetElement = STEM_ELEMENT[targetStem];
  const dayPolarity = STEM_POLARITY[dayStem];
  const targetPolarity = STEM_POLARITY[targetStem];

  if (!dayElement || !targetElement || !dayPolarity || !targetPolarity) {
    return null;
  }

  const samePolarity = dayPolarity === targetPolarity;

  // Same element: Friend / Rob Wealth
  if (targetElement === dayElement) {
    return samePolarity ? "friend" : "robWealth";
  }

  // Output: Day Master produces target
  if (targetElement === getProducedElement(dayElement)) {
    return samePolarity ? "eatingGod" : "hurtingOfficer";
  }

  // Wealth: Day Master controls target
  // Traditional Bazi polarity:
  // same polarity = Indirect Wealth, opposite polarity = Direct Wealth
  if (targetElement === getControlledElement(dayElement)) {
    return samePolarity ? "indirectWealth" : "directWealth";
  }

  // Officer: target controls Day Master
  // same polarity = Seven Killings, opposite polarity = Direct Officer
  if (targetElement === getControllingElement(dayElement)) {
    return samePolarity ? "sevenKilling" : "directOfficer";
  }

  // Resource: target produces Day Master
  // same polarity = Indirect Resource, opposite polarity = Direct Resource
  if (targetElement === getProducingElement(dayElement)) {
    return samePolarity ? "indirectResource" : "directResource";
  }

  return null;
}

function createEmptyScores() {
  return TEN_GOD_KEYS.reduce((acc, key) => {
    acc[key] = {
      rawScore: 0,
      sources: [],
    };
    return acc;
  }, {});
}

function addScore(scores, key, amount, source = {}) {
  if (!key || !scores[key] || !Number.isFinite(amount) || amount <= 0) return;

  scores[key].rawScore += amount;
  scores[key].sources.push({
    ...source,
    amount,
  });
}

function getPillarStem(pillars, position) {
  return pillars?.[position]?.stem || pillars?.[position]?.heavenlyStem || null;
}

function getPillarBranch(pillars, position) {
  return pillars?.[position]?.branch || pillars?.[position]?.earthlyBranch || null;
}

function applyVisibleStemScores(scores, pillars, dayStem) {
  ["year", "month", "day", "hour"].forEach((position) => {
    if (position === "day") return;

    const stem = getPillarStem(pillars, position);
    const key = getTenGodKey(dayStem, stem);
    const weight = STEM_POSITION_WEIGHT[position] ?? 0.5;

    addScore(scores, key, weight, {
      type: "visibleStem",
      position,
      stem,
      element: STEM_ELEMENT[stem],
    });
  });
}

function applyHiddenStemScores(scores, pillars, dayStem) {
  ["year", "month", "day", "hour"].forEach((position) => {
    const branch = getPillarBranch(pillars, position);
    const hiddenStems = BRANCH_HIDDEN_STEMS[branch] || [];
    const positionWeight = BRANCH_POSITION_WEIGHT[position] ?? 0.5;

    hiddenStems.forEach((hiddenStem, index) => {
      const key = getTenGodKey(dayStem, hiddenStem);
      const decay = HIDDEN_STEM_DECAY[index] ?? 0.2;
      const weight = positionWeight * decay;

      addScore(scores, key, weight, {
        type: "hiddenStem",
        position,
        branch,
        stem: hiddenStem,
        element: STEM_ELEMENT[hiddenStem],
        hiddenStemRank: index + 1,
      });
    });
  });
}

function applySeasonalStrength(scores, pillars, dayStem) {
  const monthBranch = getPillarBranch(pillars, "month");
  const seasonElement = SEASON_ELEMENT_BY_MONTH_BRANCH[monthBranch];

  if (!monthBranch || !seasonElement || !dayStem) return;

  const representativeStem = REPRESENTATIVE_STEM_BY_ELEMENT[seasonElement];
  const seasonalKey = getTenGodKey(dayStem, representativeStem);

  // Month branch is the strongest environmental influence.
  addScore(scores, seasonalKey, 1.7, {
    type: "seasonalAnchor",
    monthBranch,
    seasonElement,
    stem: representativeStem,
    element: seasonElement,
  });

  // Boost profiles that already appear through the month branch.
  Object.keys(scores).forEach((key) => {
    const hasMonthSource = scores[key].sources.some(
      (source) => source.position === "month"
    );

    if (hasMonthSource) {
      scores[key].rawScore *= 1.22;
      scores[key].sources.push({
        type: "monthBranchMultiplier",
        monthBranch,
        multiplier: 1.22,
      });
    }
  });
}

function normalizeStrengthText(dayMasterStrength) {
  if (!dayMasterStrength) return "";

  if (typeof dayMasterStrength === "string") {
    return dayMasterStrength.toLowerCase();
  }

  return String(
    dayMasterStrength.status ||
      dayMasterStrength.label ||
      dayMasterStrength.strength ||
      dayMasterStrength.category ||
      ""
  ).toLowerCase();
}

function applyDayMasterStrengthAdjustment(scores, dayMasterStrength) {
  const strengthText = normalizeStrengthText(dayMasterStrength);

  if (!strengthText) return;

  const isStrong =
    strengthText.includes("strong") ||
    strengthText.includes("excess") ||
    strengthText.includes("旺");

  const isWeak =
    strengthText.includes("weak") ||
    strengthText.includes("low") ||
    strengthText.includes("身弱") ||
    strengthText.includes("弱");

  if (!isStrong && !isWeak) return;

  const peerKeys = ["friend", "robWealth"];
  const outputKeys = ["eatingGod", "hurtingOfficer"];
  const wealthKeys = ["directWealth", "indirectWealth"];
  const officerKeys = ["directOfficer", "sevenKilling"];
  const resourceKeys = ["directResource", "indirectResource"];

  const applyMultiplier = (keys, multiplier, reason) => {
    keys.forEach((key) => {
      if (!scores[key]) return;

      scores[key].rawScore *= multiplier;
      scores[key].sources.push({
        type: "dayMasterStrengthAdjustment",
        reason,
        multiplier,
      });
    });
  };

  if (isStrong) {
    applyMultiplier(peerKeys, 0.88, "Strong Day Master needs less peer reinforcement");
    applyMultiplier(resourceKeys, 0.85, "Strong Day Master needs less resource support");
    applyMultiplier(outputKeys, 1.16, "Strong Day Master can express output");
    applyMultiplier(wealthKeys, 1.18, "Strong Day Master can handle wealth/control");
    applyMultiplier(officerKeys, 1.12, "Strong Day Master can handle pressure/structure");
  }

  if (isWeak) {
    applyMultiplier(peerKeys, 1.18, "Weak Day Master benefits from peer support");
    applyMultiplier(resourceKeys, 1.22, "Weak Day Master benefits from resource support");
    applyMultiplier(outputKeys, 0.9, "Weak Day Master may leak energy through output");
    applyMultiplier(wealthKeys, 0.86, "Weak Day Master may struggle to control wealth");
    applyMultiplier(officerKeys, 0.88, "Weak Day Master may feel pressure from officer energy");
  }
}

function getAnnualPillar(annualPillar, annualOverlay) {
  return (
    annualPillar ||
    annualOverlay?.annualPillar ||
    annualOverlay?.pillar ||
    annualOverlay?.yearPillar ||
    null
  );
}

function applyAnnualOverlay(scores, dayStem, annualPillar, annualOverlay) {
  const pillar = getAnnualPillar(annualPillar, annualOverlay);

  if (!pillar || !dayStem) return;

  const annualStem = pillar.stem || pillar.heavenlyStem;
  const annualBranch = pillar.branch || pillar.earthlyBranch;

  const visibleKey = getTenGodKey(dayStem, annualStem);

  addScore(scores, visibleKey, 0.75, {
    type: "annualVisibleStem",
    stem: annualStem,
    branch: annualBranch,
    element: STEM_ELEMENT[annualStem],
  });

  const hiddenStems = BRANCH_HIDDEN_STEMS[annualBranch] || [];

  hiddenStems.forEach((hiddenStem, index) => {
    const key = getTenGodKey(dayStem, hiddenStem);
    const decay = HIDDEN_STEM_DECAY[index] ?? 0.2;
    const weight = 0.35 * decay;

    addScore(scores, key, weight, {
      type: "annualHiddenStem",
      branch: annualBranch,
      stem: hiddenStem,
      element: STEM_ELEMENT[hiddenStem],
    });
  });

  const amplifiedElements = annualOverlay?.amplifiedElements || [];

  amplifiedElements.forEach((element) => {
    const representativeStem = REPRESENTATIVE_STEM_BY_ELEMENT[element];
    const key = getTenGodKey(dayStem, representativeStem);

    addScore(scores, key, 0.35, {
      type: "annualAmplifiedElement",
      element,
      stem: representativeStem,
    });
  });
}

function normalizeArchetypeDefinitions(archetypeDefinitions = []) {
  if (Array.isArray(archetypeDefinitions)) {
    return archetypeDefinitions.map((item) => ({
      ...item,
      key: item.key,
    }));
  }

  return Object.entries(archetypeDefinitions || {}).map(([objectKey, value]) => ({
    ...value,
    key: value?.key || objectKey,
  }));
}

function scoreToPublicRange(rawScore, maxRaw) {
  if (!rawScore || rawScore <= 0) return 0;

  const ratio = maxRaw > 0 ? rawScore / maxRaw : 0;

  // Public-facing score range:
  // keeps weak profiles low, strong profiles visible, but avoids overclaiming precision.
  return Math.round(Math.max(18, Math.min(96, 18 + ratio * 72)));
}

function normalizeScores(scores, archetypeDefinitions = []) {
  const definitionsArray = normalizeArchetypeDefinitions(archetypeDefinitions);

  const maxRaw = Math.max(
    ...TEN_GOD_KEYS.map((key) => scores[key]?.rawScore || 0),
    1
  );

  const archetypes = definitionsArray.map((definition) => {
    const key = definition.key;
    const rawScore = scores[key]?.rawScore || 0;
    const score = scoreToPublicRange(rawScore, maxRaw);

    return {
      ...definition,
      key,
      rawScore,
      score,
      percentage: score,
      sources: scores[key]?.sources || [],
    };
  });

  return archetypes
    .sort((a, b) => {
      if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
      return TEN_GOD_KEYS.indexOf(a.key) - TEN_GOD_KEYS.indexOf(b.key);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

export function calculateArchetypeScores({
  pillars,
  dayStem,
  annualPillar,
  annualOverlay,
  dayMasterStrength,
  archetypeDefinitions = [],
}) {

  const resolvedDayStem = dayStem || getPillarStem(pillars, "day");
  const scores = createEmptyScores();

  if (!pillars || !resolvedDayStem) {
    return normalizeScores(scores, archetypeDefinitions);
  }

  applyVisibleStemScores(scores, pillars, resolvedDayStem);
  applyHiddenStemScores(scores, pillars, resolvedDayStem);
  applySeasonalStrength(scores, pillars, resolvedDayStem);
  applyAnnualOverlay(scores, resolvedDayStem, annualPillar, annualOverlay);
  applyDayMasterStrengthAdjustment(scores, dayMasterStrength);

  return normalizeScores(scores, archetypeDefinitions);
}