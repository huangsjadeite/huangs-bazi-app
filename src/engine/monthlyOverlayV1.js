// src/engine/monthlyOverlayV1.js
//
// Monthly forecast (流月). Each month's pillar is read against the natal
// chart in layers:
//   1. Element fit — the month's dominant element vs the Elements to Enhance
//      (Good +1 / Neutral 0 / Caution −1). The starting score.
//   2. Ten God — the dominant element's Ten God for the Day Master sets the
//      month's theme, what to do, what to watch and the life area it touches.
//   3. Branch relations with the natal pillars (clash / combine / harm /
//      punishment / destruction), located by pillar.
//   4. Shen Sha stars switched on by the month branch.
//   5. Void (空亡) — month branch is one of the Day pillar's void branches.
//   6. Tai Sui and the current Luck Pillar — month branch clashing either.
// Score adjustments: Day clash −1, any other natal clash −0.5, Day combo
// +0.5, Noble People +0.5, Void −0.5. Layers 3–6 need `pillars`; without
// them the month falls back to element fit only.

import { calculateYearPillar, calculateMonthPillar } from "./pillars.js";
import {
  ELEMENTS,
  STEM_WEIGHT,
  BRANCH_MAIN_ELEMENT_WEIGHT,
  HIDDEN_STEM_WEIGHT,
  getBranchIndex,
  cycleMod,
} from "../data/baziConstants.js";
import { calculateTenGod } from "./tenGods.js";
import { findRelations, getVoidBranches } from "./rawChartDataV1.js";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ELEMENT_FIT_SCORE = { Good: 1, Neutral: 0, Caution: -1 };

const TEN_GOD_MONTH = {
  Friend: {
    group: "Companion",
    theme: "Peers, teamwork and self-reliance",
    do: "network, team up with peers and work on shared goals",
    watch: "stubbornness, and having to split money or credit with others",
    area: "Career",
  },
  "Rob Wealth": {
    group: "Companion",
    theme: "Competition, bold moves and money going out",
    do: "compete, pitch and push for what you want",
    watch: "impulsive spending, lending money and rivals",
    area: "Wealth",
  },
  "Eating God": {
    group: "Output",
    theme: "Creativity and self-expression",
    do: "launch, present, publish and pitch ideas",
    watch: "over-indulgence and coasting",
    area: "Career",
  },
  "Hurting Officer": {
    group: "Output",
    theme: "Speaking up, innovation and breaking the mould",
    do: "innovate, perform and solve problems in new ways",
    watch: "clashes with bosses, careless words, and contract or legal issues",
    area: "Career",
  },
  "Direct Wealth": {
    group: "Wealth",
    theme: "Steady income and careful money management",
    do: "negotiate pay, budget, save and close steady deals",
    watch: "being too cautious or tight-fisted",
    area: "Wealth",
  },
  "Indirect Wealth": {
    group: "Wealth",
    theme: "Opportunities, deals and windfalls",
    do: "chase opportunities, sell, and expand your network",
    watch: "speculation and overspending",
    area: "Wealth",
  },
  "Direct Officer": {
    group: "Officer",
    theme: "Responsibility, recognition and structure",
    do: "go for promotion, sign formal agreements and deal with authorities",
    watch: "rigidity, and pressure to please everyone",
    area: "Career",
  },
  "Seven Killings": {
    group: "Officer",
    theme: "Pressure, competition and breakthroughs",
    do: "take on hard challenges and make decisive moves",
    watch: "stress, conflict, overwork and accidents",
    area: "Career",
  },
  "Direct Resource": {
    group: "Resource",
    theme: "Learning, support and mentors",
    do: "study, get certified, ask mentors for help, rest and recover",
    watch: "passivity and leaning too much on others",
    area: "Wellness",
  },
  "Indirect Resource": {
    group: "Resource",
    theme: "Insight, research and inner work",
    do: "research, plan and pursue specialist or spiritual study",
    watch: "overthinking, isolation and second-guessing",
    area: "Wellness",
  },
};

const PILLAR_INFO = {
  H: { name: "Hour", area: "children and side projects" },
  D: { name: "Day", area: "personal life and close relationships" },
  M: { name: "Month", area: "work and your role" },
  Y: { name: "Year", area: "family and older relatives" },
};

const STAR_NOTES = {
  peachBlossom: { icon: "🌸", label: "Peach Blossom", text: "romance and social charm are heightened" },
  noblePeople: { icon: "🙏", label: "Noble People", text: "help from others arrives, a good month to ask for favours" },
  skyHorse: { icon: "🐎", label: "Sky Horse", text: "travel, moving or a job change" },
  intelligenceStar: { icon: "🎓", label: "Intelligence Star", text: "good for exams, study and learning" },
  robberySha: { icon: "⚠️", label: "Robbery Sha", text: "watch for loss, theft and sudden setbacks" },
};

function scoreMonthPillarElements(monthPillar) {
  const scores = Object.fromEntries(ELEMENTS.map((element) => [element, 0]));

  scores[monthPillar.stem.element] += STEM_WEIGHT;
  scores[monthPillar.branch.element] += BRANCH_MAIN_ELEMENT_WEIGHT;

  monthPillar.branch.hiddenStems.forEach((hiddenStem) => {
    scores[hiddenStem.element] += HIDDEN_STEM_WEIGHT;
  });

  return scores;
}

function getDominantElement(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getElementFit(dominantElement, usefulGodV4) {
  const favourable = usefulGodV4?.favourableElements || [];
  const secondaryFavourable = usefulGodV4?.secondaryFavourableElements || [];
  const caution = usefulGodV4?.cautionElements || [];

  if (favourable.includes(dominantElement) || secondaryFavourable.includes(dominantElement)) {
    return "Good";
  }
  if (caution.includes(dominantElement)) {
    return "Caution";
  }
  return "Neutral";
}

function getRating(score) {
  if (score >= 1.5) return "Excellent";
  if (score >= 0.5) return "Good";
  if (score > -0.5) return "Mixed";
  if (score >= -1) return "Challenging";
  return "Difficult";
}

// The stem carrying the dominant element: the branch's main qi first (the
// branch rules the month), then the month stem, then any other hidden stem.
function getPrimaryStemKey(monthPillar, dominantElement) {
  const [mainQi, ...rest] = monthPillar.branch.hiddenStems;
  if (mainQi?.element === dominantElement) return mainQi.key;
  if (monthPillar.stem.element === dominantElement) return monthPillar.stem.key;
  return rest.find((hidden) => hidden.element === dominantElement)?.key || mainQi?.key;
}

function isPartnerStar(group, gender) {
  const normalized = (gender || "").toLowerCase();
  return (normalized === "male" && group === "Wealth") || (normalized === "female" && group === "Officer");
}

const isClash = (a, b) => cycleMod(getBranchIndex(a) - getBranchIndex(b), 12) === 6;

function starBranchKeys(star) {
  if (star.branch?.key) return [star.branch.key];
  return (star.branches || []).map((branch) => branch.key);
}

function readRelations(monthPillar, natalEntries) {
  const relations = findRelations(monthPillar, natalEntries);
  const watch = [];
  const support = [];
  const clashedPillars = [];
  let scoreChange = 0;
  const animal = monthPillar.branch.animal;
  const natalAnimal = (tag) => natalEntries.find((entry) => entry.tag === tag)?.pillar.branch.animal;

  relations.forEach(({ type, with: tags }) => {
    tags.forEach((tag) => {
      const pillar = PILLAR_INFO[tag];
      const against = `your ${pillar.name} pillar (${natalAnimal(tag)})`;
      if (type === "Clashes") {
        clashedPillars.push(tag);
        watch.push(
          tag === "D"
            ? `${animal} clashes ${against}: upheaval in personal life and close relationships, so avoid big personal decisions`
            : `${animal} clashes ${against}: changes or friction around ${pillar.area}`
        );
      } else if (type === "EB Combo") {
        support.push(`${animal} combines with ${against}: cooperation and support around ${pillar.area}`);
      } else if (type === "Harms" || type === "Punishment" || type === "Destruction") {
        watch.push(`${animal} ${type === "Harms" ? "harms" : type === "Punishment" ? "punishes" : "breaks"} ${against}: minor friction around ${pillar.area}`);
      }
    });
  });

  if (clashedPillars.includes("D")) scoreChange -= 1;
  if (clashedPillars.some((tag) => tag !== "D")) scoreChange -= 0.5;
  const combinesDay = relations.some((item) => item.type === "EB Combo" && item.with.includes("D"));
  if (combinesDay) scoreChange += 0.5;

  return { watch, support, clashedPillars, combinesDay, scoreChange };
}

function buildMonthNote({ chinese, branchAnimal, dominantElement, rating, theme }) {
  const lead = `${chinese} (${branchAnimal}) brings ${dominantElement} energy`;
  return theme ? `${lead}: ${theme.toLowerCase()}. Rated ${rating}.` : `${lead}. Rated ${rating}.`;
}

export function buildMonthlyOverlayV1({
  selectedYear,
  usefulGodV4,
  pillars = null,
  shenSha = null,
  gender = "",
  currentLuckBranchKey = null,
}) {
  // Mid-month day (15th) keeps every call safely inside that month's solar
  // boundary, away from Jie Qi cutover dates near the start of each month.

  const dayStemKey = pillars?.day?.stem?.key || null;
  const natalEntries = pillars
    ? Object.entries({ hour: "H", day: "D", month: "M", year: "Y" })
        .filter(([key]) => pillars[key])
        .map(([key, tag]) => ({ tag, key, pillar: pillars[key] }))
    : [];
  const voidBranches = pillars?.day ? getVoidBranches(pillars.day) : [];
  const stars = shenSha?.stars || [];

  const months = MONTH_NAMES.map((monthName, index) => {
    const monthNumber = index + 1;
    // January falls before the solar new year (立春, ~4 Feb), so it belongs to
    // the previous Chinese year and takes that year's month stems and Tai Sui.
    const monthYearPillar = calculateYearPillar({ year: selectedYear, month: monthNumber, day: 15 });
    const monthPillar = calculateMonthPillar(
      { month: monthNumber, day: 15 },
      monthYearPillar
    );

    const elementScores = scoreMonthPillarElements(monthPillar);
    const dominantElement = getDominantElement(elementScores);
    const read = getElementFit(dominantElement, usefulGodV4);
    const branchKey = monthPillar.branch.key;
    const branchAnimal = monthPillar.branch.animal;
    const chinese = `${monthPillar.stem.zh}${monthPillar.branch.zh}`;

    let score = ELEMENT_FIT_SCORE[read];

    // Ten God layer
    let tenGod = null;
    let guidance = null;
    let focusAreas = [];
    let activatesPartnerStar = false;
    if (dayStemKey) {
      const primary = calculateTenGod(dayStemKey, getPrimaryStemKey(monthPillar, dominantElement));
      tenGod = {
        primary,
        stem: calculateTenGod(dayStemKey, monthPillar.stem.key),
        branch: calculateTenGod(dayStemKey, monthPillar.branch.hiddenStems[0].key),
      };
      guidance = TEN_GOD_MONTH[primary];
      focusAreas = [guidance.area];
      activatesPartnerStar = isPartnerStar(guidance.group, gender);
      if (activatesPartnerStar) focusAreas.push("Relationships");
    }

    // Relations layer
    const relationRead = natalEntries.length
      ? readRelations(monthPillar, natalEntries)
      : { watch: [], support: [], clashedPillars: [], combinesDay: false, scoreChange: 0 };
    score += relationRead.scoreChange;
    if (relationRead.clashedPillars.includes("D") && !focusAreas.includes("Relationships")) {
      focusAreas.push("Relationships");
    }

    // Shen Sha layer
    const activeStars = stars
      .filter((star) => STAR_NOTES[star.key] && starBranchKeys(star).includes(branchKey))
      .map((star) => ({ key: star.key, ...STAR_NOTES[star.key] }));
    if (activeStars.some((star) => star.key === "noblePeople")) score += 0.5;

    // Void layer
    const isVoid = voidBranches.includes(branchKey);
    if (isVoid) score -= 0.5;

    const watch = [...relationRead.watch];
    if (isVoid) watch.push(`${branchAnimal} is a void (空亡) branch for you: plans may lose steam or fall through`);
    if (isClash(branchKey, monthYearPillar.branch.key)) {
      watch.push(`${branchAnimal} clashes the year's Tai Sui (${monthYearPillar.branch.animal}): a more turbulent month in general`);
    }
    if (currentLuckBranchKey && isClash(branchKey, currentLuckBranchKey)) {
      watch.push(`${branchAnimal} clashes your current 10-year Luck Pillar: expect a short shake-up of the decade's theme`);
    }

    const rating = getRating(score);

    return {
      month: monthNumber,
      monthName,
      year: selectedYear,
      chinese,
      stemName: monthPillar.stem.label,
      branchKey,
      branchAnimal,
      elementScores,
      dominantElement,
      read,
      score,
      rating,
      tenGod,
      tenGodGroup: guidance?.group || null,
      theme: guidance?.theme || null,
      doText: guidance?.do || null,
      watchText: guidance?.watch || null,
      focusAreas,
      activatesPartnerStar,
      support: relationRead.support,
      watch,
      clashedPillars: relationRead.clashedPillars,
      combinesDay: relationRead.combinesDay,
      stars: activeStars,
      isVoid,
      note: buildMonthNote({ chinese, branchAnimal, dominantElement, rating, theme: guidance?.theme }),
    };
  });

  return {
    version: "monthly-overlay-v2",
    selectedYear,
    months,
  };
}

export default buildMonthlyOverlayV1;
