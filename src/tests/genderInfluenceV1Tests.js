import { genderInfluenceV1 } from "./genderInfluenceV1.js";

const mockRelationship = {
  spouseStar: "Wealth",
  spouseStarPresence: {
    present: true,
    locations: ["monthStem"],
  },
  timingNotes: ["Annual activation present"],
};

const mockTenProfiles = {
  dominantProfile: "Connector",
};

const mockStructure = {
  dominantStructure: "Connectors",
};

console.log("Male test:");
console.log(
  genderInfluenceV1({
    input: { gender: "Male" },
    relationshipEngineV2: mockRelationship,
    tenProfileScoringV2: mockTenProfiles,
    structureScoringV2: mockStructure,
  })
);

console.log("Female test:");
console.log(
  genderInfluenceV1({
    input: { gender: "Female" },
    relationshipEngineV2: mockRelationship,
    tenProfileScoringV2: mockTenProfiles,
    structureScoringV2: mockStructure,
  })
);

console.log("Unspecified test:");
console.log(
  genderInfluenceV1({
    input: {},
    relationshipEngineV2: mockRelationship,
    tenProfileScoringV2: mockTenProfiles,
    structureScoringV2: mockStructure,
  })
);