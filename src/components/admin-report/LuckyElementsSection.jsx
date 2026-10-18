// Lucky colours, numbers and directions for the reading year, from
// luckyElementsV1. Upgraded PDF only.

import { AdminReportSection } from "./shared";

const KEEP = { breakInside: "avoid" };
const HEADING = "text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]";

const SWATCH = {
  green: "#2E7D32", teal: "#00897B",
  red: "#C62828", orange: "#EF6C00", pink: "#EC407A", purple: "#7B1FA2",
  yellow: "#F9A825", beige: "#D7C4A3", brown: "#795548",
  white: "#FFFFFF", gold: "#C9A227", silver: "#BDBDBD", grey: "#757575",
  black: "#212121", navy: "#1A237E", "dark blue": "#1565C0",
};

// How to use each Eight Mansions direction day to day.
const DIRECTION_USE = {
  "Sheng Qi": "Face this way when you work, study, negotiate or sign. Your best direction for career and money.",
  "Tian Yi": "Sleep with the top of your head pointing this way to rest and recover.",
  "Yan Nian": "Good for the bedroom and for important talks with your partner or family.",
  "Fu Wei": "Face this way to think clearly, meditate or prepare for an exam.",
};

function Swatches({ colours }) {
  return (
    <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
      {colours.map((colour) => (
        <span key={colour} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full border border-slate-300"
            style={{ backgroundColor: SWATCH[colour], printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
          />
          {colour}
        </span>
      ))}
    </span>
  );
}

function ElementRow({ element, children }) {
  return (
    <div className="grid grid-cols-[1fr_4fr] border-t border-slate-100 py-2 text-sm" style={KEEP}>
      <p className="pr-3 font-semibold text-slate-900">{element}</p>
      <div className="text-stone-700">{children}</div>
    </div>
  );
}

function DirectionRow({ item }) {
  return (
    <div className="border-t border-slate-100 py-2 text-sm" style={KEEP}>
      <p>
        <strong className="text-slate-900">{item.direction}</strong>{" "}
        <span className="text-stone-500">
          ({item.name} {item.label}, {item.theme})
        </span>
      </p>
      <p className="text-stone-700">{DIRECTION_USE[item.name]}</p>
      {item.yearNotes.map((note) => (
        <p key={note.key} className="mt-0.5 text-red-700">
          This year {note.zh} {note.label} sits at {note.degrees} within this direction: {note.text}.
        </p>
      ))}
    </div>
  );
}

export default function LuckyElementsSection({ luckyElements }) {
  if (!luckyElements) return null;
  const { year, colours, cautionColours, numbers, cautionNumbers, directions, avoidDirections } = luckyElements;
  const [firstColour, ...restColours] = colours;
  const [firstDirection, ...restDirections] = directions;

  return (
    <AdminReportSection icon="🍀" title={`Lucky Colours, Numbers & Directions${year ? ` for ${year}` : ""}`}>
      <p className="mt-3 text-base leading-7 text-stone-700">
        Small, everyday ways to bring in your Elements to Enhance: what you wear, the numbers you choose and the way
        you face. None of these replace good decisions, but they help tilt the year your way.
      </p>

      <div className="mt-5">
        <div style={KEEP}>
          <p className={HEADING}>Your lucky colours</p>
          <p className="mt-1.5 text-sm leading-6 text-stone-700">
            Wear them, carry them or use them at home and work. They are listed in order of how much they help you.
          </p>
          <div className="mt-2">
            <ElementRow element={firstColour.element}>
              <Swatches colours={firstColour.colours} />
            </ElementRow>
          </div>
        </div>
        {restColours.map((row) => (
          <ElementRow key={row.element} element={row.element}>
            <Swatches colours={row.colours} />
          </ElementRow>
        ))}
        {!!cautionColours.length && (
          <p className="mt-2 text-sm leading-6 text-stone-600" style={KEEP}>
            <strong>Go easy on:</strong>{" "}
            {cautionColours.map((row) => `${row.colours.join(", ")} (${row.element})`).join("; ")}. Fine in small
            touches, but don&rsquo;t make them your main colours.
          </p>
        )}
      </div>

      <div className="mt-5" style={KEEP}>
        <p className={HEADING}>Your lucky numbers</p>
        <p className="mt-1.5 text-sm leading-6 text-stone-700">
          {numbers.map((row) => `${row.numbers.join(" and ")} (${row.element})`).join("; ")}. Use them for phone and
          car numbers, unit numbers, dates and prices where you have a choice.
          {!!cautionNumbers.length &&
            ` Numbers to go easy on: ${cautionNumbers.map((row) => `${row.numbers.join(" and ")} (${row.element})`).join("; ")}.`}
        </p>
      </div>

      {firstDirection ? (
        <div className="mt-5">
          <div style={KEEP}>
            <p className={HEADING}>Your lucky directions</p>
            <p className="mt-1.5 text-sm leading-6 text-stone-700">
              From your personal Gua (see Eight Mansions). Use a compass and face these directions for the activities
              shown.
            </p>
            <div className="mt-2">
              <DirectionRow item={firstDirection} />
            </div>
          </div>
          {restDirections.map((item) => (
            <DirectionRow key={item.name} item={item} />
          ))}
          {!!avoidDirections.length && (
            <p className="mt-2 text-sm leading-6 text-stone-600" style={KEEP}>
              <strong>Try not to face:</strong> {avoidDirections.map((d) => d.direction).join(", ")} for important
              work, meetings or sleep.
            </p>
          )}
        </div>
      ) : null}
    </AdminReportSection>
  );
}
