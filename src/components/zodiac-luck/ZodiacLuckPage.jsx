// Admin-only Zodiac Luck tool (?admin=…&tool=zodiac): general luck scores for
// all 12 signs in a chosen year, from zodiacLuckV1. Separate from the report.

import { useMemo, useState } from "react";
import { adminToolHref } from "../../config/adminAccess";
import { AREAS, buildZodiacLuckV1 } from "../../engine/zodiacLuckV1";

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);
const SORTS = ["overall", ...AREAS];
const LABEL = { overall: "Overall", wealth: "Wealth", career: "Career", love: "Relationships", health: "Health" };
// Order of the advice toggles.
const ADVICE_AREAS = ["wealth", "health", "career", "love"];

const TIERS = [
  { min: 70, label: "Push", bar: "bg-emerald-700", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { min: 50, label: "Steady", bar: "bg-stone-400", chip: "bg-stone-50 text-stone-700 border-stone-200" },
  { min: -Infinity, label: "Protect", bar: "bg-[#9B2C2C]", chip: "bg-red-50 text-red-800 border-red-200" },
];
const tierOf = (score) => TIERS.find((t) => score >= t.min);

const RATING_STYLE = {
  Excellent: "bg-emerald-100 text-emerald-900",
  Good: "bg-green-50 text-green-800",
  Mixed: "bg-stone-100 text-stone-600",
  Challenging: "bg-amber-50 text-amber-800",
  Difficult: "bg-red-100 text-red-800",
};

const signed = (v) => `${v > 0 ? "+" : ""}${v}`;

function downloadCsv(luck) {
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    ["Sign", "Chinese", "Overall", "Wealth", "Career", "Relationships", "Health", "Best money months", "Months to watch",
      ...luck.signs[0].months.map((m) => m.month),
      "General advice", ...ADVICE_AREAS.map((area) => `${LABEL[area]} advice`)],
    ...luck.signs.map((s) => [
      s.sign.animal, s.sign.zh, s.scores.overall, s.scores.wealth, s.scores.career, s.scores.love, s.scores.health,
      s.bestMoneyMonths.join(", "), s.watchMonths.join(", "), ...s.months.map((m) => m.rating),
      s.advice.general, ...ADVICE_AREAS.map((area) => s.advice[area]),
    ]),
  ];
  const blob = new Blob(["﻿" + rows.map((r) => r.map(quote).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `zodiac-luck-${luck.year}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function ScoreBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 rounded-full bg-stone-100">
        <div className={`h-2.5 rounded-full ${tierOf(score).bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-7 text-right text-sm font-bold tabular-nums text-slate-900">{score}</span>
    </div>
  );
}

function RankingTable({ luck, sortBy, onSort }) {
  const signs = [...luck.signs].sort((a, b) => b.scores[sortBy] - a.scores[sortBy] || b.scores.overall - a.scores.overall);
  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-100 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-amber-100 text-xs uppercase tracking-[0.14em] text-stone-500">
            <th className="px-4 py-3 font-semibold">#</th>
            <th className="px-2 py-3 font-semibold">Sign</th>
            {SORTS.map((key) => (
              <th key={key} className="px-2 py-3">
                <button
                  type="button"
                  onClick={() => onSort(key)}
                  className={`font-semibold uppercase tracking-[0.14em] ${sortBy === key ? "text-[#8B1A1A] underline underline-offset-4" : "hover:text-slate-900"}`}
                >
                  {LABEL[key]}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Best money months</th>
          </tr>
        </thead>
        <tbody>
          {signs.map((s, i) => (
            <tr key={s.sign.key} className="border-b border-stone-100 last:border-0">
              <td className="px-4 py-2.5 text-stone-400 tabular-nums">{i + 1}</td>
              <td className="whitespace-nowrap px-2 py-2.5">
                <a href={`#sign-${s.sign.key}`} className="font-semibold text-slate-900 hover:underline">
                  {s.sign.animal}
                </a>{" "}
                <span className="text-[#8B1A1A]">{s.sign.zh}</span>
              </td>
              {SORTS.map((key) => (
                <td key={key} className={`px-2 py-2.5 ${key === "overall" ? "w-40" : "w-28"}`}>
                  <ScoreBar score={s.scores[key]} />
                </td>
              ))}
              <td className="whitespace-nowrap px-4 py-2.5 text-stone-700">{s.bestMoneyMonths.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignCard({ s, shownAreas }) {
  const tier = tierOf(s.scores.overall);
  return (
    <section id={`sign-${s.sign.key}`} className="scroll-mt-6 rounded-2xl border border-amber-100 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold text-slate-950">
          {s.sign.animal} <span className="text-[#8B1A1A]">{s.sign.zh}</span>
          <span className="ml-2 text-sm font-normal text-stone-500">{s.sign.element}</span>
        </h3>
        <span className={`rounded-full border px-3 py-0.5 text-sm font-bold ${tier.chip}`}>
          {tier.label} · {s.scores.overall}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        {AREAS.map((area) => (
          <div key={area}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{LABEL[area]}</p>
            <ScoreBar score={s.scores[area]} />
          </div>
        ))}
      </div>

      <p className="mt-4 text-base leading-7 text-stone-800">{s.advice.general}</p>
      {ADVICE_AREAS.filter((area) => shownAreas.includes(area)).map((area) => (
        <div key={area} className="mt-3 rounded-xl bg-[#FBF6EE] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8B1A1A]">{LABEL[area]}</p>
          <p className="mt-1 text-sm leading-6 text-stone-700">{s.advice[area]}</p>
        </div>
      ))}

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Why</p>
      <ul className="mt-1 space-y-0.5 text-sm text-stone-700">
        {s.reasons.map((r) => (
          <li key={r.why}>
            <span className="text-stone-500">{r.layer}:</span> {r.why}{" "}
            <span className="text-stone-400">
              ({Object.entries(r.pts).filter(([, v]) => v).map(([k, v]) => `${LABEL[k]} ${signed(v)}`).join(", ")})
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Month by month</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6 lg:grid-cols-12">
        {s.months.map((m) => (
          <div
            key={m.month}
            className={`rounded-lg px-2 py-1.5 text-center ${RATING_STYLE[m.rating]}`}
            title={`${m.span} · ${m.pillar}${m.notes.length ? ` · ${m.notes.join("; ")}` : ""}`}
          >
            <p className="text-xs font-bold">
              {m.month}
              {s.bestMoneyMonths.includes(m.month) && <span aria-label="best money month"> $</span>}
            </p>
            <p className="text-[11px]">{m.rating}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-stone-500">
        $ marks the 3 best money months. Hover a month for its dates and reasons.
        {s.watchMonths.length ? ` Months to watch: ${s.watchMonths.join(", ")}.` : ""}
      </p>
    </section>
  );
}

export default function ZodiacLuckPage() {
  const [year, setYear] = useState(2027);
  const [sortBy, setSortBy] = useState("overall");
  const [shownAreas, setShownAreas] = useState([]);
  const toggleArea = (area) =>
    setShownAreas((shown) => (shown.includes(area) ? shown.filter((a) => a !== area) : [...shown, area]));
  const luck = useMemo(() => buildZodiacLuckV1({ year }), [year]);

  return (
    <main className="min-h-screen bg-[#F7F3EB]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href={adminToolHref(null)} className="text-sm font-semibold text-amber-800 hover:underline">
            ← Back to readings
          </a>
          <span className="rounded-full border border-dashed border-[#8B1A1A] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
            Admin tool · not in the report
          </span>
        </div>

        <header className="rounded-2xl border border-amber-100 bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#8B1A1A]">Zodiac Luck</h1>
              <p className="mt-1 text-stone-600">
                {luck.year} is the {luck.yearName} year {luck.pillar}. Scores out of 100 for each birth-year sign.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-stone-700">
                Year{" "}
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="ml-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => downloadCsv(luck)}
                className="rounded-lg bg-[#8B1A1A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#741515]"
              >
                Download CSV
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-500">
            Each area starts at 60 and moves with how the sign meets Tai Sui, the 12 Year Gods, the year&rsquo;s stars and
            its elements. Push is 70 and above, Steady 50 to 69, Protect below 50. These are general forecasts by birth
            year only, and the point values are a draft for Barnabas to confirm. Click a column heading to rank by it.
          </p>
        </header>

        <RankingTable luck={luck} sortBy={sortBy} onSort={setSortBy} />

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-100 bg-white px-5 py-3">
          <span className="mr-1 text-sm font-semibold text-stone-700">Show advice for:</span>
          {ADVICE_AREAS.map((area) => {
            const on = shownAreas.includes(area);
            return (
              <button
                key={area}
                type="button"
                aria-pressed={on}
                onClick={() => toggleArea(area)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                  on ? "border-[#8B1A1A] bg-[#8B1A1A] text-white" : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                {on ? "✓ " : ""}
                {LABEL[area]}
              </button>
            );
          })}
          <span className="text-xs text-stone-500">General advice always shows.</span>
        </div>

        <div className="space-y-4">
          {luck.signs.map((s) => (
            <SignCard key={s.sign.key} s={s} shownAreas={shownAreas} />
          ))}
        </div>
      </div>
    </main>
  );
}
