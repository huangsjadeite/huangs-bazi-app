export default function LifeThemesSection({ lifeThemes }) {
  const fallbackLifeThemes = {
    primaryThemes: [
      "Relationships and Connections",
      "Balancing Independence and Support",
      "Strategic Decision Making",
    ],
    supportingThemes: ["Building Through People", "Trust and Reciprocity"],
  };

  const themeData =
    lifeThemes &&
    (lifeThemes.primaryThemes?.length || lifeThemes.supportingThemes?.length)
      ? lifeThemes
      : fallbackLifeThemes;

  const primaryThemes = (themeData.primaryThemes || []).slice(0, 3);
  const supportingThemes = (themeData.supportingThemes || []).slice(0, 2);

  if (!primaryThemes.length && !supportingThemes.length) return null;

  const allThemes = [...primaryThemes, ...supportingThemes];

  return (
    <section className="rounded-[36px] border border-orange-200 bg-gradient-to-br from-white via-[#FFFDF8] to-orange-50 px-8 py-10 shadow-lg md:px-10">
      <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-700">
        ✨ Life Themes
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        Your Recurring Life Lessons
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        These themes describe the patterns that repeatedly shape your growth, decisions, relationships and long-term direction.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {allThemes.map((theme) => (
          <span
            key={theme}
            className="rounded-full border border-orange-200 bg-white px-5 py-3 text-base font-semibold text-slate-900"
          >
            {theme}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-4xl text-base leading-7 text-stone-600">
        Your full reading explains what each of these themes means for your
        growth, decisions and relationships.
      </p>
    </section>
  );
}
