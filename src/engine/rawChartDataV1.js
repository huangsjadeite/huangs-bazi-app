// src/engine/rawChartDataV1.js
//
// Practitioner-style "raw chart" grid: natal pillars, the selected year's
// pillar and every Luck Pillar, each annotated with Ten Gods (stem + hidden
// stems), the Day Master's 12 Growth Phase in that branch, Void (空亡) and
// relations against the natal pillars. Reads pillars and luck pillars; does
// not affect any other engine output.
//
// Relations follow the reference readings the owner validates against: stem
// combos, branch six-combos, clashes, harms, destructions, and punishments
// (子卯 pair, 寅巳申 / 丑戌未 only when all three are present). Stem clashes,
// self-punishment and three-harmony / seasonal combos are not listed.

import {
  CONTROLS,
  EARTHLY_BRANCHES,
  GENERATES,
  getBranch,
  getBranchIndex,
  getStem,
  getStemIndex,
  cycleMod,
} from "../data/baziConstants.js";
import { buildPillar, calculateYearPillar } from "./pillars.js";
import { calculateTenGod } from "./tenGods.js";

const VERSION = "raw-chart-data-v1";

const PILLAR_KEYS = ["hour", "day", "month", "year"];
const PILLAR_TAGS = { hour: "H", day: "D", month: "M", year: "Y" };

const TEN_GOD_SHORT = {
  Friend: { abbr: "F", zh: "比肩" },
  "Rob Wealth": { abbr: "RW", zh: "劫财" },
  "Eating God": { abbr: "EG", zh: "食神" },
  "Hurting Officer": { abbr: "HO", zh: "伤官" },
  "Direct Wealth": { abbr: "DW", zh: "正财" },
  "Indirect Wealth": { abbr: "IW", zh: "偏财" },
  "Direct Officer": { abbr: "DO", zh: "正官" },
  "Seven Killings": { abbr: "7K", zh: "七杀" },
  "Direct Resource": { abbr: "DR", zh: "正印" },
  "Indirect Resource": { abbr: "IR", zh: "偏印" },
};

// 12 Growth Phases (十二长生), in cycle order.
const GROWTH_PHASES = [
  { zh: "长生", en: "Growth" },
  { zh: "沐浴", en: "Bath" },
  { zh: "冠带", en: "Crowning" },
  { zh: "临官", en: "Officer" },
  { zh: "帝旺", en: "Peak" },
  { zh: "衰", en: "Weakening" },
  { zh: "病", en: "Sick" },
  { zh: "死", en: "Death" },
  { zh: "墓", en: "Grave" },
  { zh: "绝", en: "Extinction" },
  { zh: "胎", en: "Conceived" },
  { zh: "养", en: "Nurture" },
];

// Branch where each stem's 长生 phase sits. Yang stems step forward through
// the branches, Yin stems step backward.
const GROWTH_START_BRANCH = {
  jia: "hai", bing: "yin", wu: "yin", geng: "si", ren: "shen",
  yi: "wu", ding: "you", ji: "you", xin: "zi", gui: "mao",
};

const pairKey = (a, b) => [a, b].sort().join("|");
const pairSet = (pairs) => new Set(pairs.map(([a, b]) => pairKey(a, b)));

const STEM_COMBOS = pairSet([["jia", "ji"], ["yi", "geng"], ["bing", "xin"], ["ding", "ren"], ["wu", "gui"]]);
const BRANCH_COMBOS = pairSet([["zi", "chou"], ["yin", "hai"], ["mao", "xu"], ["chen", "you"], ["si", "shen"], ["wu", "wei"]]);
const HARMS = pairSet([["zi", "wei"], ["chou", "wu"], ["yin", "si"], ["mao", "chen"], ["shen", "hai"], ["you", "xu"]]);
const DESTRUCTIONS = pairSet([["zi", "you"], ["mao", "wu"], ["chen", "chou"], ["wei", "xu"], ["yin", "hai"], ["si", "shen"]]);
const PAIR_PUNISHMENTS = pairSet([["zi", "mao"]]);
const TRIPLE_PUNISHMENTS = [["yin", "si", "shen"], ["chou", "xu", "wei"]];

// Seasonal strength (旺相休囚死): how strong an element is in the birth
// month's season. The season's element is the month branch's element (Earth
// for the four transitional months 辰戌丑未).
const SEASON_STATES = {
  prosperous: { zh: "旺", en: "Prosperous" },
  strong: { zh: "相", en: "Strong" },
  resting: { zh: "休", en: "Resting" },
  trapped: { zh: "囚", en: "Trapped" },
  dead: { zh: "死", en: "Dead" },
};

function getSeasonState(element, seasonElement) {
  if (element === seasonElement) return SEASON_STATES.prosperous;
  if (GENERATES[seasonElement] === element) return SEASON_STATES.strong;
  if (GENERATES[element] === seasonElement) return SEASON_STATES.resting;
  if (CONTROLS[element] === seasonElement) return SEASON_STATES.trapped;
  return SEASON_STATES.dead;
}

function describeSeason(pillar, seasonElement) {
  if (!seasonElement) return null;
  return {
    stem: { element: pillar.stem.element, ...getSeasonState(pillar.stem.element, seasonElement) },
    branch: { element: pillar.branch.element, ...getSeasonState(pillar.branch.element, seasonElement) },
  };
}

const isClash = (a, b) => cycleMod(getBranchIndex(a) - getBranchIndex(b), 12) === 6;

function describeTenGod(dayStemKey, stemKey) {
  const tenGod = calculateTenGod(dayStemKey, stemKey);
  return {
    tenGod,
    tenGodAbbr: TEN_GOD_SHORT[tenGod].abbr,
    tenGodZh: TEN_GOD_SHORT[tenGod].zh,
  };
}

function getGrowthPhase(dayStemKey, branchKey) {
  const stem = getStem(dayStemKey);
  const start = getBranchIndex(GROWTH_START_BRANCH[stem.key]);
  const step = stem.polarity === "Yang" ? 1 : -1;
  const offset = cycleMod((getBranchIndex(branchKey) - start) * step, 12);
  return GROWTH_PHASES[offset];
}

// 空亡: the two branches left over in the day pillar's 10-day cycle (旬).
export function getVoidBranches(dayPillar) {
  const stemIndex = getStemIndex(dayPillar.stem.key);
  const branchIndex = getBranchIndex(dayPillar.branch.key);
  return [10, 11].map((step) => EARTHLY_BRANCHES[cycleMod(branchIndex - stemIndex + step, 12)].key);
}

// Relations between one pillar and a set of other pillars. `others` is a list
// of { tag, pillar }; the result lists each relation type once with the tags
// of the pillars involved, e.g. { type: "Clashes", with: ["H"] }.
export function findRelations(pillar, others) {
  const found = new Map();
  const add = (type, tag) => {
    if (!found.has(type)) found.set(type, []);
    if (tag && !found.get(type).includes(tag)) found.get(type).push(tag);
  };

  const stem = pillar.stem.key;
  const branch = pillar.branch.key;

  others.forEach(({ tag, pillar: other }) => {
    if (STEM_COMBOS.has(pairKey(stem, other.stem.key))) add("HS Combo", tag);

    const otherBranch = other.branch.key;
    if (BRANCH_COMBOS.has(pairKey(branch, otherBranch))) add("EB Combo", tag);
    if (isClash(branch, otherBranch)) add("Clashes", tag);
    if (HARMS.has(pairKey(branch, otherBranch))) add("Harms", tag);
    if (DESTRUCTIONS.has(pairKey(branch, otherBranch))) add("Destruction", tag);
    if (PAIR_PUNISHMENTS.has(pairKey(branch, otherBranch))) add("Punishment", tag);
  });

  // Three-way punishments count only when this pillar completes the full set.
  const branchesByTag = others.map(({ tag, pillar: other }) => ({ tag, key: other.branch.key }));
  const completes = (group) => {
    if (!group.includes(branch)) return null;
    const tags = group
      .filter((key) => key !== branch)
      .map((key) => branchesByTag.find((item) => item.key === key)?.tag);
    return tags.every(Boolean) ? tags : null;
  };

  TRIPLE_PUNISHMENTS.forEach((group) => {
    const tags = completes(group);
    if (tags) tags.forEach((tag) => add("Punishment", tag));
  });

  return [...found.entries()].map(([type, withTags]) => ({ type, with: withTags }));
}

function buildCell(pillar, { dayStemKey, voidBranches, isDayPillar = false }) {
  return {
    stem: {
      key: pillar.stem.key,
      zh: pillar.stem.zh,
      name: pillar.stem.name,
      element: pillar.stem.element,
      polarity: pillar.stem.polarity,
      ...(isDayPillar
        ? { tenGod: "Day Master", tenGodAbbr: "DM", tenGodZh: "日元" }
        : describeTenGod(dayStemKey, pillar.stem.key)),
    },
    branch: {
      key: pillar.branch.key,
      zh: pillar.branch.zh,
      name: pillar.branch.key.charAt(0).toUpperCase() + pillar.branch.key.slice(1),
      element: pillar.branch.element,
      polarity: pillar.branch.polarity,
      animal: pillar.branch.animal,
    },
    hiddenStems: pillar.branch.hiddenStems.map((hidden) => ({
      zh: hidden.zh,
      name: hidden.name,
      element: hidden.element,
      polarity: hidden.polarity,
      ...describeTenGod(dayStemKey, hidden.key),
    })),
    growthPhase: getGrowthPhase(dayStemKey, pillar.branch.key),
    isVoid: voidBranches.includes(pillar.branch.key),
  };
}

export function buildRawChartDataV1({ pillars, luckPillars, selectedYear, birthYear }) {
  if (!pillars?.day) return null;

  const dayStemKey = pillars.day.stem.key;
  const voidBranches = getVoidBranches(pillars.day);
  const context = { dayStemKey, voidBranches };

  const natalEntries = PILLAR_KEYS.filter((key) => pillars[key]).map((key) => ({
    tag: PILLAR_TAGS[key],
    key,
    pillar: pillars[key],
  }));

  const seasonElement = pillars.month?.branch?.element || null;

  const natal = Object.fromEntries(
    natalEntries.map(({ key, pillar }) => [
      key,
      {
        ...buildCell(pillar, { ...context, isDayPillar: key === "day" }),
        season: describeSeason(pillar, seasonElement),
        relations: findRelations(
          pillar,
          natalEntries.filter((entry) => entry.key !== key)
        ),
      },
    ])
  );

  const withNatalRelations = (pillar) => ({
    ...buildCell(pillar, context),
    relations: findRelations(pillar, natalEntries),
  });

  // Mid-year date sits safely after 立春, so this is that year's pillar.
  const yearPillar = selectedYear
    ? calculateYearPillar({ year: selectedYear, month: 6, day: 15 })
    : null;
  const annual = yearPillar
    ? { year: selectedYear, ...withNatalRelations(buildPillar({ stemKey: yearPillar.stem.key, branchKey: yearPillar.branch.key })) }
    : null;

  const ageInSelectedYear = selectedYear && birthYear ? selectedYear - birthYear : null;

  const luck = (luckPillars?.pillars || []).map((item) => ({
    startAge: item.startAge?.years ?? null,
    endAge: item.endAge?.years ?? null,
    isCurrent:
      ageInSelectedYear !== null &&
      ageInSelectedYear >= item.startAge?.years &&
      ageInSelectedYear < item.endAge?.years,
    ...withNatalRelations(item.pillar),
  }));

  return {
    version: VERSION,
    dayMaster: { zh: pillars.day.stem.zh, name: pillars.day.stem.name, element: pillars.day.stem.element },
    voidBranches: voidBranches.map((key) => getBranch(key).zh),
    seasonElement,
    natal,
    annual,
    luckDirection: luckPillars?.direction || null,
    luck,
    currentLuck: luck.find((item) => item.isCurrent) || null,
  };
}
