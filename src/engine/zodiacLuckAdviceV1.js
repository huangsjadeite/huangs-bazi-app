// src/engine/zodiacLuckAdviceV1.js
//
// Advice paragraphs for the admin Zodiac Luck tool, built from a sign's
// zodiacLuckV1 result: one general paragraph plus one each for wealth, career,
// love (relationships) and health. Every sentence comes from a reason that
// actually scored for the sign, so the text works for any year.

// Tai Sui sentence for the general paragraph.
const TAI_SUI_GENERAL = {
  sixHarmony: "Tai Sui is on your side this year. Doors open more easily and the right people tend to appear, so move your plans forward rather than wait.",
  threeHarmony: "You share a team with the year's energy, so working with others pays off. Build on what you have already started instead of starting over.",
  same: "This is your own zodiac year (本命年), which tends to feel more up and down. Keep your plans steady, avoid big gambles and let change come at a pace you can manage.",
  clash: "Your sign sits directly opposite the year, so expect movement in work, home or the people around you. Change you plan for goes far better than change forced on you.",
  punishment: "The year tests you through rules, pressure and responsibility. Read before you sign, avoid shortcuts and give yourself more time than you think you need.",
  harm: "Small misunderstandings can quietly build up. Say what you mean, put agreements in writing and give people the benefit of the doubt.",
  destruction: "Expect minor disruptions and unexpected costs, so leave buffers in your timing and your budget.",
};
const NO_TAI_SUI_LINK =
  "The year neither lifts nor strains your sign much, so your results come from steady effort and good timing rather than luck.";

// One sentence per reason and area. {element} is the year element involved.
const AREA_TEXT = {
  "taiSui:sixHarmony": {
    wealth: "Helpful people bring opportunities, so say yes to introductions.",
    career: "Bosses and partners are more receptive, which makes it a good year to ask for a promotion or pitch an idea.",
    love: "Partners and family are easier to get along with, a good year to commit or reconnect.",
    health: "Your energy is well supported.",
  },
  "taiSui:threeHarmony": {
    wealth: "Partnerships and group projects are where the money is.",
    career: "Teamwork gets results, so join forces rather than going it alone.",
    love: "Friends and shared activities bring people closer.",
    health: "Your energy holds up well when you keep a routine with others.",
  },
  "taiSui:same": {
    wealth: "Avoid big gambles and high-risk investments.",
    career: "Change may come whether you plan it or not, so keep your skills ready.",
    love: "Moods can swing, so be patient with the people closest to you.",
    health: "Pace yourself and don't skip rest.",
  },
  "taiSui:clash": {
    wealth: "Expect bigger expenses, perhaps from a move or a change, so keep savings ready.",
    career: "A change of job or role is likely, so plan it rather than react to it.",
    love: "Distance or disagreements may test relationships, so talk things through early.",
    health: "Drive and travel carefully, and don't ignore small health signals.",
  },
  "taiSui:punishment": {
    wealth: "Read contracts carefully and keep your paperwork in order.",
    career: "Rules and office politics need care, so avoid shortcuts.",
    love: "Avoid power struggles at home.",
    health: "Stress can build up, so make time to unwind.",
  },
  "taiSui:harm": {
    wealth: "Double-check agreements, especially with friends.",
    career: "Watch for gossip and keep promises in writing.",
    love: "Small hurts can build up, so clear the air quickly.",
    health: "Look after your sleep.",
  },
  "taiSui:destruction": {
    wealth: "Leave room in your budget for unexpected costs.",
    career: "Plans may be disrupted, so build in buffers.",
    love: "Minor friction is easy to fix if you deal with it early.",
    health: "Keep a steady routine.",
  },
  "god:Sun": {
    career: "The Sun star (太阳) brings visibility and support from people in authority.",
    wealth: "Recognition can turn into better pay.",
  },
  "god:Mourning Door": {
    health: "The Mourning Door star (丧门) asks you to look after your own health and that of older family members.",
    love: "Family matters may need more of your time.",
  },
  "god:Moon": {
    love: "The Moon star (太阴) brings gentle, caring support, especially from the women in your life.",
    wealth: "Quiet, steady saving does well.",
  },
  "god:Five Ghosts": {
    career: "The Five Ghosts star (五鬼) can stir up petty people and gossip at work, so stay out of office disputes.",
    wealth: "Watch for small losses and scams.",
  },
  "god:Death Charm": {
    health: "The Death Charm star (死符) calls for regular check-ups and enough rest.",
    wealth: "Avoid lending money you can't afford to lose.",
  },
  "god:Dragon Virtue": {
    career: "The Dragon Virtue star (龙德) brings mentors and helpful people.",
    wealth: "Help from others can open money opportunities.",
  },
  "god:White Tiger": {
    health: "The White Tiger star (白虎) asks for care with injuries, sport and travel.",
    wealth: "Avoid risky spending.",
  },
  "god:Fortune Virtue": {
    wealth: "The Fortune Virtue star (福德) brings blessings and small windfalls.",
    health: "Your wellbeing is well protected.",
  },
  "god:Sky Dog": {
    health: "The Sky Dog star (天狗) asks for care with accidents and minor illness.",
    love: "Worries in the family may need your support.",
  },
  "god:Sickness Charm": {
    health: "The Sickness Charm star (病符) makes you more prone to minor illness, so keep up your rest and check-ups.",
  },
  "star:nobleman": {
    career: "The Nobleman star (天乙贵人) brings helpful people at the right moment, so ask for help when you need it.",
    wealth: "Introductions and good advice can lead to money.",
  },
  "star:intelligence": {
    career: "The Intelligence star (文昌) favours study, exams, writing and new qualifications.",
  },
  "star:prosperity": {
    wealth: "The Prosperity star (禄) supports a steady income and fair reward for your work.",
  },
  "star:redPhoenix": {
    love: "The Red Phoenix star (红鸾) brings romance, a good year to meet someone or take a relationship further.",
  },
  "star:heavenlyJoy": {
    love: "The Heavenly Joy star (天喜) brings happy occasions such as celebrations and good news at home.",
  },
  "star:peachBlossom": {
    love: "Peach Blossom (桃花) makes you more attractive and sociable.",
  },
  "star:skyHorse": {
    career: "The Sky Horse star (驿马) brings travel and movement, good for a change of role or location.",
  },
  "element:wealth": {
    wealth: "The year's {element} energy is your wealth element, so your effort converts into money.",
  },
  "element:power": {
    career: "The year's {element} energy brings pressure, but also recognition and responsibility.",
    health: "Don't let work pressure eat into your rest.",
  },
  "element:resource": {
    health: "The year's {element} energy supports and restores you.",
    career: "Learning and support from others help your work.",
  },
  "element:output": {
    love: "The year's {element} energy brings out your expressive, social side.",
    wealth: "Your ideas and creativity can earn for you.",
    health: "You may give out more energy than you take in, so make time to recharge.",
  },
  "element:companion": {
    wealth: "The year's {element} energy brings competition, so protect your share and avoid lending money.",
    career: "Peers can be allies or rivals, so choose your partners well.",
  },
};

const OPENERS = {
  wealth: ["Money flows more easily for you this year.", "Money is steady rather than spectacular this year.", "This is a year to protect your money rather than chase it."],
  career: ["Your career has strong backing this year.", "Your career moves at a steady pace this year.", "Your career needs patience and care this year."],
  love: ["Relationships are a bright spot this year.", "Relationships are steady this year.", "Relationships need extra care this year."],
  health: ["Your energy is strong this year.", "Your health is steady this year, with a few things to watch.", "Make your health a priority this year."],
};
const AREA_NAMES = { wealth: "wealth", career: "career", love: "relationships", health: "health" };
const MAX_SENTENCES = 4;

const tierIndex = (score) => (score >= 70 ? 0 : score >= 50 ? 1 : 2);
const tierName = (score) => ["Push", "Steady", "Protect"][tierIndex(score)];

function list(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function bestMonths(months) {
  return [...months]
    .filter((m) => m.rating === "Excellent" || m.rating === "Good")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => months.indexOf(a) - months.indexOf(b))
    .map((m) => m.month);
}

function areaSentences(reasons, area) {
  const seen = new Set();
  return reasons
    .filter((r) => r.pts[area] && AREA_TEXT[r.id]?.[area])
    .sort((a, b) => Math.abs(b.pts[area]) - Math.abs(a.pts[area]))
    .map((r) => AREA_TEXT[r.id][area].replace("{element}", r.element || ""))
    .filter((text) => !seen.has(text) && seen.add(text))
    .slice(0, MAX_SENTENCES);
}

function monthSentence(area, result) {
  const { months, bestMoneyMonths, watchMonths } = result;
  const best = bestMonths(months);
  if (area === "wealth") return `Your best money months are ${list(bestMoneyMonths)}.`;
  if (area === "love") {
    const peach = months.filter((m) => m.notes.includes("Peach Blossom month")).map((m) => m.month);
    if (peach.length) return `Romance is most likely in ${list(peach)}, your Peach Blossom month.`;
    return best.length ? `Plan important dates and conversations for ${list(best)}.` : "";
  }
  if (area === "career") return best.length ? `Make your bigger career moves in ${list(best)}.` : "Take career decisions slowly and check the details.";
  return watchMonths.length ? `Rest more and avoid overdoing it in ${list(watchMonths)}.` : "No month stands out as especially hard on your energy.";
}

export function buildZodiacAdviceV1(result, year) {
  const { sign, scores, reasons, months, watchMonths } = result;

  const taiSuiReasons = reasons.filter((r) => r.id.startsWith("taiSui:"));
  const taiSuiText = taiSuiReasons.length ? TAI_SUI_GENERAL[taiSuiReasons[0].id.slice(7)] : NO_TAI_SUI_LINK;
  const ranked = ["wealth", "career", "love", "health"].sort((a, b) => scores[b] - scores[a]);
  const best = bestMonths(months);
  const general = [
    `${year} is a ${tierName(scores.overall)} year for the ${sign.animal}.`,
    taiSuiText,
    scores[ranked[0]] >= 60
      ? `Your strongest area is ${AREA_NAMES[ranked[0]]}, while ${AREA_NAMES[ranked[3]]} needs the most care.`
      : `${AREA_NAMES[ranked[0]][0].toUpperCase()}${AREA_NAMES[ranked[0]].slice(1)} holds up best, while ${AREA_NAMES[ranked[3]]} needs the most care.`,
    best.length ? `Your best months are ${list(best)}.` : "",
    watchMonths.length ? `Take extra care in ${list(watchMonths)}.` : "",
  ].filter(Boolean).join(" ");

  const advice = { general };
  for (const area of ["wealth", "career", "love", "health"]) {
    advice[area] = [OPENERS[area][tierIndex(scores[area])], ...areaSentences(reasons, area), monthSentence(area, result)]
      .filter(Boolean)
      .join(" ");
  }
  return advice;
}

export default buildZodiacAdviceV1;
