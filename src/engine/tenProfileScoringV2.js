// src/data/tenProfileScoringV2.js

import tenProfileScoringV3, {
  tenProfileScoringV3 as runV3,
  calculateTenProfileScoringV3,
  getTenProfileScoringV3,
} from "./tenProfileScoringV3";

export function tenProfileScoringV2(chart = {}) {
  return {
    ...runV3(chart),
    version: "TenProfileScoringV2-wrapper",
    wrappedEngine: "TenProfileScoringV3",
  };
}

export const calculateTenProfileScoringV2 = tenProfileScoringV2;
export const getTenProfileScoringV2 = tenProfileScoringV2;

export {
  runV3 as tenProfileScoringV3,
  calculateTenProfileScoringV3,
  getTenProfileScoringV3,
};

export default tenProfileScoringV2;