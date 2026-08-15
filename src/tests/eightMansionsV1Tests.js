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

console.log(failures ? `\n${failures} case(s) FAILED.` : "\nAll Eight Mansions gua-zero cases passed.");
