// RelationshipArchetypeV1.js
// Consumer-facing relationship archetype engine.
// No UI logic. No React. No BaZi display formatting.
// Input expected from buildBaziChart.js engine output.

const PROFILE_ALIASES = {
  Friend: ["Friend", "Companion", "Parallel"],
  RobWealth: ["Rob Wealth", "RobWealth", "Competitor", "Warrior"],
  EatingGod: ["Eating God", "EatingGod", "Creator"],
  HurtingOfficer: ["Hurting Officer", "HurtingOfficer", "Performer"],
  DirectWealth: ["Direct Wealth", "DirectWealth", "Provider"],
  IndirectWealth: ["Indirect Wealth", "IndirectWealth", "Pioneer"],
  DirectOfficer: ["Direct Officer", "DirectOfficer", "Leader"],
  SevenKillings: ["Seven Killings", "SevenKillings", "Challenger"],
  DirectResource: ["Direct Resource", "DirectResource", "Supporter"],
  IndirectResource: ["Indirect Resource", "IndirectResource", "Thinker"],
};

const DEFAULT_ARCHETYPE = {
  name: "The Steady Companion",
  relationshipStyle:
    "You approach relationships through trust, consistency and emotional safety. You may take time to open up, but once you feel secure, you are sincere and dependable.",
  strengths: [
    "You are loyal once trust is built.",
    "You value emotional stability over drama.",
    "You can become a calming presence in a relationship.",
  ],
  blindSpots: [
    "You may wait too long before expressing what you really need.",
    "You may appear calm outside even when something matters deeply inside.",
    "You may stay in familiar patterns because they feel safe.",
  ],
  advice:
    "Let your partner understand your inner world earlier. Love becomes easier when you do not have to be guessed.",
  greenFlags: [
    "Someone who is consistent with their words and actions.",
    "Someone who makes you feel emotionally safe.",
    "Someone who respects your pace.",
  ],
  redFlags: [
    "Someone who creates confusion or emotional instability.",
    "Someone who only shows effort when they are about to lose you.",
    "Someone who dismisses your feelings as too much or unnecessary.",
  ],
  partnerNeeds: [
    "Emotional consistency",
    "Patience",
    "A peaceful and trustworthy connection",
  ],
};

const ARCHETYPE_LIBRARY = {
  LOYAL_BUILDER: {
    name: "The Loyal Builder",
    relationshipStyle:
      "You approach love seriously. You do not usually treat relationships as something casual, because you naturally look for stability, trust and long-term direction.",
    strengths: [
      "You are dependable when you commit.",
      "You naturally think about the future of the relationship.",
      "You are willing to build through effort, not just emotion.",
    ],
    blindSpots: [
      "You may become too responsible and forget to receive care too.",
      "You may measure love through effort instead of emotional softness.",
      "You may stay strong for too long before admitting you need support.",
    ],
    advice:
      "Let love be built with both responsibility and tenderness. You do not always have to be the strong one for the relationship to feel secure.",
    greenFlags: [
      "Someone who is consistent and sincere.",
      "Someone who respects commitment.",
      "Someone who can build a stable life with you.",
    ],
    redFlags: [
      "Someone who avoids accountability.",
      "Someone who only wants excitement but not responsibility.",
      "Someone who makes you carry the whole relationship alone.",
    ],
    partnerNeeds: [
      "Commitment",
      "Reliability",
      "Shared long-term direction",
    ],
  },

  INDEPENDENT_HEART: {
    name: "The Independent Heart",
    relationshipStyle:
      "You need love, but you also need space to remain yourself. You are not naturally drawn to relationships that feel controlling, restrictive or emotionally suffocating.",
    strengths: [
      "You respect individuality in love.",
      "You are not easily dependent on someone for validation.",
      "You bring strength and self-direction into relationships.",
    ],
    blindSpots: [
      "You may appear more emotionally detached than you really are.",
      "You may avoid asking for help because you are used to handling things alone.",
      "You may test whether someone respects your freedom before fully opening up.",
    ],
    advice:
      "Independence is part of your strength, but love also requires allowing someone to come close enough to support you.",
    greenFlags: [
      "Someone who gives you space without becoming distant.",
      "Someone who respects your individuality.",
      "Someone who supports your growth instead of competing with it.",
    ],
    redFlags: [
      "Someone who is possessive or controlling.",
      "Someone who makes you feel guilty for needing space.",
      "Someone who turns love into a power struggle.",
    ],
    partnerNeeds: [
      "Freedom",
      "Mutual respect",
      "A relationship that supports personal growth",
    ],
  },

  TRUSTED_COMPANION: {
    name: "The Trusted Companion",
    relationshipStyle:
      "You approach relationships through friendship, familiarity and emotional trust. You may not rush into romance, but you grow deeply attached when someone feels safe and real.",
    strengths: [
      "You are emotionally loyal once someone earns your trust.",
      "You are good at creating a natural sense of companionship.",
      "You can be very supportive in everyday life.",
    ],
    blindSpots: [
      "You may hide romantic feelings behind friendship.",
      "You may stay in unclear connections because they feel comfortable.",
      "You may avoid direct emotional conversations until the situation becomes confusing.",
    ],
    advice:
      "Let your heart be clearer earlier. A connection can feel safe and still need honest direction.",
    greenFlags: [
      "Someone who feels like both a lover and a best friend.",
      "Someone who communicates steadily.",
      "Someone who makes ordinary life feel peaceful.",
    ],
    redFlags: [
      "Someone who keeps the connection undefined for too long.",
      "Someone who only comes close when convenient.",
      "Someone who enjoys your support but avoids commitment.",
    ],
    partnerNeeds: [
      "Friendship",
      "Emotional safety",
      "Clear commitment over time",
    ],
  },

  EMOTIONAL_EXPLORER: {
    name: "The Emotional Explorer",
    relationshipStyle:
      "You are drawn to relationships that help you understand yourself more deeply. Love is not only about stability for you; it also needs emotional meaning, curiosity and growth.",
    strengths: [
      "You are emotionally reflective.",
      "You can sense subtle shifts in a relationship.",
      "You are open to growth, healing and deeper conversations.",
    ],
    blindSpots: [
      "You may overthink someone’s feelings or intentions.",
      "You may be attracted to emotional complexity even when it is tiring.",
      "You may confuse intensity with true compatibility.",
    ],
    advice:
      "Choose the person who brings clarity, not just emotional depth. A meaningful relationship should help you feel more grounded, not constantly uncertain.",
    greenFlags: [
      "Someone who can talk honestly about feelings.",
      "Someone who brings emotional clarity.",
      "Someone who supports your inner growth.",
    ],
    redFlags: [
      "Someone who gives mixed signals.",
      "Someone who makes you keep guessing.",
      "Someone who uses emotional depth without emotional responsibility.",
    ],
    partnerNeeds: [
      "Emotional honesty",
      "Depth",
      "Reassurance and clarity",
    ],
  },

  PASSION_SEEKER: {
    name: "The Passion Seeker",
    relationshipStyle:
      "You are drawn to chemistry, excitement and emotional aliveness. You need a relationship that feels real, expressive and alive — not flat or overly predictable.",
    strengths: [
      "You bring warmth and passion into love.",
      "You are expressive when you feel emotionally engaged.",
      "You can inspire your partner to feel more alive and confident.",
    ],
    blindSpots: [
      "You may be pulled toward intensity before checking emotional stability.",
      "You may lose interest when the relationship becomes too routine.",
      "You may mistake pursuit or drama for genuine love.",
    ],
    advice:
      "Let passion be supported by consistency. The right relationship should feel exciting without making you anxious.",
    greenFlags: [
      "Someone who is warm, expressive and sincere.",
      "Someone who keeps the relationship alive without creating chaos.",
      "Someone who matches your energy but still brings stability.",
    ],
    redFlags: [
      "Someone who is exciting but unreliable.",
      "Someone who creates emotional highs and lows.",
      "Someone who enjoys attraction but avoids responsibility.",
    ],
    partnerNeeds: [
      "Chemistry",
      "Warmth",
      "Consistent emotional effort",
    ],
  },

  QUIET_PROTECTOR: {
    name: "The Quiet Protector",
    relationshipStyle:
      "You may not always express love loudly, but you show care through protection, loyalty and quiet effort. You naturally want the people you love to feel safe.",
    strengths: [
      "You are protective when you care.",
      "You can stay calm during difficult moments.",
      "You show love through practical support and presence.",
    ],
    blindSpots: [
      "You may expect your actions to speak for themselves.",
      "You may suppress softer feelings because vulnerability feels unfamiliar.",
      "You may become guarded when you feel emotionally exposed.",
    ],
    advice:
      "Let your partner hear your feelings, not only see your effort. Protection feels warmer when it is paired with emotional openness.",
    greenFlags: [
      "Someone who appreciates quiet forms of love.",
      "Someone who does not force you to open up before you are ready.",
      "Someone who makes vulnerability feel safe.",
    ],
    redFlags: [
      "Someone who provokes you to get a reaction.",
      "Someone who mistakes your quietness for lack of care.",
      "Someone who disrespects your boundaries.",
    ],
    partnerNeeds: [
      "Trust",
      "Respect",
      "Gentle emotional patience",
    ],
  },

  DEVOTED_STRATEGIST: {
    name: "The Devoted Strategist",
    relationshipStyle:
      "You think carefully about love. You may observe, assess and protect your heart before fully committing, because you want the relationship to make sense emotionally and practically.",
    strengths: [
      "You are thoughtful about long-term compatibility.",
      "You notice details others may miss.",
      "You are willing to improve the relationship when you see real potential.",
    ],
    blindSpots: [
      "You may overanalyse the connection.",
      "You may look for certainty before allowing emotional closeness.",
      "You may become too focused on what could go wrong.",
    ],
    advice:
      "Use your discernment wisely, but do not let analysis replace experience. Some parts of love can only be understood by being present.",
    greenFlags: [
      "Someone whose actions are clear and consistent.",
      "Someone who can discuss the future maturely.",
      "Someone who respects your need to understand the relationship.",
    ],
    redFlags: [
      "Someone who avoids serious conversations.",
      "Someone who makes you feel foolish for needing clarity.",
      "Someone whose words and actions do not match.",
    ],
    partnerNeeds: [
      "Clarity",
      "Maturity",
      "Shared values and direction",
    ],
  },

  SOFT_LEADER: {
    name: "The Soft Leader",
    relationshipStyle:
      "You may naturally influence the direction of a relationship, but you are learning that love does not need to be controlled to be safe. Your best relationship allows you to lead and soften at the same time.",
    strengths: [
      "You bring direction and strength into relationships.",
      "You can take initiative when something matters.",
      "You are capable of protecting the relationship’s future.",
    ],
    blindSpots: [
      "You may become too used to leading everything.",
      "You may struggle to receive care without feeling vulnerable.",
      "You may unintentionally dominate the emotional pace of the relationship.",
    ],
    advice:
      "The right partner should not make you feel weaker when you soften. Let love become a place where you can be supported, not just impressive.",
    greenFlags: [
      "Someone who respects your strength but also cares for your softer side.",
      "Someone who can lead with you, not against you.",
      "Someone who makes you feel safe enough to relax.",
    ],
    redFlags: [
      "Someone who competes with your strength.",
      "Someone who only values you when you are capable.",
      "Someone who makes softness feel unsafe.",
    ],
    partnerNeeds: [
      "Emotional safety",
      "Mutual respect",
      "A partner who can meet your strength calmly",
    ],
  },

  GROWTH_PARTNER: {
    name: "The Growth Partner",
    relationshipStyle:
      "You approach love as something that should help both people become better. You are drawn to relationships where both partners support each other’s confidence, healing and future direction.",
    strengths: [
      "You encourage growth in your partner.",
      "You are willing to improve yourself for the relationship.",
      "You naturally notice potential in people.",
    ],
    blindSpots: [
      "You may fall in love with potential instead of reality.",
      "You may give too much encouragement to someone who is not showing effort.",
      "You may become the emotional coach instead of an equal partner.",
    ],
    advice:
      "Choose someone who is already willing to grow, not someone you have to convince. Love should inspire both people, not depend on you carrying the transformation.",
    greenFlags: [
      "Someone who takes responsibility for their growth.",
      "Someone who supports your ambitions and emotions.",
      "Someone who becomes better with you, not because you force it.",
    ],
    redFlags: [
      "Someone who drains your energy but calls it love.",
      "Someone who depends on you to fix their life.",
      "Someone who talks about growth but avoids real change.",
    ],
    partnerNeeds: [
      "Mutual growth",
      "Encouragement",
      "Shared emotional responsibility",
    ],
  },

  SELECTIVE_ROMANTIC: {
    name: "The Selective Romantic",
    relationshipStyle:
      "You may be romantic, but you are not easily convinced. You need emotional sincerity, personal standards and a connection that feels meaningful before you fully open your heart.",
    strengths: [
      "You have strong standards in love.",
      "You can be deeply sincere once you choose someone.",
      "You are not easily satisfied by surface-level attraction.",
    ],
    blindSpots: [
      "You may hide your softness behind high standards.",
      "You may reject people before giving the connection enough room to unfold.",
      "You may compare reality against an ideal version of love.",
    ],
    advice:
      "Keep your standards, but allow love to be human. The right person may not be perfect, but they should be sincere, consistent and emotionally safe.",
    greenFlags: [
      "Someone who is sincere and emotionally present.",
      "Someone who respects your standards.",
      "Someone who makes romance feel safe, not performative.",
    ],
    redFlags: [
      "Someone who pressures you to lower your standards.",
      "Someone who gives charm without consistency.",
      "Someone who makes love feel like performance.",
    ],
    partnerNeeds: [
      "Sincerity",
      "Emotional quality",
      "Romance with consistency",
    ],
  },
};

function normalizeKey(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getProfileScore(tenProfiles = {}, profileKey) {
  const aliases = PROFILE_ALIASES[profileKey] || [profileKey];

  for (const alias of aliases) {
    if (tenProfiles[alias] !== undefined) {
      return Number(tenProfiles[alias]) || 0;
    }
  }

  const normalizedAliases = aliases.map(normalizeKey);

  for (const [key, value] of Object.entries(tenProfiles || {})) {
    if (normalizedAliases.includes(normalizeKey(key))) {
      return Number(value) || 0;
    }
  }

  return 0;
}

function getTopProfiles(tenProfiles = {}) {
  const profileKeys = Object.keys(PROFILE_ALIASES);

  return profileKeys
    .map((key) => ({
      key,
      score: getProfileScore(tenProfiles, key),
    }))
    .sort((a, b) => b.score - a.score);
}

function getDominantProfile(tenProfiles = {}) {
  return getTopProfiles(tenProfiles)[0] || { key: null, score: 0 };
}

function getStructureName(structure = {}) {
  if (typeof structure === "string") return structure;

  return (
    structure?.name ||
    structure?.primary ||
    structure?.type ||
    structure?.dominantStructure ||
    ""
  );
}

function getStrengthCategory(daymasterStrength = {}) {
  if (typeof daymasterStrength === "string") return daymasterStrength;

  return (
    daymasterStrength?.category ||
    daymasterStrength?.label ||
    daymasterStrength?.strengthCategory ||
    daymasterStrength?.level ||
    ""
  );
}

function isStrongDaymaster(daymasterStrength = {}) {
  const category = normalizeKey(getStrengthCategory(daymasterStrength));
  const score = Number(
    daymasterStrength?.score ??
      daymasterStrength?.finalScore ??
      daymasterStrength?.percentage ??
      0
  );

  return (
    category.includes("strong") ||
    category.includes("verystrong") ||
    score >= 60
  );
}

function isWeakDaymaster(daymasterStrength = {}) {
  const category = normalizeKey(getStrengthCategory(daymasterStrength));
  const score = Number(
    daymasterStrength?.score ??
      daymasterStrength?.finalScore ??
      daymasterStrength?.percentage ??
      0
  );

  return category.includes("weak") || score > 0 && score < 45;
}

function getUsefulGodElements(usefulGod = {}) {
  if (Array.isArray(usefulGod)) return usefulGod;

  return (
    usefulGod?.elements ||
    usefulGod?.favourableElements ||
    usefulGod?.favorableElements ||
    usefulGod?.supportiveElements ||
    usefulGod?.usefulElements ||
    []
  );
}

function includesUsefulElement(usefulGod = {}, element) {
  return getUsefulGodElements(usefulGod)
    .map((item) => normalizeKey(item?.element || item?.name || item))
    .includes(normalizeKey(element));
}

function scoreArchetypes({
  tenProfiles = {},
  structure = {},
  daymasterStrength = {},
  usefulGod = {},
}) {
  const dominant = getDominantProfile(tenProfiles);
  const structureName = normalizeKey(getStructureName(structure));
  const strongDM = isStrongDaymaster(daymasterStrength);
  const weakDM = isWeakDaymaster(daymasterStrength);

  const score = {
    LOYAL_BUILDER: 0,
    INDEPENDENT_HEART: 0,
    TRUSTED_COMPANION: 0,
    EMOTIONAL_EXPLORER: 0,
    PASSION_SEEKER: 0,
    QUIET_PROTECTOR: 0,
    DEVOTED_STRATEGIST: 0,
    SOFT_LEADER: 0,
    GROWTH_PARTNER: 0,
    SELECTIVE_ROMANTIC: 0,
  };

  const add = (key, points) => {
    score[key] += points;
  };

  const friend = getProfileScore(tenProfiles, "Friend");
  const robWealth = getProfileScore(tenProfiles, "RobWealth");
  const eatingGod = getProfileScore(tenProfiles, "EatingGod");
  const hurtingOfficer = getProfileScore(tenProfiles, "HurtingOfficer");
  const directWealth = getProfileScore(tenProfiles, "DirectWealth");
  const indirectWealth = getProfileScore(tenProfiles, "IndirectWealth");
  const directOfficer = getProfileScore(tenProfiles, "DirectOfficer");
  const sevenKillings = getProfileScore(tenProfiles, "SevenKillings");
  const directResource = getProfileScore(tenProfiles, "DirectResource");
  const indirectResource = getProfileScore(tenProfiles, "IndirectResource");

  // Profile-driven scoring
  add("TRUSTED_COMPANION", friend * 1.2);
  add("INDEPENDENT_HEART", robWealth * 1.3);
  add("PASSION_SEEKER", eatingGod * 0.9);
  add("PASSION_SEEKER", hurtingOfficer * 1.2);
  add("LOYAL_BUILDER", directWealth * 1.3);
  add("GROWTH_PARTNER", indirectWealth * 1.1);
  add("LOYAL_BUILDER", directOfficer * 1.1);
  add("SOFT_LEADER", directOfficer * 1.2);
  add("QUIET_PROTECTOR", sevenKillings * 1.2);
  add("SOFT_LEADER", sevenKillings * 1.1);
  add("TRUSTED_COMPANION", directResource * 1.2);
  add("DEVOTED_STRATEGIST", indirectResource * 1.3);
  add("EMOTIONAL_EXPLORER", indirectResource * 1.1);

  // Dominant profile bonus
  switch (dominant.key) {
    case "Friend":
      add("TRUSTED_COMPANION", 18);
      break;
    case "RobWealth":
      add("INDEPENDENT_HEART", 18);
      break;
    case "EatingGod":
      add("PASSION_SEEKER", 14);
      add("GROWTH_PARTNER", 8);
      break;
    case "HurtingOfficer":
      add("PASSION_SEEKER", 18);
      add("SELECTIVE_ROMANTIC", 8);
      break;
    case "DirectWealth":
      add("LOYAL_BUILDER", 18);
      break;
    case "IndirectWealth":
      add("GROWTH_PARTNER", 16);
      add("PASSION_SEEKER", 8);
      break;
    case "DirectOfficer":
      add("SOFT_LEADER", 16);
      add("LOYAL_BUILDER", 12);
      break;
    case "SevenKillings":
      add("QUIET_PROTECTOR", 16);
      add("SOFT_LEADER", 14);
      break;
    case "DirectResource":
      add("TRUSTED_COMPANION", 16);
      add("LOYAL_BUILDER", 8);
      break;
    case "IndirectResource":
      add("DEVOTED_STRATEGIST", 16);
      add("EMOTIONAL_EXPLORER", 14);
      break;
    default:
      break;
  }

  // Structure influence
  if (structureName.includes("connector")) {
    add("TRUSTED_COMPANION", 15);
    add("GROWTH_PARTNER", 10);
  }

  if (structureName.includes("thinker")) {
    add("DEVOTED_STRATEGIST", 15);
    add("EMOTIONAL_EXPLORER", 10);
  }

  if (structureName.includes("supporter")) {
    add("LOYAL_BUILDER", 14);
    add("TRUSTED_COMPANION", 12);
  }

  if (structureName.includes("leader")) {
    add("SOFT_LEADER", 16);
    add("QUIET_PROTECTOR", 8);
  }

  if (structureName.includes("creator")) {
    add("PASSION_SEEKER", 14);
    add("SELECTIVE_ROMANTIC", 8);
  }

  if (structureName.includes("performer")) {
    add("PASSION_SEEKER", 16);
    add("INDEPENDENT_HEART", 8);
  }

  if (structureName.includes("pioneer")) {
    add("GROWTH_PARTNER", 14);
    add("INDEPENDENT_HEART", 10);
  }

  // Daymaster strength influence
  if (strongDM) {
    add("INDEPENDENT_HEART", 10);
    add("SOFT_LEADER", 10);
    add("QUIET_PROTECTOR", 8);
  }

  if (weakDM) {
    add("TRUSTED_COMPANION", 10);
    add("LOYAL_BUILDER", 8);
    add("EMOTIONAL_EXPLORER", 8);
  }

  // Useful God emotional adjustment
  if (includesUsefulElement(usefulGod, "Water")) {
    add("EMOTIONAL_EXPLORER", 8);
    add("TRUSTED_COMPANION", 6);
  }

  if (includesUsefulElement(usefulGod, "Wood")) {
    add("GROWTH_PARTNER", 8);
    add("EMOTIONAL_EXPLORER", 6);
  }

  if (includesUsefulElement(usefulGod, "Fire")) {
    add("PASSION_SEEKER", 8);
    add("SELECTIVE_ROMANTIC", 6);
  }

  if (includesUsefulElement(usefulGod, "Earth")) {
    add("LOYAL_BUILDER", 8);
    add("TRUSTED_COMPANION", 6);
  }

  if (includesUsefulElement(usefulGod, "Metal")) {
    add("DEVOTED_STRATEGIST", 8);
    add("SELECTIVE_ROMANTIC", 6);
  }

  return score;
}

function enrichWithContext(base, context) {
  const { daymasterStrength = {}, usefulGod = {} } = context;
  const strongDM = isStrongDaymaster(daymasterStrength);
  const weakDM = isWeakDaymaster(daymasterStrength);

  const notes = [];

  if (strongDM) {
    notes.push(
      "Because your personal energy is naturally strong, relationships work better when you do not feel controlled, but also when you do not have to carry everything alone."
    );
  }

  if (weakDM) {
    notes.push(
      "Because your personal energy is more sensitive to your environment, emotional safety and consistency matter more than dramatic chemistry."
    );
  }

  if (includesUsefulElement(usefulGod, "Water")) {
    notes.push(
      "You may benefit from a partner who brings calm communication, emotional patience and space to process your feelings."
    );
  }

  if (includesUsefulElement(usefulGod, "Wood")) {
    notes.push(
      "You may benefit from a partner who supports your growth, encourages your confidence and gives the relationship room to evolve naturally."
    );
  }

  if (includesUsefulElement(usefulGod, "Fire")) {
    notes.push(
      "You may benefit from a partner who brings warmth, affection and emotional expression into the relationship."
    );
  }

  if (includesUsefulElement(usefulGod, "Earth")) {
    notes.push(
      "You may benefit from a partner who is grounded, steady and sincere in their actions."
    );
  }

  if (includesUsefulElement(usefulGod, "Metal")) {
    notes.push(
      "You may benefit from a partner who is clear, respectful and mature in how they handle commitment."
    );
  }

  return {
    ...base,
    relationshipStyle: notes.length
      ? `${base.relationshipStyle} ${notes[0]}`
      : base.relationshipStyle,
    advice: notes.length > 1 ? `${base.advice} ${notes[1]}` : base.advice,
  };
}

export function buildRelationshipArchetypeV1(input = {}) {
  const {
    tenProfiles = {},
    structure = {},
    daymasterStrength = {},
    usefulGod = {},
  } = input;

  const archetypeScores = scoreArchetypes({
    tenProfiles,
    structure,
    daymasterStrength,
    usefulGod,
  });

  const ranked = Object.entries(archetypeScores)
    .map(([key, score]) => ({ key, score }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0];

  if (!winner || winner.score <= 0) {
    return {
      ...DEFAULT_ARCHETYPE,
      key: "STEADY_COMPANION",
      score: 0,
      source: "RelationshipArchetypeV1",
    };
  }

  const base = ARCHETYPE_LIBRARY[winner.key] || DEFAULT_ARCHETYPE;

  return {
    key: winner.key,
    score: Math.round(winner.score),
    source: "RelationshipArchetypeV1",
    ...enrichWithContext(base, {
      tenProfiles,
      structure,
      daymasterStrength,
      usefulGod,
    }),
  };
}

export default buildRelationshipArchetypeV1;