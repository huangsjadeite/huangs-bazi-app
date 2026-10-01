// src/engine/luckDecadeDetailsV1.js
//
// Career, wealth, relationship and health outlook for each 10-year Luck
// Pillar. Each decade has two halves: the stem sets the first five years, the
// branch's main hidden stem the last five. A half is read through its Ten God
// (which area of life it activates) and whether its element helps or strains
// the chart (favourable / caution lists from usefulGodV4). Clashes and
// combinations with the natal pillars add change-of-circumstance notes.

import { ELEMENT_BODY_SYSTEM } from "../data/elementBodySystem.js";

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

// Per area, per Ten God: [helps, strains]. "Helps" is used when the half's
// element is favourable, supportive or neutral; "strains" when it is a
// caution element.
const CAREER = {
  Friend: [
    "Allies, peers and teamwork carry your career; partnerships and joining forces work well.",
    "A crowded field: more competition for the same roles and credit, so make your contribution visible.",
  ],
  "Rob Wealth": [
    "Drive and competitiveness push you forward; a good time to go after bigger roles or strike out on your own.",
    "Rivalry and office politics are more likely; pick your battles and avoid risky moves made just to prove a point.",
  ],
  "Eating God": [
    "Your skills, ideas and craft get noticed; a strong time for creative work, specialising and building a name for quality.",
    "You may feel restless in your role or spread yourself across too many ideas; finish what you start.",
  ],
  "Hurting Officer": [
    "Independence and bold ideas pay off; good for launching your own projects, speaking up and changing direction.",
    "Friction with bosses and rules is more likely; channel frustration into your own projects rather than confrontation.",
  ],
  "Direct Wealth": [
    "Career progress comes through practical results and steady delivery; commercial and management roles suit you.",
    "Work can feel like a grind for money; keep sight of the longer-term direction, not just the pay.",
  ],
  "Indirect Wealth": [
    "Deals, sales and business opportunities open up; a good time to take a commercial or entrepreneurial step.",
    "Many opportunities, not all of them sound; check the fine print before jumping on a new venture.",
  ],
  "Direct Officer": [
    "Recognition, promotion and a stronger reputation; a good decade for stepping into responsibility and leadership.",
    "Heavy responsibility and pressure from above; protect your energy and set clear limits on what you take on.",
  ],
  "Seven Killings": [
    "High-pressure challenges bring breakthroughs; ambitious goals and demanding roles can lift your career fast.",
    "Intense pressure, tough bosses or sudden setbacks; move carefully and avoid all-or-nothing decisions.",
  ],
  "Direct Resource": [
    "Mentors, qualifications and backing from seniors support your rise; a good time to study or earn credentials.",
    "Progress can feel slow and you may wait for permission too long; act on what you already know.",
  ],
  "Indirect Resource": [
    "Specialist knowledge, research and unconventional paths suit you; trust your instincts on career direction.",
    "You may overthink or drift between ideas; set concrete targets so insight turns into progress.",
  ],
};

const WEALTH = {
  Friend: [
    "Shared ventures and partnerships can grow your money; pooling resources with trusted people works well.",
    "Money leaks through friends, lending and group spending; keep personal and shared finances separate.",
  ],
  "Rob Wealth": [
    "Bold moves can pay off when you back yourself; competitive markets reward your drive.",
    "A classic period for losses through competition, lending or impulsive spending; guard your savings closely.",
  ],
  "Eating God": [
    "Your talents turn into income; earning through skills, services and creative work flows well.",
    "Spending on ideas and enjoyment can run ahead of income; budget for your projects.",
  ],
  "Hurting Officer": [
    "Clever ideas and self-promotion bring in money; side projects and independent income do well.",
    "Big spending on new ventures or sudden changes of plan; test ideas small before investing heavily.",
  ],
  "Direct Wealth": [
    "Steady income, saving and building assets; a good decade to grow wealth patiently and buy for the long term.",
    "Money feels tight or hard-earned; focus on budgeting and avoid stretching for big purchases.",
  ],
  "Indirect Wealth": [
    "Windfalls, deals and investment opportunities; business and side income can grow quickly.",
    "Money comes and goes fast; avoid speculation and high-risk deals, and lock in gains when you have them.",
  ],
  "Direct Officer": [
    "Income grows through your position and reputation, such as salary rises and stable employment.",
    "Obligations and fixed costs take a bigger share; review commitments before adding more.",
  ],
  "Seven Killings": [
    "Taking on bigger challenges can bring bigger rewards; performance-based income suits you.",
    "Pressure-driven spending or sudden costs; keep an emergency buffer and avoid legal or contractual risks.",
  ],
  "Direct Resource": [
    "Support from family or mentors, property and long-term assets; investing in education pays off.",
    "Slower money; avoid relying on others' help and build your own income stream.",
  ],
  "Indirect Resource": [
    "Niche expertise and unconventional income sources can pay; property and long-term holdings suit you.",
    "Irregular income and missed chances from hesitation; keep a simple, steady plan.",
  ],
};

const HEALTH_GROUP = {
  companion: [
    "Energy and resilience are generally good; exercise with others keeps you motivated.",
    "You may push too hard and ignore signs of burnout; build in real rest.",
  ],
  output: [
    "A lively, expressive period; creative outlets and enjoyment keep your energy up.",
    "Overwork and nervous energy can drain you; watch sleep and don't burn the candle at both ends.",
  ],
  wealth: [
    "Busy but manageable; staying active and organised keeps you well.",
    "Chasing results can wear you down; schedule recovery as seriously as your goals.",
  ],
  officer: [
    "Discipline and routine support your health; structured habits stick more easily now.",
    "Stress and pressure are the main risk; protect your sleep and give yourself real downtime.",
  ],
  resource: [
    "A restorative period; rest, learning and self-care come more naturally.",
    "You may slow down too much; gentle, regular movement keeps energy flowing.",
  ],
};

// Before 18, a half is read as school, family and friendships rather than
// career, money and romance.
const YOUTH_AGE = 18;

const STUDY_GROUP = {
  companion: [
    "Friendships and teamwork help at school; learning alongside others brings out your best.",
    "Peer pressure and comparison can distract; steady encouragement helps you stay on track.",
  ],
  output: [
    "Creativity and self-expression shine; arts, sport and hands-on subjects suit you.",
    "Restlessness with rules and routine; a patient, flexible learning style helps.",
  ],
  wealth: [
    "Practical, results-driven learning suits you; clear goals keep you motivated.",
    "Distractions and busy schedules pull focus from study; simple routines help.",
  ],
  officer: [
    "Discipline and structure help you do well; teachers and responsibility bring out your best.",
    "Pressure from exams or strict expectations weighs on you; reassurance and balance help.",
  ],
  resource: [
    "Learning comes naturally; a strong period for study, reading and support from teachers and family.",
    "You may daydream or rely on others' help; gentle structure keeps learning on track.",
  ],
};

const YOUTH_RELATIONSHIP_GROUP = {
  companion: ["Friendships grow and matter a lot to you.", "Friendship ups and downs are more likely; a trusted adult to talk to helps."],
  output: ["You are expressive and fun to be around.", "Moods can run high; patience at home helps."],
  wealth: ["A practical, busy family life keeps you grounded.", "Busy family schedules can leave you feeling overlooked; time together helps."],
  officer: ["Clear family rules give you security.", "Strict expectations at home can feel heavy."],
  resource: ["Close family care and support shape these years.", "You may withdraw into yourself; warm family support helps."],
};

// Spouse star: Officer stars for a woman, Wealth stars for a man. The rival
// star: Hurting Officer for a woman, Rob Wealth for a man.
function relationshipLine(tenGod, helps, gender) {
  const group = GROUP_OF[tenGod];
  const spouseGroup = gender === "male" ? "wealth" : "officer";
  const rival = gender === "male" ? "Rob Wealth" : "Hurting Officer";

  if (group === spouseGroup) {
    return helps
      ? "Your partner star is active: a strong time to meet someone, deepen commitment or marry."
      : "Your partner star is active but strained: relationships are on your mind, but choose carefully and don't rush commitment.";
  }
  if (tenGod === rival) {
    return helps
      ? "You want more freedom in love; honest conversations keep your relationship fresh."
      : "Friction or a third party can unsettle relationships; speak up early and avoid saying things in the heat of the moment.";
  }
  if (group === "companion") {
    return helps
      ? "Your social circle grows; friends and shared activities bring you closer to the people who matter."
      : "Friends and outside commitments compete for your time; make space for your partner.";
  }
  if (group === "output") {
    return helps
      ? "Warmth and charm are easy for you now; you express affection more openly."
      : "Moods and words can run ahead of you; think before speaking in close relationships.";
  }
  if (group === "resource") {
    return helps
      ? "Family support and a calm home life anchor you; a good time for caring, steady relationships."
      : "You may withdraw into yourself; let the people close to you in.";
  }
  if (group === "wealth") {
    return helps
      ? "Practical care shows your love; shared goals such as a home or savings bring you closer."
      : "Money or busy schedules can strain relationships; plan time together deliberately.";
  }
  if (group === "officer") {
    return helps
      ? "Responsibility and loyalty strengthen your relationships; commitments feel solid."
      : "Duty and pressure can leave little room for romance; protect time for each other.";
  }
  return null;
}

const RELATION_NOTES = {
  // Natal pillar tag -> [area, clash text, combo text]
  D: ["relationship",
    "clashes your Spouse Palace (day branch), often a sign of change at home: a move, a new relationship stage, or tension that asks for patience.",
    "combines with your Spouse Palace (day branch), which favours closeness, commitment and harmony at home."],
  M: ["career",
    "clashes your month pillar (career and environment), which often brings a change of job, industry or location.",
    "combines with your month pillar (career and environment), which helps teamwork and stable working conditions."],
  Y: ["relationship",
    "clashes your year pillar (family and roots), so family matters or a move away from your roots may need attention.",
    "combines with your year pillar (family and roots), which favours family support and harmony."],
  H: ["relationship",
    "clashes your hour pillar (children and later plans), which can bring changes in family plans; pace yourself.",
    "combines with your hour pillar (children and later plans), which supports family life and long-term plans."],
};

function halfRating(element, usefulGod) {
  if (!element) return "neutral";
  if (element === usefulGod?.primaryUsefulGod) return "favourable";
  if ((usefulGod?.favourableElements || []).includes(element)) return "favourable";
  if ((usefulGod?.secondaryFavourableElements || []).includes(element)) return "supported";
  if ((usefulGod?.cautionElements || []).includes(element)) return "caution";
  return "neutral";
}

function describeHalves(halves, lineFor) {
  const [first, second] = halves.map((half) => ({ ...half, text: lineFor(half) }));
  if (first.text && first.text === second.text) return `Across the decade: ${first.text}`;
  return [
    first.text && `Age ${first.startAge}–${first.endAge} (${first.zh} ${first.element}, ${first.tenGod}): ${first.text}`,
    second.text && `Age ${second.startAge}–${second.endAge} (${second.zh} ${second.element}, ${second.tenGod}): ${second.text}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function healthLine(half) {
  const group = GROUP_OF[half.tenGod];
  const base = HEALTH_GROUP[group]?.[half.helps ? 0 : 1];
  if (!base) return null;
  if (half.helps) return base;
  const body = ELEMENT_BODY_SYSTEM[half.element];
  return body ? `${base} Look after your ${body}.` : base;
}

export function buildLuckDecadeDetailsV1({ rawChartData, usefulGod, gender } = {}) {
  const decades = rawChartData?.luck || [];

  return decades.map((decade) => {
    const midAge = decade.startAge + 5;
    const halves = [
      {
        startAge: decade.startAge,
        endAge: midAge,
        zh: decade.stem.zh,
        element: decade.stem.element,
        tenGod: decade.stem.tenGod,
      },
      {
        startAge: midAge,
        endAge: decade.endAge,
        zh: decade.branch.zh,
        element: decade.branch.element,
        tenGod: decade.hiddenStems?.[0]?.tenGod || null,
      },
    ].map((half) => {
      const rating = halfRating(half.element, usefulGod);
      return { ...half, rating, helps: rating !== "caution" };
    });

    const pick = (h) => (h.helps ? 0 : 1);
    const young = (h) => h.startAge < YOUTH_AGE;
    const areas = {
      career: describeHalves(halves, (h) =>
        young(h) ? STUDY_GROUP[GROUP_OF[h.tenGod]]?.[pick(h)] || null : CAREER[h.tenGod]?.[pick(h)] || null
      ),
      wealth: describeHalves(halves, (h) =>
        young(h)
          ? "Family finances matter more than your own at this age; good money habits learned now pay off later."
          : WEALTH[h.tenGod]?.[pick(h)] || null
      ),
      relationship: describeHalves(halves, (h) =>
        young(h)
          ? YOUTH_RELATIONSHIP_GROUP[GROUP_OF[h.tenGod]]?.[pick(h)] || null
          : relationshipLine(h.tenGod, h.helps, gender)
      ),
      health: describeHalves(halves, healthLine),
    };
    const branchName = `The ${decade.branch.zh} ${decade.branch.animal || ""}`.trim();

    (decade.relations || []).forEach((relation) => {
      const isClash = relation.type === "Clashes";
      const isCombo = relation.type === "EB Combo";
      if (!isClash && !isCombo) return;
      relation.with.forEach((tag) => {
        const note = RELATION_NOTES[tag];
        if (!note) return;
        let [area, clashText, comboText] = note;
        // Relations come from the branch, so they belong to the last five years.
        if (tag === "D" && halves[1].startAge < YOUTH_AGE) {
          clashText = "clashes your day branch (home life), which can bring changes at home such as a move.";
          comboText = "combines with your day branch (home life), which favours a settled, happy home.";
        }
        areas[area] = `${areas[area]} ${branchName} ${isClash ? clashText : comboText}`.trim();
      });
    });

    return {
      startAge: decade.startAge,
      endAge: decade.endAge,
      halves: halves.map(({ startAge, endAge, zh, element, tenGod, rating }) => ({
        startAge, endAge, zh, element, tenGod, rating,
      })),
      ...areas,
    };
  });
}

export default buildLuckDecadeDetailsV1;
