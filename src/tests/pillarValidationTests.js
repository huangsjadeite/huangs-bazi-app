import { buildBaziChart } from "../engine/buildBaziChart.js";
import { PILLAR_VALIDATION_DATASET } from "./pillarValidationDataset.js";

for (const person of PILLAR_VALIDATION_DATASET) {
  const chart = buildBaziChart({
    birthDate: person.birthDate,
    birthTime: person.birthTime,
    useBirthTime: !!person.birthTime,
    gender: "female",
    birthCountry: "Singapore",
  });

  console.log({
  name: person.name,

  year: {
    expected: `${person.expectedYearStemZh || "?"}${person.expectedYearBranchZh || "?"}`,
    actual: `${chart?.pillars?.year?.stem?.zh}${chart?.pillars?.year?.branch?.zh}`,
  },

  day: {
    expected: `${person.expectedDayStemZh}${person.expectedDayBranchZh}`,
    actual: `${chart?.pillars?.day?.stem?.zh}${chart?.pillars?.day?.branch?.zh}`,
  },

  dayMaster: {
    expected: person.expectedDayMaster,
    actual: chart?.pillars?.day?.stem?.element,
  },
});
}