const TEN_GOD_ARCHETYPE_BOOSTS = {
  friend: ["friend"],
  robWealth: ["robWealth"],
  eatingGod: ["eatingGod"],
  hurtingOfficer: ["hurtingOfficer"],
  directWealth: ["directWealth"],
  indirectWealth: ["indirectWealth"],
  directOfficer: ["directOfficer"],
  sevenKilling: ["sevenKilling"],
  directResource: ["directResource"],
  indirectResource: ["indirectResource"],
};

const LIFE_THEME_BOOSTS = {
  career: ["directOfficer", "sevenKilling", "directWealth"],
  wealth: ["directWealth", "indirectWealth"],
  relationship: ["friend", "directResource", "indirectResource"],
  wellness: ["directResource", "indirectResource", "eatingGod"],
};

function getStrongestLifeTheme(annualOverlayV3 = {}) {
  const scores = {
    career: annualOverlayV3?.career?.score || 0,
    wealth: annualOverlayV3?.wealth?.score || 0,
    relationship: annualOverlayV3?.relationship?.score || 0,
    wellness: annualOverlayV3?.wellness?.score || 0,
  };

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export function buildArchetypeOverlayV4({
  archetypes = [],
  annualOverlayV3 = {},
}) {
  const annualStemTenGod =
    annualOverlayV3?.annualTenGods?.stemTenGod || null;

  const strongestLifeTheme = getStrongestLifeTheme(annualOverlayV3);

  const lifeThemeBoostKeys =
    LIFE_THEME_BOOSTS[strongestLifeTheme] || [];

  const amplifiedElements =
    annualOverlayV3?.amplifiedElements || [];

  const boostedKeys =
    TEN_GOD_ARCHETYPE_BOOSTS[annualStemTenGod] || [];

  const adjustedArchetypes = archetypes
    .map((archetype) => {
      let annualBoost = 0;
      const adjustmentReasons = [];

      if (boostedKeys.includes(archetype.key)) {
        annualBoost += 12;
        adjustmentReasons.push(
          `2026 activates your ${archetype.publicName} pattern more strongly.`
        );
      }

      if (lifeThemeBoostKeys.includes(archetype.key)) {
        annualBoost += 6;
        adjustmentReasons.push(
          `${strongestLifeTheme} themes are emphasised this year.`
        );
      }

      if (
        archetype.element &&
        amplifiedElements.includes(archetype.element)
      ) {
        annualBoost += 4;
        adjustmentReasons.push(
          `${archetype.element} energy is amplified this year.`
        );
      }

      const baseScore = Number(archetype.score || 0);
      const adjustedScore = Math.min(100, baseScore + annualBoost);

      return {
        ...archetype,
        baseScore,
        annualBoost,
        score: adjustedScore,
        adjustmentReasons,
      };
    })
    .sort((a, b) => b.score - a.score);

  const dominantArchetype = adjustedArchetypes[0] || null;
  const supportingArchetypes = adjustedArchetypes.slice(1, 5);

  const yearShiftExplanation = annualStemTenGod
    ? `This year highlights your ${annualStemTenGod} pattern, so your archetype ranking may shift based on the annual energy.`
    : "This year may subtly shift your archetype expression, but no strong annual Ten God influence was detected.";

  return {
    adjustedArchetypes,
    dominantArchetype,
    supportingArchetypes,
    yearShiftExplanation,
  };
}