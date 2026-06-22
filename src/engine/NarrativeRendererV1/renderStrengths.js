import { toNarrative } from "./labelToNarrative.js";

export function renderStrengths(
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
  const strengths = [];

  const structure = narrativePersonalization?.structure || "";
  const profile = narrativePersonalization?.profile || "";

  if (structure === "Connectors" && profile === "Direct Wealth") {
    strengths.push(
      "You are able to create momentum by bringing the right people, ideas and opportunities together.",
      "People may naturally look to you when direction, trust or relationship management is needed.",
      "Financial growth tends to come through trust, reputation and the relationships you build over time."
    );
  } else if (structure === "Connectors" && profile === "Friend") {
    strengths.push(
      "You build strong long-term relationships through loyalty, trust and genuine support.",
      "People often feel comfortable around you because of your ability to create connection and mutual understanding.",
      "Many opportunities develop through goodwill, reciprocity and the strength of your relationships."
    );
  } else if (structure === "Thinkers" && profile === "Eating God") {
    strengths.push(
      "You are able to understand situations deeply and notice patterns that others may miss.",
      "People are likely to respect your judgement because it comes from preparation, knowledge and careful thinking.",
      "Your earning potential grows when you develop knowledge or skills that people recognise as valuable."
    );
  } else if (structure === "Thinkers" && profile === "Direct Resource") {
    strengths.push(
      "You are naturally thoughtful, observant and able to make decisions from a place of understanding.",
      "People may trust your advice because it is grounded in preparation, research and careful consideration.",
      "You create value by turning knowledge, experience and insight into practical guidance."
    );
  } else if (structure === "Supporters" && profile === "Direct Resource") {
    strengths.push(
      "You create value through reliability, practical support and the ability to make others feel guided.",
      "People may trust your guidance because you combine care with practical perspective.",
      "You are able to build stability by offering reliable value that others can depend on."
    );
  } else {
    if (career?.careerStyle) {
      strengths.push(buildCareerStrength(career.careerStyle, career));
    }

    if (career?.leadershipStyle) {
      strengths.push(buildLeadershipStrength(career.leadershipStyle, career));
    }

    if (wealth?.incomeStyle || wealth?.wealthBehaviour) {
      strengths.push(buildWealthStrength(wealth));
    }

    if (
      relationship?.communicationStyle?.description ||
      relationship?.relationshipStyle?.description
    ) {
      strengths.push(buildRelationshipStrength(relationship));
    }

    if (health?.recoveryStyle) {
      strengths.push(buildHealthStrength(health.recoveryStyle));
    }

    const primaryThemes = lifeThemes?.primaryThemes || [];
    const supportingThemes = lifeThemes?.supportingThemes || [];

    if (primaryThemes.length > 0) {
      strengths.push(buildLifeThemeStrength(primaryThemes[0]));
    }

    if (supportingThemes.length > 0) {
      strengths.push(buildLifeThemeStrength(supportingThemes[0]));
    }
  }

  return strengths
    .filter(Boolean)
    .map((item) => toNarrative(item))
    .filter((item) => tracker.use(item))
    .slice(0, 3);
}

function buildCareerStrength(careerStyle, career) {
  const text = String(careerStyle).toLowerCase();
  const leadership = String(career?.leadershipStyle || "").toLowerCase();

  if (text.includes("connector") && leadership.includes("influence")) {
    return "You are able to create momentum by bringing the right people, ideas and opportunities together.";
  }

  if (text.includes("connector")) {
    return "You have a natural ability to build bridges between people, conversations and opportunities.";
  }

  if (text.includes("analytical")) {
    return "You are able to understand situations deeply and notice patterns that others may miss.";
  }

  if (text.includes("systems")) {
    return "You are naturally good at creating order, structure and consistency that help people and projects function smoothly.";
  }

  if (text.includes("support")) {
    return "You create value through reliability, practical support and the ability to make others feel guided.";
  }

  return careerStyle;
}

function buildLeadershipStrength(leadershipStyle, career) {
  const text = String(leadershipStyle).toLowerCase();
  const careerStyle = String(career?.careerStyle || "").toLowerCase();

  if (text.includes("influence") && careerStyle.includes("connector")) {
    return "People may naturally look to you when direction, trust or relationship management is needed.";
  }

  if (text.includes("operational")) {
    return "You lead effectively by creating clarity, accountability and dependable systems that others can rely on.";
  }

  if (text.includes("technical") || text.includes("expert")) {
    return "People are likely to respect your judgement because it comes from preparation, knowledge and careful thinking.";
  }

  if (text.includes("mentor") || text.includes("support")) {
    return "People may trust your guidance because you combine care with practical perspective.";
  }

  return leadershipStyle;
}

function buildWealthStrength(wealth) {
  const incomeStyle = String(wealth?.incomeStyle || "").toLowerCase();
  const wealthBehaviour = String(wealth?.wealthBehaviour || "").toLowerCase();

  if (incomeStyle.includes("network") || wealthBehaviour.includes("relationship")) {
    return "Financial growth tends to come through trust, reputation and the relationships you build over time.";
  }

  if (incomeStyle.includes("expertise") || wealthBehaviour.includes("knowledge")) {
    return "Your earning potential grows when you develop knowledge or skills that people recognise as valuable.";
  }

  if (incomeStyle.includes("structure") || wealthBehaviour.includes("structure")) {
    return "Financial strength grows when you build stable systems, consistent habits and long-term foundations.";
  }

  if (incomeStyle.includes("service") || wealthBehaviour.includes("security")) {
    return "You are able to build stability by offering reliable value that others can depend on.";
  }

  return wealth?.incomeStyle || wealth?.wealthBehaviour;
}

function buildRelationshipStrength(relationship) {
  return (
    relationship?.communicationStyle?.description ||
    relationship?.relationshipStyle?.description
  );
}

function buildHealthStrength(recoveryStyle) {
  return recoveryStyle;
}

function buildLifeThemeStrength(theme) {
  return theme;
}

export default renderStrengths;