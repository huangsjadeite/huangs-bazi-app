import { getProfileDisplay } from "../../data/profileDisplay";
import { AdminMonthCallout, AdminReportSection, AdminStrengthRiskGrid } from "./shared";

// Links the strongest wealth energy (the percentages) to the text below it,
// which comes from the overall chart pattern and can otherwise read as a
// contradiction (e.g. "The Opportunist" above "rather than chasing fast gains").
function wealthBridge(directPct, indirectPct) {
  const direct = Math.round(directPct || 0);
  const indirect = Math.round(indirectPct || 0);
  if (!direct && !indirect) return null;
  if (indirect > direct)
    return `Your stronger money energy is Indirect Wealth (${getProfileDisplay("Indirect Wealth").name}), so you tend to spot openings others miss. The rest of your chart, described below, shapes how you turn those openings into lasting results.`;
  if (direct > indirect)
    return `Your stronger money energy is Direct Wealth (${getProfileDisplay("Direct Wealth").name}), so you do best with regular, dependable income. The rest of your chart, described below, shapes how you grow it.`;
  return "Direct and Indirect Wealth are equally strong in your chart, so you can earn through both steady income and well-timed opportunities. The rest of your chart, described below, shapes how you use them.";
}

export default function WealthSection({
  directWealthPct,
  indirectWealthPct,
  wealthStrongMonths,
  wealthCautionMonths,
  wealthArchetype,
  wealth,
  wealthFocus,
}) {
  return (
    <AdminReportSection icon="💰" title="Wealth Opportunities">
      {(directWealthPct != null || indirectWealthPct != null) && (
        <p className="mt-3 text-sm font-semibold text-amber-700">
          {indirectWealthPct != null && `Indirect Wealth · ${getProfileDisplay("Indirect Wealth").name || ""} ${Math.round(indirectWealthPct)}%`}
          {indirectWealthPct != null && directWealthPct != null && " · "}
          {directWealthPct != null && `Direct Wealth · ${getProfileDisplay("Direct Wealth").name || ""} ${Math.round(directWealthPct)}%`}
        </p>
      )}
      {wealthBridge(directWealthPct, indirectWealthPct) && (
        <p className="mt-2 text-base leading-7 text-stone-700">{wealthBridge(directWealthPct, indirectWealthPct)}</p>
      )}
      <AdminMonthCallout label="Easiest months" months={wealthStrongMonths} tone="good" />
      <AdminMonthCallout label="Pace yourself" months={wealthCautionMonths} tone="caution" />
      {wealthArchetype.wealthArchetype && (
        <p className="mt-3 text-base text-stone-700">
          <strong>{wealthArchetype.wealthArchetype}</strong>
          {wealth.incomeStyle ? ` · ${wealth.incomeStyle}` : ""}
        </p>
      )}
      {wealthFocus && (
        <p className="mt-3 text-base leading-7 text-stone-700">{wealthFocus}</p>
      )}
      {wealth.wealthStrategy && (
        <p className="mt-3 text-base leading-7 text-stone-700">{wealth.wealthStrategy}</p>
      )}
      <AdminStrengthRiskGrid
        strengths={wealth.wealthStrengths || wealthArchetype.moneyStrengths}
        risks={wealth.wealthRisks || wealthArchetype.moneyBlindSpots}
        strengthLabel="Wealth Strengths"
        riskLabel="Wealth Blind Spots"
      />
      {!!wealthArchetype.idealIncomeModels?.length && (
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Ideal Income Models
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {wealthArchetype.idealIncomeModels.map((item) => (
              <span
                key={item}
                className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </AdminReportSection>
  );
}
