import { normalizeStoneItems } from "./helpers";

export default function RecommendedStones({ stones }) {
  const stoneData = normalizeStoneItems(stones);
  const strategy = stones?.energyStrategy || {};

  if (!stones || stoneData.length === 0) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        Recommended Energy Supports
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {stones.topRecommendation
          ? `${stones.topRecommendation} is your main support`
          : "Wear these to support your personal energy"}
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        {strategy.explanation ||
          stones.explanation ||
          "These stones are selected based on the supportive elements your chart benefits from."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {stones.primaryElement && (
          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Primary: {stones.primaryElement}
          </span>
        )}

        {stones.secondaryElement && (
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Secondary: {stones.secondaryElement}
          </span>
        )}

        {stones.cautionElements?.length > 0 && (
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            Use {stones.cautionElements.join(", ")} carefully
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {stoneData.slice(0, 6).map((item) => (
          <div
            key={`${item.rank}-${item.name}`}
            className="rounded-2xl border border-zinc-200 bg-[#FFFDF8] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">💎</div>

            <p className="mt-4 text-sm font-semibold text-stone-500">
              {item.element} Support
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-950">
              {item.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              {item.theme}
            </p>

            <p className="mt-4 text-xs leading-5 text-stone-500">
              {item.bestFor}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
