import { createThemeTracker } from "./themeTracker.js";
import { renderHeadline } from "./renderHeadline.js";
import { renderSummary } from "./renderSummary.js";
import { renderStrengths } from "./renderStrengths.js";
import { renderBlindSpots } from "./renderBlindSpots.js";
import { renderGrowthAdvice } from "./renderGrowthAdvice.js";
import { renderCareerFocus } from "./renderCareerFocus.js";
import { renderWealthFocus } from "./renderWealthFocus.js";
import { renderRelationshipFocus } from "./renderRelationshipFocus.js";
import { renderWellnessFocus } from "./renderWellnessFocus.js";

export function NarrativeRendererV1({
  career = null,
  wealth = null,
  relationship = null,
  health = null,
  lifeThemes = null,
  narrativePersonalization = null,
} = {}) {
  const tracker = createThemeTracker();

  const payload = {
    career,
    wealth,
    relationship,
    health,

    lifeThemes: {
      primaryThemes: lifeThemes?.primaryThemes || [],
      supportingThemes: lifeThemes?.supportingThemes || [],
      reasoning: lifeThemes?.reasoning || [],
      version: lifeThemes?.version || "life-themes-v1",
    },

    narrativePersonalization: {
      structure:
        narrativePersonalization?.structure || "",

      profile:
        narrativePersonalization?.profile || "",

      primaryUsefulGod:
        narrativePersonalization?.primaryUsefulGod || "",

      personalityFlavor:
        narrativePersonalization?.personalityFlavor || "",

      careerFlavor:
        narrativePersonalization?.careerFlavor || "",

      wealthFlavor:
        narrativePersonalization?.wealthFlavor || "",

      relationshipFlavor:
        narrativePersonalization?.relationshipFlavor || "",

      reasoning:
        narrativePersonalization?.reasoning || [],

      version:
        narrativePersonalization?.version ||
        "narrative-personalization-v1",
    },
  };

  return {
    version: "NarrativeRendererV4",

    headline: renderHeadline(payload),

    summary: renderSummary(payload),

    strengths: renderStrengths(payload, tracker),

    blindSpots: renderBlindSpots(payload, tracker),

    growthAdvice: renderGrowthAdvice(payload, tracker),

    careerFocus: renderCareerFocus(payload),

    wealthFocus: renderWealthFocus(payload),

    relationshipFocus: renderRelationshipFocus(payload),

    wellnessFocus: renderWellnessFocus(payload),

    lifeThemes: payload.lifeThemes,

    narrativePersonalization:
      payload.narrativePersonalization,
  };
}

export default NarrativeRendererV1;