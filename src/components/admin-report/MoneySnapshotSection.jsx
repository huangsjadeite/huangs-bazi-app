// One-page money summary printed right after the cover, from the
// moneySnapshot values in deriveAdminReportData. Both PDFs.

const HEADING = "text-xs font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]";
const EXACT = { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" };

const YEAR_TYPES = {
  push: {
    label: "PUSH YEAR",
    style: "border-emerald-300 bg-emerald-50 text-emerald-800",
    line: (year) => `${year} brings energy your chart needs. A good year to grow, ask for more and take considered risks.`,
  },
  steady: {
    label: "STEADY YEAR",
    style: "border-slate-300 bg-slate-50 text-slate-700",
    line: (year) => `${year} neither pushes nor strains your chart. Progress comes from consistency and good timing.`,
  },
  protect: {
    label: "PROTECT YEAR",
    style: "border-amber-300 bg-amber-50 text-amber-800",
    line: (year) =>
      `${year} brings energy your chart finds demanding. A year to consolidate, guard what you have and time your moves carefully.`,
  },
};

const READ_TO_TYPE = { favourable: "push", supported: "push", neutral: "steady", caution: "protect" };

// What each income style (from the chart's main structure, see
// wealthEngineV1) means in practice. Styles without an entry show the name only.
const INCOME_STYLE_MEANINGS = {
  "Network-driven income":
    "Your money tends to come through people: the clients, contacts, partners and friends who trust you. Referrals, introductions, partnerships and repeat customers matter more for you than working alone, so the stronger your network and reputation, the stronger your income.",
  "Expertise-driven income":
    "Your money tends to come from what you know: skills, qualifications, specialist knowledge and sound judgement are what people pay you for. Keep learning and become the go-to person in your field, and your income grows with it.",
  "Service-driven income":
    "Your money tends to come from looking after others: helping, advising or supporting clients and colleagues. People pay for the trust and reliability you bring, so loyal, long-term relationships grow your income.",
  "Creative income":
    "Your money tends to come from what you make or express: ideas, products, content, design or performance. Turning your talent into something people can see and buy grows your income.",
  "Structure-driven income":
    "Your money tends to come from organisation and control: managing budgets, systems, teams or assets. Clear plans, steady saving and well-run processes grow your income over time.",
};

const RATING_STYLE = {
  Excellent: "bg-emerald-100 text-emerald-800",
  Good: "bg-green-50 text-green-700",
  Mixed: "bg-slate-100 text-slate-600",
};

function Block({ title, children }) {
  return (
    <div className="mt-6" style={{ breakInside: "avoid" }}>
      <p className={HEADING}>{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function MoneySnapshotSection({ snapshot, clientName }) {
  if (!snapshot) return null;
  const { year, annualRead, luckOverview, bestMonths, carefulMonths, incomeStyle } = snapshot;
  const yearType = YEAR_TYPES[READ_TO_TYPE[annualRead]];

  return (
    <section className="mt-8 rounded-2xl border border-amber-100 p-5 sm:p-7 print:mt-0 print:rounded-none print:border-0 print:p-0" style={{ breakAfter: "page" }}>
      <h2 className="text-3xl font-bold text-slate-950 print:text-[#8B1A1A]">Your {year} Money Snapshot</h2>
      {clientName && <p className="mt-1 text-base text-stone-500">{clientName}</p>}
      <div className="mt-1 border-b border-amber-100 print:border-[#8B1A1A]" />

      {yearType && (
        <div className={`mt-6 rounded-2xl border-2 px-5 py-4 ${yearType.style}`} style={{ ...EXACT, breakInside: "avoid" }}>
          <p className="text-2xl font-extrabold tracking-[0.12em]">{yearType.label}</p>
          <p className="mt-1.5 text-base leading-7 text-slate-800">{yearType.line(year)}</p>
        </div>
      )}
      {luckOverview && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          <strong>What this means right now:</strong> {luckOverview}
        </p>
      )}

      <Block title="Your best money months">
        {bestMonths.length ? (
          <ul className="flex flex-wrap gap-2">
            {bestMonths.map((m) => (
              <li key={m.name} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-base text-slate-900">
                {m.name}
                {m.rating && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${RATING_STYLE[m.rating] || RATING_STYLE.Mixed}`} style={EXACT}>
                    {m.rating}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-stone-600">None stand out this year.</p>
        )}
      </Block>

      <Block title="Months to be careful with money">
        <p className="text-base text-slate-900">{carefulMonths.length ? carefulMonths.join(", ") : "None stand out this year."}</p>
      </Block>

      {incomeStyle && (
        <Block title="Your money style">
          <p className="text-base font-semibold text-slate-900">{incomeStyle}</p>
          {INCOME_STYLE_MEANINGS[incomeStyle] && (
            <p className="mt-1 text-base leading-7 text-stone-700">{INCOME_STYLE_MEANINGS[incomeStyle]}</p>
          )}
        </Block>
      )}

      <p className="mt-8 text-sm text-stone-500">Full details on the Wealth Opportunities and Monthly Outlook pages.</p>
    </section>
  );
}
