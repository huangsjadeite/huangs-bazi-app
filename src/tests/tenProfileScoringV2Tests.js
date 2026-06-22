import { buildBaziChart } from "../engine/buildBaziChart.js";
import tenProfileScoringV2 from "../engine/tenProfileScoringV2.js";

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
      selectedYear: 2026,
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
      selectedYear: 2026,
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
      selectedYear: 2026,
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
      selectedYear: 2026,
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

function printProfile(profile, index) {
  console.log(
    `${index + 1}. ${profile.name} (${profile.chineseName}) — Score: ${profile.score}, Percentage: ${profile.percentage}%, Label: ${profile.strengthLabel}`
  );
  console.log("   Element:", profile.element);
  console.log("   Polarity:", profile.polarity);
  console.log("   Visibility:", profile.visibility);
  console.log("   Source Breakdown:", profile.sourceBreakdown);
  console.log("   Raw Score:", profile.rawScore);
  console.log("   Explanation:", profile.explanation);
}

function runTenProfileScoringV2Tests() {
  console.log("=== Ten Profile Scoring V2 Tests ===\n");

  for (const testCase of TEST_CASES) {
    const chart = buildBaziChart(testCase.input);

    const result =
      chart.tenProfileScoringV2 ||
      tenProfileScoringV2({
        pillars: chart.pillars,
        annualPillar: chart.annualOverlay?.yearPillar,
        dayMasterStrength: chart.dayMasterStrengthV4,
      });

    console.log(`Name: ${testCase.name}`);
    console.log(`Day Pillar: ${formatPillar(chart.pillars?.day)}`);
    console.log(`Month Pillar: ${formatPillar(chart.pillars?.month)}`);
    console.log(`Hour Pillar: ${formatPillar(chart.pillars?.hour)}`);

    console.log("Day Master Strength V4:", {
      score: chart.dayMasterStrengthV4?.strengthScore,
      label: chart.dayMasterStrengthV4?.strengthLabel,
      status: chart.dayMasterStrengthV4?.status,
    });

    console.log("\nDominant Profile:");
    printProfile(result.dominantProfile, 0);

    console.log("\nSupporting Profiles:");
    result.supportingProfiles.forEach((profile, index) => {
      printProfile(profile, index);
    });

    console.log("\nTop 5 Profiles:");
    result.profiles.slice(0, 5).forEach((profile, index) => {
      printProfile(profile, index);
    });

    console.log("\nRaw Scores:", result.rawScores);
    console.log("Normalized Scores:", result.normalizedScores);
    console.log("Factors:", result.factors);
    console.log("Overall Explanation:", result.explanation);

    console.log("\nCompact JSON Summary:");
    console.log(
      JSON.stringify(
        {
          name: testCase.name,
          dayPillar: formatPillar(chart.pillars?.day),
          monthPillar: formatPillar(chart.pillars?.month),
          hourPillar: formatPillar(chart.pillars?.hour),
          dayMasterStrengthV4: {
            score: chart.dayMasterStrengthV4?.strengthScore,
            label: chart.dayMasterStrengthV4?.strengthLabel,
            status: chart.dayMasterStrengthV4?.status,
          },
          dominantProfile: result.dominantProfile,
          supportingProfiles: result.supportingProfiles,
          rawScores: result.rawScores,
          normalizedScores: result.normalizedScores,
        },
        null,
        2
      )
    );

    console.log("\n-----------------------------------\n");
  }
}

runTenProfileScoringV2Tests();