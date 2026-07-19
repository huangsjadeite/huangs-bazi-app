export default function EmotionalEnergyProfile({ profile }) {
  return (
    <div className="mt-8 rounded-[32px] bg-white px-8 py-8 shadow-md md:px-12 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Your Personalised Profile for {profile.selectedYear}
          </p>

          <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            {profile.name || "-"}
          </h3>

          <p className="mt-4 text-base font-semibold text-stone-500">
            Chinese Zodiac Sign: {profile.zodiac || "-"}
          </p>

          <p className="mt-5 text-2xl font-medium text-stone-600 md:text-3xl">
            Daymaster:
            <span className="ml-2 font-semibold text-red-900">
              {profile.coreEnergy || "-"}
            </span>
          </p>

                    {profile.dayMasterTitle && (
            <p className="mt-4 text-xl font-bold text-red-900">
              {profile.dayMasterTitle}
            </p>
          )}

          {profile.dayMasterSummary && (
            <p className="mt-3 max-w-4xl text-base leading-8 text-stone-500 md:text-lg">
              {profile.dayMasterSummary}
            </p>
          )}
        </div>

        <div className="w-full max-w-[300px] rounded-[26px] bg-red-900 px-10 py-8 text-center text-white shadow-md">
          <p className="text-base font-semibold leading-7">
            Current Energy Influence
          </p>

          <p className="mt-5 text-4xl font-bold tracking-wide">丙午</p>

          <p className="mt-4 text-2xl font-semibold md:text-3xl">
            Fire Horse
          </p>
        </div>
      </div>
    </div>
  );
}
