import { getSolarYearPrecise } from "../data/solarTerms.js";

// Gua (1-9, excluding 5) -> trigram identity, element, compass direction.
// Validated against 4 of these 8 entries (1, 2, 4, 6) directly against real
// reference output (Ma Weini, Suyin C, Yue Qing Amanda, Wong Lee Lee charts).
// 3, 7, 8, 9 follow the same standard classical Lo Shu pattern but were not
// independently cross-checked the same way - worth a spot-check later.
const GUA_INFO = {
  1: { lifeStar: "1 White", trigram: "Kan", zh: "坎", element: "Water", direction: "North", group: "East" },
  2: { lifeStar: "2 Black", trigram: "Kun", zh: "坤", element: "Earth", direction: "Southwest", group: "West" },
  3: { lifeStar: "3 Jade", trigram: "Zhen", zh: "震", element: "Wood", direction: "East", group: "East" },
  4: { lifeStar: "4 Green", trigram: "Xun", zh: "巽", element: "Wood", direction: "Southeast", group: "East" },
  6: { lifeStar: "6 White", trigram: "Qian", zh: "乾", element: "Metal", direction: "Northwest", group: "West" },
  7: { lifeStar: "7 Red", trigram: "Dui", zh: "兌", element: "Metal", direction: "West", group: "West" },
  8: { lifeStar: "8 White", trigram: "Gen", zh: "艮", element: "Earth", direction: "Northeast", group: "West" },
  9: { lifeStar: "9 Purple", trigram: "Li", zh: "離", element: "Fire", direction: "South", group: "East" },
};

// Per-Gua favourable (Sheng Qi/Tian Yi/Yan Nian/Fu Wei) and unfavourable
// (Huo Hai/Wu Gui/Liu Sha/Jue Ming) direction tables. Entries for Gua 1, 2,
// 4, 6 verified against real reference output; 3, 7, 8, 9 from the standard
// classical table.
const DIRECTIONS_BY_GUA = {
  1: { shengQi: "Southeast", tianYi: "East", yanNian: "South", fuWei: "North", huoHai: "West", wuGui: "Northeast", liuSha: "Northwest", jueMing: "Southwest" },
  2: { shengQi: "Northeast", tianYi: "West", yanNian: "Northwest", fuWei: "Southwest", huoHai: "South", wuGui: "North", liuSha: "Southeast", jueMing: "East" },
  3: { shengQi: "South", tianYi: "North", yanNian: "Southeast", fuWei: "East", huoHai: "Northeast", wuGui: "West", liuSha: "Southwest", jueMing: "Northwest" },
  4: { shengQi: "North", tianYi: "South", yanNian: "East", fuWei: "Southeast", huoHai: "Southwest", wuGui: "Northwest", liuSha: "Northeast", jueMing: "West" },
  6: { shengQi: "West", tianYi: "Northeast", yanNian: "Southwest", fuWei: "Northwest", huoHai: "Southeast", wuGui: "South", liuSha: "East", jueMing: "North" },
  7: { shengQi: "Northwest", tianYi: "Southwest", yanNian: "Northeast", fuWei: "West", huoHai: "North", wuGui: "Southeast", liuSha: "South", jueMing: "East" },
  8: { shengQi: "Southwest", tianYi: "Northwest", yanNian: "West", fuWei: "Northeast", huoHai: "East", wuGui: "South", liuSha: "North", jueMing: "Southeast" },
  9: { shengQi: "East", tianYi: "Southeast", yanNian: "North", fuWei: "South", huoHai: "Northwest", wuGui: "Southwest", liuSha: "West", jueMing: "Northeast" },
};

function reduceToSingleDigit(value) {
  let n = value;
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function calculateMingGua({ birthDate, birthTime, gender }) {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime ? birthTime.split(":").map(Number) : [0, 0];
  const solar = getSolarYearPrecise(year, month, day, hour, minute, Boolean(birthTime));
  const solarYear = solar.year;
  const lastTwoDigits = solarYear % 100;
  const reduced = reduceToSingleDigit(lastTwoDigits);

  const isBefore2000 = solarYear < 2000;
  const isMale = String(gender || "").toLowerCase() === "male";

  let gua;
  if (isMale) {
    gua = isBefore2000 ? 10 - reduced : 9 - reduced;
  } else {
    gua = isBefore2000 ? reduced + 5 : reduced + 6;
  }
  gua = reduceToSingleDigit(gua);

  // Male post-2000 subtraction (9 - reduced) can land exactly on 0 when
  // reduced === 9; classical convention wraps that back to 9.
  if (gua === 0) {
    gua = 9;
  }

  // Gua 5 has no trigram of its own in the Lo Shu framework; classical
  // convention reassigns it.
  if (gua === 5) {
    gua = isMale ? 2 : 8;
  }

  return { gua, solar };
}

export function buildEightMansionsV1({ birthDate, birthTime, gender }) {
  if (!birthDate) return null;

  const { gua, solar } = calculateMingGua({ birthDate, birthTime, gender });
  const info = GUA_INFO[gua];
  const directions = DIRECTIONS_BY_GUA[gua];

  return {
    version: "eight-mansions-v1",
    gua,
    solarYear: solar.year,
    onBoundaryDay: solar.onBoundaryDay,
    needsBirthTime: solar.needsTime,
    lifeStar: info.lifeStar,
    trigram: info.trigram,
    trigramZh: info.zh,
    element: info.element,
    personalDirection: info.direction,
    group: `${info.group} Group`,
    favourableDirections: [
      { name: "Sheng Qi", label: "Life-Generating", direction: directions.shengQi, theme: "career success, wealth, vitality" },
      { name: "Tian Yi", label: "Heavenly Doctor", direction: directions.tianYi, theme: "health, recovery" },
      { name: "Yan Nian", label: "Longevity", direction: directions.yanNian, theme: "relationships, marriage harmony" },
      { name: "Fu Wei", label: "Stability", direction: directions.fuWei, theme: "personal growth, self-cultivation" },
    ],
    unfavourableDirections: [
      { name: "Huo Hai", label: "Mishap", direction: directions.huoHai },
      { name: "Wu Gui", label: "Five Ghosts", direction: directions.wuGui },
      { name: "Liu Sha", label: "Six Killings", direction: directions.liuSha },
      { name: "Jue Ming", label: "Life-Threatening", direction: directions.jueMing },
    ],
  };
}

export default buildEightMansionsV1;
