// src/tests/wealthElementTests.js
//
// Verifies the Ten-God Wealth element assignment directly against the
// control cycle (Wood->Earth->Water->Fire->Metal->Wood) and polarity rule,
// independent of any narrative engine. Run with:
//   node --experimental-vm-modules src/tests/wealthElementTests.js
// (or via the Vite ssrLoadModule harness used by the other src/tests files)

import { calculateTenGod } from "../engine/tenGods.js";

const CASES = [
  { dayStem: "wu", label: "Yang Earth (Wu 戊)", expectedWealthElement: "Water" },
  { dayStem: "ji", label: "Yin Earth (Ji 己)", expectedWealthElement: "Water" },
  { dayStem: "jia", label: "Yang Wood (Jia 甲)", expectedWealthElement: "Earth" },
  { dayStem: "ren", label: "Yang Water (Ren 壬)", expectedWealthElement: "Fire" },
  { dayStem: "bing", label: "Yang Fire (Bing 丙)", expectedWealthElement: "Metal" },
  { dayStem: "geng", label: "Yang Metal (Geng 庚)", expectedWealthElement: "Wood" },
];

const STEMS_BY_ELEMENT_AND_POLARITY = {
  Wood: { Yang: "jia", Yin: "yi" },
  Fire: { Yang: "bing", Yin: "ding" },
  Earth: { Yang: "wu", Yin: "ji" },
  Metal: { Yang: "geng", Yin: "xin" },
  Water: { Yang: "ren", Yin: "gui" },
};

const DAY_STEM_POLARITY = {
  jia: "Yang", yi: "Yin",
  bing: "Yang", ding: "Yin",
  wu: "Yang", ji: "Yin",
  geng: "Yang", xin: "Yin",
  ren: "Yang", gui: "Yin",
};

function runWealthElementTests() {
  console.log("\n==============================");
  console.log("Wealth Element Verification Suite");
  console.log("==============================\n");

  let failures = 0;

  CASES.forEach(({ dayStem, label, expectedWealthElement }) => {
    const dayPolarity = DAY_STEM_POLARITY[dayStem];
    const wealthStems = STEMS_BY_ELEMENT_AND_POLARITY[expectedWealthElement];

    // Day Master controls the Wealth element. The Wealth stem with the
    // OPPOSITE polarity to the Day Master is Direct Wealth; the SAME
    // polarity is Indirect Wealth.
    const oppositePolarity = dayPolarity === "Yang" ? "Yin" : "Yang";
    const directWealthStem = wealthStems[oppositePolarity];
    const indirectWealthStem = wealthStems[dayPolarity];

    const directResult = calculateTenGod(dayStem, directWealthStem);
    const indirectResult = calculateTenGod(dayStem, indirectWealthStem);

    const directOk = directResult === "Direct Wealth";
    const indirectOk = indirectResult === "Indirect Wealth";
    const ok = directOk && indirectOk;
    if (!ok) failures++;

    console.log(`${ok ? "PASS" : "FAIL"} - ${label}`);
    console.log(
      `  Expected Wealth element: ${expectedWealthElement} | Direct Wealth stem (${directWealthStem}): ${directResult} | Indirect Wealth stem (${indirectWealthStem}): ${indirectResult}`
    );
  });

  console.log(
    failures
      ? `\n${failures} case(s) FAILED.\n`
      : "\nAll Wealth element cases passed.\n"
  );

  return failures === 0;
}

runWealthElementTests();

export { runWealthElementTests };
