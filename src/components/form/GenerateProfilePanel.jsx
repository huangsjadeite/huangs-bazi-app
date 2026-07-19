import huangsLogo from "../../assets/hjj-logo-black.png";
import { BIRTH_COUNTRY_OPTIONS, getBirthCountryTimezone } from "../../data/birthCountryTimezones";

export default function GenerateProfilePanel({ form, onChange, onGenerate }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <img
          src={huangsLogo}
          alt="Huangs Logo"
          className="h-12 w-auto opacity-70"
        />

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">
          Birth Details
        </p>
      </div>

      <h1 className="text-3xl font-bold text-slate-950">
        Generate Your Bazi (八字) Profile
      </h1>

      <p className="mt-4 text-lg text-stone-500">
        Birth time is used to calculate the Hour Pillar, Hidden Stems and Ten Gods weighting.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Your Name
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg"
            value={form.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Birth Date
          </label>
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg"
            value={form.birthDate}
            onChange={(e) => onChange({ birthDate: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Birth Time
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <select
              disabled={form.birthTimeUnknown}
              className="rounded-2xl border border-slate-200 px-4 py-4 text-lg disabled:bg-slate-100 disabled:text-slate-400"
              value={form.birthHour || "00"}
              onChange={(e) => onChange({ birthHour: e.target.value })}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = String(i).padStart(2, "0");
                return (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                );
              })}
            </select>

            <select
              disabled={form.birthTimeUnknown}
              className="rounded-2xl border border-slate-200 px-4 py-4 text-lg disabled:bg-slate-100 disabled:text-slate-400"
              value={form.birthMinute || "00"}
              onChange={(e) => onChange({ birthMinute: e.target.value })}
            >
              {Array.from({ length: 60 }, (_, i) => {
                const minute = String(i).padStart(2, "0");
                return (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                );
              })}
            </select>
          </div>

          <label className="mt-3 flex items-center gap-3 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.birthTimeUnknown || false}
              onChange={(e) => onChange({ birthTimeUnknown: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            Time of Birth Unknown
          </label>

          {form.birthTimeUnknown && (
            <p className="mt-2 text-xs text-orange-700">
              3 Pillars mode: Hour Pillar will be omitted and accuracy may be reduced.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Gender
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg"
            value={form.gender}
            onChange={(e) => onChange({ gender: e.target.value })}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Birth Country
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg"
            value={form.birthCountry}
            onChange={(e) => onChange({ birthCountry: e.target.value })}
          >
            <option value="" disabled>
              Select
            </option>
            {BIRTH_COUNTRY_OPTIONS.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm text-stone-500">
            Timezone: {form.birthCountry ? getBirthCountryTimezone(form.birthCountry) : "Select birth country"}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-900">
            Current Energy Year
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-lg"
            value={form.selectedYear}
            onChange={(e) => onChange({ selectedYear: Number(e.target.value) })}
          >
            <option value={2026}>2026</option>
            <option value={2027} disabled>
              2027 Coming Soon
            </option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-3xl border border-yellow-200 bg-yellow-50 p-6">
        <div>
          <h2 className="text-xl font-bold text-orange-900">
            Bazi Calculation
          </h2>
          <p className="mt-2 text-orange-800">
            Find out how your Bazi affects your Wealth, Health, Career and Relationships
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="rounded-2xl bg-orange-700 px-10 py-4 text-sm font-semibold text-white shadow-md hover:bg-orange-600"
        >
          Click Here!
        </button>
      </div>
    </section>
  );
}
