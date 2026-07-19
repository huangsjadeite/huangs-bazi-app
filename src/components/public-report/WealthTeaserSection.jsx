export default function WealthTeaserSection({ wealth }) {
  if (!wealth) return null;

  const hasContent =
    wealth.wealthArchetype ||
    wealth.wealthStyle ||
    wealth.incomePath ||
    wealth.summary;

  if (!hasContent) return null;

  return (
    <section className="rounded-[36px] border border-emerald-200 bg-gradient-to-br from-white via-[#FFFDF8] to-emerald-50 px-8 py-10 shadow-lg md:px-10">
      <p className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
        💰 Wealth Archetype
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {wealth.wealthArchetype || "Your Wealth Style"}
      </h2>

      <p className="mt-5 max-w-5xl text-lg leading-8 text-stone-600">
        {wealth.wealthStyle ||
          "This shows the natural way your chart tends to create value, attract opportunities and build financial direction."}
      </p>

      {(wealth.incomePath || wealth.summary) && (
        <div className="mt-7 rounded-[28px] border border-emerald-100 bg-white p-7 shadow-sm">
          <h3 className="text-xl font-bold text-emerald-900">
            How wealth tends to grow for you
          </h3>

          <p className="mt-4 text-base leading-7 text-stone-600">
            {wealth.incomePath || wealth.summary}
          </p>
        </div>
      )}

      <div className="mt-7 rounded-[28px] border border-emerald-100 bg-emerald-50 p-7">
        <p className="text-base leading-7 text-emerald-800">
          Your full reading covers your ideal income models, money mindset,
          supportive elements, wealth strengths and financial blind spots.
        </p>
      </div>
    </section>
  );
}
