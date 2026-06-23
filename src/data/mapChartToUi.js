import { getDayMasterDescription } from "./dayMasterDescriptions.js";

const pickArray = (...arrays) => {
  return arrays.find((array) => Array.isArray(array) && array.length > 0) || [];
};

const safeText = (value, fallback = "") => {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (value && typeof value === "object") {
    const parts = [];

    if (Array.isArray(value.regulation) && value.regulation.length) {
      parts.push(
        `Your chart first benefits from regulation through ${value.regulation.join(
          ", "
        )}.`
      );
    }

    if (Array.isArray(value.balance) && value.balance.length) {
      parts.push(
        `It also benefits from balancing ${value.balance.join(", ")}.`
      );
    }

    if (
      typeof value.supportControl === "string" &&
      value.supportControl.trim()
    ) {
      parts.push(value.supportControl.trim());
    }

    if (
      typeof value.annualOverlay === "string" &&
      value.annualOverlay.trim()
    ) {
      parts.push(value.annualOverlay.trim());
    }

    return parts.length ? parts.join(" ") : fallback;
  }

  return fallback;
};

const uniqueArray = (items = []) => {
  return [...new Set(items.filter(Boolean))];
};

const TEN_PROFILE_NAMES = {
  Friend: "The Companion",
  RobWealth: "The Challenger",
  EatingGod: "The Creator",
  HurtingOfficer: "The Rebel Voice",
  DirectWealth: "The Builder",
  IndirectWealth: "The Opportunist",
  DirectOfficer: "The Guardian",
  SevenKillings: "The Warrior",
  DirectResource: "The Nurturer",
  IndirectResource: "The Mystic",

  friend: "The Companion",
  robWealth: "The Challenger",
  eatingGod: "The Creator",
  hurtingOfficer: "The Rebel Voice",
  directWealth: "The Builder",
  indirectWealth: "The Opportunist",
  directOfficer: "The Guardian",
  sevenKillings: "The Warrior",
  directResource: "The Nurturer",
  indirectResource: "The Mystic",
};

const normalizeScore = (value) => {
  const number = Number(value || 0);

  if (!Number.isFinite(number)) return 0;

  if (number > 0 && number <= 1) {
    return Math.round(number * 100);
  }

  return Math.round(number);
};

const getRawArchetypeScore = (item) => {
  return normalizeScore(
    item?.percentage ?? item?.adjustedScore ?? item?.score ?? item?.value ?? 0
  );
};

const getArchetypeKey = (item) => {
  return (
    item?.archetypeKey ||
    item?.key ||
    item?.profileKey ||
    item?.profile ||
    item?.type ||
    item?.tenGod ||
    item?.label ||
    item?.name ||
    ""
  );
};

const normalizeLifeThemes = (chart) => {
  const rawLifeThemes =
    chart?.lifeThemes ||
    chart?.lifeThemesV1 ||
    chart?.lifeAreas?.lifeThemes ||
    null;

  return {
    primaryThemes: Array.isArray(rawLifeThemes?.primaryThemes)
      ? rawLifeThemes.primaryThemes
      : [],
    supportingThemes: Array.isArray(rawLifeThemes?.supportingThemes)
      ? rawLifeThemes.supportingThemes
      : [],
    reasoning: Array.isArray(rawLifeThemes?.reasoning)
      ? rawLifeThemes.reasoning
      : [],
    version: rawLifeThemes?.version || "life-themes-v1",
  };
};

const normalizeBlindSpots = (chart) => {
  const blindSpots =
    chart?.blindSpotsV1 ||
    chart?.blindSpots ||
    chart?.lifeAreas?.blindSpots ||
    chart?.practicalSupport?.blindSpots ||
    null;

  return {
    version: blindSpots?.version || "blind-spots-v1",
    blindSpots: Array.isArray(blindSpots?.blindSpots)
      ? blindSpots.blindSpots
      : [],
    mainStructure: blindSpots?.mainStructure || "",
    dominantProfile: blindSpots?.dominantProfile || "",
    dayMasterStatus: blindSpots?.dayMasterStatus || "",
    reasoning: Array.isArray(blindSpots?.reasoning)
      ? blindSpots.reasoning
      : [],
  };
};

const normalizeWealthArchetype = (chart) => {
  const wealthArchetype =
    chart?.wealthArchetypeV1 ||
    chart?.wealthArchetype ||
    chart?.lifeAreas?.wealthArchetype ||
    chart?.practicalSupport?.wealthArchetype ||
    null;

  return {
    version: wealthArchetype?.version || "wealth-archetype-v1",

    wealthArchetype: wealthArchetype?.wealthArchetype || "",
    wealthStyle: wealthArchetype?.wealthStyle || "",
    incomePath: wealthArchetype?.incomePath || "",

    incomeStyle: wealthArchetype?.incomeStyle || "",
    moneyMindset: wealthArchetype?.moneyMindset || "",
    wealthBehaviour: wealthArchetype?.wealthBehaviour || "",

    primaryUsefulGod: wealthArchetype?.primaryUsefulGod || "",
    secondaryUsefulGod: wealthArchetype?.secondaryUsefulGod || "",

    moneyStrengths: Array.isArray(wealthArchetype?.moneyStrengths)
      ? wealthArchetype.moneyStrengths
      : [],
    moneyBlindSpots: Array.isArray(wealthArchetype?.moneyBlindSpots)
      ? wealthArchetype.moneyBlindSpots
      : [],
    idealIncomeModels: Array.isArray(wealthArchetype?.idealIncomeModels)
      ? wealthArchetype.idealIncomeModels
      : [],
    reasoning: Array.isArray(wealthArchetype?.reasoning)
      ? wealthArchetype.reasoning
      : [],

    debug: wealthArchetype?.debug || {},
  };
};

const normalizeRelationshipPattern = (chart) => {
  const relationshipPattern =
    chart?.relationshipPatternV1 ||
    chart?.relationshipPattern ||
    chart?.lifeAreas?.relationshipPattern ||
    chart?.practicalSupport?.relationshipPattern ||
    null;

  return {
    version: relationshipPattern?.version || "relationship-pattern-v1",

    relationshipStyle: relationshipPattern?.relationshipStyle || "",
    relationshipPattern: relationshipPattern?.relationshipPattern || "",
    summary: relationshipPattern?.summary || "",

    emotionalNeeds: Array.isArray(relationshipPattern?.emotionalNeeds)
      ? relationshipPattern.emotionalNeeds
      : [],

    relationshipStrengths: Array.isArray(
      relationshipPattern?.relationshipStrengths
    )
      ? relationshipPattern.relationshipStrengths
      : [],

    relationshipBlindSpots: Array.isArray(
      relationshipPattern?.relationshipBlindSpots
    )
      ? relationshipPattern.relationshipBlindSpots
      : [],

    idealPartnerTraits: Array.isArray(relationshipPattern?.idealPartnerTraits)
      ? relationshipPattern.idealPartnerTraits
      : [],

    growthAdvice: Array.isArray(relationshipPattern?.growthAdvice)
      ? relationshipPattern.growthAdvice
      : [],

    supportiveEnergy: relationshipPattern?.supportiveEnergy || "",

    primaryUsefulGod: relationshipPattern?.primaryUsefulGod || "",
    secondaryUsefulGod: relationshipPattern?.secondaryUsefulGod || "",

    reasoning: relationshipPattern?.reasoning || {},
  };
};

const normalizeRelationshipArchetype = (chart) => {
  const relationshipArchetype =
    chart?.relationshipArchetypeV1 ||
    chart?.relationshipArchetype ||
    chart?.lifeAreas?.relationshipArchetype ||
    chart?.practicalSupport?.relationshipArchetype ||
    null;

  return {
    version:
      relationshipArchetype?.version ||
      relationshipArchetype?.source ||
      "relationship-archetype-v1",

    key: relationshipArchetype?.key || "",
    name: relationshipArchetype?.name || "",
    score: relationshipArchetype?.score || 0,

    relationshipStyle: relationshipArchetype?.relationshipStyle || "",
    advice: relationshipArchetype?.advice || "",

    strengths: Array.isArray(relationshipArchetype?.strengths)
      ? relationshipArchetype.strengths
      : [],

    blindSpots: Array.isArray(relationshipArchetype?.blindSpots)
      ? relationshipArchetype.blindSpots
      : [],

    greenFlags: Array.isArray(relationshipArchetype?.greenFlags)
      ? relationshipArchetype.greenFlags
      : [],

    redFlags: Array.isArray(relationshipArchetype?.redFlags)
      ? relationshipArchetype.redFlags
      : [],

    partnerNeeds: Array.isArray(relationshipArchetype?.partnerNeeds)
      ? relationshipArchetype.partnerNeeds
      : [],
  };
};

const normalizeTopStrengths = (chart) => {
  const topStrengths =
    chart?.topStrengthsV1 ||
    chart?.topStrengths ||
    chart?.personalityAndStructure?.topStrengths ||
    chart?.practicalSupport?.topStrengths ||
    [];

  return Array.isArray(topStrengths)
    ? topStrengths.map((item, index) => ({
        rank: item?.rank || index + 1,
        key: item?.key || "",
        title: item?.title || "",
        description: item?.description || "",
        reason: item?.reason || "",
        score: item?.score || 0,
        source: item?.source || "TopStrengthsV1",
      }))
    : [];
};

const normalizeFocusRanking = (chart) => {
  const focusRanking =
    chart?.focusRankingV1 ||
    chart?.focusRanking ||
    chart?.lifeAreas?.focusRanking ||
    chart?.practicalSupport?.focusRanking ||
    [];

  return Array.isArray(focusRanking)
    ? focusRanking.map((item, index) => ({
        rank: item?.rank || index + 1,
        key: item?.key || "",
        area: item?.area || "",
        priority: item?.priority || "",
        description: item?.description || "",
        reason: item?.reason || "",
        action: item?.action || "",
        score: item?.score || 0,
        source: item?.source || "FocusRankingV1",
      }))
    : [];
};

const getChartDayMasterValue = (chart) => {
  return (
    chart?.dayMasterStrength?.dayMaster?.label ||
    chart?.dayMasterStrength?.dayMaster?.displayName ||
    chart?.dayMasterStrength?.dayMaster?.name ||
    chart?.dayMasterStrength?.dayMaster?.zh ||
    chart?.dayMasterStrength?.displayName ||
    chart?.dayMasterStrengthV4?.dayMaster?.label ||
    chart?.dayMasterStrengthV4?.dayMaster?.displayName ||
    chart?.dayMasterStrengthV4?.dayMaster?.name ||
    chart?.dayMasterStrengthV4?.dayMaster ||
    chart?.pillars?.day?.heavenlyStem?.label ||
    chart?.pillars?.day?.heavenlyStem?.name ||
    chart?.pillars?.day?.heavenlyStem?.zh ||
    chart?.pillars?.day?.stem?.label ||
    chart?.pillars?.day?.stem?.name ||
    chart?.pillars?.day?.stem?.zh ||
    ""
  );
};

const normalizeGrowthAdvice = (chart) => {
  const growthAdvice =
    chart?.growthAdviceV1 ||
    chart?.growthAdvice ||
    chart?.lifeAreas?.growthAdvice ||
    chart?.practicalSupport?.growthAdvice ||
    null;

  return {
    version: growthAdvice?.version || "growth-advice-v1",

    growthFocus: growthAdvice?.growthFocus || "",
    summary: growthAdvice?.summary || "",
    wealthConnection: growthAdvice?.wealthConnection || "",

    growthStrengths: Array.isArray(growthAdvice?.growthStrengths)
      ? growthAdvice.growthStrengths
      : [],

    avoidPatterns: Array.isArray(growthAdvice?.avoidPatterns)
      ? growthAdvice.avoidPatterns
      : [],

    nextLevelActions: Array.isArray(growthAdvice?.nextLevelActions)
      ? growthAdvice.nextLevelActions
      : [],

    relatedBlindSpots: Array.isArray(growthAdvice?.relatedBlindSpots)
      ? growthAdvice.relatedBlindSpots
      : [],

    supportiveEnergy: growthAdvice?.supportiveEnergy || {},

    mainStructure: growthAdvice?.mainStructure || "",
    dominantProfile: growthAdvice?.dominantProfile || "",
    dayMasterStatus: growthAdvice?.dayMasterStatus || "",

    reasoning: Array.isArray(growthAdvice?.reasoning)
      ? growthAdvice.reasoning
      : [],
  };
};

export const mapChartToUi = (chart, selectedYear) => {
  const personalEnergy = chart?.personalEnergyProfile || {};
  const annual = chart?.annualOverlay || {};
  const annualScores = chart?.annualOverlayV3 || {};
  const dayMasterIdentity = getDayMasterDescription(getChartDayMasterValue(chart));

  const stones =
    chart?.recommendations?.stones ||
    chart?.practicalSupport?.stones ||
    chart?.stoneRecommendationsV4 ||
    chart?.stoneRecommendationsV3 ||
    chart?.stoneRecommendations ||
    {};

  const products =
    chart?.recommendations?.products ||
    chart?.practicalSupport?.products ||
    chart?.productRecommendationsV1 ||
    {};

  const rawGuidance =
    chart?.practicalSupport?.guidance ||
    chart?.practicalGuidanceV6 ||
    chart?.practicalGuidanceV3 ||
    chart?.practicalGuidance ||
    {};

  const lifeThemes = normalizeLifeThemes(chart);
  const blindSpots = normalizeBlindSpots(chart);
  const wealthArchetype = normalizeWealthArchetype(chart);
  const growthAdvice = normalizeGrowthAdvice(chart);
  const relationshipPattern = normalizeRelationshipPattern(chart);
  const relationshipArchetype = normalizeRelationshipArchetype(chart);
  const topStrengths = normalizeTopStrengths(chart);
  const focusRanking = normalizeFocusRanking(chart);

  const guidance = {
    ...rawGuidance,

    career: {
      ...(rawGuidance.career || {}),
      score: annualScores?.career?.score,
    },

    wealth: {
      ...(rawGuidance.wealth || {}),
      score: annualScores?.wealth?.score,
      wealthArchetype,
    },

    relationship: {
      ...(rawGuidance.relationship || {}),
      score: annualScores?.relationship?.score,
      relationshipPattern,
      relationshipArchetype,
    },

    wellness: {
      ...(rawGuidance.wellness || rawGuidance.health || {}),
      score: annualScores?.wellness?.score,
    },

    health: {
      ...(rawGuidance.health || rawGuidance.wellness || {}),
      score: annualScores?.wellness?.score,
    },
  };

  const rawArchetypes = pickArray(
  chart?.personalityAndStructure?.tenProfileScoring?.profiles,
  chart?.personalityAndStructure?.tenProfileScoring?.rankedProfiles,
  chart?.tenProfileScoringV3?.profiles,
  chart?.tenProfileScoringV3?.rankedProfiles,
  chart?.tenProfileScoringV2?.profiles,
  chart?.tenProfileScoringV2?.rankedProfiles,
  chart?.adjustedArchetypes,
  chart?.archetypes,
  chart?.tenGodProfiles,
  chart?.profiles
);

  const archetypes = rawArchetypes
    .map((item) => {
      const profileKey = getArchetypeKey(item);
      const score = getRawArchetypeScore(item);

      const publicName =
        item?.publicName ||
        item?.name ||
        item?.label ||
        TEN_PROFILE_NAMES[profileKey] ||
        profileKey ||
        "Archetype";

      return {
        key: profileKey,
        type:
          item?.tenGod ||
          item?.type ||
          item?.label ||
          profileKey ||
          "Archetype",
        name: publicName,
        label:
          item?.tenGod ||
          item?.type ||
          item?.label ||
          profileKey ||
          "Archetype",
        description:
          item?.description ||
          item?.publicMeaning ||
          item?.meaning ||
          item?.theme ||
          "This archetype reflects one of your active personality patterns.",
        score,
        percentage: score,
        strengths: item?.strengths || [],
        stressPattern: item?.stressPattern || item?.stress || "",
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    profile: {
      ...(chart?.profile || {}),
      name: chart?.input?.name?.trim() || "",
      selectedYear,
      summary:
        chart?.profile?.summary ||
        chart?.narrative?.headline ||
        chart?.narrativeRendererV1?.headline ||
        "Your elemental balance interacts differently with each annual cycle, influencing emotional expression, mental pressure, motivation and recovery.",
      zodiac:
        chart?.birthZodiac?.zodiacDisplayName ||
        chart?.birthZodiac?.displayName ||
        chart?.birthZodiac?.animal ||
        "-",
      coreEnergy:
        chart?.dayMasterStrength?.dayMaster?.zh &&
        chart?.dayMasterStrength?.dayMaster?.label
          ? `${chart.dayMasterStrength.dayMaster.zh} · ${chart.dayMasterStrength.dayMaster.label}`
          : dayMasterIdentity?.stem && dayMasterIdentity?.label
          ? `${dayMasterIdentity.stem} · ${dayMasterIdentity.label}`
          : chart?.dayMasterStrength?.displayName ||
            chart?.dayMasterStrength?.dayMaster?.displayName ||
            chart?.dayMasterStrengthV4?.dayMaster ||
            "",
      dayMasterIdentity,
      dayMasterTitle: dayMasterIdentity?.title || "",
      dayMasterSummary: dayMasterIdentity?.summary || "",
      annualPillar: annual.yearPillar || null,
      annualZodiac: annual.zodiac?.displayName || "",
    },

    archetypes,

    elements: (() => {
      const natalWeighted = chart?.elementBalance?.weighted || {};
      const percentages = chart?.elementBalance?.percentages || {};

      // The year pillar's element points (e.g. 2026 Bing-Wu/Fire Horse skews
      // heavily Fire). Same raw-points scale as elementBalance.weighted, so
      // adding it in and renormalising treats the year as a 5th pillar.
      const annualElementPoints =
        chart?.annualOverlayV4?.annualElements ||
        chart?.annualOverlay?.annualElements ||
        chart?.annualOverlayV3?.elementScores ||
        {};

      const combinedWeighted = Object.fromEntries(
        Object.keys(percentages).map((name) => [
          name,
          Number(natalWeighted[name] || 0) + Number(annualElementPoints[name] || 0),
        ])
      );
      const combinedTotal = Object.values(combinedWeighted).reduce(
        (sum, value) => sum + value,
        0
      );

      return Object.entries(percentages).map(([name, percentage]) => ({
        key: name,
        name,
        label: `${percentage}%`,
        publicMeaning: "",
        percentage,

        annualPercentage:
          combinedTotal > 0
            ? Number(((combinedWeighted[name] / combinedTotal) * 100).toFixed(1))
            : Number(percentage || 0),
      }));
    })(),

    personalEnergyBalance: {
  coreEnergyStatus:
    chart?.dayMasterStrengthV4?.status ||
    personalEnergy.coreEnergyStatus ||
    "",
  coreEnergyScore:
    chart?.dayMasterStrengthV4?.strengthScore ??
    personalEnergy.coreEnergyScore ??
    "",
  seasonalDominantElement:
    annual?.zodiac?.displayName ||
    annual?.dominantElement ||
    personalEnergy.seasonalDominantElement ||
    "",
  // usefulGodV4 is the authoritative strength-first source (see
  // engine README). The older usefulGodSuggestion module is an explicitly
  // labelled prototype with a different, percentage-only methodology that
  // can disagree with V4 on the same element - mixing the two here is what
  // previously put the same element in both supportive and caution lists.
  // Only fall back to the legacy module when V4 didn't run.
  supportiveElements: chart?.usefulGodV4
    ? uniqueArray([
        ...(chart.usefulGodV4.favourableElements || []),
        ...(chart.usefulGodV4.secondaryFavourableElements || []),
      ])
    : uniqueArray(personalEnergy.supportiveElements || []),
  cautionElements: chart?.usefulGodV4
    ? uniqueArray(chart.usefulGodV4.cautionElements || [])
    : uniqueArray(personalEnergy.cautionElements || []),
  explanation: safeText(
    chart?.usefulGodV4?.explanation || personalEnergy.explanation,
    "Your chart benefits from using supportive elements with balance, rather than simply adding more of what is already strong."
  ),
  method: personalEnergy.method,
},

    practicalGuidance: guidance,
    guidance,

    lifeThemes,
    blindSpots,
    wealthArchetype,
    growthAdvice,
    relationshipPattern,
    relationshipArchetype,
    topStrengths,
    focusRanking,

    lifeAreas: {
      ...(chart?.lifeAreas || {}),
      lifeThemes,
      blindSpots,
      wealthArchetype,
      growthAdvice,
      relationshipPattern,
      relationshipArchetype,
      topStrengths,
      focusRanking,
    },

    personalityAndStructure: {
      ...(chart?.personalityAndStructure || {}),
      topStrengths,
    },

    stoneRecommendations: {
      ...stones,
      primaryElement: stones.primaryElement || "",
      secondaryElement: stones.secondaryElement || "",
      supportElements: stones.supportElements || [],
      supportBenefits: stones.supportBenefits || [],
      energyStrategy: stones.energyStrategy || {},
      cautionElements: stones.cautionElements || [],
      recommendedStones: stones.recommendedStones || [],
      topRecommendation: stones.topRecommendation || "",
      annualFocus: stones.annualFocus || "",
      explanation: stones.explanation || "",
      stoneDetails: stones.stoneDetails || [],
      primaryRecommendations: stones.primaryRecommendations || [],
      secondaryRecommendations: stones.secondaryRecommendations || [],
      avoidRecommendations: stones.avoidRecommendations || [],
      method: stones.method || stones.version || "",
    },

    stones: {
      ...stones,
      primaryElement: stones.primaryElement || "",
      secondaryElement: stones.secondaryElement || "",
      supportElements: stones.supportElements || [],
      supportBenefits: stones.supportBenefits || [],
      energyStrategy: stones.energyStrategy || {},
      cautionElements: stones.cautionElements || [],
      recommendedStones: stones.recommendedStones || [],
      topRecommendation: stones.topRecommendation || "",
      annualFocus: stones.annualFocus || "",
      explanation: stones.explanation || "",
      stoneDetails: stones.stoneDetails || [],
      primaryRecommendations: stones.primaryRecommendations || [],
      secondaryRecommendations: stones.secondaryRecommendations || [],
      avoidRecommendations: stones.avoidRecommendations || [],
      method: stones.method || stones.version || "",
    },

    productRecommendations: products,
    products,

    recommendations: {
      stones,
      products,
    },

    annualOverlay: annual,
    annual,

    cta: chart?.cta || {
      label: "Next Step",
      text: "",
    },
  };
};