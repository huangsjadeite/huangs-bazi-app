const DAY_MASTER_TRAITS = {
  Jia:  "Driven, principled and growth-oriented. Like a tall tree — pioneering by nature, with a strong sense of direction and deep-rooted conviction.",
  Yi:   "Flexible, creative and people-attuned. Adapts well to changing conditions and builds lasting connections through warmth and resourcefulness.",
  Bing: "Warm, expressive and naturally charismatic. Brings energy and light to those around them through enthusiasm, generosity and a strong presence.",
  Ding: "Thoughtful, loyal and quietly perceptive. Like a steady flame — consistent in care, emotionally intelligent and deeply attuned to those nearby.",
  Wu:   "Stable, patient and deeply dependable. Like a mountain — grounded and protective, with a strong inner foundation and slow-to-change conviction.",
  Ji:   "Nurturing, practical and quietly supportive. Naturally builds a stable foundation for others, with a grounded, detail-oriented and giving nature.",
  Geng: "Principled, decisive and direct. Strong sense of right and wrong with a preference for straightforward action and clear personal standards.",
  Xin:  "Refined, perceptive and aesthetically attuned. Sensitive to quality and detail, with an appreciation for beauty, precision and how things are perceived.",
  Ren:  "Ambitious, resourceful and expansive. Like a great river — naturally drawn to big-picture thinking, opportunity and adaptive flow.",
  Gui:  "Gentle, intuitive and deeply perceptive. Quietly absorbs and processes the world, with a rich inner life and natural empathy for others.",
};

const SPOUSE_PALACE_NOTES = {
  Wood:  "Your relationship palace carries Wood energy — growth, renewal and nurturing. You thrive with partners who are encouraging, flexible and growth-minded.",
  Fire:  "Your relationship palace carries Fire energy — warmth, passion and expressiveness. You thrive with partners who are vibrant, emotionally present and open.",
  Earth: "Your relationship palace carries Earth energy — stability, loyalty and groundedness. You thrive with partners who are dependable, patient and consistent.",
  Metal: "Your relationship palace carries Metal energy — structure, clarity and principle. You thrive with partners who are decisive, honest and have strong personal values.",
  Water: "Your relationship palace carries Water energy — depth, intuition and emotional flow. You thrive with partners who are perceptive, adaptable and emotionally intelligent.",
};

const ANIMAL_TO_MONTH = {
  Rat: "December", Ox: "January", Tiger: "February", Rabbit: "March",
  Dragon: "April", Snake: "May", Horse: "June", Goat: "July",
  Monkey: "August", Rooster: "September", Dog: "October", Pig: "November",
};

const DZI_BEAD_MAP = {
  "Metal": { label: "7-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=7+eye+dzi+bead",           why: "Amplifies expression, communication, creativity and professional visibility" },
  "Water": { label: "3-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=3+eye+dzi+bead",           why: "Activates wealth flow, opportunity recognition and financial abundance" },
  "Wood":  { label: "9-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=9+eye+dzi+bead",           why: "Strengthens authority, career structure and disciplined achievement" },
  "Fire":  { label: "1-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=1+eye+dzi+bead",           why: "Sharpens wisdom, clarity, protective learning and intuitive support" },
  "Earth": { label: "5-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=5+eye+dzi+bead",           why: "Grounds and balances energy, bringing stability and all-round luck from five directions" },
};

// Only surface a career-relevant profile's % if it's actually prominent
// in this chart (top 4) - forcing it into every report regardless of
// rank would misrepresent charts where it's dormant.
function findTopProfilePct(rankedProfiles, names, topN = 4) {
  for (const name of names) {
    const idx = rankedProfiles.findIndex((p) => p.profile === name);
    if (idx !== -1 && idx < topN) {
      return { name: rankedProfiles[idx].profile, percentage: rankedProfiles[idx].percentage };
    }
  }
  return null;
}

export function deriveAdminReportData(report) {
  const narrative = report.narrative || {};
  const personality = report.personalityAndStructure || {};
  const usefulGod = report.usefulGodAndElements || {};
  const lifeAreas = report.lifeAreas || {};
  const stones = report.practicalSupport?.stones || {};
  const eightMansions = report.personalDirectionsAndStars?.eightMansions || null;
  const shenSha = report.personalDirectionsAndStars?.shenSha?.stars || [];
  const luckPillars = report.personalDirectionsAndStars?.luckPillars || null;
  const lifePalace = report.personalDirectionsAndStars?.lifePalace || null;
  const conceptionPalace = report.personalDirectionsAndStars?.conceptionPalace || null;
  const natalPillars = report.chartFoundation?.pillars || null;
  const tenGodByPillar = report.chartFoundation?.tenGodByPillar || null;
  const annualPillar = report.annualEnergy?.annualOverlay?.annualPillar || null;
  const annualZodiac = report.annualEnergy?.annualZodiac || null;

  const rankedProfiles = [...(personality.tenProfileScoring?.rankedProfiles || [])].sort(
    (a, b) => b.percentage - a.percentage
  );
  const findProfilePct = (name) =>
    rankedProfiles.find((p) => p.profile === name)?.percentage;
  const career = lifeAreas.career || {};
  const wealth = lifeAreas.wealth || {};
  const wealthArchetype = lifeAreas.wealthArchetype || {};
  const relationship = lifeAreas.relationship || {};
  const relationshipArchetype = lifeAreas.relationshipArchetype || {};
  const relationshipPattern = lifeAreas.relationshipPattern || {};
  const health = lifeAreas.health || {};
  const blindSpots = personality.blindSpots || {};
  const lifeThemes = lifeAreas.lifeThemes || {};
  const growthAdvice = lifeAreas.growthAdvice || {};
  const elementalBalance = report.chartFoundation?.elementalBalance || [];
  const monthlyOutlook = report.annualEnergy?.monthlyOverlay?.months || [];
  const strongerElements = elementalBalance.slice(0, 2).map((e) => e.name);
  const moderateElements = elementalBalance.slice(2, -2).map((e) => e.name);
  const weakerElements = [...elementalBalance].slice(-2).map((e) => e.name);

  const directWealthPct = findProfilePct("Direct Wealth");
  const indirectWealthPct = findProfilePct("Indirect Wealth");

  const dayMasterStem = natalPillars?.day?.stem;
  const dayMasterLabel = dayMasterStem
    ? `${dayMasterStem.zh} ${dayMasterStem.name} ${dayMasterStem.element}`
    : report.chartFoundation?.dayMasterElement || "-";
  const dayMasterTrait = dayMasterStem ? DAY_MASTER_TRAITS[dayMasterStem.name] : null;

  const careerAuthorityProfile = findTopProfilePct(rankedProfiles, ["Direct Officer", "Seven Killings"]);
  const careerOutputProfile = findTopProfilePct(rankedProfiles, ["Hurting Officer", "Eating God"]);

  const weakestElement = elementalBalance[elementalBalance.length - 1];

  // Which element plays which Ten-God role for this Day Master (Self/
  // Resource/Output/Wealth/Officer) - structural fact, independent of
  // favourability.
  const elementForRole = (roleName) =>
    elementalBalance.find((e) => e.role === roleName)?.name;
  const officerElement = elementForRole("Officer");
  const outputElement = elementForRole("Output");
  const wealthElement = elementForRole("Wealth");

  // A role being structurally relevant to an area (e.g. Officer -> Career)
  // doesn't mean it's good for THIS chart - that depends on the Day Master's
  // strength band. Intersect with what's actually favourable here so a weak
  // Day Master chart (where Officer drains rather than helps) doesn't get a
  // false "strong career month" callout.
  const favourableSet = new Set([
    ...(usefulGod.favourableElements || []),
    ...(usefulGod.secondaryFavourableElements || []),
  ]);

  const monthNamesWhere = (predicate) =>
    monthlyOutlook.filter(predicate).map((m) => m.monthName);

  const cautionSet = new Set(usefulGod.cautionElements || []);
  const partnerStarElement = relationship.spouseStar?.element || null;

  // Day Branch (Spouse Palace) — the earthly branch of the day pillar is the
  // classical "relationship palace" in BaZi. Its element indicates the quality
  // of energy the person brings to and seeks in close partnerships.
  const dayBranchAnimal = natalPillars?.day?.branch?.animal || null;
  const dayBranchZh = natalPillars?.day?.branch?.zh || null;
  const dayBranchElement = natalPillars?.day?.branch?.element || null;
  const spousePalaceNoteText = dayBranchElement ? SPOUSE_PALACE_NOTES[dayBranchElement] : null;

  // Peach Blossom timing — the Peach Blossom branch indicates which years and
  // months romance and social magnetism peak for this person.
  const peachBlossomStar = shenSha.find((s) => s.key === "peachBlossom");
  const peachBlossomAnimal = peachBlossomStar?.branch?.animal || null;
  const peachBlossomMonth = peachBlossomAnimal ? ANIMAL_TO_MONTH[peachBlossomAnimal] : null;
  // 2020 = Rat year (index 0); cycle repeats every 12 years
  const peachBlossomYears = (() => {
    if (!peachBlossomAnimal) return [];
    const order = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
    const targetIdx = order.indexOf(peachBlossomAnimal);
    if (targetIdx === -1) return [];
    const currentYear = new Date().getFullYear();
    const currentIdx = (currentYear - 2020 + 1200) % 12;
    const offset = (targetIdx - currentIdx + 12) % 12;
    const first = offset === 0 ? currentYear : currentYear + offset;
    return [first, first + 12];
  })();

  const careerStrongMonths = monthNamesWhere(
    (m) =>
      favourableSet.has(m.dominantElement) &&
      (m.dominantElement === officerElement || m.dominantElement === outputElement)
  );
  const careerCautionMonths = monthNamesWhere(
    (m) =>
      cautionSet.has(m.dominantElement) &&
      (m.dominantElement === officerElement || m.dominantElement === outputElement)
  );
  const wealthStrongMonths = monthNamesWhere(
    (m) => favourableSet.has(m.dominantElement) && m.dominantElement === wealthElement
  );
  const wealthCautionMonths = monthNamesWhere(
    (m) => cautionSet.has(m.dominantElement) && m.dominantElement === wealthElement
  );
  // "Good" relationship months are anchored to the partner star element
  // (the chart's own structural relationship signal) rather than the
  // general favourable set, mirroring how Career/Wealth use their own
  // role element rather than a generic favourable/caution split.
  const relationshipGoodMonths = monthNamesWhere(
    (m) => favourableSet.has(m.dominantElement) && m.dominantElement === partnerStarElement
  );
  const relationshipCautionMonths = monthNamesWhere((m) =>
    (relationship.timingNotes?.activatedBy || []).includes(m.dominantElement)
  );
  const wellnessEasierMonths = monthNamesWhere((m) => m.read === "Good");
  const wellnessCautionMonths = monthNamesWhere((m) => m.read === "Caution");

  const annualZodiacName = annualZodiac?.displayName || "";
  const coverYearLabel = `${report.annualEnergy?.selectedYear || new Date().getFullYear()}${annualZodiacName ? ` ${annualZodiacName}` : ""} Year`;

  function expandMonthlyNote(item) {
    const elementInfo = elementalBalance?.find((e) => e.name === item.dominantElement);
    const roleDesc = elementInfo?.roleDescription;
    const { chinese, branchAnimal, dominantElement, read } = item;
    const roleText = roleDesc
      ? ` For this chart, ${dominantElement} energy governs ${roleDesc}.`
      : "";
    const goodActionMap = {
      Metal: "express ideas, build visibility and pursue creative or communication-led opportunities",
      Water: "attract resources, pursue wealth goals and strengthen key relationships",
      Wood: "build structure, take on responsibilities and establish long-term commitments",
      Fire: "seek support, invest in learning and draw on mentors or helpful people",
      Earth: "ground decisions, consolidate progress and build on what you already have",
    };
    const cautionNoteMap = {
      Earth: "adds to what is already being managed in this chart, which can amplify heaviness or a sense of overcommitment",
      Fire: "adds warmth that this chart needs to process carefully, which may stir emotional intensity or scattered energy",
      Wood: "can intensify structure and obligation demands already present in this chart",
      Metal: "may feel draining or overly cutting when the chart is already under pressure",
      Water: "adds flow that can feel unsteady or emotionally heavy during a demanding period",
    };
    if (read === "Good") {
      const action = goodActionMap[dominantElement] || "act on plans and take meaningful steps forward";
      return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This is a supportive window — a good time to ${action}. Use this month's momentum to take action on goals you have been building toward, and lean into opportunities that feel aligned rather than holding back.`;
    }
    if (read === "Caution") {
      const cautionNote = cautionNoteMap[dominantElement] || "may create added demands on your energy";
      return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This energy ${cautionNote}. Pace yourself carefully — focus on maintaining what is already in place rather than starting new initiatives. Give yourself room to rest and recover, and avoid making major commitments from a place of pressure or urgency.`;
    }
    return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This is a relatively neutral period for this chart — a steady time to maintain momentum without major push or pull in either direction. Use the quieter energy to consolidate, reflect and prepare for upcoming active windows.`;
  }

  // primaryUsefulGod from usefulGodV4 is an element name ("Metal", "Water", etc.)
  const primaryDzi = DZI_BEAD_MAP[usefulGod.primaryUsefulGod] || null;
  const secondaryDziRaw = DZI_BEAD_MAP[usefulGod.secondaryUsefulGod] || null;
  const secondaryDzi = secondaryDziRaw?.label !== primaryDzi?.label ? secondaryDziRaw : null;

  return {
    narrative, personality, usefulGod, lifeAreas, stones, eightMansions, shenSha,
    luckPillars, lifePalace, conceptionPalace, natalPillars, tenGodByPillar,
    annualPillar, annualZodiac,
    rankedProfiles, findProfilePct,
    career, wealth, wealthArchetype, relationship, relationshipArchetype,
    relationshipPattern, health, blindSpots, lifeThemes, growthAdvice,
    elementalBalance, monthlyOutlook, strongerElements, moderateElements, weakerElements,
    directWealthPct, indirectWealthPct,
    dayMasterLabel, dayMasterTrait,
    careerAuthorityProfile, careerOutputProfile,
    weakestElement, officerElement, outputElement, wealthElement,
    favourableSet, cautionSet, partnerStarElement,
    dayBranchAnimal, dayBranchZh, dayBranchElement, spousePalaceNoteText,
    peachBlossomAnimal, peachBlossomYears, peachBlossomMonth,
    careerStrongMonths, careerCautionMonths,
    wealthStrongMonths, wealthCautionMonths,
    relationshipGoodMonths, relationshipCautionMonths,
    wellnessEasierMonths, wellnessCautionMonths,
    annualZodiacName, coverYearLabel, expandMonthlyNote,
    dziBeadMap: DZI_BEAD_MAP, primaryDzi, secondaryDzi,
  };
}
