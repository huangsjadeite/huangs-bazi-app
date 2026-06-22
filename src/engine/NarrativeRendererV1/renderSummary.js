import { personalizeSummaryOpening } from "./personalizeNarrative.js";

export function renderSummary({
  career,
  wealth,
  relationship,
  health,
  lifeThemes,
  narrativePersonalization,
}) {
  const primaryThemes = lifeThemes?.primaryThemes || [];
  const supportingThemes = lifeThemes?.supportingThemes || [];

  const structure =
    narrativePersonalization?.structure || "";

  const profile =
    narrativePersonalization?.profile || "";

  const personalityFlavor =
    narrativePersonalization?.personalityFlavor || "";

  const coreLifeTheme =
    primaryThemes[0] ||
    "understanding yourself more clearly and making more intentional choices";

  const growthTheme =
    primaryThemes[1] ||
    "learning how to grow in a way that feels steady, mature and sustainable";

  const balancingTheme =
    primaryThemes[2] ||
    "making choices that feel more aligned, grounded and sustainable";

  const supportingThemeText =
    supportingThemes.length > 0
      ? supportingThemes.join(" and ")
      : "better self-awareness and long-term growth";

  const careerStyle =
    career?.careerStyle ||
    career?.leadershipStyle ||
    "building a clearer sense of direction in your work";

  const wealthStyle =
    wealth?.wealthBehaviour ||
    wealth?.incomeStyle ||
    "making financial choices with more steadiness and long-term awareness";

  const relationshipStyle =
    relationship?.relationshipStyle?.description ||
    relationship?.communicationStyle?.description ||
    "building relationships with more trust, clarity and emotional honesty";

  const healthStyle =
    health?.recoveryStyle ||
    health?.stressPattern ||
    "creating routines that support your energy instead of draining it";

  let openingText;

  if (
    structure === "Connectors" &&
    profile === "Direct Wealth"
  ) {
    openingText =
      "Your chart shows someone who grows through people, timing and visibility. Opportunities often open when you are seen, trusted and placed in the right environment. A major theme throughout life is learning how relationships, influence and strategic positioning can create meaningful progress.";
  } else if (
    structure === "Connectors" &&
    profile === "Friend"
  ) {
    openingText =
      "Your chart shows someone who grows through relationships, trust and mutual support. Many of your opportunities develop through the people around you, and your ability to build loyalty, connection and long-term goodwill often becomes one of your greatest strengths.";
  } else if (
    structure === "Thinkers" &&
    profile === "Eating God"
  ) {
    openingText =
      "Your chart shows someone who grows through understanding, learning and expertise. You may need time to observe, analyse and make sense of situations before moving forward with confidence. Over time, knowledge becomes one of your most valuable assets.";
  } else if (
    structure === "Thinkers" &&
    profile === "Direct Resource"
  ) {
    openingText =
      "Your chart shows someone who grows through wisdom, preparation and thoughtful decision-making. You often perform best when you have a clear understanding of what you are doing and why, allowing confidence to develop from genuine competence.";
  } else if (
    structure === "Supporters" &&
    profile === "Direct Resource"
  ) {
    openingText =
      "Your chart shows someone who grows through reliability, care and meaningful contribution. People may value your steadiness more than you realise, and many of your long-term opportunities come from consistently creating value over time.";
  } else {
    openingText =
      `This phase of life highlights ${cleanText(
        coreLifeTheme
      ).toLowerCase()}. Rather than moving through life on autopilot, your chart points toward becoming more conscious of the patterns, people and choices that truly shape your direction.`;
  }

  const opening = personalizeSummaryOpening({
    baseOpening: openingText,
    career,
    wealth,
    relationship,
    health,
    lifeThemes,
    narrativePersonalization,
  });

  return [
    opening,

    `A major part of your growth journey involves ${cleanText(
      growthTheme
    ).toLowerCase()} while also learning the lessons contained within ${cleanText(
      balancingTheme
    ).toLowerCase()}. Life may repeatedly place you in situations that encourage greater self-awareness, better judgement and a clearer understanding of what truly matters to you.`,

    `In practical terms, this energy expresses itself through ${cleanText(
      careerStyle
    )}, ${cleanText(
      wealthStyle
    )} and ${cleanText(
      relationshipStyle
    )}. These themes are often connected rather than separate. The way you work, make decisions, build trust and communicate with others may influence multiple areas of life at the same time.`,

    `Your wellbeing is closely connected to ${cleanText(
      healthStyle
    )}. When your energy, emotional state and recovery needs are respected, it becomes easier to make decisions that feel sustainable rather than reactive.`,

    `Overall, the supporting themes of ${cleanText(
      supportingThemeText
    ).toLowerCase()} suggest that your longer-term progress comes from alignment rather than force. The more your choices reflect who you genuinely are and what you value most, the more naturally growth, opportunities and fulfilment can develop over time.`,
  ].join("\n\n");
}

function cleanText(value) {
  return String(value || "")
    .replace(/\.$/, "")
    .trim();
}

export default renderSummary;