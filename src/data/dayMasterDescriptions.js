// src/data/dayMasterDescriptions.js

export const DAYMASTER_DESCRIPTIONS = {
  JiaWood: {
    key: "JiaWood",
    stem: "甲",
    label: "Jia Wood",
    title: "The Tall Tree",
    summary:
      "You grow through vision, integrity and long-term purpose. You prefer meaningful progress over quick wins, and people often trust you when direction and principles are needed.",
  },

  YiWood: {
    key: "YiWood",
    stem: "乙",
    label: "Yi Wood",
    title: "The Flexible Vine",
    summary:
      "You grow through adaptability, relationships and creative problem-solving. You often find ways around obstacles by staying flexible, observant and quietly resourceful.",
  },

  BingFire: {
    key: "BingFire",
    stem: "丙",
    label: "Bing Fire",
    title: "The Sun",
    summary:
      "You shine through warmth, visibility and enthusiasm. Your presence can uplift others, especially when you share ideas openly and allow your natural brightness to be seen.",
  },

  DingFire: {
    key: "DingFire",
    stem: "丁",
    label: "Ding Fire",
    title: "The Candle",
    summary:
      "You influence through insight, sensitivity and emotional awareness. Your strength often comes from quiet impact, careful observation and the ability to bring warmth into subtle spaces.",
  },

  WuEarth: {
    key: "WuEarth",
    stem: "戊",
    label: "Wu Earth",
    title: "The Mountain",
    summary:
      "You create stability through reliability, responsibility and practical judgement. Others often look to you when decisions require strength and perspective.",
  },

  JiEarth: {
    key: "JiEarth",
    stem: "己",
    label: "Ji Earth",
    title: "The Garden Soil",
    summary:
      "You support growth through care, patience and nurturing. You often help people develop their potential while creating a sense of steadiness and harmony around you.",
  },

  GengMetal: {
    key: "GengMetal",
    stem: "庚",
    label: "Geng Metal",
    title: "The Sword",
    summary:
      "You value courage, honesty and decisive action. You naturally cut through confusion and focus on what truly matters, especially when situations require strength and clarity.",
  },

  XinMetal: {
    key: "XinMetal",
    stem: "辛",
    label: "Xin Metal",
    title: "The Jewel",
    summary:
      "You notice quality, refinement and details that others may miss. You are often drawn toward excellence, beauty and meaningful standards in both people and decisions.",
  },

  RenWater: {
    key: "RenWater",
    stem: "壬",
    label: "Ren Water",
    title: "The Ocean",
    summary:
      "You grow through exploration, ideas and possibility. Your adaptability allows you to navigate change, connect different perspectives and see the bigger picture.",
  },

  GuiWater: {
    key: "GuiWater",
    stem: "癸",
    label: "Gui Water",
    title: "The Rain",
    summary:
      "You influence through empathy, observation and emotional intelligence. You often understand people deeply, even when very little is said directly.",
  },
};

export function normalizeDayMasterKey(value) {
  if (!value) return "";

  return String(value)
    .replace(/[·\s_-]/g, "")
    .replace("甲", "Jia")
    .replace("乙", "Yi")
    .replace("丙", "Bing")
    .replace("丁", "Ding")
    .replace("戊", "Wu")
    .replace("己", "Ji")
    .replace("庚", "Geng")
    .replace("辛", "Xin")
    .replace("壬", "Ren")
    .replace("癸", "Gui");
}

export function getDayMasterDescription(value) {
  const key = normalizeDayMasterKey(value);

  return (
    DAYMASTER_DESCRIPTIONS[key] ||
    Object.values(DAYMASTER_DESCRIPTIONS).find((item) => {
      const labelKey = normalizeDayMasterKey(item.label);
      const stemKey = normalizeDayMasterKey(item.stem);

      return key.includes(labelKey) || key.includes(stemKey);
    }) ||
    null
  );
}