export function buildPaidReportSchemaV1(chart) {
  return {
    version: "PaidReportSchemaV1",

    client: {
      name: chart?.input?.name || "",
      gender: chart?.input?.gender || "",
      birthDate: chart?.input?.birthDate || "",
      birthTime: chart?.input?.birthTime || "",
      birthCountry: chart?.input?.birthCountry || "",
      mode: chart?.mode || "",
      selectedYear: chart?.input?.selectedYear || 2026,
    },

    chartFoundation: {
      pillars: chart?.pillars || null,
      birthZodiac: chart?.birthZodiac || null,
      elementBalance: chart?.elementBalanceV3 || chart?.elementBalance || null,
      dayMasterStrength:
        chart?.dayMasterStrengthV4 ||
        chart?.dayMasterStrengthV3 ||
        null,
    },

    personalityAndStructure: {
      tenProfileScoring: chart?.tenProfileScoringV2 || null,
      structureScoring: chart?.structureScoringV2 || null,
      narrativePersonalization:
        chart?.narrativePersonalizationV1 || null,
      archetypes: chart?.archetypes || [],
      adjustedArchetypes: chart?.adjustedArchetypes || [],
    },

    usefulGodAndElements: {
      usefulGod: chart?.usefulGodV4 || chart?.usefulGod || null,
      favourableElements:
        chart?.usefulGodV4?.favourableElements ||
        chart?.usefulGod?.favourableElements ||
        [],
      cautionElements:
        chart?.usefulGodV4?.cautionElements ||
        chart?.usefulGod?.cautionElements ||
        [],
      primaryUsefulGod:
        chart?.usefulGodV4?.primaryUsefulGod ||
        chart?.usefulGod?.primaryUsefulGod ||
        "",
      secondaryUsefulGod:
        chart?.usefulGodV4?.secondaryUsefulGod ||
        chart?.usefulGod?.secondaryUsefulGod ||
        "",
    },

    annualEnergy: {
      annualOverlay: chart?.annualOverlayV3 || chart?.annualOverlay || null,
      selectedYear: chart?.input?.selectedYear || 2026,
    },

    lifeAreas: {
      career: chart?.careerEngineV1 || null,
      wealth: chart?.wealthEngineV1 || null,
      relationship: chart?.relationshipEngineV2 || null,
      health: chart?.healthEngineV1 || null,
      lifeThemes: chart?.lifeThemesV1 || null,
    },

    interpretationLayers: {
      lifeThemes: chart?.lifeThemesV1 || null,
      narrativePersonalization:
        chart?.narrativePersonalizationV1 || null,
      narrativeRenderer: chart?.narrativeRendererV1 || null,
    },

    practicalSupport: {
      guidance:
        chart?.practicalGuidanceV6 ||
        chart?.practicalGuidanceV3 ||
        null,
      stones:
        chart?.stoneRecommendationsV4 ||
        chart?.stoneRecommendationsV3 ||
        null,
    },

    narrative: chart?.pdfReportSchema || chart?.pdfReportSchemaV1 || null,

    futureModules: {
      dziRecommendations: null,
      fengShuiSupport: null,
      monthlyTiming: null,
      wealthTiming: null,
      emotionalTriggers: null,
    },
  };
}

export default buildPaidReportSchemaV1;