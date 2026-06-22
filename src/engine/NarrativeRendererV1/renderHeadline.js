import { personalizeHeadline } from "./personalizeNarrative.js";

export function renderHeadline({
  career,
  wealth,
  relationship,
  health,
  lifeThemes,
  narrativePersonalization,
}) {
  const primaryThemes =
    lifeThemes?.primaryThemes || [];

  const structure =
    narrativePersonalization?.structure || "";

  const profile =
    narrativePersonalization?.profile || "";

  const personalityFlavor =
    narrativePersonalization?.personalityFlavor || "";

  const careerFlavor =
    narrativePersonalization?.careerFlavor || "";

  const wealthFlavor =
    narrativePersonalization?.wealthFlavor || "";

  let baseHeadline;

  // Highest priority:
  // Structure + Profile flavour

  if (
    structure === "Connectors" &&
    profile === "Direct Wealth"
  ) {
    baseHeadline =
      "Building influence through relationships, visibility and strategic positioning.";
  } else if (
    structure === "Connectors" &&
    profile === "Indirect Wealth"
  ) {
    baseHeadline =
      "Creating opportunities through people, timing and meaningful connections.";
  } else if (
    structure === "Connectors" &&
    profile === "Friend"
  ) {
    baseHeadline =
      "Building trust, loyalty and growth through meaningful relationships.";
  } else if (
    structure === "Thinkers" &&
    profile === "Eating God"
  ) {
    baseHeadline =
      "Growing through knowledge, expertise and thoughtful self-development.";
  } else if (
    structure === "Thinkers" &&
    profile === "Direct Resource"
  ) {
    baseHeadline =
      "Building wisdom, clarity and confidence through understanding.";
  } else if (
    structure === "Supporters" &&
    profile === "Direct Resource"
  ) {
    baseHeadline =
      "Creating stability, guidance and lasting value through reliability.";
  } else if (
    primaryThemes.length > 0
  ) {
    baseHeadline =
      `Your life path is strongly shaped by ${primaryThemes[0].toLowerCase()}.`;
  } else {
    baseHeadline =
      "This chapter invites you to understand yourself more clearly and grow with greater intention.";
  }

  return personalizeHeadline({
    baseHeadline,
    career,
    wealth,
    relationship,
    health,
    lifeThemes,
    narrativePersonalization,
  });
}

export default renderHeadline;