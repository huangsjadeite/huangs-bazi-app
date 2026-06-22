import buildBaziChart from "../engine/buildBaziChart.js";

const benchmarkCharts = [
  {
    name: "Joshua",
    gender: "male",
    birthDate: "1999-01-26",
    birthTime: "22:00",
    birthCountry: "Singapore",
    useBirthTime: true,
    selectedYear: 2026,
  },
  {
    name: "Ma Weini",
    gender: "female",
    birthDate: "1982-08-15",
    birthTime: "21:00",
    birthCountry: "Singapore",
    useBirthTime: true,
    selectedYear: 2026,
  },
  {
    name: "Suyin C",
    gender: "female",
    birthDate: "1987-12-03",
    birthTime: "03:45",
    birthCountry: "Singapore",
    useBirthTime: true,
    selectedYear: 2026,
  },
  {
    name: "Yue Qing Amanda",
    gender: "female",
    birthDate: "1986-09-07",
    birthTime: "00:00",
    birthCountry: "Singapore",
    useBirthTime: true,
    selectedYear: 2026,
  },
  {
    name: "Wong Lee Lee",
    gender: "female",
    birthDate: "1980-03-06",
    birthTime: "",
    birthCountry: "Singapore",
    useBirthTime: false,
    selectedYear: 2026,
  },
];

function runUsefulGodV4Benchmarks() {
  console.log("\n==============================");
  console.log("UsefulGodV4 Benchmark Results");
  console.log("==============================\n");

  benchmarkCharts.forEach((input) => {
    const chart = buildBaziChart(input);

    console.log(`\n===== ${input.name} =====`);

    console.log("Day Master:", {
      stem: chart.pillars?.day?.stem?.name,
      element: chart.pillars?.day?.stem?.element,
    });

    console.log("Day Master Strength V4:", {
      score: chart.dayMasterStrengthV4?.score,
      label: chart.dayMasterStrengthV4?.label,
      category: chart.dayMasterStrengthV4?.category,
      strength: chart.dayMasterStrengthV4?.strength,
    });

    console.log("Structure:", {
      mainStructure: chart.structureScoringV2?.mainStructure?.name,
      supportingStructures: chart.structureScoringV2?.supportingStructures?.map(
        (s) => s.name
      ),
    });

    console.log("UsefulGodV4:", {
      primaryUsefulGod: chart.usefulGodV4?.primaryUsefulGod,
      secondaryUsefulGod: chart.usefulGodV4?.secondaryUsefulGod,
      favourableElements: chart.usefulGodV4?.favourableElements,
      cautionElements: chart.usefulGodV4?.cautionElements,
    });

    console.log("Reasoning:");
    chart.usefulGodV4?.reasoning?.forEach((line) => {
      console.log("-", line);
    });

    if (chart.warnings?.length) {
      console.log("Warnings:");
      chart.warnings.forEach((warning) => {
        console.log("-", warning);
      });
    }
  });
}

runUsefulGodV4Benchmarks();

export { runUsefulGodV4Benchmarks };