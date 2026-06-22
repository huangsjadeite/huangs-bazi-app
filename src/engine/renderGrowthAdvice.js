import { STRUCTURE_THEMES } from "./narrativeTemplates.js";

export function renderGrowthAdvice({ lifeThemes }, tracker) {
  const structure = lifeThemes?.dominantStructure;
  const base = STRUCTURE_THEMES[structure]?.growthAdvice || [];

  return base.filter((item) => tracker.use(item)).slice(0, 3);
}