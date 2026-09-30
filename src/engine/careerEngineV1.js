// src/engine/careerEngineV1.js

// Best-fit industries come from the Elements to Enhance (usefulGodV4 primary +
// secondary): working in a field of a favourable element feeds the chart what
// it lacks. The older recommendedDirections list still uses the Day Master's
// own element and is kept for compatibility; the admin report no longer shows it.

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

function getRecommendedDirections(mainStructure, dayMasterElement) {
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

  const directions = [
    ...(structureMap[mainStructure] || []),
    ...(INDUSTRIES_BY_ELEMENT[dayMasterElement] || []),
  ];

  return [...new Set(directions)].slice(0, 5);
}

// Industries traditionally tied to each element. Kept separate from the structure-based roles above: roles say
// what kind of work suits the person, industries say which field to do it in.
const INDUSTRIES_BY_ELEMENT = {
  Wood: ["Education & Training", "Publishing & Writing", "Healthcare & Wellness", "Fashion & Textiles", "Furniture & Horticulture"],
  Fire: ["Media & Entertainment", "Marketing & Advertising", "Food & Beverage", "Beauty & Cosmetics", "Technology & Electronics"],
  Earth: ["Property & Real Estate", "Construction", "Insurance", "Agriculture & Food Supply", "Administration & Operations"],
  Metal: ["Finance & Banking", "Jewellery & Precious Metals", "Engineering", "Law & Compliance", "Automotive & Machinery"],
  Water: ["Logistics & Shipping", "Travel & Hospitality", "Trading & Import/Export", "Communications", "Consulting"],
};

// What working in each element's industries surrounds a person with, so the
// report can say why a field supports the chart.
const INDUSTRY_ELEMENT_REASON = {
  Wood: "growth, learning and nurturing",
  Fire: "visibility, energy and being seen",
  Earth: "land, buildings and steady, dependable systems",
  Metal: "money, precision, rules and fine materials",
  Water: "movement, travel, trade and the flow of information",
};

// Why the roles fit (from the chart's main structure), plus example job
// titles so each role is concrete.
const ROLE_DETAILS = {
  Connectors: {
    summary: "Your chart leans toward people and opportunity, so you do best in roles built on relationships, networking and deal-making.",
    roles: {
      Consulting: "Management consultant, business advisor",
      Sales: "Account manager, sales lead",
      "Business Development": "Partnerships manager, BD executive",
      "Client Relationship Management": "Key account manager, relationship manager",
      Entrepreneurship: "Founder, business owner",
    },
  },
  Thinkers: {
    summary: "Your chart leans toward knowledge and analysis, so you do best in roles where your thinking, expertise and judgement are the product.",
    roles: {
      Research: "Researcher, research analyst",
      Strategy: "Strategy manager, business planner",
      Education: "Lecturer, trainer",
      Analysis: "Data analyst, financial analyst",
      "Specialist Advisory": "Subject-matter expert, technical advisor",
    },
  },
  Supporters: {
    summary: "Your chart leans toward care and reliability, so you do best in roles where you look after, guide or develop other people.",
    roles: {
      Teaching: "Teacher, coach",
      Wellness: "Therapist, wellness practitioner",
      "Human Resources": "HR manager, people partner",
      "Client Care": "Customer success manager, service lead",
      "Advisory Services": "Counsellor, financial planner",
    },
  },
  Creators: {
    summary: "Your chart leans toward expression and originality, so you do best in roles where you create, present or shape ideas.",
    roles: {
      "Content Creation": "Content creator, writer",
      Design: "Designer, art director",
      Marketing: "Marketing manager, campaign lead",
      Branding: "Brand strategist, creative director",
      "Creative Business": "Studio or boutique owner",
    },
  },
  Managers: {
    summary: "Your chart leans toward structure and control, so you do best in roles where you run things and are accountable for results.",
    roles: {
      Operations: "Operations manager, COO",
      Management: "General manager, department head",
      Finance: "Finance manager, financial controller",
      "Project Leadership": "Project manager, programme lead",
      "Business Administration": "Office manager, business administrator",
    },
  },
};

function getBestFitIndustryGroups(primaryElement, secondaryElement) {
  const hasSecondary = secondaryElement && secondaryElement !== primaryElement;
  return [
    { element: primaryElement, rank: "Main element to enhance", count: hasSecondary ? 3 : 5 },
    ...(hasSecondary ? [{ element: secondaryElement, rank: "Second element to enhance", count: 2 }] : []),
  ]
    .filter((group) => INDUSTRIES_BY_ELEMENT[group.element])
    .map(({ element, rank, count }) => ({
      element,
      rank,
      reason: `${element} industries surround you with ${INDUSTRY_ELEMENT_REASON[element]}, which your chart needs more of.`,
      industries: INDUSTRIES_BY_ELEMENT[element].slice(0, count),
    }));
}

function getBestFitRoleDetails(mainStructure) {
  const details = ROLE_DETAILS[mainStructure];
  if (!details) return null;
  return {
    summary: details.summary,
    roles: Object.entries(details.roles).map(([role, examples]) => ({ role, examples })),
  };
}

function getBestFitRoles(mainStructure) {
  return getRecommendedDirections(mainStructure, null);
}

// Three industries from the primary Element to Enhance and two from the
// secondary; all five from the primary when there is no distinct secondary.
function getBestFitIndustries(primaryElement, secondaryElement) {
  const primary = INDUSTRIES_BY_ELEMENT[primaryElement] || [];
  const secondary =
    secondaryElement && secondaryElement !== primaryElement
      ? INDUSTRIES_BY_ELEMENT[secondaryElement] || []
      : [];
  if (!secondary.length) return primary;
  return [...primary.slice(0, 3), ...secondary.slice(0, 2)];
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
  const dayMasterElement = usefulGodV4?.dayMasterElement || null;

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
      dayMasterElement
    ),
    bestFitIndustries: getBestFitIndustries(primaryUsefulGod, secondaryUsefulGod),
    bestFitIndustryElements: [primaryUsefulGod, secondaryUsefulGod].filter(
      (element, index, list) => element && list.indexOf(element) === index
    ),
    bestFitRoles: getBestFitRoles(mainStructure),
    bestFitIndustryGroups: getBestFitIndustryGroups(primaryUsefulGod, secondaryUsefulGod),
    bestFitRoleDetails: getBestFitRoleDetails(mainStructure),

    debug: {
      mainStructure,
      dominantProfile,
      dayStatus,
      dayMasterElement,
      primaryUsefulGod,
      secondaryUsefulGod,
      note:
        "CareerEngineV1 translates frozen Engine V2 outputs into practical career interpretation. It does not affect pillars, strength, structure or Elements to Enhance.",
    },
  };
}

export default buildCareerEngineV1;