import { normalizeGuidanceItem } from "./helpers";

export default function LifeGuidanceSection({ guidance }) {
  const guidanceItems = [
    normalizeGuidanceItem(guidance?.career, "Career", "💼"),
    normalizeGuidanceItem(guidance?.wealth, "Wealth", "💰"),
    normalizeGuidanceItem(guidance?.relationship, "Relationship", "❤️"),
    normalizeGuidanceItem(guidance?.wellness || guidance?.health, "Wellness", "🌿"),
  ].filter(Boolean);

  if (!guidanceItems.length) return null;

  const actionLabels = {
    Career: "Career Action",
    Wealth: "Wealth Action",
    Relationship: "Relationship Action",
    Wellness: "Wellness Action",
  };

    const actionFallbacks = {
    Career:
      "Increase visibility through useful conversations, clearer positioning and work that allows people to understand your value.",
    Wealth:
      "Choose fewer but higher-quality opportunities. Focus on what can produce steady value instead of chasing every possible opening.",
    Relationship:
      "Let trust build through consistency, emotional honesty and actions over time instead of guessing or testing the connection too early.",
    Wellness:
      "Create recovery space before pressure builds. Your system works better when rest, routine and emotional reset are part of the plan.",
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
        Practical Guidance
      </p>

      <h2 className="text-3xl font-bold tracking-tight text-slate-950">
        Simple Actions To Apply
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        These are simple next-step directions based on your chart, so the reading becomes easier to apply in daily life.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {guidanceItems.map((item, index) => {
          const focus = item.focus || "Life";
          const actionTitle = actionLabels[focus] || `${focus} Action`;

          return (
            <div
              key={`${focus}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
                  {item.icon}
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">
                  {actionTitle}
                </p>
              </div>

                            <h3 className="mt-5 text-2xl font-bold text-slate-950">
                {actionTitle}
              </h3>

              <p className="mt-5 min-h-[110px] text-base leading-7 text-stone-600">
                                {item.explanation ||
                  item.bullets?.[0] ||
                  item.advice ||
                  actionFallbacks[focus] ||
                  "Focus on one practical step that helps you use this area of life with more clarity and balance."}              </p>

              {item.bullets?.length > 1 && (
                <ul className="mt-5 space-y-2">
                  {item.bullets.slice(1, 3).map((bullet) => (
                    <li key={bullet} className="text-sm leading-6 text-stone-500">
                      • {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
