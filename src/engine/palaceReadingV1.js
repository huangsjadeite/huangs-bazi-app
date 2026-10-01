// src/engine/palaceReadingV1.js
//
// Reading for the Life Palace (命宮) and Conception Palace (胎元). Each palace
// pillar is read the same way as a natal pillar: its stem's Ten God against
// the Day Master (what the palace pulls you toward), the branch's main hidden
// stem (the inner motive), whether its elements help or strain the chart,
// the Day Master's Growth Phase in its branch, and how it clashes or combines
// with the natal pillars.

import { calculateTenGod } from "./tenGods.js";
import { findRelations, getGrowthPhase } from "./rawChartDataV1.js";
import { GROWTH_PHASE_ENERGY, halfRating } from "./luckDecadeDetailsV1.js";

const GROUP_OF = {
  Friend: "companion",
  "Rob Wealth": "companion",
  "Eating God": "output",
  "Hurting Officer": "output",
  "Direct Wealth": "wealth",
  "Indirect Wealth": "wealth",
  "Direct Officer": "officer",
  "Seven Killings": "officer",
  "Direct Resource": "resource",
  "Indirect Resource": "resource",
};

// Life Palace stem Ten God: what your life path keeps pulling you toward.
const LIFE_DRIVE = {
  Friend: "independence and self-reliance. You are meant to stand on your own feet and build alongside equals rather than under others.",
  "Rob Wealth": "bold, competitive action. Your path rewards courage and initiative, especially in business and anything you lead yourself.",
  "Eating God": "expression, craft and enjoyment. Your path runs through skills you love and sharing them with others.",
  "Hurting Officer": "innovation and questioning convention. Your path is to improve how things are done, often in your own way.",
  "Direct Wealth": "steady building of wealth and security. Patient, practical effort is your path, and it compounds over time.",
  "Indirect Wealth": "opportunity, trade and wide networks. Your path favours business, deal-making and spotting openings early.",
  "Direct Officer": "responsibility, reputation and leadership within structures. Your path is authority that is earned and respected.",
  "Seven Killings": "challenge and transformation. Your path grows through pressure, decisive action and taking on what others avoid.",
  "Direct Resource": "learning, teaching and caring. Your path is knowledge and the support you give others.",
  "Indirect Resource": "insight, research and specialist or spiritual knowledge. Your path is unconventional wisdom.",
};

// Conception Palace stem Ten God: what you arrived with.
const CONCEPTION_INHERITED = {
  Friend: "a strong sense of self and an independent streak from the very start.",
  "Rob Wealth": "a competitive spirit; siblings, cousins or peers played a big part early on.",
  "Eating God": "an easy-going, creative nature and a love of the good things in life.",
  "Hurting Officer": "a quick, clever mind and a tendency to question rules from an early age.",
  "Direct Wealth": "a practical, careful attitude to money and effort, often learned at home.",
  "Indirect Wealth": "a natural eye for opportunity and a generous, sociable nature.",
  "Direct Officer": "a sense of duty and respect for rules instilled early.",
  "Seven Killings": "resilience shaped by early pressure or high expectations.",
  "Direct Resource": "a nurturing start and a natural love of learning.",
  "Indirect Resource": "a reflective, intuitive nature and an independent way of thinking.",
};

const INNER_MOTIVE = {
  Friend: "being your own person",
  "Rob Wealth": "proving yourself",
  "Eating God": "enjoying what you do",
  "Hurting Officer": "freedom to do things your way",
  "Direct Wealth": "security and stability",
  "Indirect Wealth": "freedom and new opportunities",
  "Direct Officer": "respect and doing the right thing",
  "Seven Killings": "achievement and control",
  "Direct Resource": "being cared for and caring for others",
  "Indirect Resource": "understanding things deeply",
};

const FIELDS_BY_GROUP = {
  companion: "partnerships, sport and fitness, team leadership, or running your own business",
  output: "creative work, teaching, food and hospitality, media, design or consulting",
  wealth: "business, finance, sales, trading or property",
  officer: "management, government, law, corporate leadership or the disciplined services",
  resource: "education, healthcare, research, counselling or spiritual and wellness work",
};

const STRENGTH_BY_GROUP = {
  companion: "self-belief and loyalty to the people on your side",
  output: "talent and the ability to express yourself",
  wealth: "practical sense and resourcefulness",
  officer: "discipline and a sense of responsibility",
  resource: "patience, kindness and a capacity to learn",
};

const RELATION_TEXT = {
  life: {
    Clashes: {
      D: "clashes your Spouse Palace: your life direction and home life can pull against each other, so make deliberate room for both.",
      M: "clashes your month pillar: your true calling may lie away from your first career or the environment you grew up in.",
      Y: "clashes your year pillar: your path may take you away from family expectations or your roots.",
      H: "clashes your hour pillar: your later-life plans may change direction more than once.",
    },
    "EB Combo": {
      D: "combines with your Spouse Palace: your partner and your life path tend to support each other.",
      M: "combines with your month pillar: your career and your deeper path line up naturally.",
      Y: "combines with your year pillar: family support helps you along your path.",
      H: "combines with your hour pillar: your path grows stronger in later life and through the next generation.",
    },
  },
  conception: {
    Clashes: {
      D: "clashes your Spouse Palace: early-life patterns can resurface in close relationships, so notice old habits.",
      M: "clashes your month pillar: your early environment changed or was unsettled, which made you adaptable.",
      Y: "clashes your year pillar: family circumstances around your birth may have been changing.",
      H: "clashes your hour pillar: you may choose a different path for your own children than the one you had.",
    },
    "EB Combo": {
      D: "combines with your Spouse Palace: what you learned early carries warmly into your relationships.",
      M: "combines with your month pillar: your early environment supported you well.",
      Y: "combines with your year pillar: strong family bonds from the start.",
      H: "combines with your hour pillar: family traditions you carry forward to the next generation.",
    },
  },
};

// Day Master's Growth Phase in the Conception Palace: your natural pace.
const CONCEPTION_TEMPERAMENT = {
  Growth: "you start things eagerly and grow quickly",
  Bath: "you are curious and drawn to new experiences, sometimes restless",
  Crowning: "you are self-assured, with a natural sense of presence",
  Officer: "you have been capable and self-reliant from early on",
  Peak: "you are strong-willed, with a great deal of drive",
  Weakening: "you are mature and measured beyond your years",
  Sick: "you are sensitive and need more rest than most",
  Death: "you are quiet, thoughtful and inward-looking",
  Grave: "you are careful, a natural saver and keeper of things",
  Extinction: "you are adaptable and able to start over when needed",
  Conceived: "you are imaginative, always with ideas in the making",
  Nurture: "you grow steadily, especially with good support around you",
};

const PILLAR_TAGS = { hour: "H", day: "D", month: "M", year: "Y" };

function elementFitText(kind, stemEl, branchEl, usefulGod) {
  const els = [...new Set([stemEl, branchEl])];
  const ratings = els.map((el) => halfRating(el, usefulGod));
  const label = els.join(" and ");
  const plural = els.length > 1;
  const primary = usefulGod?.primaryUsefulGod;
  const subject = kind === "life" ? "following this path" : "drawing on these inborn traits";
  if (ratings.every((r) => r === "favourable" || r === "supported")) {
    return `This palace carries ${label}, which ${plural ? "help" : "helps"} your chart, so ${subject} strengthens you. It is a direction worth leaning into.`;
  }
  if (ratings.every((r) => r === "caution")) {
    return `This palace carries ${label}, which your chart already has plenty of, so ${subject} can pull hard and wear you out.${primary ? ` Balance it with your Element to Enhance (${primary}).` : ""}`;
  }
  if (ratings.some((r) => r === "caution")) {
    return `This palace mixes elements that help you with ones your chart already has plenty of, so ${subject} works best in measured doses.${primary ? ` Your Element to Enhance (${primary}) keeps it in balance.` : ""}`;
  }
  return `This palace carries ${label}, which ${plural ? "sit" : "sits"} neutrally in your chart; ${subject} neither drains nor boosts you on its own.`;
}

export function buildPalaceReadingV1({ palace, kind = "life", pillars, usefulGod } = {}) {
  const pillar = palace?.pillar;
  const dayStemKey = pillars?.day?.stem?.key;
  if (!pillar || !dayStemKey) return null;

  const tenGod = calculateTenGod(dayStemKey, pillar.stem.key);
  const mainHidden = pillar.branch.hiddenStems?.[0];
  const branchTenGod = mainHidden ? calculateTenGod(dayStemKey, mainHidden.key) : null;
  const group = GROUP_OF[tenGod];

  const drive = kind === "life"
    ? `Its stem is your ${tenGod}, so your life keeps pulling you toward ${LIFE_DRIVE[tenGod]}`
    : `Its stem is your ${tenGod}, so you came in with ${CONCEPTION_INHERITED[tenGod]}`;

  const motive = branchTenGod && INNER_MOTIVE[branchTenGod]
    ? `Underneath, the ${pillar.branch.zh} ${pillar.branch.animal} holds your ${branchTenGod}: an inner need for ${INNER_MOTIVE[branchTenGod]}.`
    : null;

  const phase = getGrowthPhase(dayStemKey, pillar.branch.key);
  let energy = null;
  if (kind === "life" && GROWTH_PHASE_ENERGY[phase.en]) {
    const text = GROWTH_PHASE_ENERGY[phase.en];
    energy = `Your Day Master sits in its ${phase.en} (${phase.zh}) phase here. On this path: ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  }
  if (kind === "conception" && CONCEPTION_TEMPERAMENT[phase.en]) {
    energy = `Your Day Master sits in its ${phase.en} (${phase.zh}) phase here, which sets your natural pace: ${CONCEPTION_TEMPERAMENT[phase.en]}.`;
  }

  const natalEntries = Object.entries(PILLAR_TAGS)
    .filter(([key]) => pillars[key])
    .map(([key, tag]) => ({ tag, pillar: pillars[key] }));
  const links = [];
  findRelations(pillar, natalEntries).forEach(({ type, with: tags }) => {
    tags.forEach((tag) => {
      if (type === "HS Combo" && tag === "D") {
        links.push(kind === "life"
          ? "Its stem combines with your Day Master: you feel strongly drawn to this path, as if it fits you naturally."
          : "Its stem combines with your Day Master: these inborn traits sit very close to who you are.");
        return;
      }
      const text = RELATION_TEXT[kind][type]?.[tag];
      if (text) links.push(`It ${text}`);
    });
  });

  const useIt = kind === "life"
    ? `Fields that suit this palace: ${FIELDS_BY_GROUP[group]}.`
    : `A strength to draw on all your life: ${STRENGTH_BY_GROUP[group]}.`;

  return {
    version: "palace-reading-v1",
    tenGod,
    branchTenGod,
    drive,
    motive,
    elementFit: elementFitText(kind, pillar.stem.element, pillar.branch.element, usefulGod),
    energy,
    links,
    useIt,
  };
}

export default buildPalaceReadingV1;
