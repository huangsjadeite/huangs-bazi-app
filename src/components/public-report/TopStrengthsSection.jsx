export default function TopStrengthsSection({ strengths }) {
  if (!Array.isArray(strengths) || strengths.length === 0) return null;

  return (
    <section className="rounded-[36px] border border-amber-200 bg-gradient-to-br from-white via-[#FFFDF8] to-amber-50 px-8 py-10 shadow-lg md:px-10">
      <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-700">
        ✨ Your Natural Advantages
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        Your Top Strengths
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        These are the natural strengths you can lean on when making decisions,
        building relationships, growing your work and moving through the year
        with more confidence.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {strengths.slice(0, 3).map((item, index) => (
          <div
            key={`${item.key || item.title}-${index}`}
            className="rounded-[28px] border border-amber-100 bg-white p-7 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
              Strength {item.rank || index + 1}
            </p>

            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              {item.title || "Natural Strength"}
            </h3>

            <p className="mt-4 text-base leading-7 text-stone-600">
              {item.description ||
                "This is one of your natural advantages when used consciously."}
            </p>

            {item.reason && (
              <div className="mt-6 rounded-2xl bg-amber-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
                  What this means for you
                </p>

                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {item.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
