// src/tests/productRecommendationsV1Tests.js

import { buildBaziChart } from "../engine/buildBaziChart.js";

const TEST_CASES = [
  {
    name: "Joshua",
    input: {
      name: "Joshua",
      gender: "male",
      birthDate: "1999-01-26",
      birthTime: "22:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Ma Weini",
    input: {
      name: "Ma Weini",
      gender: "female",
      birthDate: "1982-08-15",
      birthTime: "21:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Suyin C",
    input: {
      name: "Suyin C",
      gender: "female",
      birthDate: "1987-12-03",
      birthTime: "03:45",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Yue Qing Amanda",
    input: {
      name: "Yue Qing Amanda",
      gender: "female",
      birthDate: "1986-09-07",
      birthTime: "00:00",
      birthCountry: "Singapore",
      useBirthTime: true,
      selectedYear: 2026,
    },
  },
  {
    name: "Wong Lee Lee",
    input: {
      name: "Wong Lee Lee",
      gender: "female",
      birthDate: "1980-03-06",
      birthTime: "",
      birthCountry: "Singapore",
      useBirthTime: false,
      selectedYear: 2026,
    },
  },
];

function hasArray(value) {
  return Array.isArray(value);
}

function hasNoUndefinedProductValues(products = []) {
  return products.every(
    (product) =>
      product?.stone &&
      product?.stoneType &&
      product?.category &&
      product?.priority &&
      product?.reason &&
      product?.customerMessage
  );
}

function runProductRecommendationsV1Tests() {
  console.log("Running ProductRecommendationsV1 benchmark tests...");

  const results = TEST_CASES.map((testCase) => {
    const chart = buildBaziChart(testCase.input);
    const result = chart?.productRecommendationsV1;

    const checks = {
      hasResult: Boolean(result),
      correctVersion: result?.version === "product-recommendations-v1",

      hasPrimaryArray: hasArray(result?.primaryProducts),
      hasSecondaryArray: hasArray(result?.secondaryProducts),
      hasLifestyleArray: hasArray(result?.lifestyleProducts),
      hasReasoningArray: hasArray(result?.reasoning),

      hasPrimaryProducts: result?.primaryProducts?.length > 0,
      hasSecondaryProducts: result?.secondaryProducts?.length > 0,
      hasLifestyleProducts: result?.lifestyleProducts?.length > 0,

      validPrimaryProducts: hasNoUndefinedProductValues(
        result?.primaryProducts
      ),
      validSecondaryProducts: hasNoUndefinedProductValues(
        result?.secondaryProducts
      ),
      validLifestyleProducts: hasNoUndefinedProductValues(
        result?.lifestyleProducts
      ),

      hasMainStructure: Boolean(result?.mainStructure),
      hasDominantProfile: Boolean(result?.dominantProfile),

      noWarningsFromProductV1: !chart?.warnings?.some((warning) =>
        warning.includes("ProductRecommendationsV1 failed safely")
      ),
    };

    const pass = Object.values(checks).every(Boolean);

    return {
      name: testCase.name,
      pass,

      primaryElement: result?.primaryElement,
      secondaryElement: result?.secondaryElement,
      mainStructure: result?.mainStructure,
      dominantProfile: result?.dominantProfile,

      primaryProductsCount: result?.primaryProducts?.length || 0,
      secondaryProductsCount: result?.secondaryProducts?.length || 0,
      lifestyleProductsCount: result?.lifestyleProducts?.length || 0,

      firstPrimaryProduct: result?.primaryProducts?.[0]
        ? `${result.primaryProducts[0].stone} ${result.primaryProducts[0].category}`
        : null,

      firstSecondaryProduct: result?.secondaryProducts?.[0]
        ? `${result.secondaryProducts[0].stone} ${result.secondaryProducts[0].category}`
        : null,

      checks,
    };
  });

  console.table(
    results.map((result) => ({
      name: result.name,
      status: result.pass ? "PASS" : "FAIL",
      primaryElement: result.primaryElement,
      secondaryElement: result.secondaryElement,
      mainStructure: result.mainStructure,
      dominantProfile: result.dominantProfile,
      primaryProductsCount: result.primaryProductsCount,
      secondaryProductsCount: result.secondaryProductsCount,
      lifestyleProductsCount: result.lifestyleProductsCount,
      firstPrimaryProduct: result.firstPrimaryProduct,
      firstSecondaryProduct: result.firstSecondaryProduct,
    }))
  );

  const failed = results.filter((result) => !result.pass);

  if (failed.length > 0) {
    console.warn("ProductRecommendationsV1 failed cases:", failed);
  } else {
    console.log("ProductRecommendationsV1 benchmark completed: ALL PASS");
  }

  return results;
}

runProductRecommendationsV1Tests();