// src/engine/luckyElementsV1.js
//
// Practical lucky colours, numbers and directions for the reading year.
//   Colours and numbers: from the Elements to Enhance (UsefulGodV4 favourable
//   + secondary), with colours of the caution elements to go easy on. Numbers
//   follow the He Tu (河图) pairs: Water 1/6, Fire 2/7, Wood 3/8, Metal 4/9,
//   Earth 5/0.
//   Directions: the four personal Eight Mansions directions, each flagged when
//   that year's Tai Sui, Year Breaker or Three Killings sector falls in it.

const VERSION = "lucky-elements-v1";

const ELEMENT_COLOURS = {
  Wood: ["green", "teal"],
  Fire: ["red", "orange", "pink", "purple"],
  Earth: ["yellow", "beige", "brown"],
  Metal: ["white", "gold", "silver", "grey"],
  Water: ["black", "navy", "dark blue"],
};

const ELEMENT_NUMBERS = {
  Water: [1, 6],
  Fire: [2, 7],
  Wood: [3, 8],
  Metal: [4, 9],
  Earth: [5, 0],
};

const SECTOR_NOTES = {
  taiSui: "avoid sitting or working facing straight into this part this year, and leave renovation here until next year",
  suiPo: "fine to face, but leave renovation or knocking work in this part of your home until next year",
  threeKillings: "fine to face, but avoid sitting with your back to it and leave renovation here until next year",
};

const formatDegrees = ({ from, to }) => `${from}°–${to}°`;

export function buildLuckyElementsV1({ usefulGod, eightMansions, taiSui, selectedYear } = {}) {
  const enhance = [...new Set([...(usefulGod?.favourableElements || []), ...(usefulGod?.secondaryFavourableElements || [])])];
  if (!enhance.length) return null;
  const caution = (usefulGod?.cautionElements || []).filter((element) => !enhance.includes(element));

  const directions = (eightMansions?.favourableDirections || []).map((item) => ({
    ...item,
    yearNotes: (taiSui?.sectors || [])
      .filter((sector) => sector.direction === item.direction)
      .map((sector) => ({
        key: sector.key,
        zh: sector.zh,
        label: sector.label,
        degrees: formatDegrees(sector.degrees),
        text: SECTOR_NOTES[sector.key],
      })),
  }));

  return {
    version: VERSION,
    year: selectedYear || taiSui?.year || null,
    colours: enhance.map((element) => ({ element, colours: ELEMENT_COLOURS[element] })),
    cautionColours: caution.map((element) => ({ element, colours: ELEMENT_COLOURS[element] })),
    numbers: enhance.map((element) => ({ element, numbers: ELEMENT_NUMBERS[element] })),
    cautionNumbers: caution.map((element) => ({ element, numbers: ELEMENT_NUMBERS[element] })),
    directions,
    avoidDirections: eightMansions?.unfavourableDirections || [],
    yearSectors: (taiSui?.sectors || []).map((sector) => ({ ...sector, degrees: formatDegrees(sector.degrees), text: SECTOR_NOTES[sector.key] })),
  };
}

export default buildLuckyElementsV1;
