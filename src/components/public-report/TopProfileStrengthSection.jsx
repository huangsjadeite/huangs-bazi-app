import { ARCHETYPE_EMOJIS, PROFILE_DISPLAY } from "../../data/profileDisplay";
import { getStrengthBarWidth, getStrengthLabel, normalizeScore } from "./helpers";

export default function TopProfileStrengthSection({ chart, uiChart }) {
  const engineProfiles =
    chart?.personalityAndStructure?.tenProfileScoring?.rankedProfiles ||
    chart?.personalityAndStructure?.tenProfileScoring?.profiles ||
    chart?.tenProfileScoringV2?.rankedProfiles ||
    chart?.tenProfileScoringV2?.profiles ||
    uiChart?.archetypes ||
    [];

  const items = Array.isArray(engineProfiles)
    ? engineProfiles
        .map((item) => {
          // Engine rankedProfiles use `profile` (e.g. "Seven Killings").
          // PROFILE_DISPLAY is keyed camelCase ("sevenKillings"). Build the key
          // from whatever identifier exists so a real name never falls through
          // to the "Profile Strength" placeholder.
          const rawKey =
            item.key || item.id || item.profileKey || item.profile || item.name || "";
          const stripped = String(rawKey).replace(/\s+/g, "");
          const camelKey = stripped.charAt(0).toLowerCase() + stripped.slice(1);
          const display =
            PROFILE_DISPLAY[camelKey] || PROFILE_DISPLAY[stripped] || {};
          const engineName =
            item.profile || item.name || item.label || rawKey || "";

          return {
            key: stripped || engineName,
            actualName: display.actualName || engineName || "Profile",
            name: display.name || item.publicName || engineName || "Profile Strength",
            icon: display.icon || ARCHETYPE_EMOJIS[engineName] || "✨",
            subtitle:
              display.subtitle ||
              item.subtitle ||
              item.keyword ||
              "Personal Pattern",
            theme:
              display.theme ||
              item.theme ||
              item.description ||
              item.publicMeaning ||
              "This pattern influences how you think, respond and make decisions in daily life.",
            score: normalizeScore(item.percentage ?? item.score ?? item.value),
          };
        })
        // IMPORTANT:
        // Do not filter out zero-score profiles.
        // The engine outputs all 10 archetypes correctly, and the UI should show
        // dormant / inactive archetypes as part of the complete personality map.
        .sort((a, b) => b.score - a.score)
    : [];

  if (!items.length) return null;

  const topThree = items.slice(0, 3);
  const supporting = items.slice(3);

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white px-8 py-10 shadow-md md:px-10">
      <p className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-red-700">
        ✨ Profile Strength
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        Your Strongest Personality Patterns
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        These are the strongest patterns shaping how you think, decide, work,
        connect with others and respond to pressure.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {topThree.map((item, index) => (
          <div
            key={`${item.key}-${index}`}
            className="rounded-[28px] border border-slate-200 bg-[#FFFDF8] p-7 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700">
                  No. {index + 1} Pattern
                </p>

                <h3 className="mt-4 text-2xl font-bold text-slate-950">
                  {item.icon} {item.name}
                </h3>

                                                                             <p className="mt-2 text-sm font-semibold text-stone-500">
                  {item.actualName}
                </p>

                <p className="mt-1 text-xs font-medium text-stone-400">
                  {item.subtitle}
                </p>
              </div>

              <p className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                {getStrengthLabel(item.score)}
              </p>
            </div>

            <p className="mt-5 text-base leading-7 text-stone-600">
              {item.theme}
            </p>

            <div className="mt-6 h-4 rounded-full bg-stone-100">
              <div
                className="h-4 rounded-full bg-red-900"
                style={{ width: getStrengthBarWidth(item.score) }}
              />
            </div>
          </div>
        ))}
      </div>

      {!!supporting.length && (
        <div className="mt-8 rounded-[28px] border border-slate-200 bg-[#FFFDF8] p-7 shadow-sm">
          <p className="text-base text-stone-600">
            You have <strong>{supporting.length} more personality patterns</strong>{" "}
            in your chart — see the complete 10-pattern breakdown in your full reading.
          </p>
        </div>
      )}
    </section>
  );
}
