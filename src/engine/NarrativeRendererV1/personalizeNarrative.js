export function personalizeHeadline({
  baseHeadline,
  career,
  wealth,
  relationship,
  health,
  lifeThemes,
}) {
  const careerStyle = career?.careerStyle;
  const incomeStyle = wealth?.incomeStyle;
  const healthPattern = health?.stressPattern;
  const coreTheme = lifeThemes?.coreLifeTheme;

  if (
    careerStyle === "Connector Strategist" &&
    incomeStyle === "Network-driven income"
  ) {
    return "Building influence through relationships, visibility and strategic positioning.";
  }

  if (
    careerStyle === "Connector Strategist" &&
    healthPattern === "People and opportunity overload"
  ) {
    return "Learning to grow through connection without carrying every opportunity at once.";
  }

  if (careerStyle === "Analytical Specialist") {
    return "Turning knowledge, insight and careful thinking into practical direction.";
  }

  if (careerStyle === "Support-Oriented Expert") {
    return "Creating stability through care, reliability and long-term contribution.";
  }

  return baseHeadline || coreTheme || "Understanding your growth path with greater clarity.";
}

export function personalizeSummaryOpening({
  baseOpening,
  career,
  wealth,
  relationship,
  health,
  lifeThemes,
}) {
  const careerStyle = career?.careerStyle;
  const incomeStyle = wealth?.incomeStyle;
  const vitalityLevel = health?.vitalityLevel;

  if (
    careerStyle === "Connector Strategist" &&
    incomeStyle === "Network-driven income"
  ) {
    return "Your chart shows someone who grows through people, timing and visibility. Opportunities often open when you are seen, trusted and placed in the right conversations.";
  }

  if (careerStyle === "Analytical Specialist") {
    return "Your chart shows someone who grows through understanding. You may need time to observe, analyse and make sense of things before moving forward with confidence.";
  }

  if (careerStyle === "Support-Oriented Expert") {
    return "Your chart shows someone who grows through reliability, care and meaningful contribution. People may value your steadiness more than you realise.";
  }

  if (vitalityLevel === "Sensitive") {
    return "Your chart shows a sensitive internal system that needs space, rhythm and emotional clarity in order to function well.";
  }

  return baseOpening;
}