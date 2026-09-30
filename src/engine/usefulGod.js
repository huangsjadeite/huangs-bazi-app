import { ELEMENTS, GENERATES, CONTROLS } from "../data/baziConstants.js";

function getElementThatControls(element) {
  return ELEMENTS.find((candidate) => CONTROLS[candidate] === element);
}

function getElementThatGenerates(element) {
  return ELEMENTS.find((candidate) => GENERATES[candidate] === element);
}

function getGeneratedBy(element) {
  return GENERATES[element];
}

function getControlledBy(element) {
  return CONTROLS[element];
}

function sortElementsByPercentage(elementBalance = {}, direction = "asc") {
  const percentages = elementBalance.percentages || {};

  return Object.entries(percentages)
    .filter(([element]) => ELEMENTS.includes(element))
    .sort((a, b) => {
      return direction === "asc" ? a[1] - b[1] : b[1] - a[1];
    })
    .map(([element]) => element);
}

function getElementPercentage(elementBalance = {}, element) {
  return elementBalance?.percentages?.[element] ?? 0;
}

function uniqueClean(elements = []) {
  return [...new Set(elements.filter(Boolean))];
}

export function calculateUsefulGodSuggestion(dayMasterStrength, elementBalance) {
  const selfElement = dayMasterStrength?.selfElement;
  const category = dayMasterStrength?.category || "balanced";

  if (!selfElement || !ELEMENTS.includes(selfElement)) {
    return {
      method: "engine-v2-dynamic-prototype",
      supportiveElements: ["Water"],
      cautionElements: [],
      reasoning:
        "Self element was unavailable, so Water is used as a conservative balancing fallback.",
      note: "Prototype Elements to Enhance suggestion only. Final Elements to Enhance logic should be reviewed manually before production use.",
    };
  }

  const resourceElement = getElementThatGenerates(selfElement);
  const outputElement = getGeneratedBy(selfElement);
  const wealthElement = getControlledBy(selfElement);
  const officerElement = getElementThatControls(selfElement);

  const weakestElements = sortElementsByPercentage(elementBalance, "asc");
  const strongestElements = sortElementsByPercentage(elementBalance, "desc");

  const selfPercentage = getElementPercentage(elementBalance, selfElement);
  const resourcePercentage = getElementPercentage(elementBalance, resourceElement);
  const outputPercentage = getElementPercentage(elementBalance, outputElement);
  const wealthPercentage = getElementPercentage(elementBalance, wealthElement);
  const officerPercentage = getElementPercentage(elementBalance, officerElement);

  let supportiveElements = [];
  let cautionElements = [];
  let reasoning = "";

  if (category === "strong") {
    supportiveElements = [
      outputElement,
      wealthElement,
      officerElement,
      ...weakestElements.slice(0, 2),
    ];

    cautionElements = [
      selfElement,
      resourceElement,
      ...strongestElements.slice(0, 1),
    ];

    reasoning =
      "The Day Master appears strong, so the chart benefits from expression, wealth/output movement, regulation and weaker balancing elements rather than further strengthening the self element.";
  } else if (category === "weak") {
    supportiveElements = [
      selfElement,
      resourceElement,
      ...weakestElements.filter(
        (element) => element === selfElement || element === resourceElement
      ),
    ];

    cautionElements = [outputElement, wealthElement, officerElement];

    reasoning =
      "The Day Master appears weak, so the chart benefits from strengthening the self element and resource element before adding too much output, wealth or pressure energy.";
  } else {
    supportiveElements = [
      ...weakestElements.slice(0, 2),
      resourcePercentage < 15 ? resourceElement : null,
      selfPercentage < 15 ? selfElement : null,
    ];

    cautionElements = strongestElements.filter(
      (element) => getElementPercentage(elementBalance, element) >= 30
    );

    reasoning =
      "The Day Master appears relatively balanced, so the chart benefits from supporting weaker elements while avoiding over-amplifying already dominant elements.";
  }

  supportiveElements = uniqueClean(supportiveElements).filter(
    (element) => !cautionElements.includes(element)
  );

  cautionElements = uniqueClean(cautionElements);

  if (!supportiveElements.length) {
    supportiveElements = weakestElements.slice(0, 2);
  }

  if (!supportiveElements.length) {
    supportiveElements = [resourceElement || "Water"];
  }

  return {
    method: "engine-v2-dynamic-prototype",
    selfElement,
    category,

    supportiveElements,
    cautionElements,

    relationshipElements: {
      selfElement,
      resourceElement,
      outputElement,
      wealthElement,
      officerElement,
    },

    elementPercentages: {
      selfElement: selfPercentage,
      resourceElement: resourcePercentage,
      outputElement: outputPercentage,
      wealthElement: wealthPercentage,
      officerElement: officerPercentage,
    },

    reasoning,
    note: "Prototype Elements to Enhance suggestion only. Final Elements to Enhance logic should be reviewed manually before production use.",
  };
}