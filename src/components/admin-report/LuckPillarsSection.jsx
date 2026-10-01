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
  Fire:  "red jadeite or red garnet",
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

const DETAIL_AREAS = [
  ["career", "Career"],
  ["wealth", "Wealth"],
  ["relationship", "Relationships"],
  ["health", "Health"],
];

function KeyYearList({ label, years, tone }) {
  if (!years?.length) return null;
  return (
    <div>
      <dt className={`text-xs font-bold uppercase tracking-[0.14em] ${tone}`}>{label}</dt>
      <dd className="text-stone-700">
        {years.map((y) => (
          <span key={y.year} className="block">
            <strong>{y.year}</strong> {y.zh} {y.animal} (age {y.age}): {y.reason}.
          </span>
        ))}
      </dd>
    </div>
  );
}

function DecadeExtras({ details }) {
  const { energy, undercurrent, voidNote, stars, keyYears } = details;
  const hasYears = keyYears?.best?.length || keyYears?.watch?.length;
  if (!energy && !undercurrent && !voidNote && !stars?.length && !hasYears) return null;
  return (
    <dl className="mt-3 grid gap-x-5 gap-y-2.5 border-t border-slate-200 pt-3 text-sm leading-6 md:grid-cols-2 print:grid-cols-2">
      {energy && (
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">Personal energy</dt>
          <dd className="text-stone-700">{energy}</dd>
        </div>
      )}
      {(undercurrent || voidNote) && (
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">Hidden influences</dt>
          <dd className="text-stone-700">{[undercurrent, voidNote].filter(Boolean).join(" ")}</dd>
        </div>
      )}
      {stars?.length > 0 && (
        <div className="md:col-span-2 print:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">Stars activated</dt>
          <dd className="text-stone-700">
            {stars.map((s) => <span key={s} className="block">{s}</span>)}
          </dd>
        </div>
      )}
      <KeyYearList label="Best years" years={keyYears?.best} tone="text-emerald-700 print:text-[#2f6b3a]" />
      <KeyYearList label="Years to watch" years={keyYears?.watch} tone="text-rose-700 print:text-[#8B1A1A]" />
    </dl>
  );
}

export default function LuckPillarsSection({ luckPillars, luckTimeline, usefulGod, ageInSelectedYear, selectedYear }) {
  if (!luckTimeline?.length) return null;

  const primaryUsefulEl = usefulGod.primaryUsefulGod || null;
  const { startingAge, direction } = luckPillars;

  return (
    <AdminReportSection icon="📈" title="10-Year Luck Pillars (大运)">
      <p className="mt-3 text-base leading-7 text-stone-700">
        A Luck Pillar is a 10-year season of life. Each one brings in a new element that sits alongside
        your birth chart for the whole decade, so it colours career, money, relationships and health all at once.
        Its top character shapes the first five years and its bottom character the last five. Halves that bring
        in an Element to Enhance tend to feel like a tailwind; halves that add more of what your chart already has
        plenty of feel like a headwind, and call for pacing rather than pushing.
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Your first Luck Pillar began at age {startingAge.years} {startingAge.years === 1 ? "year" : "years"}{" "}
        {startingAge.months} {startingAge.months === 1 ? "month" : "months"}. Before that,
        your month of birth sets the tone. The pillars then step {direction === "forward" ? "forward" : "backward"}{" "}
        through the 60-pillar cycle from your month pillar; the direction depends on gender and birth year.
        {ageInSelectedYear !== null && ` You turn ${ageInSelectedYear} in ${selectedYear}.`}
      </p>

      <div style={{ breakInside: "avoid" }}>
        <LuckReadLegend usefulGod={usefulGod} />
      </div>

      <div className="mt-4 space-y-4">
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
            <div
              key={i}
              className={`rounded-2xl border p-4 print:rounded-none ${p.isCurrent ? "border-amber-400 bg-amber-50 print:border-[#8B1A1A] print:bg-[#FAE5D3]" : "border-slate-200 print:border-[#e5d5c0]"}`}
              style={{ breakInside: "avoid" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-bold text-slate-900">
                  Age {p.startAge.years}–{p.endAge.years}
                  {p.details?.fromYear && (
                    <span className="ml-1 text-sm font-normal text-stone-500">({p.details.fromYear}–{p.details.toYear})</span>
                  )}
                  <span className="ml-2">{p.pillar.stem.zh}{p.pillar.branch.zh}</span>
                  <span className="ml-2 text-base font-semibold text-stone-700">
                    {p.pillar.stem.element} / {p.pillar.branch.element}
                  </span>
                  {getProfileDisplay(p.tenGod)?.name && (
                    <span className="text-base font-normal text-stone-500"> · {getProfileDisplay(p.tenGod).name}</span>
                  )}
                </p>
                {p.isCurrent && (
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white print:bg-[#8B1A1A]">
                    NOW
                  </span>
                )}
              </div>
              <div className="text-sm">
                <LuckHalves halves={p.halves} />
              </div>
              {p.details?.overview && (
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{p.details.overview}</p>
              )}
              {theme && <p className="mt-1 text-sm leading-6 text-stone-700">{theme}</p>}
              {p.details && (
                <dl className="mt-3 grid gap-x-5 gap-y-2.5 text-sm leading-6 md:grid-cols-2 print:grid-cols-2">
                  {DETAIL_AREAS.map(([key, label]) =>
                    p.details[key] ? (
                      <div key={key}>
                        <dt className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">{label}</dt>
                        <dd className="text-stone-700">{p.details[key]}</dd>
                      </div>
                    ) : null
                  )}
                </dl>
              )}
              {p.details && <DecadeExtras details={p.details} />}
              <p className="mt-3 border-t border-slate-200 pt-2 text-xs leading-5 text-stone-500">
                <strong className="text-stone-600">Wear &amp; display:</strong> {wearNote}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Ages are exact ages, not Chinese nominal ages (虚岁), which run one year higher.
      </p>
    </AdminReportSection>
  );
}
