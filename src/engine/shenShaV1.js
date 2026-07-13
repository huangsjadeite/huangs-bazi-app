import { getBranch, getStem } from "../data/baziConstants.js";

// Shen Sha (神煞) auxiliary stars. Started with three validated against real
// reference output (Ma Weini's chart: Peach Blossom = Mao/Rabbit, Sky Horse
// = Shen/Monkey, Noble People = Wei/Goat, all matching). This round adds
// Intelligence Star, Solitary/Widow, Monthly Virtue, Heavenly Virtue, Five
// Ghosts and Robbery Sha, each sourced and cross-checked against multiple
// classical references before being added - see project memory for sources.
//
// White Tiger (白虎) is deliberately left out: sources disagree on what it
// even is - some equate it with 災煞 (a natal year-branch-trio lookup, same
// shape as everything else here), others treat it as an annual flying star
// relative to Tai Sui (a yearly-recalculated transit, structurally
// different from every other star in this file). Add only once it's clear
// which definition the reference tool being validated against actually uses.

// Standard "trine" groups (4 branches apart, 120° on the zodiac wheel).
// Used by Peach Blossom and Sky Horse (year-branch-keyed) and Monthly
// Virtue (month-branch-keyed) - the grouping shape is identical, only
// which pillar's branch you look up against it differs.
const TRIO_GROUPS = [
  { branches: ["yin", "wu", "xu"], peachBlossom: "mao", skyHorse: "shen", robberySha: "hai", monthlyVirtue: "bing" },
  { branches: ["shen", "zi", "chen"], peachBlossom: "you", skyHorse: "yin", robberySha: "si", monthlyVirtue: "ren" },
  { branches: ["hai", "mao", "wei"], peachBlossom: "zi", skyHorse: "si", robberySha: "shen", monthlyVirtue: "jia" },
  { branches: ["si", "you", "chou"], peachBlossom: "wu", skyHorse: "hai", robberySha: "yin", monthlyVirtue: "geng" },
];

// Seasonal-quarter groups (3 CONSECUTIVE branches each season) - a
// different grouping shape from the trine groups above. Used by
// Solitary/Widow only.
const SEASON_TRIO_GROUPS = [
  { branches: ["hai", "zi", "chou"], solitary: "yin", widow: "xu" },
  { branches: ["yin", "mao", "chen"], solitary: "si", widow: "chou" },
  { branches: ["si", "wu", "wei"], solitary: "shen", widow: "chen" },
  { branches: ["shen", "you", "xu"], solitary: "hai", widow: "wei" },
];

// Day Stem -> Noble People (Tian Yi Guiren) branches.
const NOBLE_PEOPLE_BY_DAY_STEM = {
  jia: ["chou", "wei"],
  wu: ["chou", "wei"],
  geng: ["chou", "wei"],
  yi: ["zi", "shen"],
  ji: ["zi", "shen"],
  bing: ["hai", "you"],
  ding: ["hai", "you"],
  ren: ["mao", "si"],
  gui: ["mao", "si"],
  xin: ["yin", "wu"],
};

// Day Stem -> Intelligence Star (Wen Chang Gui Ren) branch.
const INTELLIGENCE_STAR_BY_DAY_STEM = {
  jia: "si",
  yi: "wu",
  bing: "shen",
  ding: "you",
  wu: "shen",
  ji: "you",
  geng: "hai",
  xin: "zi",
  ren: "yin",
  gui: "mao",
};

// Year Branch -> Five Ghosts (五鬼) branch, a fixed +4 offset around the
// 12 branches.
const FIVE_GHOSTS_BY_YEAR_BRANCH = {
  zi: "chen",
  chou: "si",
  yin: "wu",
  mao: "wei",
  chen: "shen",
  si: "you",
  wu: "xu",
  wei: "hai",
  shen: "zi",
  you: "chou",
  xu: "yin",
  hai: "mao",
};

// Month Branch -> Heavenly Virtue (Tian De Gui Ren) target. The classical
// table mixes stems and branches depending on the month - some months'
// Heavenly Virtue is conventionally a branch rather than a stem, checked
// against either the stems or branches present in the chart. Do not force
// every entry into a single stem table.
const HEAVENLY_VIRTUE_BY_MONTH_BRANCH = {
  yin: { type: "stem", key: "ding" },
  mao: { type: "branch", key: "shen" },
  chen: { type: "stem", key: "ren" },
  si: { type: "stem", key: "xin" },
  wu: { type: "branch", key: "hai" },
  wei: { type: "stem", key: "jia" },
  shen: { type: "stem", key: "gui" },
  you: { type: "branch", key: "yin" },
  xu: { type: "stem", key: "bing" },
  hai: { type: "stem", key: "yi" },
  zi: { type: "branch", key: "si" },
  chou: { type: "stem", key: "geng" },
};

function findTrioGroup(branchKey) {
  return TRIO_GROUPS.find((group) => group.branches.includes(branchKey));
}

function findSeasonTrioGroup(branchKey) {
  return SEASON_TRIO_GROUPS.find((group) => group.branches.includes(branchKey));
}

function branchPresentInPillars(pillars, branchKey) {
  return Object.values(pillars)
    .filter(Boolean)
    .some((pillar) => pillar.branch.key === branchKey);
}

function stemPresentInPillars(pillars, stemKey) {
  return Object.values(pillars)
    .filter(Boolean)
    .some((pillar) => pillar.stem.key === stemKey);
}

export function buildShenShaV1({ pillars }) {
  if (!pillars?.year || !pillars?.day) return null;

  const yearBranchKey = pillars.year.branch.key;
  const dayBranchKey = pillars.day.branch.key;
  const dayStemKey = pillars.day.stem.key;
  const monthBranchKey = pillars.month?.branch?.key || null;

  const yearTrioGroup = findTrioGroup(yearBranchKey);
  // Solitary/Widow are keyed by DAY branch, not year branch - verified
  // against 3 real Joey Yap reference charts (Ma Weini, Suyin C, Wong Lee
  // Lee, all exact matches). Originally implemented as year-branch-keyed
  // based on the source's grouping label; the grouping table itself was
  // right, just anchored to the wrong pillar.
  const daySeasonGroup = findSeasonTrioGroup(dayBranchKey);
  const monthTrioGroup = monthBranchKey ? findTrioGroup(monthBranchKey) : null;

  const peachBlossomBranchKey = yearTrioGroup?.peachBlossom || null;
  const skyHorseBranchKey = yearTrioGroup?.skyHorse || null;
  const robberyShaBranchKey = yearTrioGroup?.robberySha || null;
  const solitaryBranchKey = daySeasonGroup?.solitary || null;
  const widowBranchKey = daySeasonGroup?.widow || null;
  const nobleBranchKeys = NOBLE_PEOPLE_BY_DAY_STEM[dayStemKey] || [];
  const intelligenceBranchKey = INTELLIGENCE_STAR_BY_DAY_STEM[dayStemKey] || null;
  const fiveGhostsBranchKey = FIVE_GHOSTS_BY_YEAR_BRANCH[yearBranchKey] || null;
  const monthlyVirtueStemKey = monthTrioGroup?.monthlyVirtue || null;
  const heavenlyVirtue = monthBranchKey
    ? HEAVENLY_VIRTUE_BY_MONTH_BRANCH[monthBranchKey] || null
    : null;

  const branchLabel = (key) => {
    if (!key) return null;
    const branch = getBranch(key);
    return { key, zh: branch.zh, animal: branch.animal };
  };

  const stemLabel = (key) => {
    if (!key) return null;
    const stem = getStem(key);
    return { key, zh: stem.zh, name: stem.name };
  };

  const stars = [];

  if (peachBlossomBranchKey) {
    stars.push({
      key: "peachBlossom",
      name: "Peach Blossom",
      zh: "桃花",
      branch: branchLabel(peachBlossomBranchKey),
      theme: "Charm, attractiveness, romantic and social opportunities.",
      caution: "Can also bring romantic complications or scattered attention.",
      active: branchPresentInPillars(pillars, peachBlossomBranchKey),
    });
  }

  if (skyHorseBranchKey) {
    stars.push({
      key: "skyHorse",
      name: "Sky Horse",
      zh: "驛馬",
      branch: branchLabel(skyHorseBranchKey),
      theme: "Travel, movement, relocation, change of environment.",
      caution: "Can also show as restlessness or difficulty settling.",
      active: branchPresentInPillars(pillars, skyHorseBranchKey),
    });
  }

  if (nobleBranchKeys.length) {
    stars.push({
      key: "noblePeople",
      name: "Noble People",
      zh: "天乙貴人",
      branches: nobleBranchKeys.map((key) => branchLabel(key)),
      theme: "Helpful mentors or benefactors who appear at key moments.",
      caution: null,
      active: nobleBranchKeys.some((key) => branchPresentInPillars(pillars, key)),
    });
  }

  if (intelligenceBranchKey) {
    stars.push({
      key: "intelligenceStar",
      name: "Intelligence Star",
      zh: "文昌貴人",
      branch: branchLabel(intelligenceBranchKey),
      theme: "Learning, study, exam performance, intellectual recognition.",
      caution: null,
      active: branchPresentInPillars(pillars, intelligenceBranchKey),
    });
  }

  if (solitaryBranchKey) {
    stars.push({
      key: "solitary",
      name: "Solitary",
      zh: "孤辰",
      branch: branchLabel(solitaryBranchKey),
      theme: null,
      caution: "A tendency to feel unsupported or out of place, particularly when starting new chapters or in early life.",
      active: branchPresentInPillars(pillars, solitaryBranchKey),
    });
  }

  if (widowBranchKey) {
    stars.push({
      key: "widow",
      name: "Widow Star",
      zh: "寡宿",
      branch: branchLabel(widowBranchKey),
      theme: null,
      caution: "A tendency toward emotional withdrawal after loss or endings; can show as guardedness in close relationships.",
      active: branchPresentInPillars(pillars, widowBranchKey),
    });
  }

  if (monthlyVirtueStemKey) {
    stars.push({
      key: "monthlyVirtue",
      name: "Monthly Virtue",
      zh: "月德貴人",
      stem: stemLabel(monthlyVirtueStemKey),
      theme: "A recurring protective influence — disputes and difficulties tend to resolve more smoothly, month to month.",
      caution: null,
      active: stemPresentInPillars(pillars, monthlyVirtueStemKey),
    });
  }

  if (heavenlyVirtue) {
    const active =
      heavenlyVirtue.type === "stem"
        ? stemPresentInPillars(pillars, heavenlyVirtue.key)
        : branchPresentInPillars(pillars, heavenlyVirtue.key);

    stars.push({
      key: "heavenlyVirtue",
      name: "Heavenly Virtue",
      zh: "天德貴人",
      [heavenlyVirtue.type]:
        heavenlyVirtue.type === "stem"
          ? stemLabel(heavenlyVirtue.key)
          : branchLabel(heavenlyVirtue.key),
      theme: "One of the most powerful protective stars — heaven's grace helps resolve serious difficulties, including illness, legal matters and setbacks.",
      caution: null,
      active,
    });
  }

  if (fiveGhostsBranchKey) {
    stars.push({
      key: "fiveGhosts",
      name: "Five Ghosts",
      zh: "五鬼",
      branch: branchLabel(fiveGhostsBranchKey),
      theme: null,
      caution: "Can show as friction, misunderstandings, or obstacles needing extra care to resolve.",
      active: branchPresentInPillars(pillars, fiveGhostsBranchKey),
    });
  }

  if (robberyShaBranchKey) {
    stars.push({
      key: "robberySha",
      name: "Robbery Sha",
      zh: "劫殺",
      branch: branchLabel(robberyShaBranchKey),
      theme: null,
      caution: "Can show as sudden setbacks or loss requiring more cautious decision-making.",
      active: branchPresentInPillars(pillars, robberyShaBranchKey),
    });
  }

  return {
    version: "shen-sha-v1",
    stars,
  };
}

export default buildShenShaV1;
