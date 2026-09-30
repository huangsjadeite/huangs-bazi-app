// src/engine/dateSelectionV1.js
//
// Personal Date Selection: rates a calendar day for one person, in the style of
// a Tong Shu day read. Three independent inputs:
//   1. The day's own element read against the person's Elements to Enhance
//      (same dominant-element rule as monthlyOverlayV1).
//   2. The day's Ten God relative to the Day Master, grouped into the five
//      energies (Companion / Output / Wealth / Power / Resource), which decide
//      what the day is suited for.
//   3. The 12 Day Officers (建除十二神): position of the day branch counted from
//      the month branch (建 = same branch). Rated with the classical rhyme
//      「建满平收黑，除危定执黄，成开皆可用，闭破不相当」.
// A day whose branch clashes the natal Day branch (日冲) is flagged regardless.
//
// The month branch comes from the real Jie-term timestamps, so days either
// side of a solar term get the correct Chinese month.

import {
  ELEMENTS,
  STEM_WEIGHT,
  BRANCH_MAIN_ELEMENT_WEIGHT,
  HIDDEN_STEM_WEIGHT,
  getBranchIndex,
  cycleMod,
} from "../data/baziConstants.js";
import { getNearestJieTerm, getSolarMonthBranchApprox } from "../data/solarTerms.js";
import { calculateDayPillar } from "./pillars.js";
import { calculateTenGod } from "./tenGods.js";

const VERSION = "date-selection-v1";

const DAY_OFFICERS = [
  {
    zh: "建", en: "Establish", quality: "mixed",
    goodFor: ["Starting a new job", "Meeting important people", "Applying for positions"],
    avoid: ["Groundbreaking or renovation", "Moving house"],
  },
  {
    zh: "除", en: "Remove", quality: "good",
    goodFor: ["Decluttering and cleaning", "Medical treatment", "Ending bad habits or contracts"],
    avoid: ["Weddings", "Large purchases"],
  },
  {
    zh: "满", en: "Full", quality: "mixed",
    goodFor: ["Celebrations", "Product launches", "Collecting payments"],
    avoid: ["Medical procedures", "Legal action"],
  },
  {
    zh: "平", en: "Balance", quality: "mixed",
    goodFor: ["Repairs and maintenance", "Routine work", "Settling disagreements"],
    avoid: ["Big launches", "Weddings"],
  },
  {
    zh: "定", en: "Stable", quality: "good",
    goodFor: ["Signing contracts", "Hiring staff", "Long-term commitments", "Weddings"],
    avoid: ["Travel", "Lawsuits"],
  },
  {
    zh: "执", en: "Initiate", quality: "good",
    goodFor: ["Hiring", "Collecting debts", "Starting construction"],
    avoid: ["Moving house", "Long-distance travel"],
  },
  {
    zh: "破", en: "Destruction", quality: "avoid",
    goodFor: ["Demolition", "Ending things that no longer serve"],
    avoid: ["Weddings", "Openings", "Signing contracts", "Most major events"],
  },
  {
    zh: "危", en: "Danger", quality: "good",
    goodFor: ["Prayer and reflection", "Low-risk routine work"],
    avoid: ["Risky activities", "Travel", "Climbing heights"],
  },
  {
    zh: "成", en: "Success", quality: "good",
    goodFor: ["Grand openings", "Signing contracts", "Weddings", "Moving house"],
    avoid: ["Lawsuits"],
  },
  {
    zh: "收", en: "Receive", quality: "mixed",
    goodFor: ["Collecting payments", "Closing sales", "Buying property or stock"],
    avoid: ["Starting new projects", "Medical procedures"],
  },
  {
    zh: "开", en: "Open", quality: "good",
    goodFor: ["Grand openings", "Starting new ventures", "Starting work", "Weddings"],
    avoid: ["Funerals and burials"],
  },
  {
    zh: "闭", en: "Close", quality: "avoid",
    goodFor: ["Saving money", "Finishing work", "Rest"],
    avoid: ["Openings", "Launches", "Medical procedures", "Travel"],
  },
];

const OFFICER_QUALITY_LABEL = {
  good: "Good for major events",
  mixed: "Fine for smaller matters",
  avoid: "Avoid major events",
};

const TEN_GOD_ENERGY = {
  Friend: "Companion",
  "Rob Wealth": "Companion",
  "Eating God": "Output",
  "Hurting Officer": "Output",
  "Direct Wealth": "Wealth",
  "Indirect Wealth": "Wealth",
  "Direct Officer": "Power",
  "Seven Killings": "Power",
  "Direct Resource": "Resource",
  "Indirect Resource": "Resource",
};

const ENERGY_SUITED_FOR = {
  Companion: ["Networking", "Teamwork and partnerships", "Competitions"],
  Output: ["Starting new projects", "Presentations and pitching", "Creative work", "Marketing launches"],
  Wealth: ["Sales and negotiations", "Business deals", "Collecting payments", "Investment decisions"],
  Power: ["Job interviews", "Meeting authority figures", "Official or legal matters", "Taking on responsibility"],
  Resource: ["Studying and planning", "Seeking advice or mentors", "Signing documents", "Rest and recharging"],
};

function getMonthBranchForDate(year, month, day) {
  const found = getNearestJieTerm(year, month, day, 12, 0, "backward");
  return found?.term?.branch || getSolarMonthBranchApprox(month, day);
}

function getDominantElement(pillar) {
  const scores = Object.fromEntries(ELEMENTS.map((element) => [element, 0]));
  scores[pillar.stem.element] += STEM_WEIGHT;
  scores[pillar.branch.element] += BRANCH_MAIN_ELEMENT_WEIGHT;
  pillar.branch.hiddenStems.forEach((hidden) => {
    scores[hidden.element] += HIDDEN_STEM_WEIGHT;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getPersonalRead(element, elements) {
  if ([...(elements.favourable || []), ...(elements.secondaryFavourable || [])].includes(element)) return "good";
  if ((elements.caution || []).includes(element)) return "caution";
  return "neutral";
}

const isClash = (a, b) => cycleMod(getBranchIndex(a) - getBranchIndex(b), 12) === 6;

function getOverallRating({ personalRead, officerQuality, clashesDayBranch }) {
  if (clashesDayBranch) return "Clashes their Day pillar";
  if (officerQuality === "avoid") return "Inauspicious";
  if (personalRead === "good" && officerQuality === "good") return "Auspicious";
  if (personalRead === "caution" && officerQuality !== "good") return "Challenging";
  if (personalRead === "good" || officerQuality === "good") return "Favourable";
  return "Neutral";
}

const RATING_RANK = {
  Auspicious: 5,
  Favourable: 4,
  Neutral: 3,
  Challenging: 2,
  Inauspicious: 1,
  "Clashes their Day pillar": 0,
};

// natal: { dayStemKey, dayBranchKey }
// elements: { favourable, secondaryFavourable, caution } element-name lists
export function buildDateSelectionV1({ date, natal, elements }) {
  if (!date || !natal?.dayStemKey) return null;
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;

  const dayPillar = calculateDayPillar({ year, month, day });
  const monthBranchKey = getMonthBranchForDate(year, month, day);
  const officer = DAY_OFFICERS[cycleMod(getBranchIndex(dayPillar.branch.key) - getBranchIndex(monthBranchKey), 12)];

  const tenGod = calculateTenGod(natal.dayStemKey, dayPillar.stem.key);
  const energy = TEN_GOD_ENERGY[tenGod];
  const dominantElement = getDominantElement(dayPillar);
  const personalRead = getPersonalRead(dominantElement, elements || {});
  const clashesDayBranch = natal.dayBranchKey ? isClash(dayPillar.branch.key, natal.dayBranchKey) : false;
  const rating = getOverallRating({ personalRead, officerQuality: officer.quality, clashesDayBranch });

  return {
    version: VERSION,
    date,
    dayPillar: {
      zh: `${dayPillar.stem.zh}${dayPillar.branch.zh}`,
      stemElement: dayPillar.stem.element,
      animal: dayPillar.branch.animal,
    },
    dominantElement,
    personalRead,
    tenGod,
    energy,
    officer: {
      zh: officer.zh,
      en: officer.en,
      quality: officer.quality,
      qualityLabel: OFFICER_QUALITY_LABEL[officer.quality],
      avoid: officer.avoid,
    },
    clashesDayBranch,
    rating,
    rank: RATING_RANK[rating],
    // Officer activities first (what the day itself supports), then the
    // person's Ten God energy for the day.
    suitableFor: officer.quality === "avoid" ? officer.goodFor : [...new Set([...officer.goodFor, ...(ENERGY_SUITED_FOR[energy] || [])])],
  };
}

// Best days in the `days` after `startDate` (inclusive), best first then by
// date. Only Auspicious and Favourable days are returned.
export function findBestDatesV1({ startDate, days = 30, natal, elements, limit = 6 }) {
  if (!startDate) return [];
  const [year, month, day] = startDate.split("-").map(Number);
  const results = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(Date.UTC(year, month - 1, day + i));
    const iso = d.toISOString().slice(0, 10);
    const read = buildDateSelectionV1({ date: iso, natal, elements });
    if (read && read.rank >= RATING_RANK.Favourable) results.push(read);
  }
  return results
    .sort((a, b) => b.rank - a.rank || a.date.localeCompare(b.date))
    .slice(0, limit)
    .sort((a, b) => a.date.localeCompare(b.date));
}
