// Lucky colours and numbers for the reading year, from
// luckyElementsV1. Upgraded PDF only.

import { AdminReportSection } from "./shared";

const KEEP = { breakInside: "avoid" };
const HEADING = "keep-with-next text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]";

const SWATCH = {
  green: "#2E7D32", teal: "#00897B",
  red: "#C62828", orange: "#EF6C00", pink: "#EC407A", purple: "#7B1FA2",
  yellow: "#F9A825", beige: "#D7C4A3", brown: "#795548",
  white: "#FFFFFF", gold: "#C9A227", silver: "#BDBDBD", grey: "#757575",
  black: "#212121", navy: "#1A237E", "dark blue": "#1565C0",
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

export default function LuckyElementsSection({ luckyElements }) {
  if (!luckyElements) return null;
  const { year, colours, cautionColours, numbers, cautionNumbers } = luckyElements;
  const [firstColour, ...restColours] = colours;

  return (
    <AdminReportSection icon="🍀" title={`Lucky Colours & Numbers${year ? ` for ${year}` : ""}`}>
      <p className="mt-3 text-base leading-7 text-stone-700">
        Small, everyday ways to bring in your Elements to Enhance: what you wear and the numbers you choose. None of these replace good decisions, but they help tilt the year your way.
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

      <p className="mt-5 text-sm leading-6 text-stone-600" style={KEEP}>
        Your lucky directions are on the Personal Directions page.
      </p>
    </AdminReportSection>
  );
}
