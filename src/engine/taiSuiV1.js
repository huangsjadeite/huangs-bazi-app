// src/engine/taiSuiV1.js
//
// Tai Sui (太岁) for the reading year: how the year's branch (the Grand Duke of
// that year) meets the client's zodiac sign (year branch), plus a note for the
// Day branch, and the compass sectors the year afflicts.
//   Sign vs Tai Sui: 值 same sign (本命年), 冲 clash, 刑 punishment, 害 harm,
//   破 destruction; 六合 / 三合 with the year count as support.
//   Year sectors: 太岁 (the year branch), 岁破 (the branch it clashes) and
//   三煞 Three Killings (the season trio opposite the year's trine).

import { EARTHLY_BRANCHES, getBranch, getBranchIndex, cycleMod } from "../data/baziConstants.js";
import { calculateYearPillar } from "./pillars.js";
import { TRIO_GROUPS } from "./shenShaV1.js";

const VERSION = "tai-sui-v1";

const pairKey = (a, b) => [a, b].sort().join("|");
const pairSet = (pairs) => new Set(pairs.map(([a, b]) => pairKey(a, b)));

const SIX_HARMONY = pairSet([["zi", "chou"], ["yin", "hai"], ["mao", "xu"], ["chen", "you"], ["si", "shen"], ["wu", "wei"]]);
const PUNISHMENTS = pairSet([
  ["zi", "mao"],
  ["yin", "si"], ["si", "shen"], ["yin", "shen"],
  ["chou", "xu"], ["xu", "wei"], ["chou", "wei"],
]);
const HARMS = pairSet([["zi", "wei"], ["chou", "wu"], ["yin", "si"], ["mao", "chen"], ["shen", "hai"], ["you", "xu"]]);
const DESTRUCTIONS = pairSet([["zi", "you"], ["mao", "wu"], ["chen", "chou"], ["wei", "xu"], ["yin", "hai"], ["si", "shen"]]);

const isClash = (a, b) => cycleMod(getBranchIndex(a) - getBranchIndex(b), 12) === 6;

// Strongest first; the first match sets the headline.
const CONFLICTS = {
  same: {
    zh: "值太岁", label: "Same sign as Tai Sui", level: "major",
    text: "This is your own zodiac year (本命年). Life tends to feel more up and down, and changes come whether you plan them or not. Steady, careful choices serve you better than big gambles.",
  },
  clash: {
    zh: "冲太岁", label: "Clashing with Tai Sui", level: "major",
    text: "Your sign sits directly opposite the year. Expect movement: a change of job, home, plans or people around you is likely. Change you choose goes better than change forced on you, so plan ahead.",
  },
  punishment: {
    zh: "刑太岁", label: "Punished by Tai Sui", level: "moderate",
    text: "The year brings pressure and tests: rules, paperwork, health or relationships may need extra care. Read before you sign and avoid shortcuts.",
  },
  harm: {
    zh: "害太岁", label: "Harmed by Tai Sui", level: "mild",
    text: "Small misunderstandings and gossip can build up. Speak clearly, keep promises in writing and give people the benefit of the doubt.",
  },
  destruction: {
    zh: "破太岁", label: "Broken by Tai Sui", level: "mild",
    text: "Minor disruptions to plans and some unexpected costs. Leave buffers in your timing and budget.",
  },
};

const SUPPORT = {
  sixHarmony: {
    zh: "六合", label: "Six Harmony with Tai Sui",
    text: "Your sign pairs with the year, so Tai Sui is on your side. Helpful people and smoother progress are likely; a good year to push your plans forward.",
  },
  threeHarmony: {
    zh: "三合", label: "Three Harmony with Tai Sui",
    text: "Your sign shares a team with the year, so its energy backs you up. A good year to work with others and build on what you started.",
  },
};

// Branch -> compass point and its 15° sector of the 24 Mountains.
const BRANCH_DIRECTION = {
  zi: "North", chou: "Northeast", yin: "Northeast", mao: "East", chen: "Southeast", si: "Southeast",
  wu: "South", wei: "Southwest", shen: "Southwest", you: "West", xu: "Northwest", hai: "Northwest",
};
const branchDegrees = (key) => {
  const centre = getBranchIndex(key) * 30;
  return { from: cycleMod(centre - 7.5, 360), to: cycleMod(centre + 7.5, 360) };
};

// Three Killings (三煞) sit in the season trio opposite the year's trine.
const THREE_KILLINGS = {
  shen: { direction: "South", branches: ["si", "wu", "wei"] },
  zi: { direction: "South", branches: ["si", "wu", "wei"] },
  chen: { direction: "South", branches: ["si", "wu", "wei"] },
  yin: { direction: "North", branches: ["hai", "zi", "chou"] },
  wu: { direction: "North", branches: ["hai", "zi", "chou"] },
  xu: { direction: "North", branches: ["hai", "zi", "chou"] },
  hai: { direction: "West", branches: ["shen", "you", "xu"] },
  mao: { direction: "West", branches: ["shen", "you", "xu"] },
  wei: { direction: "West", branches: ["shen", "you", "xu"] },
  si: { direction: "East", branches: ["yin", "mao", "chen"] },
  you: { direction: "East", branches: ["yin", "mao", "chen"] },
  chou: { direction: "East", branches: ["yin", "mao", "chen"] },
};

const describeBranch = (key) => {
  const b = getBranch(key);
  return { key: b.key, zh: b.zh, animal: b.animal };
};

function conflictsBetween(own, year) {
  const pair = pairKey(own, year);
  const found = [];
  if (own === year) found.push("same");
  if (isClash(own, year)) found.push("clash");
  if (PUNISHMENTS.has(pair)) found.push("punishment");
  if (HARMS.has(pair)) found.push("harm");
  if (DESTRUCTIONS.has(pair)) found.push("destruction");
  return found;
}

function supportBetween(own, year) {
  if (own === year) return [];
  const found = [];
  if (SIX_HARMONY.has(pairKey(own, year))) found.push("sixHarmony");
  if (TRIO_GROUPS.some((group) => group.branches.includes(own) && group.branches.includes(year))) found.push("threeHarmony");
  return found;
}

// Helper signs for a pendant: your sign's Six Harmony partner first, then your
// Three Harmony allies.
function helperSigns(own) {
  const partner = EARTHLY_BRANCHES.find((b) => b.key !== own && SIX_HARMONY.has(pairKey(own, b.key)));
  const trio = TRIO_GROUPS.find((group) => group.branches.includes(own));
  return [
    ...(partner ? [{ ...describeBranch(partner.key), relation: "六合 Six Harmony" }] : []),
    ...(trio?.branches.filter((key) => key !== own) || []).map((key) => ({ ...describeBranch(key), relation: "三合 Three Harmony" })),
  ];
}

export function buildTaiSuiV1({ pillars, selectedYear } = {}) {
  const own = pillars?.year?.branch?.key;
  if (!own || !selectedYear) return null;

  // Mid-year date sits safely after 立春, so this is that year's pillar.
  const yearPillar = calculateYearPillar({ year: selectedYear, month: 6, day: 15 });
  const year = yearPillar.branch.key;
  const conflictKeys = conflictsBetween(own, year);
  const supportKeys = conflictKeys.length ? [] : supportBetween(own, year);

  const dayBranch = pillars.day?.branch?.key;
  const dayConflicts = dayBranch && dayBranch !== own ? conflictsBetween(dayBranch, year).filter((key) => key !== "destruction") : [];

  const suiPo = EARTHLY_BRANCHES[cycleMod(getBranchIndex(year) + 6, 12)].key;
  const threeKillings = THREE_KILLINGS[year];

  return {
    version: VERSION,
    year: selectedYear,
    taiSui: { ...describeBranch(year), stemZh: yearPillar.stem.zh },
    sign: describeBranch(own),
    status: conflictKeys.length ? "conflict" : supportKeys.length ? "support" : "neutral",
    level: conflictKeys.length ? CONFLICTS[conflictKeys[0]].level : null,
    conflicts: conflictKeys.map((key) => ({ key, ...CONFLICTS[key] })),
    support: supportKeys.map((key) => ({ key, ...SUPPORT[key] })),
    dayBranch: dayConflicts.length
      ? { ...describeBranch(dayBranch), conflicts: dayConflicts.map((key) => ({ key, zh: CONFLICTS[key].zh, label: CONFLICTS[key].label })) }
      : null,
    helperSigns: helperSigns(own),
    affectedSigns: EARTHLY_BRANCHES.map((b) => ({ ...describeBranch(b.key), conflicts: conflictsBetween(b.key, year) }))
      .filter((b) => b.conflicts.length)
      .map((b) => ({ ...b, conflicts: b.conflicts.map((key) => ({ key, zh: CONFLICTS[key].zh, level: CONFLICTS[key].level })) })),
    sectors: [
      { key: "taiSui", zh: "太岁", label: "Tai Sui", direction: BRANCH_DIRECTION[year], branches: [describeBranch(year)], degrees: branchDegrees(year) },
      { key: "suiPo", zh: "岁破", label: "Year Breaker", direction: BRANCH_DIRECTION[suiPo], branches: [describeBranch(suiPo)], degrees: branchDegrees(suiPo) },
      {
        key: "threeKillings", zh: "三煞", label: "Three Killings", direction: threeKillings.direction,
        branches: threeKillings.branches.map(describeBranch),
        degrees: { from: branchDegrees(threeKillings.branches[0]).from, to: branchDegrees(threeKillings.branches[2]).to },
      },
    ],
  };
}

export default buildTaiSuiV1;
