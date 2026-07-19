export default function RelationshipArchetypeSection({ relationshipArchetype }) {
  if (!relationshipArchetype) return null;

  const hasContent =
    relationshipArchetype.name ||
    relationshipArchetype.relationshipStyle ||
    relationshipArchetype.advice ||
    relationshipArchetype.strengths?.length ||
    relationshipArchetype.blindSpots?.length ||
    relationshipArchetype.greenFlags?.length ||
    relationshipArchetype.redFlags?.length ||
    relationshipArchetype.partnerNeeds?.length;

  if (!hasContent) return null;

  return (
    <section className="rounded-[36px] border border-rose-200 bg-gradient-to-br from-white via-[#FFFDF8] to-rose-50 px-8 py-10 shadow-lg md:px-10">
      <p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-rose-700">
        ❤️ Relationship Style
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {relationshipArchetype.name || "How You Naturally Love"}
      </h2>

      <p className="mt-5 max-w-5xl text-lg leading-8 text-stone-600">
        {relationshipArchetype.relationshipStyle ||
          "This shows who you naturally become in love — how you approach connection, trust and emotional closeness."}
      </p>

      {relationshipArchetype.advice && (
        <div className="mt-7 rounded-[28px] border border-rose-100 bg-white p-7 shadow-sm">
          <h3 className="text-xl font-bold text-rose-900">
            How to use this relationship style
          </h3>

          <p className="mt-4 text-base leading-7 text-stone-600">
            {relationshipArchetype.advice}
          </p>
        </div>
      )}

      <div className="mt-7 rounded-[28px] border border-rose-100 bg-rose-50 p-7">
        <p className="text-base leading-7 text-rose-800">
          Your full reading covers your relationship strengths, blind spots,
          compatibility green/red flags and exactly what you need in a partner.
        </p>
      </div>
    </section>
  );
}
