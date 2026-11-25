// Regression test for the Gua "0" edge case: for males with a post-2000
// solar birth year, gua = 9 - reduced(lastTwoDigits). When reduced === 9
// (years 2009, 2018, 2027, 2036, 2045, ...), the unpatched formula lands on
// gua 0, which has no entry in GUA_INFO. Verifies it now wraps to 9.
//
// Run with: node src/tests/eightMansionsV1Tests.js

import { buildEightMansionsV1 } from "../engine/eightMansionsV1.js";

const AFFECTED_MALE_YEARS = [2009, 2018, 2027, 2036, 2045];

let failures = 0;

for (const year of AFFECTED_MALE_YEARS) {
  const result = buildEightMansionsV1({
    birthDate: `${year}-06-15`,
    birthTime: "12:00",
    gender: "Male",
  });

  const ok = result.gua === 9;
  if (!ok) failures++;
  console.log(
    ok
      ? `PASS: Male ${year} gua = ${result.gua}`
      : `FAIL: Male ${year} gua expected 9, got ${result.gua}`
  );
}

// All eight directions for every Gua, re-derived with the classical 大游年
// line-flip rule (bits are bottom, middle, top line; 1 = yang). Starting at
// the Fu Wei trigram: flip top -> Sheng Qi, middle -> Wu Gui, bottom -> Yan
// Nian, middle -> Liu Sha, top -> Huo Hai, middle -> Tian Yi, bottom -> Jue Ming.
const TRIGRAM_DIRECTION = { "111": "Northwest", "110": "West", "101": "South", "100": "East", "011": "Southeast", "010": "North", "001": "Northeast", "000": "Southwest" };
const GUA_TRIGRAM = { 1: "010", 2: "000", 3: "100", 4: "011", 6: "111", 7: "110", 8: "001", 9: "101" };
const FLIPS = [["Sheng Qi", 2], ["Wu Gui", 1], ["Yan Nian", 0], ["Liu Sha", 1], ["Huo Hai", 2], ["Tian Yi", 1], ["Jue Ming", 0]];
// Birth inputs that give each Gua (female, pre-2000: gua = reduced + 5).
const FEMALE_YEAR_FOR_GUA = { 1: 1995, 2: 1996, 3: 1997, 4: 1998, 6: 1991, 7: 1992, 8: 1993, 9: 1994 };

for (const [gua, bits] of Object.entries(GUA_TRIGRAM)) {
  const lines = bits.split("").map(Number);
  const expected = { "Fu Wei": TRIGRAM_DIRECTION[bits] };
  for (const [name, line] of FLIPS) {
    lines[line] ^= 1;
    expected[name] = TRIGRAM_DIRECTION[lines.join("")];
  }
  const result = buildEightMansionsV1({ birthDate: `${FEMALE_YEAR_FOR_GUA[gua]}-06-15`, birthTime: "12:00", gender: "Female" });
  const actual = Object.fromEntries(
    [...result.favourableDirections, ...result.unfavourableDirections].map((item) => [item.name, item.direction])
  );
  const wrong = Object.keys(expected).filter((name) => actual[name] !== expected[name]);
  if (result.gua !== Number(gua) || wrong.length) failures += 1;
  console.log(
    result.gua === Number(gua) && !wrong.length
      ? `PASS: Gua ${gua} directions`
      : `FAIL: Gua ${gua} (got gua ${result.gua}) wrong: ${wrong.map((n) => `${n} ${actual[n]} != ${expected[n]}`).join(", ")}`
  );
}

console.log(failures ? `\n${failures} case(s) FAILED.` : "\nAll Eight Mansions cases passed.");
