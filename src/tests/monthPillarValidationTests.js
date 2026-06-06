import { buildBaziChart } from "../engine/buildBaziChart.js";

const tests = [
  {
    name: "Joshua",
    birthDate: "1999-01-26",
    birthTime: "22:00",
    expected: "乙丑",
  },

  {
    name: "Ma Weini",
    birthDate: "1982-08-15",
    birthTime: "21:00",
    expected: "戊申",
  },

  {
    name: "Suyin C",
    birthDate: "1987-12-03",
    birthTime: "03:45",
    expected: "辛亥",
  },

  {
    name: "Yue Qing Amanda",
    birthDate: "1986-09-07",
    birthTime: "00:00",
    expected: "丙申",
  },

  {
    name: "Wong Lee Lee",
    birthDate: "1980-03-06",
    birthTime: null,
    expected: "己卯",
  },
];

for (const test of tests) {
  const chart = buildBaziChart({
    birthDate: test.birthDate,
    birthTime: test.birthTime,
    useBirthTime: !!test.birthTime,
    gender: "female",
    birthCountry: "Singapore",
  });

  const actual =
    chart?.pillars?.month?.stem?.zh +
    chart?.pillars?.month?.branch?.zh;

  console.log({
    name: test.name,
    expected: test.expected,
    actual,
    pass: actual === test.expected,
  });
}