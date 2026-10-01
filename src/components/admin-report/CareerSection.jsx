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

const KEEP = { breakInside: "avoid" };

// Heading, intro and the first item print together so a heading never strands
// at the foot of a page; the remaining items flow on, each kept whole. Keeping
// the whole block together left a large gap before it in the PDF.
function IndustryCard({ group }) {
  return (
    <div
      className="mt-3 rounded-xl border-l-4 bg-stone-50 px-4 py-3"
      style={{ ...KEEP, borderColor: ELEMENT_COLOR[group.element] }}
    >
      <p className="text-sm font-bold" style={{ color: ELEMENT_COLOR[group.element] }}>
        {group.element} <span className="font-medium text-stone-500">· {group.rank}</span>
      </p>
      <p className="mt-1 text-base font-semibold text-slate-900">{group.industries.join(" · ")}</p>
      <p className="mt-1 text-sm text-stone-600">{group.reason}</p>
    </div>
  );
}

function BestFitIndustries({ groups }) {
  if (!groups?.length) return null;
  const [first, ...rest] = groups;
  return (
    <div className="mt-6">
      <div style={KEEP}>
        <p className={HEADING}>Best-fit industries</p>
        <p className="mt-1 text-base leading-7 text-stone-700">
          Working in these fields surrounds you with the elements your chart is short of, so the work
          itself tends to feel supportive rather than draining.
        </p>
        <IndustryCard group={first} />
      </div>
      {rest.map((group) => (
        <IndustryCard key={group.element} group={group} />
      ))}
    </div>
  );
}

function RoleRow({ role, examples }) {
  return (
    <div className="grid grid-cols-[2fr_3fr] border-t border-slate-100 py-2 text-sm" style={KEEP}>
      <p className="pr-3 font-semibold text-slate-900">{role}</p>
      <p className="text-stone-600">e.g. {examples}</p>
    </div>
  );
}

function BestFitRoles({ details }) {
  if (!details?.roles?.length) return null;
  const [first, ...rest] = details.roles;
  return (
    <div className="mt-6">
      <div style={KEEP}>
        <p className={HEADING}>Best-fit roles</p>
        <p className="mt-1 text-base leading-7 text-stone-700">
          {details.summary} These suit you in any industry.
        </p>
        <div className="mt-3">
          <RoleRow {...first} />
        </div>
      </div>
      {rest.map((item) => (
        <RoleRow key={item.role} {...item} />
      ))}
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
