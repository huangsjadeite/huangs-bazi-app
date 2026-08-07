export const ARCHETYPE_EMOJIS = {
  "The Friend": "🤝",
  "The Leader": "👑",
  "The Artist": "🎨",
  "The Performer": "🎤",
  "The Director": "💼",
  "The Pioneer": "🚀",
  "The Diplomat": "⚖️",
  "The Warrior": "⚔️",
  "The Analyzer": "📚",
  "The Philosopher": "🌙",
};

export const PROFILE_DISPLAY = {
  friend: {
    actualName: "Friend",
    icon: "🤝",
    name: "The Companion",
    subtitle: "Connection & Loyalty",
    theme:
      "You value loyalty, trust and meaningful connections. Relationships often play an important role in your growth.",
  },
  robWealth: {
    actualName: "Rob Wealth",
    icon: "👑",
    name: "The Challenger",
    subtitle: "Independence & Drive",
    theme:
      "You are independent, competitive and willing to challenge existing limits when pursuing goals or opportunities.",
  },
  eatingGod: {
    actualName: "Eating God",
    icon: "🎨",
    name: "The Creator",
    subtitle: "Expression & Creativity",
    theme:
      "You enjoy expressing ideas, creativity and personal perspectives. Innovation often comes naturally to you.",
  },
  hurtingOfficer: {
    actualName: "Hurting Officer",
    icon: "🎤",
    name: "The Rebel Voice",
    subtitle: "Innovation & Change",
    theme:
      "You question assumptions and are not afraid to express alternative viewpoints when you believe something can improve.",
  },
  directWealth: {
    actualName: "Direct Wealth",
    icon: "💼",
    name: "The Builder",
    subtitle: "Stability & Results",
    theme:
      "You naturally focus on creating stability, ownership and tangible results. You prefer steady progress over unnecessary risk.",
  },
  indirectWealth: {
    actualName: "Indirect Wealth",
    icon: "🚀",
    name: "The Opportunist",
    subtitle: "Opportunity & Timing",
    theme:
      "You are alert to opportunities and often spot possibilities that others miss. Flexibility and timing are important strengths.",
  },
  directOfficer: {
    actualName: "Direct Officer",
    icon: "⚖️",
    name: "The Guardian",
    subtitle: "Responsibility & Structure",
    theme:
      "You value responsibility, structure and doing what is right. Others often see you as dependable and trustworthy.",
  },
  sevenKillings: {
    actualName: "Seven Killings",
    icon: "⚔️",
    name: "The Warrior",
    subtitle: "Courage & Action",
    theme:
      "You perform well under pressure and often step forward when challenges require courage, decisiveness and action.",
  },
  directResource: {
    actualName: "Direct Resource",
    icon: "📚",
    name: "The Nurturer",
    subtitle: "Learning & Support",
    theme:
      "You learn through observation, reflection and support. Building knowledge often strengthens your confidence.",
  },
  indirectResource: {
    actualName: "Indirect Resource",
    icon: "🌙",
    name: "The Mystic",
    subtitle: "Reflection & Insight",
    theme:
      "You are naturally curious and reflective, often seeking deeper meaning, understanding and personal insight.",
  },
};

export function getProfileDisplay(profileName) {
  const stripped = String(profileName || "").replace(/\s+/g, "");
  const camelKey = stripped.charAt(0).toLowerCase() + stripped.slice(1);
  return PROFILE_DISPLAY[camelKey] || PROFILE_DISPLAY[stripped] || {};
}
