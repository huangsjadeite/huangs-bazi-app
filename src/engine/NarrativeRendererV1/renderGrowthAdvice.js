import { toNarrative } from "./labelToNarrative.js";

export function renderGrowthAdvice(
  {
    career,
    wealth,
    relationship,
    health,
    lifeThemes,
    narrativePersonalization,
  },
  tracker
) {
  const advice = [];

  const primaryThemes = lifeThemes?.primaryThemes || [];
  const supportingThemes = lifeThemes?.supportingThemes || [];

  const structure =
    narrativePersonalization?.structure || "";

  const profile =
    narrativePersonalization?.profile || "";

  // Structure + Profile specific advice

  if (
    structure === "Connectors" &&
    profile === "Direct Wealth"
  ) {
    advice.push(
      "Allow support to become part of your growth process instead of assuming that every challenge must be handled alone."
    );

    advice.push(
      "Focus on making fewer but better decisions, trusting consistency more than constant activity."
    );

    advice.push(
      "Place yourself in environments where communication, relationship-building and collaboration can create opportunities naturally."
    );
  }

  else if (
    structure === "Connectors" &&
    profile === "Indirect Resource"
  ) {
    advice.push(
      "Allow support to become part of your growth process instead of assuming that every challenge must be handled alone."
    );

    advice.push(
      "Choose opportunities that support sustainable growth rather than growth that creates unnecessary pressure."
    );

    advice.push(
      "Place yourself in environments where communication, relationship-building and collaboration can create opportunities naturally."
    );
  }

  else if (
    structure === "Thinkers" &&
    profile === "Eating God"
  ) {
    advice.push(
      "Build confidence through action as well as learning, allowing experience to reinforce what you already know."
    );

    advice.push(
      "Choose environments where your thinking, research and ability to analyse situations are properly valued."
    );

    advice.push(
      "Focus on making fewer but better decisions, trusting consistency more than constant activity."
    );
  }

  else if (
    structure === "Thinkers" &&
    profile === "Direct Resource"
  ) {
    advice.push(
      "Build confidence through action as well as learning, allowing experience to reinforce what you already know."
    );

    advice.push(
      "Stay open to new perspectives while maintaining a clear sense of direction and purpose."
    );

    advice.push(
      "Choose environments where your thinking, research and ability to analyse situations are properly valued."
    );
  }

  else if (
    structure === "Supporters" &&
    profile === "Direct Resource"
  ) {
    advice.push(
      "Allow support to be mutual instead of always being the person who carries more."
    );

    advice.push(
      "Protect your energy by setting clearer boundaries around your time, attention and emotional availability."
    );

    advice.push(
      "Invest time in strengthening your foundations before pursuing larger ambitions."
    );
  }

  // Fallback system

  else {
    if (primaryThemes.length > 1) {
      advice.push(
        buildGrowthAdviceFromTheme(
          primaryThemes[1]
        )
      );
    }

    if (primaryThemes.length > 2) {
      advice.push(
        buildGrowthAdviceFromTheme(
          primaryThemes[2]
        )
      );
    }

    if (supportingThemes.length > 0) {
      advice.push(
        buildGrowthAdviceFromTheme(
          supportingThemes[0]
        )
      );
    }

    if (career?.idealWorkEnvironment) {
      advice.push(
        buildCareerAdvice(
          career.idealWorkEnvironment
        )
      );
    }

    if (health?.recoveryStyle) {
      advice.push(
        buildHealthAdvice(
          health.recoveryStyle
        )
      );
    }

    if (wealth?.wealthAdvice) {
      advice.push(
        buildWealthAdvice(
          wealth.wealthAdvice
        )
      );
    }

    if (relationship?.growthAdvice) {
      advice.push(
        buildRelationshipAdvice(
          relationship.growthAdvice
        )
      );
    }
  }

  return advice
    .filter(Boolean)
    .map((item) => toNarrative(item))
    .filter(Boolean)
    .filter((item) => tracker.use(item))
    .slice(0, 3);
}

function buildGrowthAdviceFromTheme(theme) {
  const text = String(theme).toLowerCase();

  if (
    text.includes("independence") ||
    text.includes("support")
  ) {
    return "Allow support to become part of your growth process instead of assuming that every challenge must be handled alone.";
  }

  if (
    text.includes("knowledge") ||
    text.includes("confidence")
  ) {
    return "Build confidence through action as well as learning, allowing experience to reinforce what you already know.";
  }

  if (
    text.includes("strategic") ||
    text.includes("decision")
  ) {
    return "Focus on making fewer but better decisions, trusting consistency more than constant activity.";
  }

  if (
    text.includes("adaptability") ||
    text.includes("learning")
  ) {
    return "Stay open to new perspectives while maintaining a clear sense of direction and purpose.";
  }

  if (
    text.includes("growth") ||
    text.includes("expansion")
  ) {
    return "Choose opportunities that support sustainable growth rather than growth that creates unnecessary pressure.";
  }

  if (
    text.includes("leadership") ||
    text.includes("responsibility")
  ) {
    return "Lead through clarity and example rather than feeling responsible for solving every problem around you.";
  }

  if (
    text.includes("stability") ||
    text.includes("foundations")
  ) {
    return "Invest time in strengthening your foundations before pursuing larger ambitions.";
  }

  return String(theme);
}

function buildCareerAdvice(environment) {
  return String(environment);
}

function buildHealthAdvice(recoveryStyle) {
  return String(recoveryStyle);
}

function buildWealthAdvice(advice) {
  return String(advice);
}

function buildRelationshipAdvice(advice) {
  return String(advice);
}

export default renderGrowthAdvice;