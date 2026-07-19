import { AdminBulletList, AdminMonthCallout, AdminReportSection, AdminStrengthRiskGrid } from "./shared";

export default function RelationshipSection({
  relationshipArchetype,
  relationshipPattern,
  dayBranchAnimal,
  dayBranchZh,
  dayBranchElement,
  spousePalaceNoteText,
  relationshipGoodMonths,
  relationshipCautionMonths,
  relationshipFocus,
  relationship,
  favourableSet,
  selectedYear,
  peachBlossomAnimal,
  peachBlossomYears,
  peachBlossomMonth,
}) {
  return (
    <AdminReportSection icon="❤️" title="Relationship Dynamics">
      {relationshipArchetype.name && (
        <p className="mt-3 text-base text-stone-700">
          <strong>{relationshipArchetype.name}</strong>
          {relationshipPattern.relationshipStyle
            ? ` · ${relationshipPattern.relationshipStyle}`
            : ""}
        </p>
      )}
      {dayBranchAnimal && dayBranchElement && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          <strong>Spouse Palace ({dayBranchZh} {dayBranchAnimal} · {dayBranchElement}):</strong>{" "}
          {spousePalaceNoteText}
        </p>
      )}
      <AdminMonthCallout label="Good months" months={relationshipGoodMonths} tone="good" />
      <AdminMonthCallout
        label="Extra grounding needed"
        months={relationshipCautionMonths}
        tone="caution"
      />
      {relationshipFocus && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          {relationshipFocus}
        </p>
      )}
      {relationship.spouseStar?.interpretation && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          {relationship.spouseStar.interpretation}
        </p>
      )}
      {!!favourableSet.size && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          Partners whose own chart leans toward {[...favourableSet].join(", ")} —
          your chart's own supportive elements — tend to reinforce rather than
          drain your energy, since those are the same elements your chart
          already benefits from.
        </p>
      )}
      {!!relationship.partnerDynamics?.potentialChallenges?.length && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          {relationship.partnerDynamics.potentialChallenges.join(" ")}
        </p>
      )}
      {relationship.timingNotes?.annualInfluence && (
        <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <strong>{selectedYear || "This year"}:</strong>{" "}
          {relationship.timingNotes.annualInfluence}{" "}
          {relationship.timingNotes.caution}
        </p>
      )}
      {peachBlossomAnimal && (
        <p className="mt-3 text-base leading-7 text-stone-700">
          <strong>Romantic Peak Timing:</strong> Your Peach Blossom is the{" "}
          <strong>{peachBlossomAnimal}</strong>.{" "}
          {peachBlossomYears.length === 2 && (
            <>{peachBlossomYears[0]} and {peachBlossomYears[1]} are your next {peachBlossomAnimal} years — </>
          )}
          {peachBlossomMonth && (
            <><strong>{peachBlossomMonth}</strong> each year is also a monthly peak. </>
          )}
          These are your strongest windows for romantic connections and social magnetism.
        </p>
      )}
      <AdminStrengthRiskGrid
        strengths={relationshipArchetype.strengths || relationshipPattern.relationshipStrengths}
        risks={relationshipArchetype.blindSpots || relationshipPattern.relationshipBlindSpots}
        strengthLabel="Relationship Strengths"
        riskLabel="Relationship Blind Spots"
      />
      {!!relationshipPattern.emotionalNeeds?.length && (
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            Emotional Needs
          </p>
          <AdminBulletList items={relationshipPattern.emotionalNeeds} />
        </div>
      )}
      {!!(relationshipArchetype.partnerNeeds?.length || relationshipPattern.idealPartnerTraits?.length) && (
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
            What This Chart Needs In A Partner
          </p>
          <AdminBulletList
            items={[
              ...new Set([
                ...(relationshipArchetype.partnerNeeds || []),
                ...(relationshipPattern.idealPartnerTraits || []),
              ]),
            ]}
          />
        </div>
      )}
    </AdminReportSection>
  );
}
