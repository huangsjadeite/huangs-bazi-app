// src/data/tenProfileScoringV3.js

const STEMS = {
  Jia: { element: "Wood", polarity: "Yang" },
  Yi: { element: "Wood", polarity: "Yin" },
  Bing: { element: "Fire", polarity: "Yang" },
  Ding: { element: "Fire", polarity: "Yin" },
  Wu: { element: "Earth", polarity: "Yang" },
  Ji: { element: "Earth", polarity: "Yin" },
  Geng: { element: "Metal", polarity: "Yang" },
  Xin: { element: "Metal", polarity: "Yin" },
  Ren: { element: "Water", polarity: "Yang" },
  Gui: { element: "Water", polarity: "Yin" },

  甲: { element: "Wood", polarity: "Yang" },
  乙: { element: "Wood", polarity: "Yin" },
  丙: { element: "Fire", polarity: "Yang" },
  丁: { element: "Fire", polarity: "Yin" },
  戊: { element: "Earth", polarity: "Yang" },
  己: { element: "Earth", polarity: "Yin" },
  庚: { element: "Metal", polarity: "Yang" },
  辛: { element: "Metal", polarity: "Yin" },
  壬: { element: "Water", polarity: "Yang" },
  癸: { element: "Water", polarity: "Yin" },
};

const BRANCH_HIDDEN_STEMS = {
  Zi: ["Gui"], Chou: ["Ji", "Gui", "Xin"], Yin: ["Jia", "Bing", "Wu"],
  Mao: ["Yi"], Chen: ["Wu", "Yi", "Gui"], Si: ["Bing", "Wu", "Geng"],
  Wu: ["Ding", "Ji"], Wei: ["Ji", "Yi", "Ding"], Shen: ["Geng", "Ren", "Wu"],
  You: ["Xin"], Xu: ["Wu", "Xin", "Ding"], Hai: ["Ren", "Jia"],

  子: ["Gui"], 丑: ["Ji", "Gui", "Xin"], 寅: ["Jia", "Bing", "Wu"],
  卯: ["Yi"], 辰: ["Wu", "Yi", "Gui"], 巳: ["Bing", "Wu", "Geng"],
  午: ["Ding", "Ji"], 未: ["Ji", "Yi", "Ding"], 申: ["Geng", "Ren", "Wu"],
  酉: ["Xin"], 戌: ["Wu", "Xin", "Ding"], 亥: ["Ren", "Jia"],
};

const PROFILE_NAMES = [
  "Friend",
  "Rob Wealth",
  "Eating God",
  "Hurting Officer",
  "Direct Wealth",
  "Indirect Wealth",
  "Direct Officer",
  "Seven Killings",
  "Direct Resource",
  "Indirect Resource",
];

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

const WEIGHTS = {
  heavenlyStem: {
    year: 0.85,
    month: 1.15,
    day: 0,
    hour: 0.9,
  },
  hiddenStem: {
    main: 0.75,
    middle: 0.38,
    residual: 0.22,
  },
  branchInfluence: {
    year: 0.35,
    month: 0.75,
    day: 0.45,
    hour: 0.35,
  },
  monthCommandMultiplier: 1.16,
  annualStem: 0.18,
  annualBranch: 0.22,
};

function emptyScores() {
  return Object.fromEntries(PROFILE_NAMES.map((name) => [name, 0]));
}

function toToken(value) {
  // Pillar stems/branches may be rich objects or plain strings.
  // The STEMS / BRANCH_HIDDEN_STEMS tables key on name ("Ji") or
  // Chinese character ("己"), so reduce everything to a string token.
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.name || value.zh || value.key || value.label || undefined;
  }
  return undefined;
}

function normalisePillar(pillar) {
  if (!pillar) return {};
  return {
    stem: toToken(pillar.stem || pillar.heavenlyStem || pillar.hs || pillar.gan),
    branch: toToken(
      pillar.branch || pillar.earthlyBranch || pillar.eb || pillar.zhi
    ),
  };
}

function getPillars(chart = {}) {
  const pillars = chart.pillars || chart.fourPillars || chart.bazi || {};
  return {
    year: normalisePillar(pillars.year || chart.yearPillar || chart.year),
    month: normalisePillar(pillars.month || chart.monthPillar || chart.month),
    day: normalisePillar(pillars.day || chart.dayPillar || chart.day),
    hour: normalisePillar(pillars.hour || chart.hourPillar || chart.hour),
  };
}

function getDayStem(chart = {}) {
  const pillars = getPillars(chart);
  return toToken(chart.dayStem || chart.dayMaster) || pillars.day.stem;
}

function samePolarity(a, b) {
  return a?.polarity && b?.polarity && a.polarity === b.polarity;
}

function getProfile(dayStem, targetStem) {
  const dm = STEMS[dayStem];
  const target = STEMS[targetStem];

  if (!dm || !target) return null;

  if (target.element === dm.element) {
    return samePolarity(dm, target) ? "Friend" : "Rob Wealth";
  }

  if (GENERATES[dm.element] === target.element) {
    return samePolarity(dm, target) ? "Eating God" : "Hurting Officer";
  }

  if (CONTROLS[dm.element] === target.element) {
    return samePolarity(dm, target) ? "Indirect Wealth" : "Direct Wealth";
  }

  if (CONTROLS[target.element] === dm.element) {
    return samePolarity(dm, target) ? "Seven Killings" : "Direct Officer";
  }

  if (GENERATES[target.element] === dm.element) {
    return samePolarity(dm, target) ? "Indirect Resource" : "Direct Resource";
  }

  return null;
}

function addBreakdown(breakdown, profile, source, amount, meta = {}) {
  if (!profile) return;

  if (!breakdown[profile]) {
    breakdown[profile] = {
      total: 0,
      sources: [],
    };
  }

  breakdown[profile].total += amount;
  breakdown[profile].sources.push({
    source,
    points: Number(amount.toFixed(3)),
    ...meta,
  });
}

function addScore(scores, breakdown, profile, source, amount, meta) {
  if (!profile) return;
  scores[profile] += amount;
  addBreakdown(breakdown, profile, source, amount, meta);
}

function getHiddenWeight(index) {
  if (index === 0) return WEIGHTS.hiddenStem.main;
  if (index === 1) return WEIGHTS.hiddenStem.middle;
  return WEIGHTS.hiddenStem.residual;
}

function scoreNatal(chart = {}) {
  const pillars = getPillars(chart);
  const dayStem = getDayStem(chart);
  const scores = emptyScores();
  const breakdown = {};

  Object.entries(pillars).forEach(([position, pillar]) => {
    if (!pillar) return;

    if (position !== "day" && pillar.stem) {
      const profile = getProfile(dayStem, pillar.stem);
      addScore(
        scores,
        breakdown,
        profile,
        "heavenlyStem",
        WEIGHTS.heavenlyStem[position] || 0.7,
        { position, stem: pillar.stem }
      );
    }

    const hiddenStems = BRANCH_HIDDEN_STEMS[pillar.branch] || [];
    hiddenStems.forEach((stem, index) => {
      const profile = getProfile(dayStem, stem);
      const base = getHiddenWeight(index);
      const positionMultiplier = position === "month" ? 1.15 : 1;
      addScore(
        scores,
        breakdown,
        profile,
        "hiddenStem",
        base * positionMultiplier,
        { position, branch: pillar.branch, stem, hiddenIndex: index }
      );
    });

    const mainHidden = hiddenStems[0];
    if (mainHidden) {
      const profile = getProfile(dayStem, mainHidden);
      addScore(
        scores,
        breakdown,
        profile,
        "branchInfluence",
        WEIGHTS.branchInfluence[position] || 0.3,
        { position, branch: pillar.branch, stem: mainHidden }
      );
    }
  });

  const monthHidden = BRANCH_HIDDEN_STEMS[pillars.month.branch] || [];
  const monthMainProfile = getProfile(dayStem, monthHidden[0]);

  if (monthMainProfile) {
    const bonus = scores[monthMainProfile] * (WEIGHTS.monthCommandMultiplier - 1);
    addScore(
      scores,
      breakdown,
      monthMainProfile,
      "monthCommand",
      bonus,
      { branch: pillars.month.branch, note: "Calm natal multiplier, not a domination switch." }
    );
  }

  return { scores, breakdown };
}

function scoreAnnualOverlay(chart = {}) {
  const dayStem = getDayStem(chart);
  const annual = chart.annualOverlay || chart.currentYearOverlay || chart.yearOverlay;
  const scores = emptyScores();
  const breakdown = {};

  if (!annual) return { scores, breakdown };

  const stem = annual.stem || annual.heavenlyStem;
  const branch = annual.branch || annual.earthlyBranch;

  if (stem) {
    const profile = getProfile(dayStem, stem);
    addScore(scores, breakdown, profile, "annualStemActivation", WEIGHTS.annualStem, {
      stem,
      note: "Activation only. Does not dominate natal ranking.",
    });
  }

  const hiddenStems = BRANCH_HIDDEN_STEMS[branch] || [];
  hiddenStems.forEach((hiddenStem, index) => {
    const profile = getProfile(dayStem, hiddenStem);
    const weight = index === 0 ? WEIGHTS.annualBranch : WEIGHTS.annualBranch * 0.4;
    addScore(scores, breakdown, profile, "annualBranchActivation", weight, {
      branch,
      stem: hiddenStem,
      hiddenIndex: index,
      note: "Contextual yearly activation only.",
    });
  });

  return { scores, breakdown };
}

function toPercentages(scores) {
  const max = Math.max(...Object.values(scores), 0.01);

  return Object.fromEntries(
    Object.entries(scores).map(([profile, score]) => [
      profile,
      Number(((score / max) * 100).toFixed(1)),
    ])
  );
}

function rankProfiles(scores, annualScores) {
  return PROFILE_NAMES
    .map((profile) => ({
      profile,
      score: Number(scores[profile].toFixed(3)),
      percentage: toPercentages(scores)[profile],
      annualActivation: Number((annualScores[profile] || 0).toFixed(3)),
    }))
    .sort((a, b) => b.score - a.score);
}

export function tenProfileScoringV3(chart = {}) {
  const natal = scoreNatal(chart);
  const annual = scoreAnnualOverlay(chart);

  const finalScores = { ...natal.scores };

  const rankedProfiles = rankProfiles(finalScores, annual.scores);

  return {
    version: "TenProfileScoringV3",
    framework: "Natal-first profile scoring with annual overlay as activation/context only.",
    weights: WEIGHTS,
    scores: finalScores,
    percentages: toPercentages(finalScores),
    rankedProfiles,
    dominantProfile: rankedProfiles[0] || null,
    supportingProfiles: rankedProfiles.slice(1, 4),
    annualActivationScores: annual.scores,
    breakdown: {
      natal: natal.breakdown,
      annualActivation: annual.breakdown,
    },
    notes: [
      "Month branch and month hidden stems matter, but they no longer overpower the whole chart.",
      "Annual overlay is reported as activation and does not flip the natal personality ranking by itself.",
      "Seven Killings, Direct Officer, Wealth, Resource, and Output profiles must be supported by repeated natal evidence before becoming dominant.",
    ],
  };
}

export const calculateTenProfileScoringV3 = tenProfileScoringV3;
export const getTenProfileScoringV3 = tenProfileScoringV3;
export default tenProfileScoringV3;