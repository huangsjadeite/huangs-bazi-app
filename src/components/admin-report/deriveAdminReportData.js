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

// Plain-English takeaway for how the current decade and year combine.
const LUCK_TONE = { favourable: "good", supported: "good", caution: "caution", neutral: "neutral" };

function buildLuckOverview(decadeRead, yearRead) {
  const decade = LUCK_TONE[decadeRead];
  const year = LUCK_TONE[yearRead];
  if (!decade || !year) return null;
  if (decade === "good" && year === "good")
    return "A supportive phase of your Luck Pillar meeting a supportive year. This is a good time to push forward on plans and take considered risks.";
  if (decade === "good" && year === "caution")
    return "Your Luck Pillar is on your side right now, so this year's friction is a bump rather than a trend. Stay the course, but time big moves for the Easiest months.";
  if (decade === "caution" && year === "good")
    return "A demanding phase of your Luck Pillar, but this year opens a window. Use it to make real progress and build reserves for the harder stretches.";
  if (decade === "caution" && year === "caution")
    return "A demanding phase of your Luck Pillar and a demanding year. Focus on consolidating rather than expanding, protect health and finances, and lean on your Elements to Enhance.";
  if (decade === "good")
    return "A supportive phase of your Luck Pillar with a steady year on top. Progress comes reliably with effort; use the Easiest months for important moves.";
  if (decade === "caution")
    return "A demanding phase of your Luck Pillar with a steady year on top. Keep commitments manageable and use the Easiest months for anything important.";
  if (year === "good")
    return "A steady phase of your Luck Pillar with a supportive year on top. This year is a good one to act on plans that have been waiting.";
  if (year === "caution")
    return "A steady phase of your Luck Pillar with a more demanding year on top. Pace yourself this year and save big decisions for the Easiest months.";
  return "A steady phase of your Luck Pillar and a steady year. Results follow effort; use the Easiest months for important moves.";
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
  const zodiacCompatibility = report.personalDirectionsAndStars?.zodiacCompatibility || null;
  const natalPillars = report.chartFoundation?.pillars || null;
  const tenGodByPillar = report.chartFoundation?.tenGodByPillar || null;
  const rawChartData = report.chartFoundation?.rawChartData || null;
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

  // Elements that help THIS chart (depends on the Day Master's strength band).
  const favourableSet = new Set([
    ...(usefulGod.favourableElements || []),
    ...(usefulGod.secondaryFavourableElements || []),
  ]);

  const monthNamesWhere = (predicate) =>
    monthlyOutlook.filter(predicate).map((m) => m.monthName);

  const cautionSet = new Set(usefulGod.cautionElements || []);
  const partnerStarElement = relationship.spouseStar?.element || null;

  // Day Branch (Spouse Palace) — the earthly branch of the day pillar is the
  // classical "relationship palace" in Bazi. Its element indicates the quality
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
  // This year's rating for the Peach Blossom month, so the report never calls
  // a month a romantic peak while the Monthly Outlook rates it Challenging.
  const peachBlossomRating = monthlyOutlook.find((m) => m.monthName === peachBlossomMonth)?.rating || null;
  const peachBlossomYears = (() => {
    if (!peachBlossomAnimal) return [];
    const order = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
    const targetIdx = order.indexOf(peachBlossomAnimal);
    if (targetIdx === -1) return [];
    // Count from the reading year, not today, so a 2027 reading lists the
    // years from 2027 on.
    const currentYear = report.annualEnergy?.selectedYear || new Date().getFullYear();
    const currentIdx = (currentYear - 2020 + 1200) % 12;
    const offset = (targetIdx - currentIdx + 12) % 12;
    const first = offset === 0 ? currentYear : currentYear + offset;
    return [first, first + 12];
  })();

  // Each key area always shows both month lists, picked from the layered
  // monthly forecast (rating, Ten God theme, clashes, stars). The area's own
  // signal leads; when it finds nothing, fall back to the overall rating so
  // the line is never blank. A month never lands in both lists.
  const isEasyMonth = (m) => m.rating === "Excellent" || m.rating === "Good";
  const isHardMonth = (m) => m.rating === "Challenging" || m.rating === "Difficult";
  const hasStar = (m, key) => (m.stars || []).some((star) => star.key === key);
  const clashes = (m, tag) => (m.clashedPillars || []).includes(tag);
  const inGroup = (m, ...groups) => groups.includes(m.tenGodGroup);

  const overallGoodMonths = monthNamesWhere(isEasyMonth);
  const overallCautionMonths = monthNamesWhere(isHardMonth);
  const withFallback = (easiest, pace) => {
    const finalEasiest = easiest.length ? easiest : overallGoodMonths;
    const notEasiest = (months) => months.filter((m) => !finalEasiest.includes(m));
    const areaPace = notEasiest(pace);
    return [finalEasiest, areaPace.length ? areaPace : notEasiest(overallCautionMonths)];
  };

  // Career: Officer (authority) and Output (expression) months; a clash with
  // the Month pillar (the career pillar) always means pacing.
  const [careerStrongMonths, careerCautionMonths] = withFallback(
    monthNamesWhere((m) => isEasyMonth(m) && !clashes(m, "M") && inGroup(m, "Officer", "Output")),
    monthNamesWhere((m) => (isHardMonth(m) && inGroup(m, "Officer", "Output")) || clashes(m, "M"))
  );
  // Wealth: Wealth months; Companion months (money going out) and Robbery Sha
  // months are the pace months.
  const [wealthStrongMonths, wealthCautionMonths] = withFallback(
    monthNamesWhere((m) => isEasyMonth(m) && !hasStar(m, "robberySha") && inGroup(m, "Wealth")),
    monthNamesWhere(
      (m) => (isHardMonth(m) && inGroup(m, "Wealth", "Companion")) || hasStar(m, "robberySha")
    )
  );
  // Relationships: Peach Blossom, a combo with the Day pillar (spouse palace)
  // or the partner star (Wealth for men, Officer for women); a Day-pillar clash is
  // always a pace month.
  const [relationshipGoodMonths, relationshipCautionMonths] = withFallback(
    monthNamesWhere(
      (m) =>
        isEasyMonth(m) &&
        !clashes(m, "D") &&
        (hasStar(m, "peachBlossom") || m.combinesDay || m.activatesPartnerStar)
    ),
    monthNamesWhere(
      (m) => clashes(m, "D") || (isHardMonth(m) && m.activatesPartnerStar)
    )
  );
  // Wellness: Resource (rest and support) months; every hard month is a pace
  // month. With no Resource month, name only the two best-rated easy months
  // rather than every good month, so the list still singles something out.
  const resourceMonths = monthNamesWhere((m) => isEasyMonth(m) && inGroup(m, "Resource"));
  const bestEasyMonths = (() => {
    const top = monthlyOutlook
      .filter(isEasyMonth)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    return monthNamesWhere((m) => top.includes(m));
  })();
  const [wellnessEasierMonths, wellnessCautionMonths] = withFallback(
    resourceMonths.length ? resourceMonths : bestEasyMonths,
    monthNamesWhere(isHardMonth)
  );

  const annualZodiacName = annualZodiac?.displayName || "";
  const coverYearLabel = `${report.annualEnergy?.selectedYear || new Date().getFullYear()}${annualZodiacName ? ` ${annualZodiacName}` : ""} Year`;

  // Plain-text version of a month's forecast (used by the JSON export).
  function expandMonthlyNote(item) {
    const parts = [`${item.chinese} (${item.branchAnimal}) brings ${item.dominantElement} energy. Rated ${item.rating}.`];
    if (item.theme) parts.push(`Theme: ${item.theme} (${item.tenGod?.primary}).`);
    if (item.doText) parts.push(`Do: ${item.doText}.`);
    [...(item.support || []), ...(item.watch || [])].forEach((line) => parts.push(`${line}.`));
    (item.stars || []).forEach((star) => parts.push(`${star.label}: ${star.text}.`));
    return parts.join(" ");
  }

  // Luck (运) layers: the 10-year Luck Pillar (大运) and the year (流年), each
  // rated by the stem element against the same element lists the months,
  // stones and relationship sections use, so every section agrees.
  const luckRead = (element) => {
    if (element === usefulGod.primaryUsefulGod) return "favourable";
    if (favourableSet.has(element)) return "supported";
    if (cautionSet.has(element)) return "caution";
    return "neutral";
  };
  const selectedYear = report.annualEnergy?.selectedYear || null;
  const birthYear = Number(report.client?.birthDate?.split("-")[0]) || null;
  // Age reached during the reading year, so a 2027 reading shows the pillar
  // active in 2027 rather than today's.
  const ageInSelectedYear = selectedYear && birthYear ? selectedYear - birthYear : null;
  // Each Luck Pillar is read in two halves: the stem (天干) colours the first
  // five years and the branch (地支) the last five, so a decade can turn.
  const luckDecadeDetails = report.personalDirectionsAndStars?.luckDecadeDetails || [];
  const luckTimeline = (luckPillars?.pillars || []).map((p) => {
    const midAge = p.startAge.years + 5;
    const halves = [
      { half: "first", startAge: p.startAge.years, endAge: midAge, zh: p.pillar.stem.zh, element: p.pillar.stem.element },
      { half: "second", startAge: midAge, endAge: p.endAge.years, zh: p.pillar.branch.zh, element: p.pillar.branch.element },
    ].map((h) => ({
      ...h,
      read: luckRead(h.element),
      isCurrent: ageInSelectedYear !== null && ageInSelectedYear >= h.startAge && ageInSelectedYear < h.endAge,
    }));
    const isCurrent =
      ageInSelectedYear !== null &&
      ageInSelectedYear >= p.startAge.years &&
      ageInSelectedYear < p.endAge.years;
    // `read` is the half in force during the reading year (the first half
    // when the decade is not the current one).
    const activeHalf = halves.find((h) => h.isCurrent) || halves[0];
    const details = luckDecadeDetails.find((d) => d.startAge === p.startAge.years) || null;
    return { ...p, halves, read: activeHalf.read, isCurrent, details };
  });
  const currentLuck = luckTimeline.find((p) => p.isCurrent) || null;
  const annualRead = annualPillar?.stemElement ? luckRead(annualPillar.stemElement) : null;
  const luckOverview = buildLuckOverview(currentLuck?.read, annualRead);

  // primaryUsefulGod from usefulGodV4 is an element name ("Metal", "Water", etc.)
  const primaryDzi = DZI_BEAD_MAP[usefulGod.primaryUsefulGod] || null;
  const secondaryDziRaw = DZI_BEAD_MAP[usefulGod.secondaryUsefulGod] || null;
  const secondaryDzi = secondaryDziRaw?.label !== primaryDzi?.label ? secondaryDziRaw : null;

  return {
    narrative, personality, usefulGod, lifeAreas, stones, eightMansions, shenSha,
    luckPillars, lifePalace, conceptionPalace, zodiacCompatibility, natalPillars, tenGodByPillar,
    rawChartData,
    annualPillar, annualZodiac,
    luckTimeline, currentLuck, annualRead, ageInSelectedYear, luckOverview,
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
    peachBlossomAnimal, peachBlossomYears, peachBlossomMonth, peachBlossomRating,
    careerStrongMonths, careerCautionMonths,
    wealthStrongMonths, wealthCautionMonths,
    relationshipGoodMonths, relationshipCautionMonths,
    wellnessEasierMonths, wellnessCautionMonths,
    annualZodiacName, coverYearLabel, expandMonthlyNote,
    dziBeadMap: DZI_BEAD_MAP, primaryDzi, secondaryDzi,
  };
}
