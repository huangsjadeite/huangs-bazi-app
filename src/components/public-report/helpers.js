export function normalizeScore(value) {
  const raw = Number(value || 0);

  if (raw > 0 && raw <= 1) {
    return Math.round(raw * 100);
  }

  return Math.round(raw);
}

export function getStrengthLabel(score) {
  const safeScore = normalizeScore(score);

  if (safeScore >= 80) return "Very Strong";
  if (safeScore >= 65) return "Strong";
  if (safeScore >= 45) return "Moderate";
  if (safeScore >= 25) return "Subtle";
  return "Dormant";
}

export function getStrengthBarWidth(score) {
  const label = getStrengthLabel(score);

  if (label === "Very Strong") return "90%";
  if (label === "Strong") return "75%";
  if (label === "Moderate") return "58%";
  if (label === "Subtle") return "38%";
  return "18%";
}

export function normalizeStoneItems(stones) {
  if (!stones) return [];

  if (Array.isArray(stones?.stoneDetails) && stones.stoneDetails.length) {
    return stones.stoneDetails;
  }

  const primaryGroups = stones?.primaryRecommendations || [];
  const secondaryGroups = stones?.secondaryRecommendations || [];

  return [...primaryGroups, ...secondaryGroups].flatMap((group) =>
    (group?.stones || []).map((stone, index) => ({
      rank: `${group.category || "support"}-${index}`,
      name: stone.name,
      type: stone.type,
      element: group.element,
      theme: stone.customerMessage || stone.reason || group.summary,
      bestFor: group.productStyle || "Daily energetic support",
    }))
  );
}

export function buildShopifySearchUrl(item) {
  const rawTerms = [
    item?.stone,
    item?.category,
    ...(item?.productSearchTags || []),
    item?.name,
    item?.type,
  ].filter(Boolean);

  const uniqueTerms = [...new Set(rawTerms)];
  // Keep the query broad (1-2 terms). The store's product titles are
  // descriptive ("Natural Blue Moonstone Pendant ..."), so the stone name
  // alone matches best; stacking every tag over-narrows and returns nothing.
  const searchQuery = uniqueTerms.slice(0, 2).join(" ");

  return `https://www.huangsjadeiteandjewelry.com/search?q=${encodeURIComponent(
    searchQuery
  )}`;
}

export function getFreePreviewReport(report) {
  if (!report) return null;

  return {
    ...report,
    executiveSummary: getFirstParagraph(report.executiveSummary),
    strengths: (report.strengths || []).slice(0, 2),
    blindSpots: (report.blindSpots || []).slice(0, 2),
    growthAdvice: (report.growthAdvice || []).slice(0, 2),
  };
}

function getFirstParagraph(text) {
  if (!text) return "";

  return String(text)
    .split("\n\n")
    .filter(Boolean)
    .slice(0, 2)
    .join("\n\n");
}

export function normalizeGuidanceItem(item, fallbackFocus, fallbackIcon) {
  if (!item) return null;

  const rawScore =
    item.score ?? item.percentage ?? item.intensity ?? item.confidence ?? null;

  const displayScore =
    typeof rawScore === "number" ? normalizeScore(rawScore) : null;

  const actionCopy = {
    Career:
      "Increase visibility through useful conversations, clearer positioning and work that allows people to understand your value.",
    Wealth:
      "Choose fewer but higher-quality opportunities. Focus on what can produce steady value instead of chasing every possible opening.",
    Relationship:
      "Let trust build through consistency, emotional honesty and actions over time instead of guessing or testing the connection too early.",
    Wellness:
      "Create recovery space before pressure builds. Your system works better when rest, routine and emotional reset are part of the plan.",
  };

  const title = `${fallbackFocus} Action`;

  const explanation =
    item.action ||
    item.nextStep ||
    item.focusAction ||
    actionCopy[fallbackFocus] ||
    item.advice ||
    item.explanation ||
    item.summary ||
    item.description ||
    item.message ||
    item.interpretation ||
    item.bullets?.[0] ||
    "Focus on one practical step that helps you use this area of life with more clarity and balance.";

  return {
    ...item,
    icon: item.icon || fallbackIcon,
    focus: item.focus || fallbackFocus,
    title,
    explanation,
    displayScore,
  };
}
