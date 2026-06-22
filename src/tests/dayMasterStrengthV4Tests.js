import { buildBaziChart } from "../engine/buildBaziChart.js";
import { dayMasterStrengthV4 } from "../engine/dayMasterStrengthV4.js";

const TEST_CASES = [
  {
    name: "Joshua",
    input: {
      name: "Joshua",
      birthDate: "1999-01-26",
      birthTime: "22:00",
      useBirthTime: true,
      gender: "male",
      birthCountry: "Singapore",
    },
  },
  {
    name: "Ma Weini",
    input: {
      name: "Ma Weini",
      birthDate: "1982-08-15",
      birthTime: "21:00",
      useBirthTime: true,
      gender: "female",
      birthCountry: "Singapore",
    },
  },
  {
    name: "Suyin C",
    input: {
      name: "Suyin C",
      birthDate: "1987-12-03",
      birthTime: "03:45",
      useBirthTime: true,
      gender: "female",
      birthCountry: "Singapore",
    },
  },
  {
    name: "Yue Qing Amanda",
    input: {
      name: "Yue Qing Amanda",
      birthDate: "1986-09-07",
      birthTime: "00:00",
      useBirthTime: true,
      gender: "female",
      birthCountry: "Singapore",
    },
  },
];

function formatPillar(pillar) {
  if (!pillar) return "N/A";

  const stem =
    pillar.stem?.label ||
    pillar.stem?.name ||
    pillar.stem?.zh ||
    pillar.stem ||
    "?";

  const branch =
    pillar.branch?.animal ||
    pillar.branch?.name ||
    pillar.branch?.zh ||
    pillar.branch ||
    "?";

  return `${stem} / ${branch}`;
}

function runDayMasterStrengthV4Tests() {
  console.log("=== Day Master Strength V4 Tests ===\n");

  for (const testCase of TEST_CASES) {
    const chart = buildBaziChart(testCase.input);
    const result = chart.dayMasterStrengthV4 || dayMasterStrengthV4(chart.pillars);

    const dayPillar = chart.pillars?.day;
    const monthPillar = chart.pillars?.month;
    const hourPillar = chart.pillars?.hour;

    console.log(`Name: ${testCase.name}`);
    console.log(`Day Master: ${result.dayElement}`);
    console.log(`Day Pillar: ${formatPillar(dayPillar)}`);
    console.log(`Month Pillar: ${formatPillar(monthPillar)}`);
    console.log(`Hour Pillar: ${formatPillar(hourPillar)}`);
    console.log(`Season Element: ${result.seasonElement}`);
    console.log("Element Scores:", result.elementScores);
    console.log("Relationship Scores:", result.relationshipScores);
    console.log("Root Strength:", result.rootStrength);
    console.log(`Strength Score: ${result.strengthScore}`);
    console.log(`Strength Label: ${result.strengthLabel}`);
    console.log(`Status: ${result.status}`);
    console.log("Factors:", result.factors);
    console.log("Explanation:", result.explanation);
    console.log("\n-----------------------------------\n");
  }
}

runDayMasterStrengthV4Tests();