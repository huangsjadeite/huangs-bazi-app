// src/engine/zodiacLuckV1.js
//
// General luck by zodiac sign (birth-year sign only) for a reading year, for
// the admin Zodiac Luck tool. Not used by the client report or PDFs.
//   Each sign gets Wealth, Career, Love and Health out of 100 (BASE plus the
//   points below) and an Overall average, from four layers:
//     1. the sign against Tai Sui (taiSuiV1),
//     2. the 12 Year Gods (岁君十二神) by distance from Tai Sui,
//     3. stars the year stem / branch switch on for the sign,
//     4. the year's stem and branch elements against the sign's element.
//   Each solar month is rated from the sign against the month branch
//   (zodiacCompatibilityV1), the month stem's element, Peach Blossom and the
//   month that clashes Tai Sui.
// All point values are DRAFT weights for Barnabas to confirm; change them in
// the weights block only.

import { EARTHLY_BRANCHES, getStem, getBranch, cycleMod, GENERATES, CONTROLS } from "../data/baziConstants.js";
import { SOLAR_MONTH_BOUNDARIES_APPROX } from "../data/solarTerms.js";
import { calculateYearPillar, getFiveTigersStem } from "./pillars.js";
import { buildTaiSuiV1 } from "./taiSuiV1.js";
import { buildZodiacCompatibilityV1 } from "./zodiacCompatibilityV1.js";
import { NOBLE_PEOPLE_BY_DAY_STEM, INTELLIGENCE_STAR_BY_DAY_STEM } from "./shenShaV1.js";
import { buildZodiacAdviceV1 } from "./zodiacLuckAdviceV1.js";

const VERSION = "zodiac-luck-v1";

// ---------------------------------------------------------------- weights
const BASE = 60;
export const AREAS = ["wealth", "career", "love", "health"];

// Layer 1: the sign against Tai Sui.
const TAI_SUI = {
  sixHarmony: { wealth: 10, career: 12, love: 12, health: 6 },
  threeHarmony: { wealth: 8, career: 8, love: 6, health: 4 },
  same: { wealth: -8, career: -8, love: -6, health: -8 },
  clash: { wealth: -12, career: -12, love: -10, health: -10 },
  punishment: { wealth: -4, career: -6, love: -6, health: -8 },
  harm: { wealth: -4, career: -4, love: -6, health: -2 },
  destruction: { wealth: -6, career: -4, love: -2, health: -2 },
};

// Layer 2: by distance from Tai Sui. 太岁 and 岁破 are scored in layer 1.
const YEAR_GODS = [
  { zh: "太岁", name: "Tai Sui", pts: {} },
  { zh: "太阳", name: "Sun", pts: { career: 8, wealth: 4 } },
  { zh: "丧门", name: "Mourning Door", pts: { health: -8, love: -4 } },
  { zh: "太阴", name: "Moon", pts: { love: 8, wealth: 4 } },
  { zh: "五鬼", name: "Five Ghosts", pts: { career: -6, wealth: -4 } },
  { zh: "死符", name: "Death Charm", pts: { health: -8, wealth: -4 } },
  { zh: "岁破", name: "Year Breaker", pts: {} },
  { zh: "龙德", name: "Dragon Virtue", pts: { career: 8, wealth: 6 } },
  { zh: "白虎", name: "White Tiger", pts: { health: -8, wealth: -4 } },
  { zh: "福德", name: "Fortune Virtue", pts: { wealth: 8, health: 4 } },
  { zh: "天狗", name: "Sky Dog", pts: { health: -6, love: -4 } },
  { zh: "病符", name: "Sickness Charm", pts: { health: -10 } },
];

// Layer 3.
const STARS = {
  nobleman: { zh: "天乙贵人", name: "Nobleman", pts: { career: 8, wealth: 6 } },
  intelligence: { zh: "文昌", name: "Intelligence", pts: { career: 8 } },
  prosperity: { zh: "禄", name: "Prosperity", pts: { wealth: 10 } },
  redPhoenix: { zh: "红鸾", name: "Red Phoenix", pts: { love: 12 } },
  heavenlyJoy: { zh: "天喜", name: "Heavenly Joy", pts: { love: 8 } },
  peachBlossom: { zh: "桃花", name: "Peach Blossom", pts: { love: 8 } },
  skyHorse: { zh: "驿马", name: "Sky Horse", pts: { career: 4 } },
};

// Layer 4: the year stem counts in full, the year branch at half.
const ELEMENT = {
  wealth: { label: "brings wealth (you control it)", pts: { wealth: 10 } },
  power: { label: "brings pressure and recognition (it controls you)", pts: { career: 8, health: -4 } },
  resource: { label: "supports you (it feeds you)", pts: { health: 6, career: 4 } },
  output: { label: "draws on your energy (you feed it)", pts: { love: 6, wealth: 2, health: -2 } },
  companion: { label: "same element, so more competition", pts: { wealth: -4, career: 2 } },
};

const MONTH = {
  relation: { sixHarmony: 6, threeHarmony: 4, clash: -8, punishment: -4, harm: -3, selfPunishment: -2 },
  element: { wealth: 4, power: 2, resource: 2, output: 1, companion: -2 },
  peachBlossom: 3,
  yearBreakerMonth: -3,
};
const MONTH_RATINGS = [[10, "Excellent"], [4, "Good"], [-3, "Mixed"], [-9, "Challenging"], [-Infinity, "Difficult"]];

// ------------------------------------------------------- classical tables
// 禄 Prosperity branch of each year stem.
const PROSPERITY = { jia: "yin", yi: "mao", bing: "si", ding: "wu", wu: "si", ji: "wu", geng: "shen", xin: "you", ren: "hai", gui: "zi" };
// Peach Blossom and Sky Horse by the sign's Three Harmony group.
const PEACH = { shen: "you", zi: "you", chen: "you", yin: "mao", wu: "mao", xu: "mao", si: "wu", you: "wu", chou: "wu", hai: "zi", mao: "zi", wei: "zi" };
const HORSE = { shen: "yin", zi: "yin", chen: "yin", yin: "shen", wu: "shen", xu: "shen", si: "hai", you: "hai", chou: "hai", hai: "si", mao: "si", wei: "si" };

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RELATION_LABELS = {
  sixHarmony: "Six Harmony",
  threeHarmony: "Three Harmony",
  clash: "clash",
  punishment: "punishment",
  harm: "harm",
  selfPunishment: "self punishment",
};

function elementRelation(own, other) {
  if (own === other) return "companion";
  if (CONTROLS[own] === other) return "wealth";
  if (CONTROLS[other] === own) return "power";
  if (GENERATES[other] === own) return "resource";
  return "output";
}

const scale = (pts, factor) => Object.fromEntries(Object.entries(pts).map(([k, v]) => [k, Math.round(v * factor)]));

// Approximate solar month spans, e.g. "4 Feb – 5 Mar".
function monthSpan(i) {
  const code = (c) => ({ day: c % 100, month: Math.floor(c / 100) });
  const start = code(SOLAR_MONTH_BOUNDARIES_APPROX[i].startCode);
  const next = code(SOLAR_MONTH_BOUNDARIES_APPROX[(i + 1) % 12].startCode);
  return `${start.day} ${MONTH_NAMES[start.month - 1]} – ${next.day - 1} ${MONTH_NAMES[next.month - 1]}`;
}

function scoreMonths(sign, yearStem, yearBranch, year) {
  const compat = buildZodiacCompatibilityV1({ pillars: { year: { branch: sign } } });
  const relationsWith = (key) => [...compat.best, ...compat.challenging].find((b) => b.key === key)?.reasons.map((r) => r.key) || [];

  return SOLAR_MONTH_BOUNDARIES_APPROX.map((boundary, i) => {
    const branch = getBranch(boundary.branch);
    const stem = getStem(getFiveTigersStem(yearStem.key, branch.key));
    const startMonth = Math.floor(boundary.startCode / 100);
    const notes = [];
    let score = 0;
    let money = 0;

    for (const key of relationsWith(branch.key)) {
      score += MONTH.relation[key];
      money += MONTH.relation[key];
      notes.push(`${RELATION_LABELS[key]} with the ${branch.animal} month`);
    }
    const rel = elementRelation(sign.element, stem.element);
    score += MONTH.element[rel];
    if (rel === "wealth" || rel === "companion") money += MONTH.element[rel];
    if (rel === "wealth") notes.push(`${stem.element} month brings wealth`);
    if (rel === "companion") notes.push(`${stem.element} month brings competition`);
    if (PEACH[sign.key] === branch.key) {
      score += MONTH.peachBlossom;
      notes.push("Peach Blossom month");
    }
    if (cycleMod(branch.index - yearBranch.index, 12) === 6) {
      score += MONTH.yearBreakerMonth;
      money += MONTH.yearBreakerMonth;
      notes.push("month clashes Tai Sui");
    }

    return {
      month: `${MONTH_NAMES[startMonth - 1]}${i === 11 ? ` ${year + 1}` : ""}`,
      span: monthSpan(i),
      pillar: `${stem.zh}${branch.zh}`,
      score,
      money,
      rating: MONTH_RATINGS.find(([min]) => score >= min)[1],
      notes,
    };
  });
}

function scoreSign(sign, yearStem, yearBranch, year) {
  const reasons = [];
  const add = (layer, why, pts, id, element) => reasons.push({ layer, why, pts, id, element });

  const taiSui = buildTaiSuiV1({ pillars: { year: { branch: { key: sign.key } } }, selectedYear: year });
  for (const c of [...taiSui.conflicts, ...taiSui.support]) add("Tai Sui", `${c.zh} ${c.label}`, TAI_SUI[c.key], `taiSui:${c.key}`);

  const god = YEAR_GODS[cycleMod(sign.index - yearBranch.index, 12)];
  if (Object.keys(god.pts).length) add("Year God", `${god.zh} ${god.name}`, god.pts, `god:${god.name}`);

  const star = (key) => add("Star", `${STARS[key].zh} ${STARS[key].name}`, STARS[key].pts, `star:${key}`);
  if (NOBLE_PEOPLE_BY_DAY_STEM[yearStem.key].includes(sign.key)) star("nobleman");
  if (INTELLIGENCE_STAR_BY_DAY_STEM[yearStem.key] === sign.key) star("intelligence");
  if (PROSPERITY[yearStem.key] === sign.key) star("prosperity");
  if (EARTHLY_BRANCHES[cycleMod(3 - sign.index, 12)].key === yearBranch.key) star("redPhoenix");
  if (EARTHLY_BRANCHES[cycleMod(9 - sign.index, 12)].key === yearBranch.key) star("heavenlyJoy");
  if (PEACH[sign.key] === yearBranch.key) star("peachBlossom");
  if (HORSE[sign.key] === yearBranch.key) star("skyHorse");

  const stemRel = elementRelation(sign.element, yearStem.element);
  add("Element", `Year stem ${yearStem.zh} ${yearStem.element} ${ELEMENT[stemRel].label}`, ELEMENT[stemRel].pts, `element:${stemRel}`, yearStem.element);
  const branchRel = elementRelation(sign.element, yearBranch.element);
  add("Element", `Year branch ${yearBranch.zh} ${yearBranch.element} ${ELEMENT[branchRel].label} (half weight)`, scale(ELEMENT[branchRel].pts, 0.5), `element:${branchRel}`, yearBranch.element);

  const scores = Object.fromEntries(
    AREAS.map((area) => [area, Math.max(5, Math.min(98, BASE + reasons.reduce((s, r) => s + (r.pts[area] || 0), 0)))])
  );
  scores.overall = Math.round(AREAS.reduce((s, a) => s + scores[a], 0) / AREAS.length);

  const months = scoreMonths(sign, yearStem, yearBranch, year);
  const result = {
    sign: { key: sign.key, zh: sign.zh, animal: sign.animal, element: sign.element },
    scores,
    reasons,
    months,
    bestMoneyMonths: [...months]
      .sort((a, b) => b.money - a.money || b.score - a.score)
      .slice(0, 3)
      .sort((a, b) => months.indexOf(a) - months.indexOf(b))
      .map((m) => m.month),
    watchMonths: months.filter((m) => m.rating === "Challenging" || m.rating === "Difficult").map((m) => m.month),
  };
  return { ...result, advice: buildZodiacAdviceV1(result, year) };
}

export function buildZodiacLuckV1({ year } = {}) {
  if (!year) return null;
  // Mid-year date sits safely after 立春, so this is that year's pillar.
  const yearPillar = calculateYearPillar({ year, month: 6, day: 15 });
  const yearStem = getStem(yearPillar.stem.key);
  const yearBranch = getBranch(yearPillar.branch.key);

  return {
    version: VERSION,
    year,
    pillar: `${yearStem.zh}${yearBranch.zh}`,
    yearName: `${yearStem.element} ${yearBranch.animal}`,
    signs: EARTHLY_BRANCHES.map((sign) => scoreSign(sign, yearStem, yearBranch, year)).sort(
      (a, b) => b.scores.overall - a.scores.overall
    ),
  };
}

export default buildZodiacLuckV1;
