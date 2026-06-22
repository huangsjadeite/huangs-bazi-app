export function renderRelationshipFocus({
  relationship,
  lifeThemes,
  narrativePersonalization,
}) {
  const mainStructure =
    lifeThemes?.mainStructure ||
    lifeThemes?.dominantStructure ||
    relationship?.debug?.mainStructure ||
    narrativePersonalization?.structure ||
    "";

  const profile =
    narrativePersonalization?.profile || "";

  const relationshipFlavor =
    narrativePersonalization?.relationshipFlavor || "";

  const strengths =
    relationship?.relationshipStyle?.strengths || [];

  const cautions =
    relationship?.relationshipStyle?.cautions || [];

  const partnerTraits =
    relationship?.partnerDynamics?.favourablePartnerTraits || [];

  const timing =
    relationship?.timingNotes?.annualInfluence || "";

  // CONNECTORS

  if (
    mainStructure === "Connectors" &&
    profile === "Direct Wealth"
  ) {
    return [
      "Your relationship growth is closely connected to communication, trust and shared experiences. You tend to build connection through presence, conversation and emotional responsiveness.",
      "You often express care through consistency, reliability and showing up when people matter to you.",
      "Because relationships and responsibilities can become closely linked, one of your key lessons is learning that love does not always require carrying everything yourself.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (
    mainStructure === "Connectors" &&
    profile === "Indirect Resource"
  ) {
    return [
      "Your relationship growth is closely connected to communication, trust and emotional understanding. You often build connection through insight, empathy and meaningful conversations.",
      "You may naturally look beneath the surface of people and situations, which helps you understand emotional dynamics that others may miss.",
      "One of your key lessons is allowing relationships to unfold naturally rather than trying to understand every possibility before trust has had time to develop.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (
    mainStructure === "Connectors" &&
    profile === "Friend"
  ) {
    return [
      "Your relationship growth is closely connected to companionship, trust and shared experiences. You often value loyalty, mutual support and emotional reciprocity.",
      "You naturally invest in the people you care about and often become someone others feel comfortable relying on.",
      "One of your key lessons is ensuring that support flows both ways instead of becoming the person who constantly gives while expecting little in return.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // THINKERS

  if (mainStructure === "Thinkers") {
    return [
      "Your relationship growth comes from allowing emotional connection to develop alongside understanding. You may need time to observe, reflect and feel mentally safe before fully opening up.",
      relationshipFlavor
        ? `You naturally seek ${relationshipFlavor.toLowerCase()}, which means trust often develops through understanding rather than immediate emotional intensity.`
        : null,
      "One of the key lessons is to avoid analysing every signal before the relationship has enough time to reveal itself naturally. Not everything meaningful can be understood immediately.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // SUPPORTERS

  if (mainStructure === "Supporters") {
    return [
      "Your relationship growth comes from learning that care should flow both ways. You may naturally offer loyalty, patience and emotional support to the people you value.",
      relationshipFlavor
        ? `You often feel most secure when relationships provide ${relationshipFlavor.toLowerCase()} rather than uncertainty or inconsistency.`
        : null,
      "One of the key lessons is to avoid becoming responsible for another person's emotional wellbeing while quietly neglecting your own needs and limits.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // CREATORS

  if (mainStructure === "Creators") {
    return [
      "Your relationship growth comes from emotional honesty, freedom and authentic self-expression. You need space to be yourself without feeling restricted or judged.",
      relationshipFlavor
        ? `Relationships tend to thrive when ${relationshipFlavor.toLowerCase()} can be expressed naturally rather than forced.`
        : null,
      "One of the key lessons is to remain present during uncertainty instead of withdrawing too quickly when you feel misunderstood.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // MANAGERS

  if (mainStructure === "Managers") {
    return [
      "Your relationship growth comes from building trust through consistency, reliability and clear direction. You may value commitment and emotional steadiness more than vague or uncertain connection.",
      relationshipFlavor
        ? `You are often drawn toward relationships that reflect ${relationshipFlavor.toLowerCase()} and long-term dependability.`
        : null,
      "One of the key lessons is to avoid trying to control the pace, outcome or future of the relationship before mutual trust has had enough time to develop naturally.",
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  // FALLBACK

  if (strengths.length || cautions.length || partnerTraits.length) {
    return [
      strengths[0],
      partnerTraits[0],
      cautions[0],
      timing,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return `Your relationship growth comes from building trust, emotional clarity and mutual support in a way that feels steady, honest and sustainable.${relationshipFlavor ? ` You naturally value ${relationshipFlavor.toLowerCase()} in close relationships.` : ""} Healthy connection tends to develop when both people feel safe enough to communicate openly while respecting each other's individuality.`;
}

export default renderRelationshipFocus;