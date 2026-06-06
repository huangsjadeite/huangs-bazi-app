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

export function buildArchetypeOverlayV3({
  archetypes = [],
  annualOverlayV3 = {},
}) {
  const annualStemTenGod =
    annualOverlayV3?.annualTenGods?.stemTenGod || null;

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