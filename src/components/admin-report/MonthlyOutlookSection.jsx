const RATING_STYLE = {
  Excellent: "bg-emerald-100 text-emerald-800",
  Good: "bg-green-50 text-green-700",
  Mixed: "bg-slate-100 text-slate-600",
  Challenging: "bg-amber-100 text-amber-800",
  Difficult: "bg-red-100 text-red-700",
};

const ELEMENT_FIT_TEXT = {
  Good: "brings an element you need",
  Neutral: "neither helps nor strains your chart",
  Caution: "strains your chart",
};

const MONTH_ROW = "grid grid-cols-[7rem_7rem_1fr]";

function Line({ label, children }) {
  return (
    <p>
      <span className="font-semibold text-slate-800">{label}:</span> {children}
    </p>
  );
}

export default function MonthlyOutlookSection({ monthlyOutlook, selectedYear }) {
  if (!monthlyOutlook.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-950">
        🗓️ Monthly Outlook (流月) — {selectedYear || ""}
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        The smallest layer of luck. Each Chinese month has its own pillar, read against your chart in layers: whether
        its element is one you need, its 10 God (which sets the month's theme), any clash or combination with your
        birth pillars, the special stars (神煞) it switches on, and whether it falls on a void (空亡) branch. Together
        these give the rating, from <strong>Excellent</strong> through <strong>Good</strong>, <strong>Mixed</strong>{" "}
        and <strong>Challenging</strong> to <strong>Difficult</strong>. Months sit on top of the year and the 10-year
        Luck Pillar, so a Challenging month in a supportive decade is a speed bump, not a setback.
      </p>
      <p className="mt-1 text-xs text-stone-400">
        Chinese months start around the 4th–8th of each Western month (at the solar term), and each has a fixed
        zodiac animal: Tiger is always the first month of spring, Rabbit the second, and so on. This is not related
        to the Western zodiac.
      </p>
      {/* Each month is its own card, not a row in one big box: print engines
          leave gaps when keeping rows whole, and a single outer border then
          frames that blank space as if content were missing. */}
      <div className="mt-4 space-y-3 text-sm">
        {monthlyOutlook.map((item) => (
          <div
            key={item.month}
            className={`${MONTH_ROW} rounded-2xl border border-slate-200 print:rounded-none print:border-[#e5d5c0] print:border-l-4 print:border-l-[#8B1A1A]`}
            style={{ breakInside: "avoid" }}
          >
            <div className="px-4 py-2.5">
              <p className="font-semibold text-slate-800">{item.monthName}</p>
              <p className="text-xs text-stone-500">
                {item.chinese} · {item.branchAnimal}
              </p>
            </div>
            <div className="px-4 py-2.5">
              <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${RATING_STYLE[item.rating] || RATING_STYLE.Mixed}`}>
                {item.rating || item.read}
              </span>
            </div>
            <div className="space-y-1 px-4 py-2.5 leading-6 text-stone-600">
              {item.theme ? (
                <p className="font-semibold text-slate-900">
                  {item.theme} <span className="font-normal text-stone-500">({item.tenGod?.primary})</span>
                </p>
              ) : null}
              <p>
                {item.dominantElement} month, which {ELEMENT_FIT_TEXT[item.read]}.
              </p>
              {item.doText && <Line label="Do">{item.doText}</Line>}
              {!!item.support?.length && <Line label="Support">{item.support.join("; ")}</Line>}
              <Line label="Watch">
                {[...(item.watch || []), ...(item.watchText ? [item.watchText] : [])].join("; ") || "nothing specific"}
              </Line>
              {!!item.stars?.length && (
                <Line label="Stars">
                  {item.stars.map((star) => `${star.icon} ${star.label}: ${star.text}`).join("; ")}
                </Line>
              )}
              {!!item.focusAreas?.length && <Line label="Area to focus">{item.focusAreas.join(", ")}</Line>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
