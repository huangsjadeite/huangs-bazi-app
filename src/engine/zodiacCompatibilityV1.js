// src/engine/zodiacCompatibilityV1.js
//
// Zodiac-animal compatibility from the year branch (the animal people know as
// their sign), using the classical branch relations:
//   Good:        三合 Three Harmony (same trine) and 六合 Six Harmony (pair combo)
//   Challenging: 六冲 Clash, 六害 Harm and 刑 Punishment (incl. self-punishment)
// Every other animal is neutral. Applies to any relationship (family, friends,
// work, partners); a full match still needs both birth charts.

import { EARTHLY_BRANCHES, getBranchIndex, cycleMod } from "../data/baziConstants.js";
import { TRIO_GROUPS } from "./shenShaV1.js";

const VERSION = "zodiac-compatibility-v1";

const pairKey = (a, b) => [a, b].sort().join("|");
const pairSet = (pairs) => new Set(pairs.map(([a, b]) => pairKey(a, b)));

const SIX_HARMONY = pairSet([["zi", "chou"], ["yin", "hai"], ["mao", "xu"], ["chen", "you"], ["si", "shen"], ["wu", "wei"]]);
const HARMS = pairSet([["zi", "wei"], ["chou", "wu"], ["yin", "si"], ["mao", "chen"], ["shen", "hai"], ["you", "xu"]]);
const PUNISHMENTS = pairSet([
  ["zi", "mao"],
  ["yin", "si"], ["si", "shen"], ["yin", "shen"],
  ["chou", "xu"], ["xu", "wei"], ["chou", "wei"],
]);
const SELF_PUNISHMENT = new Set(["chen", "wu", "you", "hai"]);

const isClash = (a, b) => cycleMod(getBranchIndex(a) - getBranchIndex(b), 12) === 6;

const REASONS = {
  sixHarmony: { zh: "六合", label: "Six Harmony", text: "your closest single match: you naturally support and complete each other" },
  threeHarmony: { zh: "三合", label: "Three Harmony", text: "you share the same outlook and goals, so you work well together as a team" },
  clash: { zh: "冲", label: "Clash", text: "opposite approaches: you can spark ideas off each other but often clash, so this pairing needs the most give and take" },
  harm: { zh: "害", label: "Harm", text: "small misunderstandings and hurt feelings can build up quietly" },
  punishment: { zh: "刑", label: "Punishment", text: "pressure and power struggles; you can be hard on each other" },
  selfPunishment: { zh: "自刑", label: "Self Punishment", text: "two of the same sign can bring out each other's worst habits" },
};

function describe(branch, reasonKeys) {
  return {
    key: branch.key,
    zh: branch.zh,
    animal: branch.animal,
    reasons: reasonKeys.map((key) => ({ key, ...REASONS[key] })),
  };
}

export function buildZodiacCompatibilityV1({ pillars } = {}) {
  const own = pillars?.year?.branch;
  if (!own?.key) return null;

  const trio = TRIO_GROUPS.find((group) => group.branches.includes(own.key));
  const best = [];
  const challenging = [];
  const neutral = [];

  EARTHLY_BRANCHES.forEach((branch) => {
    if (branch.key === own.key) {
      if (SELF_PUNISHMENT.has(own.key)) challenging.push(describe(branch, ["selfPunishment"]));
      return;
    }
    const pair = pairKey(own.key, branch.key);
    const good = [];
    if (SIX_HARMONY.has(pair)) good.push("sixHarmony");
    if (trio?.branches.includes(branch.key)) good.push("threeHarmony");
    const bad = [];
    if (isClash(own.key, branch.key)) bad.push("clash");
    if (HARMS.has(pair)) bad.push("harm");
    if (PUNISHMENTS.has(pair)) bad.push("punishment");

    if (good.length) best.push(describe(branch, good));
    else if (bad.length) challenging.push(describe(branch, bad));
    else neutral.push(describe(branch, []));
  });

  // Six Harmony first, then Three Harmony; Clash first among the challenging.
  best.sort((a, b) => (a.reasons[0].key === "sixHarmony" ? -1 : 0) - (b.reasons[0].key === "sixHarmony" ? -1 : 0));
  challenging.sort((a, b) => (a.reasons[0].key === "clash" ? -1 : 0) - (b.reasons[0].key === "clash" ? -1 : 0));

  return {
    version: VERSION,
    sign: { key: own.key, zh: own.zh, animal: own.animal },
    best,
    challenging,
    neutral,
  };
}

export default buildZodiacCompatibilityV1;
