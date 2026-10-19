// scripts/generateSolarTerms.mjs
//
// One-time generator (not shipped in the app bundle). Computes the real
// astronomical instant of each of the 12 "Jie" (節) solar terms - the ones
// that mark BaZi month-pillar/Luck-Pillar boundaries - for every year in
// range, using the standard Meeus "low precision" solar longitude formula
// (Astronomical Algorithms, 2nd ed., ch. 25). Accurate to ~1 arcminute,
// i.e. well under a minute of time error - far tighter than the day-level
// precision BaZi needs.
//
// Run with: node scripts/generateSolarTerms.mjs
// Writes: src/data/solarTermTimestamps.js
//
// Output timestamps are in Beijing time (UTC+8), the conventional civil
// reference for published Chinese solar term tables, and are treated as
// "local calendar date/time" with no further timezone conversion - matching
// how the rest of this engine already treats birth date/time as naive
// local civil values.

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const START_YEAR = 1899;
const END_YEAR = 2100;

// The 12 Jie (節) terms that occur within a given Gregorian calendar year
// (Jan-Dec of that same year), with the branch they open, the ecliptic
// longitude (degrees) at which each occurs, and an approximate calendar
// date (from the existing SOLAR_MONTH_BOUNDARIES_APPROX table) used purely
// as a Newton-iteration starting guess - it only needs to be within a few
// days of the true root, which a fixed calendar date always is.
const JIE_TERMS = [
  { branch: "chou", label: "Xiao Han", longitude: 285, approxMonth: 1, approxDay: 6 },
  { branch: "yin", label: "Li Chun", longitude: 315, approxMonth: 2, approxDay: 4 },
  { branch: "mao", label: "Jing Zhe", longitude: 345, approxMonth: 3, approxDay: 6 },
  { branch: "chen", label: "Qing Ming", longitude: 15, approxMonth: 4, approxDay: 5 },
  { branch: "si", label: "Li Xia", longitude: 45, approxMonth: 5, approxDay: 6 },
  { branch: "wu", label: "Mang Zhong", longitude: 75, approxMonth: 6, approxDay: 6 },
  { branch: "wei", label: "Xiao Shu", longitude: 105, approxMonth: 7, approxDay: 7 },
  { branch: "shen", label: "Li Qiu", longitude: 135, approxMonth: 8, approxDay: 8 },
  { branch: "you", label: "Bai Lu", longitude: 165, approxMonth: 9, approxDay: 8 },
  { branch: "xu", label: "Han Lu", longitude: 195, approxMonth: 10, approxDay: 8 },
  { branch: "hai", label: "Li Dong", longitude: 225, approxMonth: 11, approxDay: 7 },
  { branch: "zi", label: "Da Xue", longitude: 255, approxMonth: 12, approxDay: 7 },
];

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function normalizeDegrees(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Gregorian calendar date (UTC) -> Julian Day Number.
function dateToJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    dayFraction +
    b -
    1524.5
  );
}

// Julian Day -> Gregorian calendar date (UTC), via the standard Meeus
// inverse algorithm.
function julianDayToDate(jd) {
  const jdAdj = jd + 0.5;
  const z = Math.floor(jdAdj);
  const f = jdAdj - z;

  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const dayWithFraction = b - d - Math.floor(30.6001 * e) + f;
  const day = Math.floor(dayWithFraction);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  const fractionalDay = dayWithFraction - day;
  const totalMinutes = Math.round(fractionalDay * 24 * 60);
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return { year, month, day, hour, minute };
}

// Apparent geocentric ecliptic longitude of the Sun (degrees), Meeus
// low-precision solar position (Astronomical Algorithms ch. 25).
function solarApparentLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;

  const L0 = normalizeDegrees(
    280.46646 + 36000.76983 * T + 0.0003032 * T * T
  );
  const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRadians(M);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const trueLongitude = L0 + C;

  const omega = 125.04 - 1934.136 * T;
  const apparentLongitude =
    trueLongitude - 0.00569 - 0.00478 * Math.sin(toRadians(omega));

  return normalizeDegrees(apparentLongitude);
}

// Mean rate of change of solar longitude, degrees/day - used as the
// Newton-iteration step size. ~360/365.25, refined per-iteration by finite
// difference rather than assumed constant, for robustness near perihelion.
function solarLongitudeRate(jd) {
  const deltaJd = 0.5;
  const lonAfter = solarApparentLongitude(jd + deltaJd);
  const lonBefore = solarApparentLongitude(jd - deltaJd);

  let diff = lonAfter - lonBefore;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;

  return diff / (2 * deltaJd);
}

function angularDifference(target, current) {
  let diff = target - current;
  diff = ((diff % 360) + 540) % 360 - 180;
  return diff;
}

// Solve for the Julian Day where the Sun's apparent longitude equals
// targetLongitude, starting from an initial guess, via Newton's method.
function solveForLongitude(targetLongitude, initialGuessJd) {
  let jd = initialGuessJd;

  for (let i = 0; i < 8; i++) {
    const currentLongitude = solarApparentLongitude(jd);
    const diff = angularDifference(targetLongitude, currentLongitude);
    if (Math.abs(diff) < 1e-7) break;

    const rate = solarLongitudeRate(jd);
    jd += diff / rate;
  }

  return jd;
}

function generateSolarTerms() {
  const byYear = {};

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    byYear[year] = JIE_TERMS.map((term) => {
      const initialGuessJd = dateToJulianDay(
        year,
        term.approxMonth,
        term.approxDay,
        0,
        0,
        0
      );
      const solvedJd = solveForLongitude(term.longitude, initialGuessJd);

      // Julian Day is UTC; add 8 hours (1/3 day) for Beijing time.
      const beijingJd = solvedJd + 8 / 24;
      const { year: y, month: m, day: d, hour: h, minute: min } =
        julianDayToDate(beijingJd);

      return {
        branch: term.branch,
        label: term.label,
        timestamp: { year: y, month: m, day: d, hour: h, minute: min },
      };
    });
  }

  return byYear;
}

function formatOutput(byYear) {
  const lines = [];
  lines.push("// AUTO-GENERATED by scripts/generateSolarTerms.mjs - do not edit by hand.");
  lines.push("// Real per-year solar term (節) timestamps in Beijing time (UTC+8),");
  lines.push("// computed via the Meeus low-precision solar longitude formula.");
  lines.push("// Regenerate with: node scripts/generateSolarTerms.mjs");
  lines.push("");
  lines.push("export const SOLAR_TERM_TIMESTAMPS_BY_YEAR = {");

  for (const year of Object.keys(byYear)) {
    const entries = byYear[year]
      .map(
        (t) =>
          `{branch:"${t.branch}",label:"${t.label}",timestamp:{year:${t.timestamp.year},month:${t.timestamp.month},day:${t.timestamp.day},hour:${t.timestamp.hour},minute:${t.timestamp.minute}}}`
      )
      .join(",");
    lines.push(`  ${year}: [${entries}],`);
  }

  lines.push("};");
  lines.push("");
  lines.push("export default SOLAR_TERM_TIMESTAMPS_BY_YEAR;");
  lines.push("");

  return lines.join("\n");
}

const byYear = generateSolarTerms();
const output = formatOutput(byYear);
const outPath = join(__dirname, "..", "src", "data", "solarTermTimestamps.js");

writeFileSync(outPath, output, "utf-8");
console.log(`Wrote ${Object.keys(byYear).length} years of solar term data to ${outPath}`);
