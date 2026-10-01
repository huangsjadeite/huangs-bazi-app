// Practitioner-style raw chart grid: natal pillars, the reading year and the
// current Luck Pillar side by side, then the full Luck Pillar row. Renders
// engine output (rawChartDataV1) only.

import DestinyChartGuide from "./DestinyChartGuide";

const ELEMENT_STYLE = {
  Wood: { zh: "木", color: "#2E7D32" },
  Fire: { zh: "火", color: "#C62828" },
  Earth: { zh: "土", color: "#8D6E63" },
  Metal: { zh: "金", color: "#6B7280" },
  Water: { zh: "水", color: "#1565C0" },
};

const PILLAR_HEADINGS = {
  hour: { zh: "时", en: "Hour" },
  day: { zh: "日", en: "Day" },
  month: { zh: "月", en: "Month" },
  year: { zh: "年", en: "Year" },
};

const ROW_LABELS = [
  { zh: "天干", en: "Heavenly Stem" },
  { zh: "地支", en: "Earthly Branch" },
  { zh: "藏干", en: "Hidden Stems" },
  { zh: "关系", en: "Relations" },
  { zh: "旺衰", en: "Season" },
  { zh: "十二长生", en: "12 Growth Phase" },
];

function ElementDot({ element, size = "h-6 w-6 text-xs" }) {
  const style = ELEMENT_STYLE[element];
  if (!style) return null;
  return (
    <span
      className={`inline-flex ${size} items-center justify-center rounded-full font-bold text-white`}
      style={{ backgroundColor: style.color }}
    >
      {style.zh}
    </span>
  );
}

function TenGodTag({ abbr, zh }) {
  if (!abbr) return null;
  return (
    <span className="inline-flex flex-col items-center rounded border border-slate-300 bg-slate-50 px-1 text-[10px] font-semibold leading-tight text-slate-600">
      <span>{zh}</span>
      <span>{abbr}</span>
    </span>
  );
}

function StemCell({ stem, compact = false }) {
  return (
    <div className="flex items-start justify-center gap-1.5">
      <div className="text-center">
        <p className={`${compact ? "text-2xl" : "text-4xl"} font-bold leading-none`} style={{ color: ELEMENT_STYLE[stem.element]?.color }}>
          {stem.zh}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-700">{stem.name}</p>
        {!compact && (
          <p className="text-xs text-stone-500">
            {stem.polarity} {stem.element}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <TenGodTag abbr={stem.tenGodAbbr} zh={stem.tenGodZh} />
        {!compact && <ElementDot element={stem.element} />}
      </div>
    </div>
  );
}

function BranchCell({ branch, isVoid, compact = false }) {
  return (
    <div className="flex items-start justify-center gap-1.5">
      <div className="text-center">
        <p className={`${compact ? "text-2xl" : "text-4xl"} font-bold leading-none`} style={{ color: ELEMENT_STYLE[branch.element]?.color }}>
          {branch.zh}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-700">{branch.name}</p>
        <p className="text-xs text-stone-500">
          {compact ? branch.animal : `${branch.polarity} ${branch.element} · ${branch.animal}`}
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        {!compact && <ElementDot element={branch.element} />}
        {isVoid && (
          <span className="rounded border border-slate-800 px-0.5 text-[10px] font-bold leading-tight text-slate-800" title="Void (空亡)">
            空亡
          </span>
        )}
      </div>
    </div>
  );
}

function HiddenStemsCell({ hiddenStems, compact = false }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {hiddenStems.map((hidden) => (
        <div key={hidden.zh} className="flex flex-col items-center">
          <span className={`${compact ? "text-base" : "text-xl"} font-bold leading-none`} style={{ color: ELEMENT_STYLE[hidden.element]?.color }}>
            {hidden.zh}
          </span>
          {!compact && (
            <span className="mt-0.5 text-[11px] text-stone-500">
              {hidden.polarity === "Yang" ? "+" : "-"}
              {hidden.element}
            </span>
          )}
          <span className="mt-0.5">
            <TenGodTag abbr={hidden.tenGodAbbr} zh={hidden.tenGodZh} />
          </span>
        </div>
      ))}
    </div>
  );
}

function RelationsCell({ relations }) {
  if (!relations?.length) return <span className="text-stone-300">—</span>;
  return (
    <div className="space-y-0.5 text-center text-xs text-slate-700">
      {relations.map((relation) => (
        <p key={relation.type}>
          {relation.type}
          {relation.with?.length ? ` (${relation.with.join(", ")})` : ""}
        </p>
      ))}
    </div>
  );
}

function SeasonCell({ season }) {
  if (!season) return <span className="block text-center text-stone-300">—</span>;
  return (
    <div className="space-y-0.5 text-center text-xs text-slate-700">
      {[season.stem, season.branch].map((part, i) => (
        <p key={i}>
          <span className="font-bold" style={{ color: ELEMENT_STYLE[part.element]?.color }}>
            {ELEMENT_STYLE[part.element]?.zh}
          </span>{" "}
          <span className="font-semibold">{part.zh}</span> {part.en}
        </p>
      ))}
    </div>
  );
}

function buildColumnCells(cell, compact = false) {
  return [
    <StemCell key="stem" stem={cell.stem} compact={compact} />,
    <BranchCell key="branch" branch={cell.branch} isVoid={cell.isVoid} compact={compact} />,
    <HiddenStemsCell key="hidden" hiddenStems={cell.hiddenStems} compact={compact} />,
    <RelationsCell key="relations" relations={cell.relations} />,
    <SeasonCell key="season" season={cell.season} />,
    <p key="growth" className="text-center text-xs font-semibold text-slate-700">
      {cell.growthPhase?.zh} {cell.growthPhase?.en}
    </p>,
  ];
}

function formatBirthParts(birthDate, birthTime) {
  const [year, month, day] = (birthDate || "").split("-").map(Number);
  const hour = birthTime ? Number(birthTime.split(":")[0]) : null;
  return { hour, day, month, year };
}

export default function RawChartDataSection({ rawChartData, birthDate, birthTime }) {
  const { natal, annual, currentLuck, luck } = rawChartData;
  const natalKeys = ["hour", "day", "month", "year"].filter((key) => natal[key]);
  const birthParts = formatBirthParts(birthDate, birthTime);

  const columns = [
    ...natalKeys.map((key) => ({
      key,
      top: birthParts[key] ?? "—",
      bottom: `${PILLAR_HEADINGS[key].zh} ${PILLAR_HEADINGS[key].en}`,
      cells: buildColumnCells(natal[key]),
    })),
    ...(annual
      ? [{ key: "annual", top: annual.year, bottom: "流年 Year", cells: buildColumnCells(annual), overlay: true }]
      : []),
    ...(currentLuck
      ? [{ key: "luck", top: `Age ${currentLuck.startAge}`, bottom: "大运 Luck Pillar", cells: buildColumnCells(currentLuck), overlay: true }]
      : []),
  ];

  // Oldest Luck Pillar on the left, as in a traditional chart.
  const luckColumns = [...luck].reverse();

  return (
    <div className="mt-8">
      {/* Heading, note and natal grid print as one block so the title never
          strands on the page before the table. */}
      <div style={{ breakInside: "avoid" }}>
        <h3 className="text-xl font-bold text-slate-950">Destiny Chart &amp; Luck Pillars</h3>
        <p className="mt-2 text-sm text-stone-500">
          Your birth chart as a Bazi master draws it, with the {annual?.year || "selected"} year and your current
          10-year Luck Pillar shaded alongside. A plain-language guide to reading it follows the chart.
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 print:overflow-visible">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="bg-slate-100">
                <th />
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-2 py-2 text-center font-semibold text-slate-700 ${column.overlay ? "bg-amber-50" : ""} ${column.key === "annual" ? "border-l-4 border-white" : ""}`}
                  >
                    <p className="text-base">{column.top}</p>
                    <p className="text-xs font-medium text-stone-500">{column.bottom}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_LABELS.map((label, rowIndex) => (
                <tr key={label.en} className="border-t border-slate-100 align-middle">
                  <th className="bg-amber-100 px-1 py-3 text-center text-[11px] font-semibold leading-tight text-amber-900">
                    <p>{label.zh}</p>
                    <p>{label.en}</p>
                  </th>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-1 py-3 ${column.overlay ? "bg-amber-50/60" : ""} ${column.key === "annual" ? "border-l-4 border-white" : ""}`}
                    >
                      {column.cells[rowIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!!luckColumns.length && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 print:overflow-visible" style={{ breakInside: "avoid" }}>
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                {luckColumns.map((item) => (
                  <th
                    key={item.startAge}
                    className={`px-1 py-2 text-center text-base font-semibold text-slate-700 ${item.isCurrent ? "bg-amber-100" : ""}`}
                  >
                    {item.startAge}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 5].map((rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-100 align-middle">
                  {luckColumns.map((item) => (
                    <td key={item.startAge} className={`px-1 py-2 ${item.isCurrent ? "bg-amber-50" : ""}`}>
                      {buildColumnCells(item, true)[rowIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-3 pb-2 text-xs text-stone-500">
            Luck Pillars by starting age (exact age, not Chinese nominal age). Highlighted pillar is active in {annual?.year || "the selected year"}.
          </p>
        </div>
      )}

      <DestinyChartGuide rawChartData={rawChartData} />
    </div>
  );
}
