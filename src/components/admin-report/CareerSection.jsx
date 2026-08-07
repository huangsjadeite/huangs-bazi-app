import { getProfileDisplay } from "../../data/profileDisplay";
import { AdminMonthCallout, AdminReportSection, AdminStrengthRiskGrid } from "./shared";

export default function CareerSection({
  careerAuthorityProfile,
  careerOutputProfile,
  careerStrongMonths,
  careerCautionMonths,
  career,
  careerFocus,
}) {
  return (
    <AdminReportSection icon="💼" title="Career Timing & Direction">
      {(careerAuthorityProfile || careerOutputProfile) && (
        <p className="mt-3 text-sm font-semibold text-amber-700">
          {careerAuthorityProfile &&
            `${careerAuthorityProfile.name} · ${getProfileDisplay(careerAuthorityProfile.name).name || ""} — ${Math.round(careerAuthorityProfile.percentage)}%`}
          {careerAuthorityProfile && careerOutputProfile && " · "}
          {careerOutputProfile &&
            `${careerOutputProfile.name} · ${getProfileDisplay(careerOutputProfile.name).name || ""} — ${Math.round(careerOutputProfile.percentage)}%`}
        </p>
      )}
      <AdminMonthCallout label="Strongest months" months={careerStrongMonths} tone="good" />
      <AdminMonthCallout label="Pace yourself" months={careerCautionMonths} tone="caution" />
      {career.careerStyle && (
        <p className="mt-3 text-base text-stone-700">
          <strong>{career.careerStyle}</strong>
          {career.leadershipStyle ? ` · ${career.leadershipStyle}` : ""}
        </p>
      )}
      {(career.careerStrategy || career.idealWorkEnvironment) && (
        <p className="mt-2 text-base leading-7 text-stone-700">
          {career.careerStrategy || career.idealWorkEnvironment}
        </p>
      )}
      {careerFocus && (
        <p className="mt-3 text-base leading-7 text-stone-700">{careerFocus}</p>
      )}
      <AdminStrengthRiskGrid
        strengths={career.careerStrengths}
        risks={career.careerRisks}
        strengthLabel="Career Strengths"
        riskLabel="Career Risks"
      />
      {!!career.recommendedDirections?.length && (
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Recommended Directions
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {career.recommendedDirections.map((item) => (
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
