// src/engine/careerEngineV1.js

const VERSION = "career-engine-v1";

function safeName(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value?.name || value?.label || value?.type || value?.profile || null;
}

function getCareerStyle(mainStructure, dominantProfile) {
  if (mainStructure === "Connectors") return "Connector Strategist";
  if (mainStructure === "Thinkers") return "Analytical Specialist";
  if (mainStructure === "Supporters") return "Support-Oriented Expert";
  if (mainStructure === "Creators") return "Creative Builder";
  if (mainStructure === "Managers") return "Systems Manager";

  if (dominantProfile) return `${dominantProfile} Career Style`;

  return "Adaptive Career Style";
}

function getIdealWorkEnvironment(mainStructure) {
  const map = {
    Connectors:
      "Relationship-driven environments where communication, trust-building, networking and opportunity creation are important.",
    Thinkers:
      "Knowledge-based environments where research, strategy, analysis and thoughtful decision-making are valued.",
    Supporters:
      "Stable and service-oriented environments where care, reliability, guidance and long-term contribution matter.",
    Creators:
      "Creative or flexible environments where expression, originality, problem-solving and independence are encouraged.",
    Managers:
      "Structured environments where planning, accountability, execution and leadership direction are important.",
  };

  return (
    map[mainStructure] ||
    "Balanced environments where the person can use both personal strengths and practical judgment."
  );
}

function getLeadershipStyle(mainStructure, dominantProfile, dayStatus) {
  if (mainStructure === "Connectors") return "Influence-Based Leader";
  if (mainStructure === "Thinkers") return "Technical Expert Leader";
  if (mainStructure === "Supporters") return "Supportive Mentor";
  if (mainStructure === "Creators") return "Visionary Creator";
  if (mainStructure === "Managers") return "Operational Leader";

  if (dayStatus === "Excessive") return "Self-Directed Leader";
  if (dominantProfile) return `${dominantProfile} Leadership Style`;

  return "Adaptive Leader";
}

function getCareerStrengths(mainStructure) {
  const map = {
    Connectors: [
      "Builds strong professional relationships.",
      "Recognises opportunities through people, timing and networks.",
      "Communicates ideas in a way that can influence others.",
    ],
    Thinkers: [
      "Understands complex information deeply.",
      "Makes thoughtful and well-considered decisions.",
      "Can become highly skilled in specialised knowledge areas.",
    ],
    Supporters: [
      "Brings consistency, loyalty and reliability to work.",
      "Supports teams and clients with patience and care.",
      "Creates trust through responsibility and follow-through.",
    ],
    Creators: [
      "Generates fresh ideas and original solutions.",
      "Works well when given room for expression and independence.",
      "Can turn personal style into value.",
    ],
    Managers: [
      "Handles structure, planning and responsibility well.",
      "Can lead through systems, standards and execution.",
      "Works well with clear goals and measurable outcomes.",
    ],
  };

  return (
    map[mainStructure] || [
      "Adapts to different work situations.",
      "Can build career direction through self-awareness.",
      "Performs best when strengths are matched to the right environment.",
    ]
  ).slice(0, 3);
}

function getCareerRisks(mainStructure, dayStatus) {
  const risks = [];

  if (mainStructure === "Connectors") {
    risks.push(
      "May take on too much responsibility through people or opportunities."
    );
    risks.push("May become scattered when too many options appear at once.");
  }

  if (mainStructure === "Thinkers") {
    risks.push("May overanalyse before taking action.");
    risks.push("May become too mentally absorbed and delay practical execution.");
  }

  if (mainStructure === "Supporters") {
    risks.push("May over-give or carry other people's responsibilities.");
    risks.push("May stay too long in roles that feel safe but limiting.");
  }

  if (mainStructure === "Creators") {
    risks.push("May resist structure even when structure is needed.");
    risks.push("May lose motivation when work feels repetitive or restrictive.");
  }

  if (mainStructure === "Managers") {
    risks.push("May become too controlling or rigid under pressure.");
    risks.push("May focus on outcomes while neglecting emotional flexibility.");
  }

  if (dayStatus === "Excessive") {
    risks.push("May struggle to delegate or soften control.");
  }

  if (dayStatus === "Weak" || dayStatus === "Under-supported") {
    risks.push("May need more support, confidence and stability before taking big risks.");
  }

  return risks.slice(0, 3);
}

function getRecommendedDirections(mainStructure, primaryUsefulGod) {
  const structureMap = {
    Connectors: [
      "Consulting",
      "Sales",
      "Business Development",
      "Client Relationship Management",
      "Entrepreneurship",
    ],
    Thinkers: [
      "Research",
      "Strategy",
      "Education",
      "Analysis",
      "Specialist Advisory",
    ],
    Supporters: [
      "Teaching",
      "Wellness",
      "Human Resources",
      "Client Care",
      "Advisory Services",
    ],
    Creators: [
      "Content Creation",
      "Design",
      "Marketing",
      "Branding",
      "Creative Business",
    ],
    Managers: [
      "Operations",
      "Management",
      "Finance",
      "Project Leadership",
      "Business Administration",
    ],
  };

  const usefulGodMap = {
    Wood: ["Education", "Growth Industries", "Planning"],
    Fire: ["Media", "Marketing", "Visibility-Based Work"],
    Earth: ["Property", "Operations", "Stability-Based Work"],
    Metal: ["Finance", "Jewellery", "Systems and Precision Work"],
    Water: ["Consulting", "Communication", "Trade and Movement"],
  };

  const directions = [
    ...(structureMap[mainStructure] || []),
    ...(usefulGodMap[primaryUsefulGod] || []),
  ];

  return [...new Set(directions)].slice(0, 5);
}

const DOMINANT_PROFILE_CAREER_MODIFIER = {
  Friend: "Because Friend energy is active, career growth often comes through trusted teams and long-standing professional relationships.",
  "Rob Wealth": "Because Rob Wealth energy is active, career growth often comes through independent action and a willingness to challenge existing structures.",
  "Eating God": "Because Eating God energy is active, career growth often comes through demonstrated expertise and a reputation for quality work.",
  "Hurting Officer": "Because Hurting Officer energy is active, career growth often comes through original thinking and a willingness to say what others won't.",
  "Direct Wealth": "Because Direct Wealth energy is active, career growth often comes through consistency, reliability and measurable results.",
  "Indirect Wealth": "Because Indirect Wealth energy is active, career growth often comes through timing, adaptability and spotting opportunities early.",
  "Direct Officer": "Because Direct Officer energy is active, career growth often comes through accountability, structure and earning trust as a dependable leader.",
  "Seven Killings": "Because Seven Killings energy is active, career growth often comes through decisive action under pressure and a willingness to lead when others hesitate.",
  "Direct Resource": "Because Direct Resource energy is active, career growth often comes through preparation, deep knowledge and thoughtful decision-making.",
  "Indirect Resource": "Because Indirect Resource energy is active, career growth often comes through original insight and seeing patterns others miss.",
};

function getCareerStrategy(idealWorkEnvironment, dominantProfile) {
  const modifier = DOMINANT_PROFILE_CAREER_MODIFIER[dominantProfile];
  return [idealWorkEnvironment, modifier].filter(Boolean).join(" ");
}

export function buildCareerEngineV1({
  dayMasterStrengthV4 = {},
  tenProfileScoringV2 = {},
  structureScoringV2 = {},
  usefulGodV4 = {},
} = {}) {
  const mainStructure = safeName(structureScoringV2?.mainStructure);
  const dominantProfile = safeName(tenProfileScoringV2?.dominantProfile);
  const dayStatus = dayMasterStrengthV4?.status || null;
  const primaryUsefulGod = usefulGodV4?.primaryUsefulGod || null;
  const secondaryUsefulGod = usefulGodV4?.secondaryUsefulGod || null;

  const careerStyle = getCareerStyle(mainStructure, dominantProfile);
  const idealWorkEnvironment = getIdealWorkEnvironment(mainStructure);
  const leadershipStyle = getLeadershipStyle(
    mainStructure,
    dominantProfile,
    dayStatus
  );
  const careerStrategy = getCareerStrategy(idealWorkEnvironment, dominantProfile);

  return {
    version: VERSION,

    careerStyle,
    idealWorkEnvironment,
    leadershipStyle,
    careerStrategy,

    careerStrengths: getCareerStrengths(mainStructure),
    careerRisks: getCareerRisks(mainStructure, dayStatus),
    recommendedDirections: getRecommendedDirections(
      mainStructure,
      primaryUsefulGod
    ),

    debug: {
      mainStructure,
      dominantProfile,
      dayStatus,
      primaryUsefulGod,
      secondaryUsefulGod,
      note:
        "CareerEngineV1 translates frozen Engine V2 outputs into practical career interpretation. It does not affect pillars, strength, structure or useful god.",
    },
  };
}

export default buildCareerEngineV1;