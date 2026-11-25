// Personal directions from the Eight Mansions Gua (eightMansionsV1), with the
// reading year's Tai Sui / Year Breaker / Three Killings notes from
// luckyElementsV1. Both PDFs.

import { AdminReportSection } from "./shared";

const KEEP = { breakInside: "avoid" };
const EXACT = { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" };
const HEADING = "keep-with-next text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]";

// Plain-language meaning of each direction, wealth first.
const FAVOURABLE = {
  "Sheng Qi": {
    short: "Wealth",
    title: "Your wealth & success direction",
    use: "Face this way when you work, sell, negotiate, sign or ask for money. Point your desk and your shop or office counter this way if you can.",
  },
  "Tian Yi": {
    short: "Health",
    title: "Your health & helpers direction",
    use: "Sleep with the top of your head pointing this way to rest and recover. Good for meeting doctors, mentors and people who can help you.",
  },
  "Yan Nian": {
    short: "Love",
    title: "Your relationships direction",
    use: "Face this way for important talks with your partner, family or business partners. Good for the bedroom and for building trust.",
  },
  "Fu Wei": {
    short: "Clarity",
    title: "Your clarity & growth direction",
    use: "Face this way to think clearly, study, plan or meditate. Good before an exam, an interview or a big decision.",
  },
};

const UNFAVOURABLE = {
  "Huo Hai": "small setbacks and wasted effort",
  "Wu Gui": "disputes, gossip and money leaks",
  "Liu Sha": "misunderstandings and relationship friction",
  "Jue Ming": "your most draining direction, for both money and health",
};

const COMPASS = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
const SHORT = { North: "N", Northeast: "NE", East: "E", Southeast: "SE", South: "S", Southwest: "SW", West: "W", Northwest: "NW" };

function polar(deg, r) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
}

// Eight-sector compass, North at the top like a phone compass. Favourable
// sectors are green and labelled with what they help; unfavourable are pale red.
function CompassRose({ favourable, unfavourable }) {
  const good = Object.fromEntries(favourable.map((item) => [item.direction, item]));
  const bad = new Set(unfavourable.map((item) => item.direction));

  return (
    <svg viewBox="0 0 200 200" className="h-52 w-52 shrink-0" style={EXACT} aria-label="Your personal directions compass">
      {COMPASS.map((direction, i) => {
        const centre = i * 45;
        const [x1, y1] = polar(centre - 22.5, 92);
        const [x2, y2] = polar(centre + 22.5, 92);
        const item = good[direction];
        const isWealth = item?.name === "Sheng Qi";
        const fill = isWealth ? "#2E7D32" : item ? "#C8E6C9" : bad.has(direction) ? "#FBE3E3" : "#F5F5F4";
        const [lx, ly] = polar(centre, 68);
        const [tx, ty] = polar(centre, 44);
        return (
          <g key={direction}>
            <path d={`M100,100 L${x1},${y1} A92,92 0 0,1 ${x2},${y2} Z`} fill={fill} stroke="#FFFFFF" strokeWidth="2" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={isWealth ? "#FFFFFF" : "#1F2937"}>
              {SHORT[direction]}
            </text>
            {item && (
              <text x={tx} y={ty + 3} textAnchor="middle" fontSize="8.5" fontWeight="600" fill={isWealth ? "#FFFFFF" : "#1B5E20"}>
                {FAVOURABLE[item.name]?.short}
              </text>
            )}
          </g>
        );
      })}
      <circle cx="100" cy="100" r="16" fill="#FFFFFF" stroke="#8B1A1A" strokeWidth="1.5" />
      <polygon points="100,88 96,100 104,100" fill="#C62828" />
      <polygon points="100,112 96,100 104,100" fill="#9CA3AF" />
    </svg>
  );
}

function YearNotes({ notes, year }) {
  return notes.map((note) => (
    <p key={note.key} className="mt-1 text-sm leading-6 text-red-700">
      In {year || "this year"}, the {note.label} ({note.zh}) also sits in this direction, at {note.degrees}: {note.text}.
    </p>
  ));
}

export default function PersonalDirectionsSection({ eightMansions, luckyElements }) {
  if (!eightMansions) return null;
  const favourable = (luckyElements?.directions?.length ? luckyElements.directions : eightMansions.favourableDirections).map(
    (item) => ({ ...item, yearNotes: item.yearNotes || [] })
  );
  const unfavourable = eightMansions.unfavourableDirections || [];
  const wealth = favourable.find((item) => item.name === "Sheng Qi");
  const others = favourable.filter((item) => item !== wealth);
  const year = luckyElements?.year;
  const hasYearNotes = favourable.some((item) => item.yearNotes.length);

  return (
    <AdminReportSection
      icon="🧭"
      title="Your Personal Directions"
      lead={
        <>
          <p className="mt-3 text-base leading-7 text-stone-700">
            Your birth year and gender give you a personal Gua number, and with it four directions that support you and
            four that drain you. These stay the same for life. Turning your desk, your bed or your seat in a meeting
            towards a good direction is one of the simplest ways to put the odds on your side.
          </p>

          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start" style={KEEP}>
            <CompassRose favourable={favourable} unfavourable={unfavourable} />
            <div className="w-full">
              {wealth && (
                <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-5 py-4" style={EXACT}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">{FAVOURABLE["Sheng Qi"].title}</p>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-900">{wealth.direction}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-800">{FAVOURABLE["Sheng Qi"].use}</p>
                  <YearNotes notes={wealth.yearNotes} year={year} />
                </div>
              )}
              <p className="mt-3 text-sm leading-6 text-stone-500">
                Your Gua: {eightMansions.gua} ({eightMansions.trigram} {eightMansions.trigramZh}, {eightMansions.element}) ·{" "}
                {eightMansions.group}
              </p>
            </div>
          </div>
        </>
      }
    >
      <div className="mt-5">
        <p className={HEADING} style={KEEP}>Your other good directions</p>
        {others.map((item) => (
          <div key={item.name} className="border-t border-slate-100 py-2.5" style={KEEP}>
            <p className="text-base text-slate-900">
              <strong>{item.direction}</strong>{" "}
              <span className="text-stone-500">· {FAVOURABLE[item.name]?.title} ({item.name})</span>
            </p>
            <p className="text-sm leading-6 text-stone-700">{FAVOURABLE[item.name]?.use}</p>
            <YearNotes notes={item.yearNotes} year={year} />
          </div>
        ))}
      </div>

      {!!unfavourable.length && (
        <div className="mt-5" style={KEEP}>
          <p className={HEADING}>Directions to avoid facing</p>
          <p className="mt-1.5 text-sm leading-6 text-stone-700">
            Try not to face these when you work, sign, negotiate or sleep. Walking through them or using them for storage
            is fine.
          </p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-stone-700">
            {unfavourable.map((item) => (
              <li key={item.name}>
                <strong className="text-slate-900">{item.direction}</strong>: {UNFAVOURABLE[item.name]} ({item.name})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-stone-600 print:border-[#e5d5c0] print:bg-[#FAF3EF]" style={{ ...KEEP, ...EXACT }}>
        <p className="font-semibold text-stone-800">How to find your directions</p>
        <p className="mt-1">
          Open the Compass app on your phone and hold it flat. Stand where you sit or sleep and turn until the compass
          shows your direction. &ldquo;Facing&rdquo; means the way your face points when you are seated; for sleep, it is
          the way the top of your head points.
          {hasYearNotes && year ? ` The red notes above apply to ${year} only.` : ""}
        </p>
      </div>
    </AdminReportSection>
  );
}
