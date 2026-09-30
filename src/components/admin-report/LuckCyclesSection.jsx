import { getProfileDisplay } from "../../data/profileDisplay";
import { AdminReportSection } from "./shared";

const LUCK_READ_STYLE = {
  favourable: { badge: "bg-emerald-100 text-emerald-800", label: "Favourable" },
  supported:  { badge: "bg-teal-100 text-teal-700",      label: "Supported"  },
  caution:    { badge: "bg-amber-100 text-amber-800",     label: "Caution"    },
  neutral:    { badge: "bg-slate-100 text-slate-600",     label: "Neutral"    },
};

export function LuckReadBadge({ read }) {
  const style = LUCK_READ_STYLE[read];
  if (!style) return null;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>{style.label}</span>
  );
}

export function LuckReadLegend({ usefulGod }) {
  const primary = usefulGod.primaryUsefulGod;
  const others = [...(usefulGod.favourableElements || []), ...(usefulGod.secondaryFavourableElements || [])].filter(
    (element) => element !== primary
  );
  const caution = usefulGod.cautionElements || [];
  return (
    <ul className="mt-3 grid gap-1.5 text-sm text-stone-600 md:grid-cols-2">
      <li><LuckReadBadge read="favourable" /> Brings your main Element to Enhance{primary ? ` (${primary})` : ""}.</li>
      {!!others.length && (
        <li><LuckReadBadge read="supported" /> Brings another element that helps your chart ({others.join(", ")}).</li>
      )}
      <li><LuckReadBadge read="neutral" /> Neither helps nor strains your chart.</li>
      <li>
        <LuckReadBadge read="caution" /> Brings an element that strains your chart
        {caution.length ? ` (${caution.join(", ")})` : ""}.
      </li>
    </ul>
  );
}

// A Luck Pillar's two halves: the top character (stem) for the first five
// years, the bottom character (branch) for the last five.
export function LuckHalves({ halves }) {
  return (
    <ul className="mt-1.5 space-y-1">
      {halves.map((h) => (
        <li key={h.half} className={h.isCurrent ? "font-semibold" : "text-stone-600"}>
          Age {h.startAge}–{h.endAge}: {h.zh} {h.element} <LuckReadBadge read={h.read} />
          {h.isCurrent && <span className="ml-1 text-xs text-amber-700">← now</span>}
        </li>
      ))}
    </ul>
  );
}

function LayerCard({ zh, title, span, meaning, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 print:bg-[#FAE5D3]" style={{ breakInside: "avoid" }}>
      <p className="text-lg font-bold text-slate-900">
        {zh} <span className="text-base">{title}</span>
      </p>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">{span}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{meaning}</p>
      {children && <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-800">{children}</div>}
    </div>
  );
}

export default function LuckCyclesSection({
  currentLuck,
  annualPillar,
  annualZodiac,
  annualRead,
  selectedYear,
  ageInSelectedYear,
  luckOverview,
  usefulGod,
}) {
  const decadeTheme = currentLuck ? getProfileDisplay(currentLuck.tenGod)?.name : null;

  return (
    <AdminReportSection icon="🌀" title="Your Luck Cycles (运) at a Glance">
      <p className="mt-3 text-base leading-7 text-stone-700">
        In Bazi, your birth chart (命) is fixed: it is the hand you were dealt. Luck (运) is the timing that
        moves around that hand, bringing in different elements over time. When the incoming element is one
        your chart needs, things flow more easily; when it brings an element that strains your chart, life
        asks more of you. Luck runs in three layers, from the big picture down:
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <LayerCard
          zh="大运"
          title="Luck Pillar"
          span="10 years"
          meaning="The season of life. It sets the overall tone for a whole decade and matters most. Its top character shapes the first five years and its bottom character the last five."
        >
          {currentLuck ? (
            <>
              <p>
                <strong>Now (age {currentLuck.startAge.years}–{currentLuck.endAge.years}):</strong>{" "}
                {currentLuck.pillar.stem.zh}
                {currentLuck.pillar.branch.zh}
                {decadeTheme ? ` · ${decadeTheme} decade` : ""}
              </p>
              <LuckHalves halves={currentLuck.halves} />
            </>
          ) : (
            <p className="text-stone-500">
              {ageInSelectedYear !== null ? `Your first Luck Pillar has not started yet at age ${ageInSelectedYear}.` : "Not available."}
            </p>
          )}
        </LayerCard>

        <LayerCard
          zh="流年"
          title="Annual Pillar"
          span="1 year"
          meaning="The weather for the year. It brings events and themes on top of the decade's season."
        >
          {annualPillar ? (
            <>
              <p>
                <strong>{selectedYear}:</strong> {annualPillar.chinese}{" "}
                {annualZodiac?.displayName || annualPillar.stemElement}
              </p>
              <p className="mt-1.5"><LuckReadBadge read={annualRead} /></p>
            </>
          ) : (
            <p className="text-stone-500">Not available.</p>
          )}
        </LayerCard>

        <LayerCard
          zh="流月"
          title="Monthly Pillar"
          span="1 month"
          meaning="The day-to-day timing. It decides the Easiest months and Pace yourself months in each area below."
        >
          <p className="text-stone-600">See the Monthly Outlook for a month-by-month read of {selectedYear}.</p>
        </LayerCard>
      </div>

      {luckOverview && (
        <p className="mt-4 rounded-xl border-l-4 border-amber-600 bg-amber-50 px-4 py-3 text-base leading-7 text-slate-900">
          <strong>What this means right now:</strong> {luckOverview}
        </p>
      )}

      <div style={{ breakInside: "avoid" }}>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-amber-700">How to read the ratings</p>
        <LuckReadLegend usefulGod={usefulGod} />
      </div>
    </AdminReportSection>
  );
}
