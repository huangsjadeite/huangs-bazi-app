import { getProfileDisplay } from "../../data/profileDisplay";
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

const READ_STYLE = {
  favourable: { badge: "bg-emerald-100 text-emerald-800", label: "Favourable" },
  supported:  { badge: "bg-teal-100 text-teal-700",      label: "Supported"  },
  caution:    { badge: "bg-amber-100 text-amber-800",     label: "Caution"    },
  neutral:    { badge: "bg-slate-100 text-slate-600",     label: "Neutral"    },
};

export default function LuckPillarsSection({ luckPillars, usefulGod, elementalBalance, birthDate }) {
  if (!luckPillars?.pillars?.length) return null;

  // Compute client's current age to highlight the active pillar
  const birthYear = birthDate ? Number(birthDate.split("-")[0]) : null;
  const birthMonth = birthDate ? Number(birthDate.split("-")[1]) : null;
  const now = new Date();
  const currentAge = birthYear
    ? now.getFullYear() - birthYear - (now.getMonth() + 1 < birthMonth ? 1 : 0)
    : null;

  const primaryEl = usefulGod.primaryUsefulGod;
  const secondaryEl = usefulGod.secondaryUsefulGod;

  function pillarRead(stemElement) {
    if (stemElement === primaryEl) return "favourable";
    if (stemElement === secondaryEl) return "supported";
    // Elements that produce or are produced by the useful god are broadly neutral;
    // elements that clash or drain it lean caution. Keep it simple: anything
    // that isn't a useful-god element is caution if it's in the top-2 strongest
    // natal elements (already excess in the chart).
    const strongEls = elementalBalance
      .slice(0, 2)
      .map((e) => e.name);
    if (strongEls.includes(stemElement)) return "caution";
    return "neutral";
  }

  const primaryUsefulEl = usefulGod.primaryUsefulGod || null;

  return (
    <AdminReportSection icon="📈" title="Luck Pillars (大運)">
      <p className="mt-3 text-base leading-7 text-stone-600">
        Luck Pillars are 10-year energy cycles that map the broader seasons of your life. Each pillar brings a different elemental emphasis that colours your career, relationships, wealth and personal growth during that period. Knowing which pillar you are currently in helps you work with the energy of your season rather than against it — some pillars accelerate growth, others call for consolidation, and understanding the difference allows you to pace yourself wisely.
      </p>
      <p className="mt-2 text-sm text-stone-400">
        Cycles begin from age {luckPillars.startingAge.years}y{luckPillars.startingAge.months}m, stepping{" "}
        {luckPillars.direction === "forward" ? "forward" : "in reverse"}{" "}
        through the cycle from the month pillar.
        {currentAge !== null && ` Current age: ${currentAge}.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {elementalBalance.map((e) => (
          <span key={e.name} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-stone-600 border border-slate-200 print:bg-[#FAE5D3] print:border-[#e5d5c0]">
            <strong className="text-stone-800">{e.name}</strong> — {e.roleDescription}
          </span>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
              <th className="px-4 py-2.5">Age</th>
              <th className="px-4 py-2.5">Decade Energy</th>
              <th className="px-4 py-2.5">Read</th>
              <th className="px-4 py-2.5">Decade Theme</th>
              <th className="px-4 py-2.5">Wear & Display</th>
            </tr>
          </thead>
          <tbody>
            {luckPillars.pillars.map((p, i) => {
              const isCurrent = currentAge !== null &&
                currentAge >= p.startAge.years &&
                currentAge < p.endAge.years;
              const read = pillarRead(p.pillar.stem.element);
              const rs = READ_STYLE[read];
              const theme = TEN_GOD_THEME[p.tenGod] || null;
              const recEl = read === "Caution" && primaryUsefulEl ? primaryUsefulEl : p.pillar.stem.element;
              const wearText = ELEMENT_WEAR[recEl] || "—";
              const displayText = ELEMENT_DISPLAY[recEl] || "—";
              const wearNote = read === "Caution" && primaryUsefulEl
                ? `Support with your Useful God (${primaryUsefulEl}). Wear ${wearText}. Display ${displayText}.`
                : `Wear ${wearText}. Display ${displayText}.`;
              return (
                <tr
                  key={i}
                  className={`border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3] ${isCurrent ? "bg-amber-50 print:bg-[#FAE5D3]" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {p.startAge.years}y–{p.endAge.years}y
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white print:bg-[#8B1A1A]">
                        NOW
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-stone-800">{p.pillar.stem.element}</span>
                    {getProfileDisplay(p.tenGod)?.name && (
                      <span className="text-stone-500"> · {getProfileDisplay(p.tenGod).name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${rs.badge}`}>
                      {rs.label}
                    </span>
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
    </AdminReportSection>
  );
}
