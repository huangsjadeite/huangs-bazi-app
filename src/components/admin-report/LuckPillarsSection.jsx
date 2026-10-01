import { getProfileDisplay } from "../../data/profileDisplay";
import { LuckHalves, LuckReadBadge, LuckReadLegend } from "./LuckCyclesSection";
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

// Decade cards may run across a page in the PDF; each labelled block stays
// whole instead, so pages fill up rather than leaving gaps.
const KEEP = { breakInside: "avoid" };

function Block({ label, tone = "text-amber-700 print:text-[#8B1A1A]", className = "", children }) {
  return (
    <div className={className} style={KEEP}>
      <dt className={`text-xs font-bold uppercase tracking-[0.14em] ${tone}`}>{label}</dt>
      <dd className="text-stone-700">{children}</dd>
    </div>
  );
}

function yearLines(years) {
  return years.map((y) => (
    <span key={y.year} className="block">
      <strong>{y.year}</strong> {y.zh} {y.animal} (age {y.age}): {y.reason}.
    </span>
  ));
}

const ROW = "grid gap-x-5 gap-y-2.5 md:grid-cols-2 print:grid-cols-2";

function DecadeExtras({ details }) {
  const { energy, undercurrent, voidNote, stars, keyYears } = details;
  const hidden = [undercurrent, voidNote].filter(Boolean).join(" ");
  const best = keyYears?.best || [];
  const watch = keyYears?.watch || [];
  if (!energy && !hidden && !stars?.length && !best.length && !watch.length) return null;
  return (
    <dl className="mt-3 space-y-2.5 border-t border-slate-200 pt-3 text-sm leading-6">
      {(energy || hidden) && (
        <div className={ROW}>
          {energy && <Block label="Personal energy">{energy}</Block>}
          {hidden && <Block label="Hidden influences">{hidden}</Block>}
        </div>
      )}
      {stars?.length > 0 && (
        <Block label="Stars activated">
          {stars.map((star) => <span key={star} className="block">{star}</span>)}
        </Block>
      )}
      {(best.length > 0 || watch.length > 0) && (
        <div className={ROW}>
          {best.length > 0 && (
            <Block label="Best years" tone="text-emerald-700 print:text-[#2f6b3a]">{yearLines(best)}</Block>
          )}
          {watch.length > 0 && (
            <Block label="Years to watch" tone="text-rose-700 print:text-[#8B1A1A]">{yearLines(watch)}</Block>
          )}
        </div>
      )}
    </dl>
  );
}

const CARD_GUIDE = [
  ["Heading", "The ages and calendar years the decade covers, its two characters and their elements, and the archetype it brings out (see the 10 Energy Archetypes table at the end)."],
  ["Age lines", "The top character shapes the first five years and the bottom character the last five. The tag beside each says whether that half helps you or asks for care, using the key above."],
  ["Bold line", "The decade in one sentence, and how to make the most of it."],
  ["Career, Wealth, Relationships, Health", "What the decade is likely to bring in each area of life."],
  ["Personal energy", "How energetic and confident you are likely to feel during the decade."],
  ["Hidden influences", "Quieter energies inside the decade that surface now and then, and any part of it that feels less solid than it looks."],
  ["Stars activated", "Special stars the decade switches on, such as helpful people, study luck, romance or travel."],
  ["Best years / Years to watch", "The specific calendar years in the decade that are most supportive, and the ones that call for extra care, with the reason for each."],
  ["Wear & display", "Jadeite, crystals and decor that balance the decade's energy."],
];

function DecadesAtAGlance({ luckTimeline }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-2xl border border-slate-200 print:overflow-visible print:rounded-none">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-left text-xs uppercase tracking-[0.1em] text-stone-600 print:bg-[#FAE5D3]">
            <th className="px-3 py-2">Age</th>
            <th className="px-3 py-2">Years</th>
            <th className="px-3 py-2">Pillar</th>
            <th className="px-3 py-2">Archetype</th>
            <th className="px-3 py-2">First half</th>
            <th className="px-3 py-2">Second half</th>
          </tr>
        </thead>
        <tbody>
          {luckTimeline.map((p, i) => (
            <tr key={i} className={`border-t border-slate-100 ${p.isCurrent ? "bg-amber-50 font-semibold print:bg-[#FAE5D3]" : ""}`}>
              <td className="px-3 py-1.5 whitespace-nowrap">
                {p.startAge.years}–{p.endAge.years}
                {p.isCurrent && <span className="ml-1 text-xs text-amber-700 print:text-[#8B1A1A]">now</span>}
              </td>
              <td className="px-3 py-1.5 whitespace-nowrap">{p.details?.fromYear ? `${p.details.fromYear}–${p.details.toYear}` : "—"}</td>
              <td className="px-3 py-1.5 whitespace-nowrap">{p.pillar.stem.zh}{p.pillar.branch.zh}</td>
              <td className="px-3 py-1.5">{getProfileDisplay(p.tenGod)?.name || p.tenGod}</td>
              {[0, 1].map((h) => (
                <td key={h} className="px-3 py-1.5">{p.halves[h] && <LuckReadBadge read={p.halves[h].read} />}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardGuide() {
  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 print:rounded-none print:border-[#e5d5c0] print:bg-transparent" style={KEEP}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">How to read each decade card</p>
      <dl className="mt-1.5 grid gap-x-5 gap-y-1 text-sm leading-6 text-stone-700 md:grid-cols-2 print:grid-cols-2">
        {CARD_GUIDE.map(([label, text]) => (
          <div key={label}>
            <dt className="inline font-bold text-slate-900">{label}: </dt>
            <dd className="inline">{text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        The card marked NOW is the decade you are in. A favourable decade is a time to push forward; a demanding one
        is a time to pace yourself, build skills and protect what you have, and it often lays the groundwork for the
        next good stretch.
      </p>
    </div>
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

      <div style={KEEP}>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">Key to the tags</p>
        <LuckReadLegend usefulGod={usefulGod} />
      </div>

      <div style={KEEP}>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]">Your decades at a glance</p>
        <DecadesAtAGlance luckTimeline={luckTimeline} />
      </div>

      <CardGuide />

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
            >
              <div style={KEEP}>
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
              </div>
              {p.details && (
                <dl className={`mt-3 text-sm leading-6 ${ROW}`}>
                  {DETAIL_AREAS.map(([key, label]) =>
                    p.details[key] ? <Block key={key} label={label}>{p.details[key]}</Block> : null
                  )}
                </dl>
              )}
              {p.details && <DecadeExtras details={p.details} />}
              <p className="mt-3 border-t border-slate-200 pt-2 text-xs leading-5 text-stone-500" style={KEEP}>
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
