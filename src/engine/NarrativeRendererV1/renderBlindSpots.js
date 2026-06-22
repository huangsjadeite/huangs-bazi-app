import { toNarrative } from "./labelToNarrative.js";

export function renderBlindSpots(
  {
    career,
    wealth,
    relationship,
    health,
    lifeThemes,
    narrativePersonalization,
  },
  tracker
) {
  const blindSpots = [];

  const primaryThemes = lifeThemes?.primaryThemes || [];
  const supportingThemes = lifeThemes?.supportingThemes || [];

  const structure = narrativePersonalization?.structure || "";
  const profile = narrativePersonalization?.profile || "";

  if (structure === "Connectors" && profile === "Direct Wealth") {
    blindSpots.push(
      "You may focus heavily on opportunities, responsibilities or outcomes, making it easy to carry more than necessary before asking for support.",
      "You may trust your judgement so strongly that external perspectives are considered later than they should be."
    );
  }

  if (structure === "Connectors" && profile === "Indirect Resource") {
    blindSpots.push(
      "You may spend too much time understanding people, situations or possibilities before deciding how you truly feel.",
      "You may see so many perspectives that committing to one direction becomes harder than necessary."
    );
  }

  if (structure === "Supporters" && profile === "Direct Resource") {
    blindSpots.push(
      "You may become the reliable person everyone depends on while quietly neglecting your own needs."
    );
  }

  if (primaryThemes.length > 0) {
    blindSpots.push(buildLifeThemeBlindSpot(primaryThemes[0]));
  }

  if (primaryThemes.length > 1) {
    blindSpots.push(buildLifeThemeBlindSpot(primaryThemes[1]));
  }

  if (supportingThemes.length > 0) {
    blindSpots.push(buildLifeThemeBlindSpot(supportingThemes[0]));
  }

  if (health?.stressPattern) {
    blindSpots.push(buildHealthBlindSpot(health.stressPattern));
  }

  if (wealth?.moneyMindset) {
    blindSpots.push(buildWealthBlindSpot(wealth.moneyMindset));
  }

  if (relationship?.challenge) {
    blindSpots.push(buildRelationshipBlindSpot(relationship.challenge));
  }

  if (career?.careerChallenge) {
    blindSpots.push(buildCareerBlindSpot(career.careerChallenge));
  }

  if (career?.growthArea) {
    blindSpots.push(buildCareerBlindSpot(career.growthArea));
  }

  return blindSpots
    .filter(Boolean)
    .map((item) => toNarrative(item))
    .filter(Boolean)
    .filter((item) => tracker.use(item))
    .slice(0, 3);
}

function buildLifeThemeBlindSpot(theme) {
  const text = String(theme).toLowerCase();

  if (text.includes("relationships")) {
    return "You may become overly focused on maintaining harmony or helping others, making it easier to overlook your own needs and priorities.";
  }

  if (text.includes("independence") || text.includes("support")) {
    return "You may become so used to handling things yourself that accepting support feels harder than it needs to be.";
  }

  if (text.includes("knowledge")) {
    return "You may spend too much time gathering information, reflecting or preparing before taking action.";
  }

  if (text.includes("leadership")) {
    return "You may feel responsible for outcomes that were never entirely yours to carry.";
  }

  if (text.includes("possibility") || text.includes("expansion")) {
    return "You may become excited by future possibilities, making it harder to decide which opportunities deserve your full commitment.";
  }

  if (text.includes("strategic")) {
    return "You may analyse situations so carefully that opportunities pass before a decision is made.";
  }

  if (text.includes("adaptability")) {
    return "You may adapt to changing circumstances so easily that your own direction becomes less clear.";
  }

  if (text.includes("growth")) {
    return "You may become focused on constant improvement without fully recognising how much progress has already been made.";
  }

  if (text.includes("stability")) {
    return "You may hold on to familiar situations longer than necessary because they feel safe or predictable.";
  }

  return theme;
}

function buildHealthBlindSpot(stressPattern) {
  const text = String(stressPattern).toLowerCase();

  if (text.includes("mental")) {
    return "You may spend so much energy processing thoughts and possibilities that your body receives less attention than it needs.";
  }

  if (text.includes("responsibility") || text.includes("carrying")) {
    return "You may keep functioning for others even when your own energy has already become stretched.";
  }

  if (
    text.includes("people") ||
    text.includes("opportunity") ||
    text.includes("overload")
  ) {
    return "Your energy may become scattered when too many people, requests or possibilities compete for your attention.";
  }

  return stressPattern;
}

function buildWealthBlindSpot(moneyMindset) {
  const text = String(moneyMindset).toLowerCase();

  if (text.includes("opportunity")) {
    return "You may focus on the potential of an opportunity before fully weighing the limits, timing or practical risks.";
  }

  if (text.includes("knowledge")) {
    return "You may underestimate the value of what you already know, delaying opportunities until you feel completely prepared.";
  }

  if (text.includes("security")) {
    return "You may prioritise safety so strongly that it becomes harder to recognise when growth requires a measured risk.";
  }

  return moneyMindset;
}

function buildRelationshipBlindSpot(challenge) {
  const text = String(challenge).toLowerCase();

  if (text.includes("communication") || text.includes("trust")) {
    return "You may need more clarity in relationships than you openly express, which can create quiet uncertainty over time.";
  }

  if (text.includes("boundaries") || text.includes("support")) {
    return "You may give support easily, but find it harder to state your own limits before feeling emotionally tired.";
  }

  if (text.includes("independent") || text.includes("alone")) {
    return "You may become overly self-reliant in relationships, even when support is available.";
  }

  return challenge;
}

function buildCareerBlindSpot(challenge) {
  const text = String(challenge).toLowerCase();

  if (text.includes("visibility") || text.includes("opportunity")) {
    return "You may feel pulled toward many visible opportunities without always checking which ones truly support your long-term direction.";
  }

  if (text.includes("analysis") || text.includes("preparation")) {
    return "You may spend too long refining your thinking before allowing your work to be seen or tested.";
  }

  if (text.includes("service") || text.includes("support")) {
    return "You may become dependable to others while underestimating the value of your own contribution.";
  }

  return challenge;
}

export default renderBlindSpots;