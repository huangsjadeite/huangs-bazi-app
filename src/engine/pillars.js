import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  getStem,
  getBranch,
  getStemIndex,
  getBranchIndex,
  cycleMod,
} from "../data/baziConstants.js";

import {
  getSolarYearApprox,
  getSolarMonthBranchApprox,
} from "../data/solarTerms.js";

function cloneStem(stemKey) {
  const stem = getStem(stemKey);

  return {
    key: stem.key,
    zh: stem.zh,
    name: stem.name,
    label: stem.label,
    element: stem.element,
    polarity: stem.polarity,
  };
}

function cloneBranch(branchKey) {
  const branch = getBranch(branchKey);

  return {
    key: branch.key,
    zh: branch.zh,
    animal: branch.animal,
    element: branch.element,
    polarity: branch.polarity,
    hiddenStems: branch.hiddenStems.map((stemKey) => cloneStem(stemKey)),
  };
}

export function buildPillar({ stemKey, branchKey, meta = {} }) {
  return {
    stem: cloneStem(stemKey),
    branch: cloneBranch(branchKey),
    ...meta,
  };
}

export function calculateYearPillar(normalizedInput) {
  const solarYear = getSolarYearApprox(
    normalizedInput.year,
    normalizedInput.month,
    normalizedInput.day
  );

  const offset = solarYear - 1984;

  return buildPillar({
    stemKey: HEAVENLY_STEMS[cycleMod(offset, 10)].key,
    branchKey: EARTHLY_BRANCHES[cycleMod(offset, 12)].key,
    meta: { solarYear },
  });
}

export function calculateMonthPillar(normalizedInput, yearPillar) {
  const monthBranchKey = getSolarMonthBranchApprox(
    normalizedInput.month,
    normalizedInput.day
  );

  const monthBranchIndex = getBranchIndex(monthBranchKey);
  const yearStemIndex = getStemIndex(yearPillar.stem.key);

  const tigerStemStartByYearStemIndex = {
    0: 2,
    5: 2,
    1: 4,
    6: 4,
    2: 6,
    7: 6,
    3: 8,
    8: 8,
    4: 0,
    9: 0,
  };

  const tigerBranchIndex = getBranchIndex("yin");
  const monthsFromTiger = cycleMod(monthBranchIndex - tigerBranchIndex, 12);
  const monthStemIndex = cycleMod(
    tigerStemStartByYearStemIndex[yearStemIndex] + monthsFromTiger,
    10
  );

  return buildPillar({
    stemKey: HEAVENLY_STEMS[monthStemIndex].key,
    branchKey: monthBranchKey,
  });
}

export function calculateDayPillar(normalizedInput) {
  const referenceUtc = Date.UTC(1984, 1, 2);
  const currentUtc = Date.UTC(
    normalizedInput.year,
    normalizedInput.month - 1,
    normalizedInput.day
  );

  const dayOffset = Math.floor((currentUtc - referenceUtc) / 86400000);

  return buildPillar({
    stemKey: HEAVENLY_STEMS[cycleMod(dayOffset + 2, 10)].key,
    branchKey: EARTHLY_BRANCHES[cycleMod(dayOffset + 2, 12)].key,
  });
}

export function calculateHourPillar(normalizedInput, dayPillar) {
  if (!normalizedInput.useBirthTime || normalizedInput.hour === null) return null;

  const hour = normalizedInput.hour;
  const hourBranchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const dayStemIndex = getStemIndex(dayPillar.stem.key);

  const ziStemStartByDayStemIndex = {
    0: 0,
    5: 0,
    1: 2,
    6: 2,
    2: 4,
    7: 4,
    3: 6,
    8: 6,
    4: 8,
    9: 8,
  };

  const hourStemIndex = cycleMod(
    ziStemStartByDayStemIndex[dayStemIndex] + hourBranchIndex,
    10
  );

  return buildPillar({
    stemKey: HEAVENLY_STEMS[hourStemIndex].key,
    branchKey: EARTHLY_BRANCHES[hourBranchIndex].key,
  });
}

export function calculatePillars(normalizedInput) {
  const year = calculateYearPillar(normalizedInput);
  const month = calculateMonthPillar(normalizedInput, year);
  const day = calculateDayPillar(normalizedInput);
  const hour = calculateHourPillar(normalizedInput, day);

  return { year, month, day, hour };
}