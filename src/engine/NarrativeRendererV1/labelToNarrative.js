export const LABEL_TO_NARRATIVE = {
  // =========================
  // CONNECTOR FAMILY
  // =========================

  "Connector Strategist":
    "You naturally build momentum by connecting people, ideas and opportunities together.",

  "Influence-Based Leader":
    "Others may look to you for direction because you are often able to see the bigger picture and influence outcomes through trust.",

  "Network-driven income":
    "Financial opportunities tend to emerge through relationships, reputation and strategic positioning.",

  "Relationship Monetizer":
    "You are able to turn trust, relationships and visibility into tangible opportunities.",

  "Opportunity-Oriented":
    "Your natural optimism helps you spot possibilities and future opportunities, though it can sometimes make practical limitations less obvious at first.",

  "People and opportunity overload":
    "You may become drained when too many people, commitments or opportunities compete for your attention at once.",

  "Resilient but easily overextended":
    "You have strong endurance, but your energy can become strained when you keep pushing without allowing enough recovery time.",

  // =========================
  // THINKER / ANALYTICAL FAMILY
  // =========================

  "Analytical Specialist":
    "You have a natural ability to observe patterns, analyse situations deeply and uncover insights that others may overlook.",

  "Technical Expert Leader":
    "People often value your judgement because your decisions are usually grounded in knowledge, preparation and thoughtful analysis.",

  "Expertise-driven income":
    "Your greatest opportunities often come from developing specialised knowledge, skills and expertise that others are willing to seek out.",

  "Knowledge-Oriented":
    "You naturally seek understanding before action, preferring to gather information and clarity before making important decisions.",

  "Mental overload":
    "Your mind is often active and processing multiple ideas at once, which can sometimes create unnecessary pressure or exhaustion.",

  "Sensitive":
    "You are highly aware of your surroundings and emotions, giving you depth of understanding but also making recovery and boundaries especially important.",

  // =========================
  // SUPPORTER FAMILY
  // =========================

  "Support-Oriented Expert":
    "You create value by helping others succeed through reliability, practical support and consistent contribution.",

  "Supportive Mentor":
    "People may naturally turn to you for guidance because you are able to offer both encouragement and practical perspective.",

  "Service-driven income":
    "Opportunities often emerge when your ability to support, guide or care for others creates meaningful value.",

  "Security-Oriented":
    "You value stability, trust and predictability, often making decisions based on long-term sustainability rather than short-term excitement.",

  "Responsibility overload":
    "You may sometimes carry more responsibility than necessary, especially when you feel accountable for the wellbeing of others.",

  // =========================
  // LIFE THEMES
  // =========================

  "Boundaries through selective visibility":
    "Your growth improves when you become more intentional about where your attention, time and emotional energy are invested.",

  "Visibility, momentum and emotional activation":
    "This period encourages greater visibility and action, but it also asks you to manage your energy carefully rather than reacting to every opportunity that appears.",

  "Building influence through relationships, communication and meaningful connection.":
    "Your path grows through communication, trust and meaningful relationships that gradually strengthen your influence over time.",

  "Turning knowledge, insight and inner understanding into practical direction.":
    "Your growth comes from transforming knowledge and self-understanding into practical action that creates meaningful progress.",

  "Creating stability through service, trust, care and long-term contribution.":
    "Your path develops through consistency, trustworthiness and the ability to create long-term value for the people around you.",

  // =========================
  // WORK ENVIRONMENTS
  // =========================

  "Relationship-driven environments where communication and networking are important":
    "You tend to thrive in environments where communication, collaboration and relationship-building play an important role.",

  "Knowledge-based environments where research, strategy, analysis and thoughtful decision-making are valued":
    "You perform best in environments where careful thinking, expertise and strategic problem-solving are appreciated.",

  "Stable and service-oriented environments where care, reliability, guidance and long-term contribution matter":
    "You tend to flourish in environments where consistency, trust and meaningful contribution are valued over constant change.",

  // =========================
  // COMMON GROWTH THEMES
  // =========================

  "Develop stronger boundaries while remaining open to opportunities.":
    "Your next stage of growth comes from balancing openness with discernment, allowing opportunities in without taking on everything at once.",

  "Move from preparation into action.":
    "Progress comes when you trust what you already know and begin acting on it instead of waiting for perfect certainty.",

  "Value personal contribution without carrying everything alone.":
    "Your growth comes from recognising that supporting others does not require sacrificing your own wellbeing or carrying every burden yourself.",

  "Taking on too many people, opportunities or responsibilities at the same time.":
    "One of your recurring challenges is recognising when your commitments have exceeded your available time, energy or emotional capacity.",

  "Overthinking, over-preparing or waiting too long before acting.":
    "A common challenge is becoming trapped in preparation or analysis when action would create greater clarity.",

  "Supporting others while neglecting personal needs, boundaries or recognition.":
    "You may sometimes prioritise the needs of others so heavily that your own wellbeing, boundaries or contributions become overlooked.",

  // =========================
  // GENERIC FALLBACK THEMES
  // =========================

  "Connection":
    "Meaningful relationships and collaboration play an important role in your growth.",

  "Leadership":
    "You are often placed in situations where others naturally look to you for direction and guidance.",

  "Influence":
    "Your impact tends to grow through trust, credibility and long-term relationship building.",

  "Trust":
    "Many of your opportunities emerge when you learn to trust both yourself and the right people around you.",

  "Growth":
    "Personal growth often comes from stepping into new experiences while remaining grounded in your values.",
};

export function toNarrative(value) {
  if (!value) return "";

  const text = String(value).trim();

  return LABEL_TO_NARRATIVE[text] || text;
}