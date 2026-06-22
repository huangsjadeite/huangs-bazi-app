// src/engine/buildBaziChart.js

import structureScoringV2 from "./structureScoringV2.js";
import tenProfileScoringV2 from "./tenProfileScoringV2.js";
import dayMasterStrengthV4 from "./dayMasterStrengthV4.js";

import { buildArchetypeOverlayV4 } from "./ArchetypeOverlayV4.js";
import { buildPracticalGuidanceV5 } from "./practicalGuidanceV5.js";
import { buildPracticalGuidanceV6 } from "./practicalGuidanceV6.js";
import { buildStoneRecommendationsV3 } from "./stoneRecommendationsV3.js";
import { buildStoneRecommendationsV4 } from "./stoneRecommendationsV4.js";
import { buildProductRecommendationsV1 } from "./productRecommendationsV1.js";
import { buildAnnualOverlayV3 } from "./annualOverlayV3.js";
import { annualOverlayV4 } from "./annualOverlayV4.js";
import { buildRelationshipEngineV2 } from "./relationshipEngineV2.js";
import { buildGenderInfluenceV1 } from "./genderInfluenceV1.js";
import { buildCareerEngineV1 } from "./careerEngineV1.js";
import { buildWealthEngineV1 } from "./wealthEngineV1.js";
import { buildWealthArchetypeV1 } from "./wealthArchetypeV1.js";
import { buildHealthEngineV1 } from "./healthEngineV1.js";
import { buildLifeThemesV1 } from "./lifeThemesV1.js";
import { buildBlindSpotsV1 } from "./blindSpotsEngineV1.js";
import { buildGrowthAdviceV1 } from "./growthAdviceV1.js";
import { buildRelationshipPatternV1 } from "./relationshipPatternV1.js";
import { buildRelationshipArchetypeV1 } from "./RelationshipArchetypeV1.js";
import { buildTopStrengthsV1 } from "./TopStrengthsV1.js";
import { buildFocusRankingV1 } from "./FocusRankingV1.js";
import { buildNarrativePersonalizationV1 } from "./narrativePersonalizationV1.js";
import { NarrativeRendererV1 } from "./NarrativeRendererV1/index.js";
import { buildPdfReportSchemaV1 } from "./pdfReportSchemaV1.js";
import { buildPaidReportSchemaV1 } from "./paidReportSchemaV1.js";

import { calculateElementBalanceV3 } from "./elementBalanceV3.js";
import { calculateUsefulGodV3 } from "./usefulGodV3.js";
import { calculateDayMasterStrengthV3 } from "./dayMasterStrengthV3.js";
import { calculateTenGods } from "./tenGodCalculator.js";

import { TEN_GOD_ARCHETYPES as ARCHETYPES } from "../data/archetypes.js";
import { usefulGodV4 } from "../data/usefulGodV4.js";

import { calculateArchetypeScores } from "./archetypeScoring.js";
import { buildAnnualOverlay } from "./annualOverlay.js";
import { calculateBirthZodiac } from "./zodiac.js";
import { buildStoneRecommendations } from "./stoneRecommendations.js";
import { buildPracticalGuidance } from "./practicalGuidance.js";
import { buildArchetypeOverlay } from "./archetypeOverlay.js";
import { buildPersonalEnergyBalance } from "./personalEnergyBalance.js";
import { calculateUsefulGodSuggestion } from "./usefulGod.js";
import { normalizeInput } from "./dateTime.js";
import { calculatePillars } from "./pillars.js";

import {
  calculateTenGodProfile,
  calculateTenGodScores,
} from "./tenGods.js";

import {
  calculateElementBalance,
  calculateDayMasterStrength,
} from "./elementBalance.js";

export const ENGINE_VERSION = "0.2.0-stable-output";

function buildConsumerEngineInput({
  tenProfileScoringV2Result,
  structureScoringV2Result,
  dayMasterStrengthV4Result,
  usefulGodV4Result,
  annualOverlay,
  annualOverlayV3,
  annualOverlayV4Result,
}) {
  return {
    tenProfiles:
      tenProfileScoringV2Result?.profileScores ||
      tenProfileScoringV2Result?.scores ||
      tenProfileScoringV2Result?.tenProfiles ||
      tenProfileScoringV2Result?.profiles ||
      tenProfileScoringV2Result ||
      {},

    structure:
      structureScoringV2Result?.mainStructure ||
      structureScoringV2Result?.structure ||
      structureScoringV2Result ||
      {},

    daymasterStrength:
      dayMasterStrengthV4Result ||
      {},

    usefulGod:
      usefulGodV4Result ||
      {},

    annualOverlay:
      annualOverlayV4Result ||
      annualOverlayV3 ||
      annualOverlay ||
      {},

    annualOverlayV3,
    annualOverlayV4: annualOverlayV4Result,
  };
}

export function buildBaziChart(input) {
  const normalizedInput = normalizeInput(input);
  const selectedYear = normalizedInput.selectedYear || 2026;
  const pillars = calculatePillars(normalizedInput);

  const tenGodsV3 = calculateTenGods(pillars);
  const tenGodByPillar = calculateTenGodProfile(pillars);
  const tenGodScores = calculateTenGodScores(pillars);

  const elementBalance = calculateElementBalance(pillars);
  const elementBalanceV3 = calculateElementBalanceV3(pillars);

  const dayMasterStrengthV3 = calculateDayMasterStrengthV3(pillars);
  const usefulGodV3 = calculateUsefulGodV3(dayMasterStrengthV3);

  let dayMasterStrengthV4Result = null;
  let dayMasterStrengthV4Error = null;

  try {
    dayMasterStrengthV4Result = dayMasterStrengthV4(pillars);
  } catch (error) {
    console.warn("dayMasterStrengthV4 failed safely:", error);
    dayMasterStrengthV4Error = error.message;
  }

  const dayMasterStrength = calculateDayMasterStrength(
    pillars,
    elementBalance
  );

  const usefulGodSuggestion = calculateUsefulGodSuggestion(
    dayMasterStrength,
    elementBalance
  );

  const birthZodiac = calculateBirthZodiac(pillars.year);

  const personalEnergyProfile = buildPersonalEnergyBalance({
    pillars,
    dayMasterStrength,
    usefulGodSuggestion,
  });

  const annualOverlay = buildAnnualOverlay(selectedYear, elementBalance);

  const annualOverlayV3 = buildAnnualOverlayV3({
    pillars,
    annualPillar: annualOverlay?.yearPillar,
    selectedYear,
    dayMasterStrengthV3,
    usefulGodV3,
    elementBalanceV3,
  });

  let tenProfileScoringV2Result = null;
  let tenProfileScoringV2Error = null;

  try {
    tenProfileScoringV2Result = tenProfileScoringV2({
      pillars,
      annualPillar: annualOverlay?.yearPillar,
      dayMasterStrength: dayMasterStrengthV4Result,
    });
  } catch (error) {
    console.warn("tenProfileScoringV2 failed safely:", error);
    tenProfileScoringV2Error = error.message;
  }

  let structureScoringV2Result = null;
  let structureScoringV2Error = null;

  try {
    structureScoringV2Result = structureScoringV2({
      pillars,
      tenProfileScoringV2: tenProfileScoringV2Result,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
    });
  } catch (error) {
    console.warn("structureScoringV2 failed safely:", error);
    structureScoringV2Error = error.message;
  }

  let usefulGodV4Result = null;
  let usefulGodV4Error = null;

  try {
    usefulGodV4Result = usefulGodV4({
      pillars,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      elementBalanceV3,
      structureScoringV2: structureScoringV2Result,
    });
  } catch (error) {
    console.warn("usefulGodV4 failed safely:", error);
    usefulGodV4Error = error.message;
  }

  let annualOverlayV4Result = null;
  let annualOverlayV4Error = null;

  try {
    annualOverlayV4Result = annualOverlayV4({
      usefulGodV4: usefulGodV4Result,
      annualOverlay,
      annualOverlayV3,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      elementBalanceV3,
    });
  } catch (error) {
    console.warn("AnnualOverlayV4 failed safely:", error);
    annualOverlayV4Error = error.message;
  }

  const consumerEngineInput = buildConsumerEngineInput({
    tenProfileScoringV2Result,
    structureScoringV2Result,
    dayMasterStrengthV4Result,
    usefulGodV4Result,
    annualOverlay,
    annualOverlayV3,
    annualOverlayV4Result,
  });

  let relationshipArchetypeV1 = null;
  let relationshipArchetypeV1Error = null;

  try {
    relationshipArchetypeV1 =
      buildRelationshipArchetypeV1(consumerEngineInput);
  } catch (error) {
    console.warn("RelationshipArchetypeV1 failed safely:", error);
    relationshipArchetypeV1Error = error.message;
  }

  let topStrengthsV1 = null;
  let topStrengthsV1Error = null;

  try {
    topStrengthsV1 = buildTopStrengthsV1(consumerEngineInput);
  } catch (error) {
    console.warn("TopStrengthsV1 failed safely:", error);
    topStrengthsV1Error = error.message;
  }

  let focusRankingV1 = null;
  let focusRankingV1Error = null;

  try {
    focusRankingV1 = buildFocusRankingV1(consumerEngineInput);
  } catch (error) {
    console.warn("FocusRankingV1 failed safely:", error);
    focusRankingV1Error = error.message;
  }

  let relationshipEngineV2 = null;
  let relationshipEngineV2Error = null;

  try {
    relationshipEngineV2 = buildRelationshipEngineV2({
      input: normalizedInput,
      pillars,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      structureScoringV2: structureScoringV2Result,
      usefulGodV4: usefulGodV4Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      annualOverlayV3,
      annualOverlayV4: annualOverlayV4Result,
    });
  } catch (error) {
    console.warn("relationshipEngineV2 failed safely:", error);
    relationshipEngineV2Error = error.message;
  }

  let genderInfluenceV1 = null;
  let genderInfluenceV1Error = null;

  try {
    genderInfluenceV1 = buildGenderInfluenceV1({
      input: normalizedInput,
      relationshipEngineV2,
      tenProfileScoringV2: tenProfileScoringV2Result,
      structureScoringV2: structureScoringV2Result,
    });
  } catch (error) {
    console.warn("genderInfluenceV1 failed safely:", error);
    genderInfluenceV1Error = error.message;
  }

  let careerEngineV1 = null;
  let careerEngineV1Error = null;

  try {
    careerEngineV1 = buildCareerEngineV1({
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      structureScoringV2: structureScoringV2Result,
      usefulGodV4: usefulGodV4Result,
    });
  } catch (error) {
    console.warn("careerEngineV1 failed safely:", error);
    careerEngineV1Error = error.message;
  }

  let wealthEngineV1 = null;
  let wealthEngineV1Error = null;

  try {
    wealthEngineV1 = buildWealthEngineV1({
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      structureScoringV2: structureScoringV2Result,
      usefulGodV4: usefulGodV4Result,
    });
  } catch (error) {
    console.warn("wealthEngineV1 failed safely:", error);
    wealthEngineV1Error = error.message;
  }

  let healthEngineV1 = null;
  let healthEngineV1Error = null;

  try {
    healthEngineV1 = buildHealthEngineV1({
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      structureScoringV2: structureScoringV2Result,
      usefulGodV4: usefulGodV4Result,
      elementBalanceV3,
    });
  } catch (error) {
    console.warn("healthEngineV1 failed safely:", error);
    healthEngineV1Error = error.message;
  }

  let lifeThemesV1 = null;
  let lifeThemesV1Error = null;

  try {
    lifeThemesV1 = buildLifeThemesV1({
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      usefulGodV4: usefulGodV4Result,
    });
  } catch (error) {
    console.warn("lifeThemesV1 failed safely:", error);
    lifeThemesV1Error = error.message;
  }

  let blindSpotsV1 = null;
  let blindSpotsV1Error = null;

  try {
    blindSpotsV1 = buildBlindSpotsV1({
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      usefulGodV4: usefulGodV4Result,
    });
  } catch (error) {
    console.warn("BlindSpotsV1 failed safely:", error);
    blindSpotsV1Error = error.message;
  }

  let wealthArchetypeV1 = null;
  let wealthArchetypeV1Error = null;

  try {
    wealthArchetypeV1 = buildWealthArchetypeV1({
      wealthEngineV1,
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      usefulGodV4: usefulGodV4Result,
      blindSpotsV1,
    });
  } catch (error) {
    console.warn("WealthArchetypeV1 failed safely:", error);
    wealthArchetypeV1Error = error.message;
  }

  let growthAdviceV1 = null;
  let growthAdviceV1Error = null;

  try {
    growthAdviceV1 = buildGrowthAdviceV1({
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      usefulGodV4: usefulGodV4Result,
      blindSpotsV1,
      wealthArchetypeV1,
    });
  } catch (error) {
    console.warn("GrowthAdviceV1 failed safely:", error);
    growthAdviceV1Error = error.message;
  }

  let relationshipPatternV1 = null;
  let relationshipPatternV1Error = null;

  try {
    relationshipPatternV1 = buildRelationshipPatternV1({
      relationshipEngineV2,
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      dayMasterStrengthV4: dayMasterStrengthV4Result,
      usefulGodV4: usefulGodV4Result,
      blindSpotsV1,
      growthAdviceV1,
    });
  } catch (error) {
    console.warn("RelationshipPatternV1 failed safely:", error);
    relationshipPatternV1Error = error.message;
  }

  let narrativePersonalizationV1 = null;
  let narrativePersonalizationV1Error = null;

  try {
    narrativePersonalizationV1 = buildNarrativePersonalizationV1({
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      usefulGodV4: usefulGodV4Result,
      blindSpotsV1,
      wealthArchetypeV1,
      growthAdviceV1,
      relationshipPatternV1,
      relationshipArchetypeV1,
      topStrengthsV1,
      focusRankingV1,
    });
  } catch (error) {
    console.warn("NarrativePersonalizationV1 failed safely:", error);
    narrativePersonalizationV1Error = error.message;
  }

  let narrativeRendererV1 = null;
  let narrativeRendererV1Error = null;

  try {
    narrativeRendererV1 = NarrativeRendererV1({
      career: careerEngineV1,
      wealth: wealthEngineV1,
      wealthArchetype: wealthArchetypeV1,
      growthAdvice: growthAdviceV1,
      relationship: relationshipEngineV2,
      relationshipPattern: relationshipPatternV1,
      relationshipArchetype: relationshipArchetypeV1,
      topStrengths: topStrengthsV1,
      focusRanking: focusRankingV1,
      health: healthEngineV1,
      lifeThemes: lifeThemesV1,
      blindSpots: blindSpotsV1,
      narrativePersonalization: narrativePersonalizationV1,
    });
  } catch (error) {
    console.warn("NarrativeRendererV1 failed safely:", error);
    narrativeRendererV1Error = error.message;
  }

  let pdfReportSchemaV1 = null;
  let pdfReportSchemaV1Error = null;

  try {
    pdfReportSchemaV1 = buildPdfReportSchemaV1({
      narrativeRendererV1,
      blindSpotsV1,
      wealthArchetypeV1,
      growthAdviceV1,
      relationshipPatternV1,
      relationshipArchetypeV1,
      topStrengthsV1,
      focusRankingV1,
    });
  } catch (error) {
    console.warn("PDFReportSchemaV1 failed safely:", error);
    pdfReportSchemaV1Error = error.message;
  }

  const archetypes = calculateArchetypeScores({
    pillars,
    dayStem:
      pillars?.day?.stem?.name ||
      pillars?.day?.stem?.zh ||
      pillars?.day?.stem,
    annualPillar: annualOverlay?.yearPillar,
    annualOverlay,
    dayMasterStrength,
    archetypeDefinitions: ARCHETYPES,
  });

  const archetypeOverlayV3 = buildArchetypeOverlayV4({
    archetypes,
    annualOverlayV3,
  });

  const adjustedArchetypes = buildArchetypeOverlay({
    archetypes,
    annualOverlay,
  });

  const practicalGuidance = buildPracticalGuidance({
    dayMasterStrength,
    usefulGodSuggestion,
    annualOverlay,
    adjustedArchetypes,
    elementBalance,
  });

  const practicalGuidanceV3 = buildPracticalGuidanceV5({
    dayMasterStrengthV3,
    usefulGodV3,
    elementBalanceV3,
    annualOverlayV3,
    archetypeOverlayV3,
  });

  const practicalGuidanceV6 = buildPracticalGuidanceV6({
    dayMasterStrengthV4: dayMasterStrengthV4Result,
    elementBalanceV3,
    structureScoringV2: structureScoringV2Result,
    usefulGodV4: usefulGodV4Result,
    tenProfileScoringV2: tenProfileScoringV2Result,
  });

  const stoneRecommendations = buildStoneRecommendations({
    usefulGodSuggestion,
    personalEnergyProfile,
    annualOverlay,
  });

  const stoneRecommendationsV3 = buildStoneRecommendationsV3({
    dayMasterStrengthV3,
    usefulGodV3,
    elementBalanceV3,
    annualOverlayV3,
  });

  let stoneRecommendationsV4 = null;
  let stoneRecommendationsV4Error = null;

  try {
    stoneRecommendationsV4 = buildStoneRecommendationsV4({
      usefulGodV4: usefulGodV4Result,
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      narrativePersonalization: narrativePersonalizationV1,
      elementBalanceV3,
      annualOverlayV4: annualOverlayV4Result,
    });
  } catch (error) {
    console.warn("StoneRecommendationsV4 failed safely:", error);
    stoneRecommendationsV4Error = error.message;
  }

  let productRecommendationsV1 = null;
  let productRecommendationsV1Error = null;

  try {
    productRecommendationsV1 = buildProductRecommendationsV1({
      stoneRecommendationsV4,
      usefulGodV4: usefulGodV4Result,
      structureScoringV2: structureScoringV2Result,
      tenProfileScoringV2: tenProfileScoringV2Result,
      annualOverlayV4: annualOverlayV4Result,
    });
  } catch (error) {
    console.warn("ProductRecommendationsV1 failed safely:", error);
    productRecommendationsV1Error = error.message;
  }

  let paidReportSchemaV1 = null;
  let paidReportSchemaV1Error = null;

  try {
    paidReportSchemaV1 = buildPaidReportSchemaV1({
      meta: {
        engineVersion: ENGINE_VERSION,
        generatedAt: new Date().toISOString(),
      },

      engineVersion: ENGINE_VERSION,
      mode: normalizedInput.useBirthTime ? "four-pillar" : "three-pillar",

      input: {
        name: normalizedInput.name,
        gender: normalizedInput.gender,
        birthDate: normalizedInput.birthDate,
        birthTime: normalizedInput.birthTime,
        birthCountry: normalizedInput.birthCountry,
        timezone: normalizedInput.timezone,
        useBirthTime: normalizedInput.useBirthTime,
        selectedYear,
      },

      pillars,
      birthZodiac,

      elementBalance,
      elementBalanceV3,

      dayMasterStrength,
      dayMasterStrengthV3,
      dayMasterStrengthV4: dayMasterStrengthV4Result,

      tenProfileScoringV2: tenProfileScoringV2Result,
      structureScoringV2: structureScoringV2Result,

      usefulGodSuggestion,
      usefulGodV3,
      usefulGodV4: usefulGodV4Result,
      usefulGod: usefulGodV4Result || usefulGodV3 || usefulGodSuggestion,

      annualOverlay,
      annualOverlayV3,
      annualOverlayV4: annualOverlayV4Result,

      archetypes,
      adjustedArchetypes,

      careerEngineV1,
      wealthEngineV1,
      wealthArchetypeV1,
      growthAdviceV1,
      relationshipEngineV2,
      relationshipPatternV1,
      relationshipArchetypeV1,
      topStrengthsV1,
      focusRankingV1,
      healthEngineV1,
      lifeThemesV1,
      blindSpotsV1,
      narrativePersonalizationV1,

      practicalGuidance,
      practicalGuidanceV3,
      practicalGuidanceV6,

      stoneRecommendations,
      stoneRecommendationsV3,
      stoneRecommendationsV4,
      productRecommendationsV1,

      narrativeRendererV1,
      narrative: narrativeRendererV1,
      pdfReportSchemaV1,
      pdfReportSchema: pdfReportSchemaV1,
    });
  } catch (error) {
    console.warn("PaidReportSchemaV1 failed safely:", error);
    paidReportSchemaV1Error = error.message;
  }

  const warnings = [
    "Month pillar uses approximate Jie Qi boundaries. Replace with exact solar-term timestamps before production.",
    "Day pillar uses a fixed reference anchor. Validate against chosen almanac before production lock.",
  ];

  if (dayMasterStrengthV4Error) {
    warnings.push(
      `DayMasterStrengthV4 failed safely: ${dayMasterStrengthV4Error}`
    );
  }

  if (tenProfileScoringV2Error) {
    warnings.push(
      `TenProfileScoringV2 failed safely: ${tenProfileScoringV2Error}`
    );
  }

  if (structureScoringV2Error) {
    warnings.push(
      `StructureScoringV2 failed safely: ${structureScoringV2Error}`
    );
  }

  if (usefulGodV4Error) {
    warnings.push(`UsefulGodV4 failed safely: ${usefulGodV4Error}`);
  }

  if (annualOverlayV4Error) {
    warnings.push(`AnnualOverlayV4 failed safely: ${annualOverlayV4Error}`);
  }

  if (relationshipArchetypeV1Error) {
    warnings.push(
      `RelationshipArchetypeV1 failed safely: ${relationshipArchetypeV1Error}`
    );
  }

  if (topStrengthsV1Error) {
    warnings.push(`TopStrengthsV1 failed safely: ${topStrengthsV1Error}`);
  }

  if (focusRankingV1Error) {
    warnings.push(`FocusRankingV1 failed safely: ${focusRankingV1Error}`);
  }

  if (relationshipEngineV2Error) {
    warnings.push(
      `RelationshipEngineV2 failed safely: ${relationshipEngineV2Error}`
    );
  }

  if (genderInfluenceV1Error) {
    warnings.push(
      `GenderInfluenceV1 failed safely: ${genderInfluenceV1Error}`
    );
  }

  if (careerEngineV1Error) {
    warnings.push(`CareerEngineV1 failed safely: ${careerEngineV1Error}`);
  }

  if (wealthEngineV1Error) {
    warnings.push(`WealthEngineV1 failed safely: ${wealthEngineV1Error}`);
  }

  if (wealthArchetypeV1Error) {
    warnings.push(
      `WealthArchetypeV1 failed safely: ${wealthArchetypeV1Error}`
    );
  }

  if (growthAdviceV1Error) {
    warnings.push(`GrowthAdviceV1 failed safely: ${growthAdviceV1Error}`);
  }

  if (relationshipPatternV1Error) {
    warnings.push(
      `RelationshipPatternV1 failed safely: ${relationshipPatternV1Error}`
    );
  }

  if (healthEngineV1Error) {
    warnings.push(`HealthEngineV1 failed safely: ${healthEngineV1Error}`);
  }

  if (lifeThemesV1Error) {
    warnings.push(`LifeThemesV1 failed safely: ${lifeThemesV1Error}`);
  }

  if (blindSpotsV1Error) {
    warnings.push(`BlindSpotsV1 failed safely: ${blindSpotsV1Error}`);
  }

  if (narrativePersonalizationV1Error) {
    warnings.push(
      `NarrativePersonalizationV1 failed safely: ${narrativePersonalizationV1Error}`
    );
  }

  if (narrativeRendererV1Error) {
    warnings.push(
      `NarrativeRendererV1 failed safely: ${narrativeRendererV1Error}`
    );
  }

  if (pdfReportSchemaV1Error) {
    warnings.push(
      `PDFReportSchemaV1 failed safely: ${pdfReportSchemaV1Error}`
    );
  }

  if (stoneRecommendationsV4Error) {
    warnings.push(
      `StoneRecommendationsV4 failed safely: ${stoneRecommendationsV4Error}`
    );
  }

  if (productRecommendationsV1Error) {
    warnings.push(
      `ProductRecommendationsV1 failed safely: ${productRecommendationsV1Error}`
    );
  }

  if (paidReportSchemaV1Error) {
    warnings.push(
      `PaidReportSchemaV1 failed safely: ${paidReportSchemaV1Error}`
    );
  }

  if (input.useBirthTime && !input.birthTime) {
    warnings.push(
      "useBirthTime was true but birthTime was missing. Engine returned three-pillar mode."
    );
  }

  if (normalizedInput.timezone === "UTC") {
    warnings.push(
      "Birth country was not found in timezone map. UTC fallback was used."
    );
  }

  const chartOutput = {
    meta: {
      engineVersion: ENGINE_VERSION,
      calculationMethod:
        "engine-v2-foundation-usefulgod-v4-annualoverlay-v4-practicalguidance-v6-blindspots-v1-wealtharchetype-v1-growthadvice-v1-relationshippattern-v1-relationshiparchetype-v1-topstrengths-v1-focusranking-v1-stonerecommendations-v4-productrecommendations-v1-relationshipengine-v2-genderinfluence-v1-careerengine-v1-wealthengine-v1-healthengine-v1-lifethemes-v1-narrativepersonalization-v1-narrativerenderer-v4-pdfreportschema-v1-paidreportschema-v1",
    },

    engineVersion: ENGINE_VERSION,
    mode: normalizedInput.useBirthTime ? "four-pillar" : "three-pillar",

    // When birth time is unknown we read only three pillars. The hour pillar
    // contributes ~25% of the chart, so day-master strength and element balance
    // are less precise. Surface this so the UI/report can note the limitation.
    readingConfidence: normalizedInput.useBirthTime
      ? {
          level: "full",
          basis: "four-pillar",
          note: "Full four-pillar reading.",
        }
      : {
          level: "approximate",
          basis: "three-pillar",
          note:
            "Birth time was not provided, so this reading uses three pillars (year, month, day). The hour pillar is excluded, which makes day-master strength and element balance approximate. For the most precise reading, provide a birth time.",
        },

    input: {
      name: normalizedInput.name,
      gender: normalizedInput.gender,
      birthDate: normalizedInput.birthDate,
      birthTime: normalizedInput.birthTime,
      birthCountry: normalizedInput.birthCountry,
      timezone: normalizedInput.timezone,
      useBirthTime: normalizedInput.useBirthTime,
      selectedYear,
    },

    pillars,

    tenGods: {
      byPillar: tenGodByPillar,
      scores: tenGodScores,
    },

    tenGodsV3,

    archetypes,
    adjustedArchetypes,
    birthZodiac,

    annualOverlay,
    annualOverlayV3,
    annualOverlayV4: annualOverlayV4Result,
    archetypeOverlayV3,

    elementBalance,
    elementBalanceV3,

    dayMasterStrength,
    dayMasterStrengthV3,
    dayMasterStrengthV4: dayMasterStrengthV4Result,

    tenProfileScoringV2: tenProfileScoringV2Result,
    structureScoringV2: structureScoringV2Result,

    usefulGodSuggestion,
    usefulGodV3,
    usefulGodV4: usefulGodV4Result,
    usefulGod: usefulGodV4Result || usefulGodV3 || usefulGodSuggestion,

    personalEnergyProfile,

    practicalGuidance,
    practicalGuidanceV3,
    practicalGuidanceV6,

    relationshipEngineV2,
    relationshipPatternV1,
    relationshipArchetypeV1,
    topStrengthsV1,
    focusRankingV1,
    genderInfluenceV1,

    careerEngineV1,
    wealthEngineV1,
    wealthArchetypeV1,
    growthAdviceV1,
    healthEngineV1,

    lifeThemesV1,
    blindSpotsV1,
    narrativePersonalizationV1,

    lifeThemes: lifeThemesV1,
    blindSpots: blindSpotsV1,
    wealthArchetype: wealthArchetypeV1,
    growthAdvice: growthAdviceV1,
    relationshipPattern: relationshipPatternV1,
    relationshipArchetype: relationshipArchetypeV1,
    topStrengths: topStrengthsV1,
    focusRanking: focusRankingV1,

    personalityAndStructure: {
      tenProfileScoring: tenProfileScoringV2Result,
      structureScoring: structureScoringV2Result,
      archetypes,
      adjustedArchetypes,
      blindSpots: blindSpotsV1,
      topStrengths: topStrengthsV1,
      narrativePersonalization: narrativePersonalizationV1,
    },

    lifeAreas: {
      career: careerEngineV1,
      wealth: wealthEngineV1,
      wealthArchetype: wealthArchetypeV1,
      growthAdvice: growthAdviceV1,
      relationship: relationshipEngineV2,
      relationshipPattern: relationshipPatternV1,
      relationshipArchetype: relationshipArchetypeV1,
      health: healthEngineV1,
      wellness: healthEngineV1,
      lifeThemes: lifeThemesV1,
      blindSpots: blindSpotsV1,
      focusRanking: focusRankingV1,
    },

    narrativeRendererV1,
    narrative: narrativeRendererV1,

    pdfReportSchemaV1,
    pdfReportSchema: pdfReportSchemaV1,

    paidReportSchemaV1,
    paidReportSchema: paidReportSchemaV1,

    stoneRecommendations,
    stoneRecommendationsV3,
    stoneRecommendationsV4,
    productRecommendationsV1,

    practicalSupport: {
      guidance:
        practicalGuidanceV6 ||
        practicalGuidanceV3 ||
        practicalGuidance,

      blindSpots: blindSpotsV1,
      wealthArchetype: wealthArchetypeV1,
      growthAdvice: growthAdviceV1,
      relationshipPattern: relationshipPatternV1,
      relationshipArchetype: relationshipArchetypeV1,
      topStrengths: topStrengthsV1,
      focusRanking: focusRankingV1,

      stones:
        stoneRecommendationsV4 ||
        stoneRecommendationsV3 ||
        stoneRecommendations,

      products: productRecommendationsV1,
    },

    recommendations: {
      stones:
        stoneRecommendationsV4 ||
        stoneRecommendationsV3 ||
        stoneRecommendations,

      products: productRecommendationsV1,
    },

    warnings,
  };

  console.table({
    name: normalizedInput.name,
    gender: normalizedInput.gender,

    dayMaster: dayMasterStrengthV4Result?.status,
    strengthScore: dayMasterStrengthV4Result?.strengthScore,

    structure: structureScoringV2Result?.mainStructure?.name,
    dominantProfile: tenProfileScoringV2Result?.dominantProfile?.name,

    usefulGod: usefulGodV4Result?.primaryUsefulGod,
    secondary: usefulGodV4Result?.secondaryUsefulGod,

    annualOverlayV4: annualOverlayV4Result?.version,
    adjustedUsefulGod: annualOverlayV4Result?.adjustedUsefulGod,
    recommendationMode: annualOverlayV4Result?.recommendationMode,

    practicalGuidanceV6: practicalGuidanceV6?.version,

    relationshipArchetypeV1: relationshipArchetypeV1?.source,
    relationshipArchetype: relationshipArchetypeV1?.name,

    topStrengthsV1: Array.isArray(topStrengthsV1)
      ? topStrengthsV1.map((item) => item.title).join(" | ")
      : null,

    focusRankingV1: Array.isArray(focusRankingV1)
      ? focusRankingV1.map((item) => item.area).join(" > ")
      : null,

    blindSpotsV1: blindSpotsV1?.version,
    wealthArchetypeV1: wealthArchetypeV1?.version,
    wealthArchetype: wealthArchetypeV1?.wealthArchetype,

    growthAdviceV1: growthAdviceV1?.version,
    growthFocus: growthAdviceV1?.growthFocus,

    relationshipPatternV1: relationshipPatternV1?.version,
    relationshipStyle: relationshipPatternV1?.relationshipStyle,
    relationshipPattern: relationshipPatternV1?.relationshipPattern,

    stoneRecommendationsV4: stoneRecommendationsV4?.version,
    productRecommendationsV1: productRecommendationsV1?.version,

    relationshipEngineV2: relationshipEngineV2?.version,
    relationshipGender: relationshipEngineV2?.gender,

    genderInfluenceV1: genderInfluenceV1?.version,
    genderInfluenceMode: genderInfluenceV1?.interpretationMode,

    careerEngineV1: careerEngineV1?.version,
    careerStyle: careerEngineV1?.careerStyle,
    leadershipStyle: careerEngineV1?.leadershipStyle,

    wealthEngineV1: wealthEngineV1?.version,
    wealthBehaviour: wealthEngineV1?.wealthBehaviour,
    incomeStyle: wealthEngineV1?.incomeStyle,
    moneyMindset: wealthEngineV1?.moneyMindset,

    healthEngineV1: healthEngineV1?.version,
    vitalityLevel: healthEngineV1?.vitalityLevel,
    stressPattern: healthEngineV1?.stressPattern,
    recoveryStyle: healthEngineV1?.recoveryStyle,

    lifeThemesV1: lifeThemesV1?.version,
    primaryThemes: lifeThemesV1?.primaryThemes?.join(" | "),
    supportingThemes: lifeThemesV1?.supportingThemes?.join(" | "),

    blindSpotCount: blindSpotsV1?.blindSpots?.length,

    narrativePersonalizationV1: narrativePersonalizationV1?.version,
    personalityFlavor: narrativePersonalizationV1?.personalityFlavor,
    careerFlavor: narrativePersonalizationV1?.careerFlavor,
    wealthFlavor: narrativePersonalizationV1?.wealthFlavor,
    relationshipFlavor: narrativePersonalizationV1?.relationshipFlavor,

    narrativeRendererV1: narrativeRendererV1?.version,
    narrativeHeadline: narrativeRendererV1?.headline,

    pdfReportSchemaV1: pdfReportSchemaV1?.version,
    paidReportSchemaV1: paidReportSchemaV1?.version,
  });

  console.log("ANNUAL OVERLAY V4:", annualOverlayV4Result);
  console.log("RELATIONSHIP ARCHETYPE V1:", relationshipArchetypeV1);
  console.log("TOP STRENGTHS V1:", topStrengthsV1);
  console.log("FOCUS RANKING V1:", focusRankingV1);
  console.log("BLIND SPOTS V1:", blindSpotsV1);
  console.log("WEALTH ARCHETYPE V1:", wealthArchetypeV1);
  console.log("GROWTH ADVICE V1:", growthAdviceV1);
  console.log("RELATIONSHIP PATTERN V1:", relationshipPatternV1);
  console.log("STONE RECOMMENDATIONS V4:", stoneRecommendationsV4);
  console.log("PRODUCT RECOMMENDATIONS V1:", productRecommendationsV1);
  console.log("PDF REPORT SCHEMA:", pdfReportSchemaV1);
  console.log("PAID REPORT SCHEMA:", paidReportSchemaV1);

  return chartOutput;
}

export default buildBaziChart;