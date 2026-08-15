export const SOLAR_MONTH_BOUNDARIES_APPROX = [
  { startCode: 204, branch: "yin", label: "Li Chun approx" },
  { startCode: 306, branch: "mao", label: "Jing Zhe approx" },
  { startCode: 405, branch: "chen", label: "Qing Ming approx" },
  { startCode: 506, branch: "si", label: "Li Xia approx" },
  { startCode: 606, branch: "wu", label: "Mang Zhong approx" },
  { startCode: 707, branch: "wei", label: "Xiao Shu approx" },
  { startCode: 808, branch: "shen", label: "Li Qiu approx" },
  { startCode: 908, branch: "you", label: "Bai Lu approx" },
  { startCode: 1008, branch: "xu", label: "Han Lu approx" },
  { startCode: 1107, branch: "hai", label: "Li Dong approx" },
  { startCode: 1207, branch: "zi", label: "Da Xue approx" },
  { startCode: 106, branch: "chou", label: "Xiao Han approx" },
];

export const SEASONAL_ELEMENT_WEIGHT = {
  yin: { Wood: 1.4, Fire: 1.1, Earth: 0.9, Metal: 0.7, Water: 0.9 },
  mao: { Wood: 1.5, Fire: 1.1, Earth: 0.8, Metal: 0.7, Water: 0.8 },
  chen: { Wood: 1.1, Fire: 0.9, Earth: 1.3, Metal: 0.8, Water: 0.9 },
  si: { Wood: 0.9, Fire: 1.4, Earth: 1.1, Metal: 0.8, Water: 0.7 },
  wu: { Wood: 0.8, Fire: 1.5, Earth: 1.2, Metal: 0.7, Water: 0.6 },
  wei: { Wood: 0.9, Fire: 1.1, Earth: 1.4, Metal: 0.8, Water: 0.7 },
  shen: { Wood: 0.7, Fire: 0.8, Earth: 1.0, Metal: 1.4, Water: 1.1 },
  you: { Wood: 0.6, Fire: 0.7, Earth: 0.9, Metal: 1.5, Water: 1.0 },
  xu: { Wood: 0.7, Fire: 0.9, Earth: 1.4, Metal: 1.1, Water: 0.8 },
  hai: { Wood: 1.1, Fire: 0.7, Earth: 0.8, Metal: 0.9, Water: 1.4 },
  zi: { Wood: 1.0, Fire: 0.6, Earth: 0.7, Metal: 0.9, Water: 1.5 },
  chou: { Wood: 0.8, Fire: 0.7, Earth: 1.3, Metal: 0.9, Water: 1.1 },
};

import { SOLAR_TERM_TIMESTAMPS_BY_YEAR } from "./solarTermTimestamps.js";

// Real per-year Jie-term timestamps (see solarTermTimestamps.js / generator
// at scripts/generateSolarTerms.mjs), used for Luck Pillar starting-age
// precision - unlike getSolarMonthBranchApprox above, this needs the true
// astronomical instant, not a fixed calendar-date approximation, since a
// 1-2 day error here becomes a ~4-8 month error in starting age (3 days =
// 1 year). Treated as naive local civil time, same simplification the rest
// of this engine already uses for birth date/time (see module comment in
// generateSolarTerms.mjs for why Beijing time is the reference here).
function timestampToComparable(t) {
  return Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute);
}

function getJieTermsAround(year) {
  return [year - 1, year, year + 1].flatMap(
    (y) => SOLAR_TERM_TIMESTAMPS_BY_YEAR[y] || []
  );
}

// Finds the nearest Jie term to the given birth moment, in the requested
// direction ("forward" = next upcoming term, "backward" = most recent past
// term), and returns the day-distance (fractional) plus the term itself.
export function getNearestJieTerm(year, month, day, hour, minute, direction) {
  const birthValue = Date.UTC(year, month - 1, day, hour ?? 0, minute ?? 0);
  const candidates = getJieTermsAround(year);

  let nearest = null;
  let nearestValue = null;

  for (const term of candidates) {
    const value = timestampToComparable(term.timestamp);

    if (direction === "forward") {
      if (value > birthValue && (nearestValue === null || value < nearestValue)) {
        nearest = term;
        nearestValue = value;
      }
    } else {
      if (value <= birthValue && (nearestValue === null || value > nearestValue)) {
        nearest = term;
        nearestValue = value;
      }
    }
  }

  if (!nearest) return null;

  const dayDistance = Math.abs(nearestValue - birthValue) / 86400000;

  return { term: nearest, dayDistance };
}

export function getSolarYearApprox(year, month, day) {
  const beforeLiChun = month < 2 || (month === 2 && day < 4);
  return beforeLiChun ? year - 1 : year;
}

// Precise 立春 year boundary, using the real per-year Jie-term timestamps
// (SOLAR_TERM_TIMESTAMPS_BY_YEAR, Meeus solar longitude) instead of the
// fixed Feb-4 approximation above. 立春 lands on the 3rd or 5th in a large
// minority of years, so the fixed cutoff misclassifies boundary births -
// this is what year-pillar and Eight Mansions gua should use instead.
// timeKnown matters only when the birth lands on the 立春 day itself; when
// it does and time is unknown, needsTime comes back true rather than
// guessing. Falls outside the timestamp table's 1899-2036 range, this
// falls back to the approximation and flags outOfRange.
export function getSolarYearPrecise(year, month, day, hour = 0, minute = 0, timeKnown = false) {
  const terms = SOLAR_TERM_TIMESTAMPS_BY_YEAR[year];
  const liChun = terms?.find((t) => t.branch === "yin");
  if (!liChun) {
    return {
      year: getSolarYearApprox(year, month, day),
      onBoundaryDay: false,
      needsTime: false,
      outOfRange: true,
    };
  }
  const { day: lcDay, hour: lcH, minute: lcM } = liChun.timestamp;
  const onBoundaryDay = month === 2 && day === lcDay;
  let before;
  if (month < 2) before = true;
  else if (month > 2) before = false;
  else if (day < lcDay) before = true;
  else if (day > lcDay) before = false;
  else before = timeKnown ? hour * 60 + minute < lcH * 60 + lcM : false;
  return {
    year: before ? year - 1 : year,
    onBoundaryDay,
    needsTime: onBoundaryDay && !timeKnown,
    instant: liChun.timestamp,
    outOfRange: false,
  };
}

export function getSolarMonthBranchApprox(month, day) {
  const dateCode = month * 100 + day;

  if (dateCode < 106) return "zi";
  if (dateCode >= 106 && dateCode < 204) return "chou";

  let selectedBranch = "chou";

  for (const boundary of SOLAR_MONTH_BOUNDARIES_APPROX) {
    if (boundary.startCode >= 204 && dateCode >= boundary.startCode) {
      selectedBranch = boundary.branch;
    }
  }

  return selectedBranch;
}