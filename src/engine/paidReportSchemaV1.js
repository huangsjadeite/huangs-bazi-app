const ELEMENT_ROLE_LABELS = {
  self: { role: "Self", text: "core identity, personal will and how directly you assert yourself" },
  resource: { role: "Resource", text: "support, learning, recovery and where you draw replenishment from" },
  output: { role: "Output", text: "expression, communication, creativity and visibility" },
  wealth: { role: "Wealth", text: "opportunity recognition, resource management and how money flows" },
  officer: { role: "Officer", text: "structure, responsibility, discipline and authority" },
};

function buildElementalBalanceWithAnnual(chart) {
  const natalWeighted = chart?.elementBalance?.weighted || {};
  const percentages = chart?.elementBalance?.percentages || {};
  const relationshipElements =
    chart?.usefulGodSuggestion?.relationshipElements || {};

  const annualElementPoints =
    chart?.annualOverlayV4?.annualElements ||
    chart?.annualOverlay?.annualElements ||
    chart?.annualOverlayV3?.elementScores ||
    {};

  const combinedWeighted = Object.fromEntries(
    Object.keys(percentages).map((name) => [
      name,
      Number(natalWeighted[name] || 0) + Number(annualElementPoints[name] || 0),
    ])
  );
  const combinedTotal = Object.values(combinedWeighted).reduce(
    (sum, value) => sum + value,
    0
  );

  const elementToRoleKey = {
    [relationshipElements.selfElement]: "self",
    [relationshipElements.resourceElement]: "resource",
    [relationshipElements.outputElement]: "output",
    [relationshipElements.wealthElement]: "wealth",
    [relationshipElements.officerElement]: "officer",
  };

  return Object.entries(percentages)
    .map(([name, natalPercentage]) => {
      const roleKey = elementToRoleKey[name] || null;
      const roleInfo = roleKey ? ELEMENT_ROLE_LABELS[roleKey] : null;

      return {
        name,
        natalPercentage,
        annualPercentage:
          combinedTotal > 0
            ? Number(((combinedWeighted[name] / combinedTotal) * 100).toFixed(1))
            : Number(natalPercentage || 0),
        role: roleInfo?.role || "",
        roleDescription: roleInfo?.text || "",
      };
    })
    .sort((a, b) => b.natalPercentage - a.natalPercentage);
}

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
      elementalBalance: buildElementalBalanceWithAnnual(chart),
      dayMasterStrength:
        chart?.dayMasterStrengthV4 ||
        chart?.dayMasterStrengthV3 ||
        null,
      dayMasterElement: chart?.usefulGodSuggestion?.relationshipElements?.selfElement || "",
    },

    personalityAndStructure: {
      tenProfileScoring: chart?.tenProfileScoringV2 || null,
      structureScoring: chart?.structureScoringV2 || null,
      narrativePersonalization:
        chart?.narrativePersonalizationV1 || null,
      archetypes: chart?.archetypes || [],
      adjustedArchetypes: chart?.adjustedArchetypes || [],
      topStrengths: chart?.topStrengthsV1 || [],
      blindSpots: chart?.blindSpotsV1 || null,
      focusRanking: chart?.focusRankingV1 || [],
    },

    usefulGodAndElements: {
      usefulGod: chart?.usefulGodV4 || chart?.usefulGod || null,
      favourableElements:
        chart?.usefulGodV4?.favourableElements ||
        chart?.usefulGod?.favourableElements ||
        [],
      secondaryFavourableElements:
        chart?.usefulGodV4?.secondaryFavourableElements || [],
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
      monthlyOverlay: chart?.monthlyOverlayV1 || null,
      selectedYear: chart?.input?.selectedYear || 2026,
    },

    lifeAreas: {
      career: chart?.careerEngineV1 || null,
      wealth: chart?.wealthEngineV1 || null,
      wealthArchetype: chart?.wealthArchetypeV1 || null,
      relationship: chart?.relationshipEngineV2 || null,
      relationshipArchetype: chart?.relationshipArchetypeV1 || null,
      relationshipPattern: chart?.relationshipPatternV1 || null,
      health: chart?.healthEngineV1 || null,
      lifeThemes: chart?.lifeThemesV1 || null,
      growthAdvice: chart?.growthAdviceV1 || null,
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
      products: chart?.productRecommendationsV1 || null,
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