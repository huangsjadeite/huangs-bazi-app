import { buildArchetypeOverlayV4 } from "./ArchetypeOverlayV4.js";
import { buildPracticalGuidanceV5 } from "./practicalGuidanceV5.js";
import { buildStoneRecommendationsV3 }
  from "./stoneRecommendationsV3.js";
import { buildPracticalGuidanceV4 } from "./practicalGuidanceV4.js";
import { buildArchetypeOverlayV3 } from "./ArchetypeOverlayV3.js";
import { buildAnnualOverlayV3 } from "./annualOverlayV3.js";
import { calculateElementBalanceV3 } from "./elementBalanceV3.js";
import { calculateUsefulGodV3 } from "./usefulGodV3.js";
import { calculateDayMasterStrengthV3 } from "./dayMasterStrengthV3.js";
import { calculateTenGods } from "./tenGodCalculator.js";
import { TEN_GOD_ARCHETYPES as ARCHETYPES } from "../data/archetypes.js";
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

export function buildBaziChart(input) {
  const normalizedInput = normalizeInput(input);

  const pillars = calculatePillars(normalizedInput);
  const tenGodsV3 = calculateTenGods(pillars);

  const tenGodByPillar = calculateTenGodProfile(pillars);
  const tenGodScores = calculateTenGodScores(pillars);

  const elementBalance = calculateElementBalance(pillars);
const elementBalanceV3 = calculateElementBalanceV3(pillars);

  const dayMasterStrengthV3 = calculateDayMasterStrengthV3(pillars);
  const usefulGodV3 = calculateUsefulGodV3(dayMasterStrengthV3);

  const dayMasterStrength = calculateDayMasterStrength(pillars, elementBalance);
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

const annualOverlay = buildAnnualOverlay(
  normalizedInput.selectedYear || 2026,
  elementBalance
);

const annualOverlayV3 = buildAnnualOverlayV3({
  pillars,
    annualPillar: annualOverlay?.yearPillar,
  selectedYear: normalizedInput.selectedYear || 2026,
  dayMasterStrengthV3,
  usefulGodV3,
  elementBalanceV3,
});

const archetypes = calculateArchetypeScores({
  pillars,
  dayStem: pillars?.day?.stem?.name || pillars?.day?.stem?.zh || pillars?.day?.stem,
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

const stoneRecommendations = buildStoneRecommendations({
  usefulGodSuggestion,
  personalEnergyProfile,
  annualOverlay,
});

const stoneRecommendationsV3 =
  buildStoneRecommendationsV3({
    dayMasterStrengthV3,
    usefulGodV3,
    elementBalanceV3,
    annualOverlayV3,
  });

  const warnings = [
    "Month pillar uses approximate Jie Qi boundaries. Replace with exact solar-term timestamps before production.",
    "Day pillar uses a fixed reference anchor. Validate against chosen almanac before production lock.",
  ];

  if (input.useBirthTime && !input.birthTime) {
    warnings.push(
      "useBirthTime was true but birthTime was missing. Engine returned three-pillar mode."
    );
  }

  if (normalizedInput.timezone === "UTC") {
    warnings.push("Birth country was not found in timezone map. UTC fallback was used.");
  }

  return {
  meta: {
    engineVersion: ENGINE_VERSION,
    calculationMethod: "strength-season-usefulgod-v2",
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
},
    pillars,
    tenGods: {
      byPillar: tenGodByPillar,
      scores: tenGodScores,
    },
    archetypes,
adjustedArchetypes,
birthZodiac,
annualOverlay,
annualOverlayV3,
archetypeOverlayV3,
practicalGuidance,
practicalGuidanceV3,
stoneRecommendations,
stoneRecommendationsV3,
tenGodsV3,
elementBalance,
elementBalanceV3,
dayMasterStrength,
dayMasterStrengthV3,
usefulGodSuggestion,
usefulGodV3,
personalEnergyProfile,
warnings,
  };
}

export default buildBaziChart;