// src/data/usefulGodV4.js

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

const STEM_ELEMENT = {
  Jia: "Wood", Yi: "Wood",
  Bing: "Fire", Ding: "Fire",
  Wu: "Earth", Ji: "Earth",
  Geng: "Metal", Xin: "Metal",
  Ren: "Water", Gui: "Water",
  甲: "Wood", 乙: "Wood",
  丙: "Fire", 丁: "Fire",
  戊: "Earth", 己: "Earth",
  庚: "Metal", 辛: "Metal",
  壬: "Water", 癸: "Water",
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

const BRANCH_MAIN_ELEMENT = {
  Zi: "Water", Chou: "Earth", Yin: "Wood", Mao: "Wood",
  Chen: "Earth", Si: "Fire", Wu: "Fire", Wei: "Earth",
  Shen: "Metal", You: "Metal", Xu: "Earth", Hai: "Water",

  子: "Water", 丑: "Earth", 寅: "Wood", 卯: "Wood",
  辰: "Earth", 巳: "Fire", 午: "Fire", 未: "Earth",
  申: "Metal", 酉: "Metal", 戌: "Earth", 亥: "Water",
};

const SEASON_CLIMATE = {
  Yin: { season: "early spring", climateNeed: ["Fire"], caution: ["Water"] },
  Mao: { season: "spring", climateNeed: ["Fire"], caution: ["Water"] },
  Chen: { season: "late spring", climateNeed: ["Metal", "Water"], caution: ["Earth"] },

  Si: { season: "early summer", climateNeed: ["Water", "Metal"], caution: ["Fire"] },
  Wu: { season: "summer", climateNeed: ["Water"], caution: ["Fire", "Earth"] },
  Wei: { season: "late summer", climateNeed: ["Water", "Metal"], caution: ["Fire", "Earth"] },

  Shen: { season: "early autumn", climateNeed: ["Fire", "Water"], caution: ["Metal"] },
  You: { season: "autumn", climateNeed: ["Fire"], caution: ["Metal"] },
  Xu: { season: "late autumn", climateNeed: ["Water", "Wood"], caution: ["Earth", "Fire"] },

  Hai: { season: "early winter", climateNeed: ["Fire", "Wood"], caution: ["Water"] },
  Zi: { season: "winter", climateNeed: ["Fire"], caution: ["Water", "Metal"] },
  Chou: { season: "late winter", climateNeed: ["Fire", "Wood"], caution: ["Earth", "Water"] },

  寅: { season: "early spring", climateNeed: ["Fire"], caution: ["Water"] },
  卯: { season: "spring", climateNeed: ["Fire"], caution: ["Water"] },
  辰: { season: "late spring", climateNeed: ["Metal", "Water"], caution: ["Earth"] },

  巳: { season: "early summer", climateNeed: ["Water", "Metal"], caution: ["Fire"] },
  午: { season: "summer", climateNeed: ["Water"], caution: ["Fire", "Earth"] },
  未: { season: "late summer", climateNeed: ["Water", "Metal"], caution: ["Fire", "Earth"] },

  申: { season: "early autumn", climateNeed: ["Fire", "Water"], caution: ["Metal"] },
  酉: { season: "autumn", climateNeed: ["Fire"], caution: ["Metal"] },
  戌: { season: "late autumn", climateNeed: ["Water", "Wood"], caution: ["Earth", "Fire"] },

  亥: { season: "early winter", climateNeed: ["Fire", "Wood"], caution: ["Water"] },
  子: { season: "winter", climateNeed: ["Fire"], caution: ["Water", "Metal"] },
  丑: { season: "late winter", climateNeed: ["Fire", "Wood"], caution: ["Earth", "Water"] },
};

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

function toToken(value) {
  // Stems/branches may arrive as rich objects ({ key, zh, name, label, element })
  // or as plain strings. The lookup tables in this module key on the name
  // ("Ji") or the Chinese character ("己"), so always reduce to a string token.
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
    stem: toToken(
      pillar.stem || pillar.heavenlyStem || pillar.hs || pillar.gan
    ),
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

function addScore(scores, element, amount) {
  // Only score the five real elements. A null/undefined pillar (e.g. a missing
  // hour pillar when birth time is unknown) must never create an "undefined"
  // bucket, which would corrupt the strength reading.
  if (!element || !ELEMENTS.includes(element)) return;
  scores[element] = (scores[element] || 0) + amount;
}

function getElementScores(chart = {}) {
  const pillars = getPillars(chart);
  const scores = Object.fromEntries(ELEMENTS.map((e) => [e, 0]));

  Object.values(pillars).forEach((pillar) => {
    // Skip pillars with no usable data (missing hour pillar in three-pillar mode).
    if (!pillar || (!pillar.stem && !pillar.branch)) return;

    const stemElement = STEM_ELEMENT[pillar.stem];
    const branchElement = BRANCH_MAIN_ELEMENT[pillar.branch];

    addScore(scores, stemElement, 1.2);
    addScore(scores, branchElement, 1.0);

    const hidden = BRANCH_HIDDEN_STEMS[pillar.branch] || [];
    hidden.forEach((stem, index) => {
      addScore(scores, STEM_ELEMENT[stem], index === 0 ? 0.55 : 0.25);
    });
  });

  const monthBranch = pillars.month.branch;
  const monthElement = BRANCH_MAIN_ELEMENT[monthBranch];
  addScore(scores, monthElement, 1.25);

  const annual = chart.annualOverlay || chart.currentYearOverlay || chart.yearOverlay;
  if (annual) {
    const annualStemElement = STEM_ELEMENT[annual.stem || annual.heavenlyStem];
    const annualBranchElement = BRANCH_MAIN_ELEMENT[annual.branch || annual.earthlyBranch];
    addScore(scores, annualStemElement, 0.45);
    addScore(scores, annualBranchElement, 0.55);
  }

  return scores;
}

function sortElementsByNeed(scores) {
  const values = ELEMENTS.map((e) => scores[e] || 0);
  const average = values.reduce((a, b) => a + b, 0) / ELEMENTS.length;

  return ELEMENTS
    .map((element) => ({
      element,
      score: scores[element] || 0,
      deficit: average - (scores[element] || 0),
    }))
    .sort((a, b) => b.deficit - a.deficit);
}

function getDayMasterElement(chart = {}) {
  const pillars = getPillars(chart);
  return (
    chart.dayMasterElement ||
    chart.dayElement ||
    STEM_ELEMENT[toToken(chart.dayMaster)] ||
    STEM_ELEMENT[pillars.day.stem] ||
    null
  );
}

function getStrengthBand(chart = {}) {
  // usefulGodV4 is called with { dayMasterStrengthV4: {...} }. That module
  // exposes `status` ("Excessive"/"Strong"/"Balanced"/"Weak"/...) and
  // `strengthScore`. Older callers used `dayMasterStrength`, so accept both.
  const dmV4 = chart.dayMasterStrengthV4 || chart.dayMasterStrength || {};

  const raw =
    dmV4.status ||
    dmV4.band ||
    dmV4.label ||
    chart.strengthBand ||
    chart.dmStrengthBand ||
    "";

  const text = String(raw).toLowerCase();

  if (text.includes("excessive")) return "veryStrong";
  if (text.includes("very strong")) return "veryStrong";
  if (text.includes("strong")) return "strong";
  if (text.includes("very weak")) return "veryWeak";
  if (text.includes("weak")) return "weak";

  const score =
    dmV4.strengthScore ??
    dmV4.score ??
    chart.dayMasterStrengthScore ??
    chart.strengthScore;

  if (typeof score === "number") {
    if (score >= 75) return "veryStrong";
    if (score >= 55) return "strong";
    if (score <= 25) return "veryWeak";
    if (score <= 45) return "weak";
  }

  return "balanced";
}

function uniquePush(list, item) {
  if (item && !list.includes(item)) list.push(item);
}

function removeExcessiveFavourables(favourable, caution, scores) {
  const values = ELEMENTS.map((e) => scores[e] || 0);
  const average = values.reduce((a, b) => a + b, 0) / ELEMENTS.length;
  const excessiveLimit = average * 1.35;

  return favourable.filter((element) => {
    const excessive = (scores[element] || 0) >= excessiveLimit;
    if (excessive) uniquePush(caution, element);
    return !excessive;
  });
}

function getAnnualCautions(chart = {}, scores = {}) {
  const annual = chart.annualOverlay || chart.currentYearOverlay || chart.yearOverlay;
  const cautions = [];

  if (!annual) return cautions;

  const stemElement = STEM_ELEMENT[annual.stem || annual.heavenlyStem];
  const branchElement = BRANCH_MAIN_ELEMENT[annual.branch || annual.earthlyBranch];

  [stemElement, branchElement].forEach((element) => {
    if (!element) return;
    if ((scores[element] || 0) >= 2.5) uniquePush(cautions, element);

    const produced = GENERATES[element];
    if ((scores[produced] || 0) >= 2.7) uniquePush(cautions, produced);
  });

  return cautions;
}

export function usefulGodV4(chart = {}) {
  const pillars = getPillars(chart);
  const dayMasterElement = getDayMasterElement(chart);
  const strengthBand = getStrengthBand(chart);
  const scores = getElementScores(chart);

  const monthBranch = pillars.month.branch;
  const climate = SEASON_CLIMATE[monthBranch] || {
    season: "unknown",
    climateNeed: [],
    caution: [],
  };

  // ---------------------------------------------------------------------------
  // STRENGTH-BALANCING FIRST (扶抑 fu-yi), to match the Joey Yap reading style.
  //
  // The PRIMARY useful elements come from whether the Day Master is strong or
  // weak:
  //   - Weak DM  -> support it: Resource (feeds DM) + the DM's own element.
  //   - Strong DM-> drain/balance it: Output (drains), Wealth (DM controls),
  //                 Officer (controls DM). The DM element and its Resource
  //                 become CAUTION (they make an already-strong DM stronger).
  //   - Balanced -> use the most deficient elements to even the chart out.
  //
  // Climate (調候) is then applied as a SECONDARY refinement, not the lead:
  // it can add a seasonal need and flag seasonal cautions, but it no longer
  // overrides the strength logic.
  // ---------------------------------------------------------------------------

  const favourable = []; // primary, strength-driven
  const secondary = []; // secondary refinements (climate + balance)
  const caution = [];

  let resourceElement;
  let outputElement;
  let wealthElement;
  let officerElement;

  if (dayMasterElement) {
    resourceElement = Object.keys(GENERATES).find(
      (element) => GENERATES[element] === dayMasterElement
    );
    outputElement = GENERATES[dayMasterElement];
    wealthElement = CONTROLS[dayMasterElement];
    officerElement = Object.keys(CONTROLS).find(
      (element) => CONTROLS[element] === dayMasterElement
    );

    if (strengthBand === "weak" || strengthBand === "veryWeak") {
      // Support the Day Master.
      uniquePush(favourable, resourceElement);
      uniquePush(favourable, dayMasterElement);
      // Too much draining/controlling is unhelpful for a weak DM.
      uniquePush(caution, wealthElement);
      uniquePush(caution, officerElement);
    } else if (strengthBand === "strong" || strengthBand === "veryStrong") {
      // Drain and balance a strong/excessive Day Master.
      uniquePush(favourable, outputElement);
      uniquePush(favourable, wealthElement);
      uniquePush(favourable, officerElement);
      // Adding more of the DM or its Resource over-strengthens it.
      uniquePush(caution, dayMasterElement);
      uniquePush(caution, resourceElement);
    } else {
      // Balanced DM: even out the chart using the most deficient elements.
      const balanceNeeds = sortElementsByNeed(scores)
        .filter((item) => item.deficit > 0)
        .map((item) => item.element);
      balanceNeeds.slice(0, 2).forEach((element) =>
        uniquePush(favourable, element)
      );
    }
  }

  // SECONDARY: climate refinement. A seasonal need is a nice-to-have unless it
  // is already in caution from the strength logic (then we don't contradict).
  climate.climateNeed.forEach((element) => {
    if (!caution.includes(element)) uniquePush(secondary, element);
  });
  // Seasonal cautions only apply if that element isn't a primary favourable.
  climate.caution.forEach((element) => {
    if (!favourable.includes(element)) uniquePush(caution, element);
  });

  // Balance fill: add the most deficient elements as secondary support, but
  // never something we've already cautioned.
  const balanceNeeds = sortElementsByNeed(scores)
    .filter((item) => item.deficit > 0)
    .map((item) => item.element);
  balanceNeeds.slice(0, 2).forEach((element) => {
    if (!caution.includes(element) && !favourable.includes(element)) {
      uniquePush(secondary, element);
    }
  });

  const annualCautions = getAnnualCautions(chart, scores);
  annualCautions.forEach((element) => {
    // Annual caution shouldn't override a primary strength-based favourable.
    if (!favourable.includes(element)) uniquePush(caution, element);
  });

  // Primary favourable = strength-driven list, with genuinely over-saturated
  // elements demoted to caution.
  let primaryFavourable = removeExcessiveFavourables(
    [...favourable],
    caution,
    scores
  );

  // If everything got filtered out (rare), fall back to the raw strength list
  // so we never return an empty recommendation.
  if (!primaryFavourable.length) primaryFavourable = [...favourable];

  const secondaryFavourable = [];
  secondary.forEach((element) => {
    if (!primaryFavourable.includes(element)) {
      uniquePush(secondaryFavourable, element);
    }
  });

  const cleanCaution = [...new Set(caution)].filter(
    (element) =>
      !primaryFavourable.includes(element) &&
      !secondaryFavourable.includes(element)
  );

  return {
    version: "UsefulGodV4",
    framework:
      "Strength-balancing (fu-yi) first, climate (tiao-hou) and chart balance second",
    dayMasterElement,
    strengthBand,
    season: climate.season,
    elementScores: scores,
    usefulElements: primaryFavourable,
    favourableElements: primaryFavourable,
    secondaryFavourableElements: secondaryFavourable,
    // Downstream engines (stoneRecommendationsV4, productRecommendationsV1)
    // expect singular primary/secondary useful-god elements.
    primaryUsefulGod: primaryFavourable[0] || null,
    secondaryUsefulGod:
      primaryFavourable[1] || secondaryFavourable[0] || null,
    cautionElements: cleanCaution,
    explanation: {
      strengthBand,
      strengthLogic:
        strengthBand === "weak" || strengthBand === "veryWeak"
          ? "Day Master is weak, so Resource and the Day Master's own element are supportive."
          : strengthBand === "strong" || strengthBand === "veryStrong"
          ? "Day Master is strong, so Output, Wealth and Officer help drain and balance it."
          : "Day Master is balanced, so the most deficient elements are used to even the chart.",
      regulation: primaryFavourable,
      balance: secondaryFavourable,
      annualOverlay:
        annualCautions.length > 0
          ? `Annual influence amplifies ${annualCautions.join(", ")}, so these are handled carefully.`
          : "Annual influence does not override the natal useful element logic.",
    },
  };
}

export const analyzeUsefulGodV4 = usefulGodV4;
export const getUsefulGodV4 = usefulGodV4;
export default usefulGodV4;