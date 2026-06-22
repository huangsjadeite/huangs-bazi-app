export function buildPdfReportSchemaV1(chart) {
  const narrative =
    chart?.narrativeRendererV1 ||
    chart?.narrative ||
    {};

  return {
    version: "PDFReportSchemaV1",

    executiveSummary: narrative.summary || "",

    strengths: narrative.strengths || [],

    blindSpots: narrative.blindSpots || [],
    growthAdvice: narrative.growthAdvice || [],

    careerFocus: narrative.careerFocus || "",
    wealthFocus: narrative.wealthFocus || "",
    relationshipFocus: narrative.relationshipFocus || "",
    wellnessFocus: narrative.wellnessFocus || "",

    sections: [
      {
        id: "executiveSummary",
        title: "Your Personal Overview",
        type: "paragraph",
        content: narrative.summary || "",
      },
      {
        id: "strengths",
        title: "Your Key Strengths",
        type: "list",
        content: narrative.strengths || [],
      },
      {
        id: "blindSpots",
        title: "Blind Spots to Be Aware Of",
        type: "list",
        content: narrative.blindSpots || [],
      },
      {
        id: "growthAdvice",
        title: "Growth Advice",
        type: "list",
        content: narrative.growthAdvice || [],
      },
      {
        id: "careerFocus",
        title: "Career Focus",
        type: "paragraph",
        content: narrative.careerFocus || "",
      },
      {
        id: "wealthFocus",
        title: "Wealth Focus",
        type: "paragraph",
        content: narrative.wealthFocus || "",
      },
      {
        id: "relationshipFocus",
        title: "Relationship Focus",
        type: "paragraph",
        content: narrative.relationshipFocus || "",
      },
      {
        id: "wellnessFocus",
        title: "Wellness Focus",
        type: "paragraph",
        content: narrative.wellnessFocus || "",
      },
    ],
  };
}

export default buildPdfReportSchemaV1;