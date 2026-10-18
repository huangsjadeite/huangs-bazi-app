// Tai Sui (太岁) for the reading year, from taiSuiV1. Upgraded PDF only.

import { AdminReportSection } from "./shared";

const KEEP = { breakInside: "avoid" };
const HEADING = "text-xs font-bold uppercase tracking-[0.14em] text-amber-700 print:text-[#8B1A1A]";

const STATUS_STYLE = {
  major: "border-red-300 bg-red-50/60",
  moderate: "border-orange-300 bg-orange-50/60",
  mild: "border-amber-300 bg-amber-50/60",
  support: "border-green-300 bg-green-50/60",
  neutral: "border-slate-200 bg-stone-50",
};

const LEVEL_LABEL = { major: "Strong effect", moderate: "Moderate effect", mild: "Mild effect" };

const signName = (s) => `${s.zh} ${s.animal}`;

function StatusCard({ taiSui }) {
  const { status, level, conflicts, support, sign, year } = taiSui;
  const style = STATUS_STYLE[level || status];
  if (status === "conflict") {
    return (
      <div className={`mt-4 rounded-xl border-l-4 px-4 py-3 ${style}`} style={KEEP}>
        <p className="text-base font-bold text-slate-900">
          {signName(sign)}: {conflicts.map((c) => `${c.label} (${c.zh})`).join(" and ")}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{LEVEL_LABEL[level]}</p>
        {conflicts.map((c) => (
          <p key={c.key} className="mt-1.5 text-sm leading-6 text-stone-700">
            {c.text}
          </p>
        ))}
      </div>
    );
  }
  if (status === "support") {
    return (
      <div className={`mt-4 rounded-xl border-l-4 px-4 py-3 ${style}`} style={KEEP}>
        <p className="text-base font-bold text-slate-900">
          {signName(sign)}: {support.map((s) => `${s.label} (${s.zh})`).join(" and ")}
        </p>
        {support.map((s) => (
          <p key={s.key} className="mt-1.5 text-sm leading-6 text-stone-700">
            {s.text}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className={`mt-4 rounded-xl border-l-4 px-4 py-3 ${style}`} style={KEEP}>
      <p className="text-base font-bold text-slate-900">{signName(sign)}: no conflict with Tai Sui</p>
      <p className="mt-1.5 text-sm leading-6 text-stone-700">
        Your sign neither clashes with nor is tied to the {year} Tai Sui, so the year&rsquo;s Grand Duke leaves you in
        peace. How {year} goes for you depends on the rest of your chart, covered in the year reading above.
      </p>
    </div>
  );
}

function Remedies({ taiSui }) {
  const { status, helperSigns } = taiSui;
  const pendant = helperSigns.length
    ? `A jade or crystal pendant of your helper signs: ${helperSigns.map((h) => `${signName(h)} (${h.relation})`).join(", ")}. These signs naturally back yours up.`
    : null;

  const items =
    status === "conflict"
      ? [
          "Pay your respects to Tai Sui (安太岁) at a temple early in the year, after 立春 (around 4 February). This is a tradition, not a must, but many people find it settling.",
          pendant,
          "Turn the restless energy into happy events (冲喜): a wedding, a new baby, moving into a new home or a family celebration all count.",
          "Go carefully with big risky investments, guaranteeing other people’s loans and legal disputes. Take extra care on the road and keep up with health check-ups.",
        ]
      : status === "support"
        ? [
            "Use the year to push forward: start the project, ask for the promotion or make the introduction you have been putting off.",
            pendant,
          ]
        : [pendant];

  return (
    <div className="mt-5">
      <div style={KEEP}>
        <p className={HEADING}>{status === "conflict" ? "What helps this year" : "Making the most of the year"}</p>
        <p className="mt-1.5 text-sm leading-6 text-stone-700">{items.filter(Boolean)[0]}</p>
      </div>
      {items.filter(Boolean).slice(1).map((item) => (
        <p key={item} className="mt-1.5 text-sm leading-6 text-stone-700" style={KEEP}>
          {item}
        </p>
      ))}
    </div>
  );
}

export default function TaiSuiSection({ taiSui }) {
  if (!taiSui) return null;
  const { year, taiSui: grandDuke, dayBranch, affectedSigns, sectors } = taiSui;

  return (
    <AdminReportSection icon="🏮" title={`Your Tai Sui (太岁) for ${year}`}>
      <p className="mt-3 text-base leading-7 text-stone-700">
        Each year is ruled by a Grand Duke, Tai Sui (太岁). In {year} it is the{" "}
        <strong>
          {grandDuke.stemZh}
          {grandDuke.zh} {grandDuke.animal}
        </strong>
        . Signs that meet the year head-on, by sharing it or clashing with it, feel its energy most. Here is where your
        sign stands.
      </p>

      <StatusCard taiSui={taiSui} />

      {dayBranch && (
        <p className="mt-3 text-sm leading-6 text-stone-700" style={KEEP}>
          <strong>Also worth knowing:</strong> your Day branch, {signName(dayBranch)} (you and your Spouse Palace), is{" "}
          {dayBranch.conflicts.map((c) => `${c.label.charAt(0).toLowerCase()}${c.label.slice(1)} (${c.zh})`).join(" and ")}. Give your closest
          relationship and your own wellbeing a little extra care this year.
        </p>
      )}

      <Remedies taiSui={taiSui} />

      <div className="mt-5" style={KEEP}>
        <p className={HEADING}>Who else feels Tai Sui in {year}</p>
        <p className="mt-1.5 text-sm leading-6 text-stone-700">
          Useful for family and friends:{" "}
          {affectedSigns.map((s, i) => (
            <span key={s.key}>
              <strong>{signName(s)}</strong> ({s.conflicts.map((c) => c.zh).join(", ")})
              {i < affectedSigns.length - 1 ? "; " : "."}
            </span>
          ))}{" "}
          Same sign (值) and clash (冲) are felt most strongly; punishment (刑) is moderate; harm (害) and break (破) are mild.
        </p>
      </div>

      <div className="mt-5">
        <div style={KEEP}>
          <p className={HEADING}>Areas of your home to leave alone in {year}</p>
          <p className="mt-1.5 text-sm leading-6 text-stone-700">
            Tai Sui also sits in a direction each year. Stand in the centre of your home with a compass to find these
            areas. Avoid starting renovation, drilling or knocking down walls there this year.
          </p>
          <SectorRow sector={sectors[0]} />
        </div>
        {sectors.slice(1).map((sector) => (
          <SectorRow key={sector.key} sector={sector} />
        ))}
      </div>
    </AdminReportSection>
  );
}

function SectorRow({ sector }) {
  return (
    <div className="grid grid-cols-[2fr_3fr] border-t border-slate-100 py-2 text-sm" style={KEEP}>
      <p className="pr-3 font-semibold text-slate-900">
        {sector.zh} {sector.label}
      </p>
      <p className="text-stone-600">
        {sector.direction} ({sector.branches.map((b) => b.zh).join("")}, {sector.degrees.from}°–{sector.degrees.to}°)
      </p>
    </div>
  );
}
