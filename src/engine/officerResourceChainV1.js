// src/engine/officerResourceChainV1.js
//
// Shared tests for the Officer -> Resource -> Day Master chain (官印相生 /
// 殺印相生) and related Ten God pairings, read from the natal Ten God
// percentages (tenProfileScoringV2). Used by the career and wealth engines so
// both sections switch wording on the same condition.

// A profile counts as "strong" at this displayed percentage or above.
export const STRONG_PROFILE_PCT = 50;

export function readOfficerResourceChainV1({ structureScoringV2, tenProfileScoringV2 } = {}) {
  const pct = tenProfileScoringV2?.percentages || {};
  const get = (name) => Number(pct[name]) || 0;
  const isAuthorityStructure =
    structureScoringV2?.mainStructure?.key === "supporters" || structureScoringV2?.mainStructure?.name === "Supporters";

  const officerPresent = get("Direct Officer") > 0 || get("Seven Killings") > 0;
  const officerStrong = Math.max(get("Direct Officer"), get("Seven Killings")) >= STRONG_PROFILE_PCT;
  const resourceStrong = Math.max(get("Direct Resource"), get("Indirect Resource")) >= STRONG_PROFILE_PCT;

  return {
    isAuthorityStructure,
    // Authority-structure chart whose Officer and Resource are both strong:
    // drives the "Trusted Leader" career and wealth wording.
    officerResourceChain: isAuthorityStructure && officerStrong && resourceStrong,
    // Officer present and Resource strong: pressure turns into growth.
    pressureIntoProgress: officerPresent && resourceStrong,
    // 傷官見官: Hurting Officer and Direct Officer both in the natal chart.
    hurtingOfficerMeetsOfficer: get("Hurting Officer") > 0 && get("Direct Officer") > 0,
  };
}

export default readOfficerResourceChainV1;
