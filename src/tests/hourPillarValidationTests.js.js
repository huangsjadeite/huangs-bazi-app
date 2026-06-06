import { buildBaziChart } from "../engine/buildBaziChart.js";
import { PILLAR_VALIDATION_DATASET } from "./pillarValidationDataset.js";

const EXPECTED_HOUR_PILLARS = {
  Joshua: "癸亥",
  "Ma Weini": "丁亥",
  "Suyin C": "庚寅",
  "Yue Qing Amanda": "甲子",
};

for (const person of PILLAR_VALIDATION_DATASET) {
  if (!person.birthTime) continue;

  const chart = buildBaziChart({
    name: person.name,
    birthDate: person.birthDate,
    birthTime: person.birthTime,
    birthCountry: "Singapore",
    useBirthTime: true,
  });

  const actual =
    `${chart?.pillars?.hour?.stem?.zh || ""}${chart?.pillars?.hour?.branch?.zh || ""}`;

  const expected = EXPECTED_HOUR_PILLARS[person.name];

  if (!expected) continue;

  console.log(
    actual === expected
      ? `PASS: ${person.name}`
      : `FAIL: ${person.name} expected ${expected}, got ${actual}`
  );
}