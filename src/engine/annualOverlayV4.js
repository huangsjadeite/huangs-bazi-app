// /src/engine/annualOverlayV4.js

export function annualOverlayV4({
  usefulGodV4,
  annualOverlay,
}) {
  const natalUsefulGod =
    usefulGodV4?.primaryUsefulGod;

  const rawAnnualData =
    annualOverlay?.elementScores ||
    annualOverlay?.annualElementScores ||
    annualOverlay?.annualElements ||
    annualOverlay?.elements ||
    {};

  let annualElements = {};

  // Handle array format
  if (Array.isArray(rawAnnualData)) {
    rawAnnualData.forEach((element) => {
      annualElements[element] =
        (annualElements[element] || 0) + 1;
    });
  }

  // Handle object format
  else {
    annualElements = rawAnnualData;
  }

  const fireScore =
    annualElements.Fire || 0;

  const earthScore =
    annualElements.Earth || 0;

  const waterScore =
    annualElements.Water || 0;

  const metalScore =
    annualElements.Metal || 0;

  const woodScore =
    annualElements.Wood || 0;

  let adjustedUsefulGod =
    natalUsefulGod;

  let recommendationMode =
    "natal";

  let explanation =
    "Natal Useful God remains the priority.";

  // Fire-heavy year
  if (
    fireScore >= 2 &&
    natalUsefulGod !== "Fire"
  ) {
    adjustedUsefulGod = "Water";

    recommendationMode =
      "annual-adjusted";

    explanation =
      "Strong annual Fire increases demand for Water support.";
  }

  // Earth-heavy year
  else if (
    earthScore >= 2 &&
    natalUsefulGod !== "Earth"
  ) {
    adjustedUsefulGod = "Wood";

    recommendationMode =
      "annual-adjusted";

    explanation =
      "Strong annual Earth increases demand for Wood support.";
  }

  // Water-heavy year
  else if (
    waterScore >= 2 &&
    natalUsefulGod !== "Water"
  ) {
    adjustedUsefulGod = "Wood";

    recommendationMode =
      "annual-adjusted";

    explanation =
      "Strong annual Water increases demand for Wood support.";
  }

  // Metal-heavy year
  else if (
    metalScore >= 2 &&
    natalUsefulGod !== "Metal"
  ) {
    adjustedUsefulGod = "Fire";

    recommendationMode =
      "annual-adjusted";

    explanation =
      "Strong annual Metal increases demand for Fire support.";
  }

  // Wood-heavy year
  else if (
    woodScore >= 2 &&
    natalUsefulGod !== "Wood"
  ) {
    adjustedUsefulGod = "Metal";

    recommendationMode =
      "annual-adjusted";

    explanation =
      "Strong annual Wood increases demand for Metal support.";
  }

  return {
    version: "annual-overlay-v4",

    natalUsefulGod,

    annualElements,

    adjustedUsefulGod,

    recommendationMode,

    explanation,
  };
}