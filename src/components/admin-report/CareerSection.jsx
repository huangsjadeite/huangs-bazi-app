import { getProfileDisplay } from "../../data/profileDisplay";
import { AdminMonthCallout, AdminReportSection, AdminStrengthRiskGrid } from "./shared";

const ELEMENT_COLOR = {
  Wood: "#2E7D32",
  Fire: "#C62828",
  Earth: "#8D6E63",
  Metal: "#A67C00",
  Water: "#1565C0",
};

const HEADING = "text-sm font-bold uppercase tracking-[0.18em] text-amber-700";

function BestFitIndustries({ groups }) {
  if (!groups?.length) return null;
  return (
    <div className="mt-6" style={{ breakInside: "avoid" }}>
      <p className={HEADING}>Best-fit industries</p>
      <p className="mt-1 text-base leading-7 text-stone-700">
        Working in these fields surrounds you with the elements your chart is short of, so the work
        itself tends to feel supportive rather than draining.
      </p>
      <div className="mt-3 space-y-3">
        {groups.map((group) => (
          <div
            key={group.element}
            className="rounded-xl border-l-4 bg-stone-50 px-4 py-3"
            style={{ borderColor: ELEMENT_COLOR[group.element] }}
          >
            <p className="text-sm font-bold" style={{ color: ELEMENT_COLOR[group.element] }}>
              {group.element} <span className="font-medium text-stone-500">· {group.rank}</span>
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">{group.industries.join(" · ")}</p>
            <p className="mt-1 text-sm text-stone-600">{group.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BestFitRoles({ details }) {
  if (!details?.roles?.length) return null;
  return (
    <div className="mt-6" style={{ breakInside: "avoid" }}>
      <p className={HEADING}>Best-fit roles</p>
      <p className="mt-1 text-base leading-7 text-stone-700">
        {details.summary} These suit you in any industry.
      </p>
      <table className="mt-3 w-full border-collapse text-sm">
        <tbody>
          {details.roles.map(({ role, examples }) => (
            <tr key={role} className="border-t border-slate-100">
              <td className="w-2/5 py-2 pr-3 font-semibold text-slate-900">{role}</td>
              <td className="py-2 text-stone-600">e.g. {examples}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
      <AdminMonthCallout label="Easiest months" months={careerStrongMonths} tone="good" />
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
      <BestFitIndustries groups={career.bestFitIndustryGroups} />
      <BestFitRoles details={career.bestFitRoleDetails} />
    </AdminReportSection>
  );
}
