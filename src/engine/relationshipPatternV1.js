// src/engine/relationshipPatternV1.js

const VERSION = "RelationshipPatternV1";

const safeArray = (value) => (Array.isArray(value) ? value : []);

const getProfileScore = (tenProfileScoringV2, profileName) => {
  const profiles =
    tenProfileScoringV2?.profiles ||
    tenProfileScoringV2?.profileScores ||
    tenProfileScoringV2?.scores ||
    [];

  if (Array.isArray(profiles)) {
    const found = profiles.find(
      (p) =>
        p?.name === profileName ||
        p?.profile === profileName ||
        p?.tenGod === profileName
    );

    return Number(found?.score || found?.percentage || found?.value || 0);
  }

  return Number(
    profiles?.[profileName]?.score ||
      profiles?.[profileName]?.percentage ||
      profiles?.[profileName] ||
      0
  );
};

const getTopProfiles = (tenProfileScoringV2) => {
  const profiles =
    tenProfileScoringV2?.profiles ||
    tenProfileScoringV2?.profileScores ||
    tenProfileScoringV2?.scores ||
    [];

  if (Array.isArray(profiles)) {
    return profiles
      .map((p) => ({
        name: p?.name || p?.profile || p?.tenGod,
        score: Number(p?.score || p?.percentage || p?.value || 0),
      }))
      .filter((p) => p.name)
      .sort((a, b) => b.score - a.score);
  }

  return Object.entries(profiles)
    .map(([name, value]) => ({
      name,
      score: Number(value?.score || value?.percentage || value || 0),
    }))
    .sort((a, b) => b.score - a.score);
};

const includesAny = (items, keywords) =>
  safeArray(items).some((item) =>
    keywords.some((keyword) =>
      String(item || "")
        .toLowerCase()
        .includes(keyword.toLowerCase())
    )
  );

export function buildRelationshipPatternV1({
  relationshipEngineV2,
  structureScoringV2,
  tenProfileScoringV2,
  dayMasterStrengthV4,
  usefulGodV4,
  blindSpotsV1,
  growthAdviceV1,
} = {}) {
  const topProfiles = getTopProfiles(tenProfileScoringV2);
  const dominantProfile =
    tenProfileScoringV2?.dominantProfile?.name ||
    tenProfileScoringV2?.dominantProfile ||
    topProfiles?.[0]?.name ||
    null;

  const structureName =
    structureScoringV2?.mainStructure?.name ||
    structureScoringV2?.dominantStructure?.name ||
    structureScoringV2?.structure ||
    null;

  const strengthStatus =
    dayMasterStrengthV4?.status ||
    dayMasterStrengthV4?.strengthCategory ||
    null;

  const primaryUsefulGod =
    usefulGodV4?.primaryUsefulGod ||
    usefulGodV4?.primary ||
    null;

  const secondaryUsefulGod =
    usefulGodV4?.secondaryUsefulGod ||
    usefulGodV4?.secondary ||
    null;

  const friendScore = getProfileScore(tenProfileScoringV2, "Friend");
  const robWealthScore = getProfileScore(tenProfileScoringV2, "Rob Wealth");
  const eatingGodScore = getProfileScore(tenProfileScoringV2, "Eating God");
  const hurtingOfficerScore = getProfileScore(
    tenProfileScoringV2,
    "Hurting Officer"
  );
  const directWealthScore = getProfileScore(tenProfileScoringV2, "Direct Wealth");
  const indirectWealthScore = getProfileScore(
    tenProfileScoringV2,
    "Indirect Wealth"
  );
  const directOfficerScore = getProfileScore(
    tenProfileScoringV2,
    "Direct Officer"
  );
  const sevenKillingsScore = getProfileScore(
    tenProfileScoringV2,
    "Seven Killings"
  );
  const directResourceScore = getProfileScore(
    tenProfileScoringV2,
    "Direct Resource"
  );
  const indirectResourceScore = getProfileScore(
    tenProfileScoringV2,
    "Indirect Resource"
  );

  const expressionScore = eatingGodScore + hurtingOfficerScore;
  const stabilityScore = directOfficerScore + directWealthScore;
  const independenceScore = robWealthScore + sevenKillingsScore;
  const emotionalDepthScore = directResourceScore + indirectResourceScore;
  const warmthScore = friendScore + eatingGodScore;

  let relationshipStyle = "Steady Connection Builder";
  let relationshipPattern =
    "You tend to build love through consistency, trust, and shared responsibility.";
  let emotionalNeeds = [
    "Emotional safety before full openness",
    "Consistency in words and actions",
    "A relationship that feels stable without becoming restrictive",
  ];
  let relationshipStrengths = [
    "You are loyal once trust is built.",
    "You notice effort and remember the little things.",
    "You prefer relationships that grow through real actions, not just words.",
  ];
  let relationshipBlindSpots = [
    "You may take too long to say what you really need.",
    "You may carry emotional responsibility quietly.",
    "You may appear more okay than you actually are.",
  ];
  let idealPartnerTraits = [
    "Emotionally steady",
    "Patient with your pace",
    "Reliable without being controlling",
  ];
  let growthAdvice = [
    "Let people know what helps you feel safe.",
    "Do not wait until you are overwhelmed before speaking honestly.",
    "Choose people whose actions are consistent over time.",
  ];

  if (expressionScore >= 130) {
    relationshipStyle = "Expressive Heart Connector";
    relationshipPattern =
      "You connect through expression, warmth, humour, honesty, and emotional presence.";
    emotionalNeeds = [
      "Freedom to express yourself naturally",
      "A partner who listens without shutting you down",
      "Warmth, playfulness, and emotional responsiveness",
    ];
    relationshipStrengths = [
      "You bring life, colour, and sincerity into relationships.",
      "You are able to make emotional connection feel personal.",
      "You can soften serious moments through warmth and honesty.",
    ];
    relationshipBlindSpots = [
      "You may over-explain when you feel misunderstood.",
      "You may feel hurt when your expression is not received well.",
      "You may need to pause before reacting from emotion.",
    ];
    idealPartnerTraits = [
      "Emotionally receptive",
      "Affectionate in a grounded way",
      "Comfortable with honest conversations",
    ];
    growthAdvice = [
      "Let your emotions breathe, but avoid making decisions at the peak of a feeling.",
      "Choose someone who can hold space for your expression.",
      "Notice who responds with care instead of defensiveness.",
    ];
  }

  if (stabilityScore >= 130) {
    relationshipStyle = "Devoted Stability Builder";
    relationshipPattern =
      "You show love through reliability, responsibility, planning, and long-term commitment.";
    emotionalNeeds = [
      "Clear commitment",
      "Respect for your effort",
      "A partner who values loyalty and consistency",
    ];
    relationshipStrengths = [
      "You are dependable and serious about the people you love.",
      "You can build a relationship with patience and maturity.",
      "You naturally think about the future, not just the moment.",
    ];
    relationshipBlindSpots = [
      "You may become too responsible in love.",
      "You may focus on doing things right instead of saying how you feel.",
      "You may stay too long when you feel obligated.",
    ];
    idealPartnerTraits = [
      "Responsible",
      "Emotionally mature",
      "Clear about commitment",
    ];
    growthAdvice = [
      "Let love be more than duty.",
      "Allow yourself to receive care instead of always proving reliability.",
      "Check whether the relationship feels nourishing, not only stable.",
    ];
  }

  if (independenceScore >= 130) {
    relationshipStyle = "Independent Passion Partner";
    relationshipPattern =
      "You need a relationship that respects your individuality while still offering emotional loyalty.";
    emotionalNeeds = [
      "Space to remain yourself",
      "Respect for your autonomy",
      "A partner who does not make love feel like control",
    ];
    relationshipStrengths = [
      "You are protective when you care.",
      "You bring courage and directness into relationships.",
      "You are drawn to bonds that feel alive and growth-oriented.",
    ];
    relationshipBlindSpots = [
      "You may act strong even when you want reassurance.",
      "You may resist depending on someone.",
      "You may test people indirectly when you feel unsafe.",
    ];
    idealPartnerTraits = [
      "Secure and not easily threatened",
      "Confident but not domineering",
      "Supportive of your growth",
    ];
    growthAdvice = [
      "Let the right person support you without seeing it as weakness.",
      "Do not confuse emotional safety with loss of freedom.",
      "Be direct about your need for both closeness and space.",
    ];
  }

  if (emotionalDepthScore >= 130) {
    relationshipStyle = "Deep Emotional Observer";
    relationshipPattern =
      "You bond slowly, but when you feel safe, your love becomes thoughtful, protective, and deeply personal.";
    emotionalNeeds = [
      "Gentleness and emotional patience",
      "Time to process feelings",
      "A partner who understands your inner world",
    ];
    relationshipStrengths = [
      "You are thoughtful and sensitive to emotional undercurrents.",
      "You can love with depth and quiet devotion.",
      "You naturally reflect before committing your heart fully.",
    ];
    relationshipBlindSpots = [
      "You may retreat when emotions become too intense.",
      "You may assume instead of asking directly.",
      "You may overthink signs of rejection.",
    ];
    idealPartnerTraits = [
      "Gentle and emotionally consistent",
      "Patient with your inner process",
      "Honest without being harsh",
    ];
    growthAdvice = [
      "Ask for clarity instead of carrying silent assumptions.",
      "Let people earn access gradually, but do not close the door too quickly.",
      "Choose emotional steadiness over emotional intensity alone.",
    ];
  }

  if (warmthScore >= 130 && independenceScore < 130) {
    relationshipStyle = "Warm Companionship Lover";
    relationshipPattern =
      "You are happiest when love feels like friendship, emotional ease, and mutual support.";
    emotionalNeeds = [
      "A partner who feels safe and familiar",
      "Daily warmth and simple affection",
      "A relationship where you do not need to perform",
    ];
    relationshipStrengths = [
      "You make people feel accepted and emotionally comfortable.",
      "You are naturally supportive when you feel appreciated.",
      "You value companionship and shared everyday moments.",
    ];
    relationshipBlindSpots = [
      "You may avoid difficult conversations to preserve harmony.",
      "You may give too much benefit of the doubt.",
      "You may downplay your needs to keep the connection peaceful.",
    ];
    idealPartnerTraits = [
      "Kind and emotionally available",
      "Consistent in small daily ways",
      "Able to communicate gently",
    ];
    growthAdvice = [
      "Do not trade your needs for temporary peace.",
      "Let harmony include honesty.",
      "Notice who makes you feel calm, not just excited.",
    ];
  }

  if (
    includesAny(blindSpotsV1?.blindSpots, [
      "overgiving",
      "responsibility",
      "pressure",
      "control",
      "avoid",
      "emotion",
    ])
  ) {
    relationshipBlindSpots = [
      ...relationshipBlindSpots,
      "Your existing blind spots may show up most clearly when you care deeply about someone.",
    ];
  }

  const supportiveEnergy =
    growthAdviceV1?.supportiveEnergy ||
    primaryUsefulGod ||
    secondaryUsefulGod ||
    "Balance";

  const summary = `${relationshipStyle}: ${relationshipPattern} Your best relationships are not built through guessing games, but through steady effort, emotional honesty, and a partner who can meet your pace with consistency.`;

  return {
    version: VERSION,

    relationshipStyle,
    relationshipPattern,
    emotionalNeeds,
    relationshipStrengths,
    relationshipBlindSpots,
    idealPartnerTraits,
    growthAdvice,
    supportiveEnergy,
    summary,

    primaryUsefulGod,
    secondaryUsefulGod,

    reasoning: {
      dominantProfile,
      structureName,
      strengthStatus,
      topProfiles: topProfiles.slice(0, 5),
      scores: {
        expressionScore,
        stabilityScore,
        independenceScore,
        emotionalDepthScore,
        warmthScore,
      },
      relationshipEngineStyle:
        relationshipEngineV2?.relationshipStyle ||
        relationshipEngineV2?.relationshipPattern ||
        null,
    },
  };
}

export default buildRelationshipPatternV1;