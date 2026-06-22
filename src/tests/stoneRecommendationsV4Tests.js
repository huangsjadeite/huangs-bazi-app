// src/tests/stoneRecommendationsV4Tests.js

import { buildBaziChart } from "../engine/buildBaziChart.js";

const TEST_CASES = [
  {
    name: "Joshua",
    input: {
      name: "Joshua",
      gender: "male",
      birthDate: "1999-01-26",
      birthTime: "22:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Ma Weini",
    input: {
      name: "Ma Weini",
      gender: "female",
      birthDate: "1982-08-15",
      birthTime: "21:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Suyin C",
    input: {
      name: "Suyin C",
      gender: "female",
      birthDate: "1987-12-03",
      birthTime: "03:45",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Yue Qing Amanda",
    input: {
      name: "Yue Qing Amanda",
      gender: "female",
      birthDate: "1986-09-07",
      birthTime: "00:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Wong Lee Lee",
    input: {
      name: "Wong Lee Lee",
      gender: "female",
      birthDate: "1980-03-06",
      birthTime: "",
      birthCountry: "Singapore",
      useBirthTime: false,
      selectedYear: 2026,
    },
  },
];

function hasArray(value) {
  return Array.isArray(value);
}

function runStoneRecommendationsV4Tests() {
  console.log("Running StoneRecommendationsV4 benchmark tests...");

  const results = TEST_CASES.map((testCase) => {
    const chart = buildBaziChart(testCase.input);
    const result = chart?.stoneRecommendationsV4;

    const checks = {
      hasResult: Boolean(result),
      correctVersion: result?.version === "stone-recommendations-v4",

      hasPrimaryArray: hasArray(result?.primaryRecommendations),
      hasSecondaryArray: hasArray(result?.secondaryRecommendations),
      hasAvoidArray: hasArray(result?.avoidRecommendations),
      hasReasoningArray: hasArray(result?.reasoning),

      hasPrimaryElement: Boolean(result?.primaryElement),
      hasRecommendedStones: hasArray(result?.recommendedStones),

      noWarningsFromStoneV4: !chart?.warnings?.some((warning) =>
        warning.includes("StoneRecommendationsV4 failed safely")
      ),
    };

    const pass = Object.values(checks).every(Boolean);

    return {
      name: testCase.name,
      pass,
      primaryElement: result?.primaryElement,
      secondaryElement: result?.secondaryElement,
      mainStructure: result?.mainStructure,
      dominantProfile: result?.dominantProfile,
      topRecommendation: result?.topRecommendation,
      recommendedStonesCount: result?.recommendedStones?.length || 0,
      avoidCount: result?.avoidRecommendations?.length || 0,
      checks,
    };
  });

  console.table(
    results.map((result) => ({
      name: result.name,
      status: result.pass ? "PASS" : "FAIL",
      primaryElement: result.primaryElement,
      secondaryElement: result.secondaryElement,
      mainStructure: result.mainStructure,
      dominantProfile: result.dominantProfile,
      topRecommendation: result.topRecommendation,
      recommendedStonesCount: result.recommendedStonesCount,
      avoidCount: result.avoidCount,
    }))
  );

  const failed = results.filter((result) => !result.pass);

  if (failed.length > 0) {
    console.warn("StoneRecommendationsV4 failed cases:", failed);
  } else {
    console.log("StoneRecommendationsV4 benchmark completed: ALL PASS");
  }

  return results;
}

runStoneRecommendationsV4Tests();