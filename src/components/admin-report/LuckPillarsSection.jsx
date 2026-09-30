import { getProfileDisplay } from "../../data/profileDisplay";
import { LuckHalves, LuckReadLegend } from "./LuckCyclesSection";
import { AdminReportSection } from "./shared";

const TEN_GOD_THEME = {
  "Friend":           "A decade of peer connection, mutual support and building through relationships. Collaborative energy — shared goals and alliances matter most.",
  "Rob Wealth":       "A decade of competition, ambition and fighting for position. Drive is high but so is rivalry — stay focused on long-term strategy over short-term wins.",
  "Eating God":       "A decade of creative expression, skill-building and personal output. A productive window to develop expertise and share your work with the world.",
  "Hurting Officer":  "A decade of independence, innovation and breaking with convention. Strong drive to do things your own way — powerful if channelled, disruptive if unchecked.",
  "Direct Wealth":    "A decade oriented toward building tangible assets, financial discipline and steady, structured growth. Hard work pays off reliably during this period.",
  "Indirect Wealth":  "A decade of opportunity, opportunistic gains and wealth through non-traditional routes. Flexible thinking and timing matter more than routine effort.",
  "Direct Officer":   "A decade of responsibility, reputation and institutional advancement. Status and career structure are prominent — authority is earned through discipline.",
  "Seven Killings":   "A decade of pressure, intensity and ambition. Challenges are sharper here, but so is the drive to overcome them — breakthrough potential is high for those who persevere.",
  "Direct Resource":  "A decade of support, mentorship and learning. A nurturing period — help arrives from others, and investing in knowledge or credentials pays long-term dividends.",
  "Indirect Resource":"A decade of intuition, spiritual insight and unconventional wisdom. Less structured support, more inner-guided clarity — trust gut instinct over outside opinion.",
};

const ELEMENT_WEAR = {
  Wood:  "green jadeite or green aventurine",
  Fire:  "red jadeite or garnet",
  Earth: "yellow jadeite or citrine",
  Metal: "white jadeite or clear quartz",
  Water: "black jadeite or aquamarine",
};
const ELEMENT_DISPLAY = {
  Wood:  "plants or wooden decor",
  Fire:  "warm lighting or red accents",
  Earth: "crystal clusters or earthy ceramics",
  Metal: "metal ornaments or white crystals",
  Water: "a small water feature or dark stone decor",
};

export default function LuckPillarsSection({ luckPillars, luckTimeline, usefulGod, ageInSelectedYear, selectedYear }) {
  if (!luckTimeline?.length) return null;

  const primaryUsefulEl = usefulGod.primaryUsefulGod || null;
  const { startingAge, direction } = luckPillars;

  return (
    <AdminReportSection icon="📈" title="10-Year Luck Pillars (大运)">
      <p className="mt-3 text-base leading-7 text-stone-700">
        A Luck Pillar is a 10-year season of life. Each one brings in a new element that sits alongside the
        your birth chart for the whole decade, so it colours career, money, relationships and health all at once.
        Its top character shapes the first five years and its bottom character the last five. Halves that bring
        in an Element to Enhance tend to feel like a tailwind; halves that add more of what your chart already has
        plenty of feel like a headwind, and call for pacing rather than pushing.
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Your first Luck Pillar began at age {startingAge.years} years {startingAge.months} months. Before that,
        your month of birth sets the tone. The pillars then step {direction === "forward" ? "forward" : "backward"}{" "}
        through the 60-pillar cycle from your month pillar; the direction depends on gender and birth year.
        {ageInSelectedYear !== null && ` You turn ${ageInSelectedYear} in ${selectedYear}.`}
      </p>

      <div style={{ breakInside: "avoid" }}>
        <LuckReadLegend usefulGod={usefulGod} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
              <th className="px-4 py-2.5">Age</th>
              <th className="px-4 py-2.5">Pillar & Energy</th>
              <th className="px-4 py-2.5">Rating</th>
              <th className="px-4 py-2.5">What the Decade Brings</th>
              <th className="px-4 py-2.5">Wear & Display</th>
            </tr>
          </thead>
          <tbody>
            {luckTimeline.map((p, i) => {
              const theme = TEN_GOD_THEME[p.tenGod] || null;
              const hasCaution = p.halves.some((h) => h.read === "caution");
              const recEl = hasCaution && primaryUsefulEl ? primaryUsefulEl : p.pillar.stem.element;
              const wearText = ELEMENT_WEAR[recEl] || "—";
              const displayText = ELEMENT_DISPLAY[recEl] || "—";
              const wearNote = hasCaution && primaryUsefulEl
                ? `Balance it with your Element to Enhance (${primaryUsefulEl}). Wear ${wearText}. Display ${displayText}.`
                : `Wear ${wearText}. Display ${displayText}.`;
              return (
                <tr
                  key={i}
                  className={`border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3] ${p.isCurrent ? "bg-amber-50 print:bg-[#FAE5D3]" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {p.startAge.years}–{p.endAge.years}
                    {p.isCurrent && (
                      <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white print:bg-[#8B1A1A]">
                        NOW
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900">
                      {p.pillar.stem.zh}
                      {p.pillar.branch.zh}
                    </span>{" "}
                    <span className="font-semibold text-stone-800">{p.pillar.stem.element} / {p.pillar.branch.element}</span>
                    {getProfileDisplay(p.tenGod)?.name && (
                      <span className="text-stone-500"> · {getProfileDisplay(p.tenGod).name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <LuckHalves halves={p.halves} />
                  </td>
                  <td className="px-4 py-3 text-stone-600 leading-5">
                    {theme || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-500 leading-5">
                    {wearNote}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Ages are exact ages, not Chinese nominal ages (虚岁), which run one year higher.
      </p>
    </AdminReportSection>
  );
}
