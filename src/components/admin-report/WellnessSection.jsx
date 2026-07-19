import { AdminMonthCallout, AdminReportSection, AdminStrengthRiskGrid } from "./shared";

export default function WellnessSection({
  dayMasterStrengthStatus,
  dayMasterStrengthScore,
  wellnessEasierMonths,
  wellnessCautionMonths,
  health,
  wellnessFocus,
  weakestElement,
}) {
  return (
    <AdminReportSection icon="🌿" title="Wellness & Energy Balance">
      {dayMasterStrengthStatus && (
        <p className="mt-3 text-sm font-semibold text-amber-700">
          Chart Strength: {dayMasterStrengthStatus}
          {dayMasterStrengthScore != null &&
            ` (${Math.round(Number(dayMasterStrengthScore))}/100)`}
        </p>
      )}
      <AdminMonthCallout label="Easier months" months={wellnessEasierMonths} tone="good" />
      <AdminMonthCallout label="Pace yourself" months={wellnessCautionMonths} tone="caution" />
      {health.vitalityLevel && (
        <p className="mt-3 text-base text-stone-700">
          <strong>{health.vitalityLevel}</strong>
          {health.stressPattern ? ` · ${health.stressPattern}` : ""}
        </p>
      )}
      {wellnessFocus && (
        <p className="mt-3 text-base leading-7 text-stone-700">{wellnessFocus}</p>
      )}
      {health.healthStrategy && (
        <p className="mt-3 text-base leading-7 text-stone-700">{health.healthStrategy}</p>
      )}
      {weakestElement && (
        <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <strong>
            {weakestElement.name} is your weakest element at {Math.round(weakestElement.natalPercentage)}%
            natally
          </strong>
          {weakestElement.roleDescription &&
            ` — ${weakestElement.name} governs ${weakestElement.roleDescription}, so this is worth conscious support.`}
          {weakestElement.bodySystem &&
            ` In classical Five-Element wellness, ${weakestElement.name} is also associated with ${weakestElement.bodySystem} — worth keeping in mind as a lifestyle/energy focus, not a medical diagnosis.`}
        </p>
      )}
      <AdminStrengthRiskGrid
        strengths={health.wellnessStrengths}
        risks={health.wellnessRisks}
        strengthLabel="Wellness Strengths"
        riskLabel="Wellness Risks"
      />
    </AdminReportSection>
  );
}
