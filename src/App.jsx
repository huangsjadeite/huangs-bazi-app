import huangsLogo from "./assets/hjj-logo-black.png";
import LeadPopup from "./components/LeadPopup";
import { COUNTRY_TIMEZONES } from "./data/countryTimezones";
import React, { useMemo, useState } from "react";
import buildBaziChart from "./engine/buildBaziChart";
import { mapChartToUi } from "./data/mapChartToUi";
import { motion } from "framer-motion";

const GLOBAL_COUNTRY_TIMEZONES = {
  Afghanistan: "Asia/Kabul",
  Albania: "Europe/Tirane",
  Algeria: "Africa/Algiers",
  Andorra: "Europe/Andorra",
  Angola: "Africa/Luanda",
  "Antigua and Barbuda": "America/Antigua",
  Argentina: "America/Argentina/Buenos_Aires",
  Armenia: "Asia/Yerevan",
  Australia: "Australia/Sydney",
  Austria: "Europe/Vienna",
  Azerbaijan: "Asia/Baku",
  Bahamas: "America/Nassau",
  Bahrain: "Asia/Bahrain",
  Bangladesh: "Asia/Dhaka",
  Barbados: "America/Barbados",
  Belarus: "Europe/Minsk",
  Belgium: "Europe/Brussels",
  Belize: "America/Belize",
  Benin: "Africa/Porto-Novo",
  Bhutan: "Asia/Thimphu",
  Bolivia: "America/La_Paz",
  "Bosnia and Herzegovina": "Europe/Sarajevo",
  Botswana: "Africa/Gaborone",
  Brazil: "America/Sao_Paulo",
  Brunei: "Asia/Brunei",
  Bulgaria: "Europe/Sofia",
  "Burkina Faso": "Africa/Ouagadougou",
  Burundi: "Africa/Bujumbura",
  Cambodia: "Asia/Phnom_Penh",
  Cameroon: "Africa/Douala",
  Canada: "America/Toronto",
  "Cape Verde": "Atlantic/Cape_Verde",
  "Central African Republic": "Africa/Bangui",
  Chad: "Africa/Ndjamena",
  Chile: "America/Santiago",
  China: "Asia/Shanghai",
  Colombia: "America/Bogota",
  Comoros: "Indian/Comoro",
  Congo: "Africa/Brazzaville",
  "Costa Rica": "America/Costa_Rica",
  Croatia: "Europe/Zagreb",
  Cuba: "America/Havana",
  Cyprus: "Asia/Nicosia",
  "Czech Republic": "Europe/Prague",
  "Democratic Republic of the Congo": "Africa/Kinshasa",
  Denmark: "Europe/Copenhagen",
  Djibouti: "Africa/Djibouti",
  Dominica: "America/Dominica",
  "Dominican Republic": "America/Santo_Domingo",
  Ecuador: "America/Guayaquil",
  Egypt: "Africa/Cairo",
  "El Salvador": "America/El_Salvador",
  "Equatorial Guinea": "Africa/Malabo",
  Eritrea: "Africa/Asmara",
  Estonia: "Europe/Tallinn",
  Eswatini: "Africa/Mbabane",
  Ethiopia: "Africa/Addis_Ababa",
  Fiji: "Pacific/Fiji",
  Finland: "Europe/Helsinki",
  France: "Europe/Paris",
  Gabon: "Africa/Libreville",
  Gambia: "Africa/Banjul",
  Georgia: "Asia/Tbilisi",
  Germany: "Europe/Berlin",
  Ghana: "Africa/Accra",
  Greece: "Europe/Athens",
  Grenada: "America/Grenada",
  Guatemala: "America/Guatemala",
  Guinea: "Africa/Conakry",
  "Guinea-Bissau": "Africa/Bissau",
  Guyana: "America/Guyana",
  Haiti: "America/Port-au-Prince",
  Honduras: "America/Tegucigalpa",
  "Hong Kong": "Asia/Hong_Kong",
  Hungary: "Europe/Budapest",
  Iceland: "Atlantic/Reykjavik",
  India: "Asia/Kolkata",
  Indonesia: "Asia/Jakarta",
  Iran: "Asia/Tehran",
  Iraq: "Asia/Baghdad",
  Ireland: "Europe/Dublin",
  Israel: "Asia/Jerusalem",
  Italy: "Europe/Rome",
  Jamaica: "America/Jamaica",
  Japan: "Asia/Tokyo",
  Jordan: "Asia/Amman",
  Kazakhstan: "Asia/Almaty",
  Kenya: "Africa/Nairobi",
  Kiribati: "Pacific/Tarawa",
  Kuwait: "Asia/Kuwait",
  Kyrgyzstan: "Asia/Bishkek",
  Laos: "Asia/Vientiane",
  Latvia: "Europe/Riga",
  Lebanon: "Asia/Beirut",
  Lesotho: "Africa/Maseru",
  Liberia: "Africa/Monrovia",
  Libya: "Africa/Tripoli",
  Liechtenstein: "Europe/Vaduz",
  Lithuania: "Europe/Vilnius",
  Luxembourg: "Europe/Luxembourg",
  Macau: "Asia/Macau",
  Madagascar: "Indian/Antananarivo",
  Malawi: "Africa/Blantyre",
  Malaysia: "Asia/Kuala_Lumpur",
  Maldives: "Indian/Maldives",
  Mali: "Africa/Bamako",
  Malta: "Europe/Malta",
  "Marshall Islands": "Pacific/Majuro",
  Mauritania: "Africa/Nouakchott",
  Mauritius: "Indian/Mauritius",
  Mexico: "America/Mexico_City",
  Micronesia: "Pacific/Pohnpei",
  Moldova: "Europe/Chisinau",
  Monaco: "Europe/Monaco",
  Mongolia: "Asia/Ulaanbaatar",
  Montenegro: "Europe/Podgorica",
  Morocco: "Africa/Casablanca",
  Mozambique: "Africa/Maputo",
  Myanmar: "Asia/Yangon",
  Namibia: "Africa/Windhoek",
  Nauru: "Pacific/Nauru",
  Nepal: "Asia/Kathmandu",
  Netherlands: "Europe/Amsterdam",
  "New Zealand": "Pacific/Auckland",
  Nicaragua: "America/Managua",
  Niger: "Africa/Niamey",
  Nigeria: "Africa/Lagos",
  "North Korea": "Asia/Pyongyang",
  "North Macedonia": "Europe/Skopje",
  Norway: "Europe/Oslo",
  Oman: "Asia/Muscat",
  Pakistan: "Asia/Karachi",
  Palau: "Pacific/Palau",
  Palestine: "Asia/Gaza",
  Panama: "America/Panama",
  "Papua New Guinea": "Pacific/Port_Moresby",
  Paraguay: "America/Asuncion",
  Peru: "America/Lima",
  Philippines: "Asia/Manila",
  Poland: "Europe/Warsaw",
  Portugal: "Europe/Lisbon",
  Qatar: "Asia/Qatar",
  Romania: "Europe/Bucharest",
  Russia: "Europe/Moscow",
  Rwanda: "Africa/Kigali",
  "Saint Kitts and Nevis": "America/St_Kitts",
  "Saint Lucia": "America/St_Lucia",
  "Saint Vincent and the Grenadines": "America/St_Vincent",
  Samoa: "Pacific/Apia",
  "San Marino": "Europe/San_Marino",
  "Sao Tome and Principe": "Africa/Sao_Tome",
  "Saudi Arabia": "Asia/Riyadh",
  Senegal: "Africa/Dakar",
  Serbia: "Europe/Belgrade",
  Seychelles: "Indian/Mahe",
  "Sierra Leone": "Africa/Freetown",
  Singapore: "Asia/Singapore",
  Slovakia: "Europe/Bratislava",
  Slovenia: "Europe/Ljubljana",
  "Solomon Islands": "Pacific/Guadalcanal",
  Somalia: "Africa/Mogadishu",
  "South Africa": "Africa/Johannesburg",
  "South Korea": "Asia/Seoul",
  "South Sudan": "Africa/Juba",
  Spain: "Europe/Madrid",
  "Sri Lanka": "Asia/Colombo",
  Sudan: "Africa/Khartoum",
  Suriname: "America/Paramaribo",
  Sweden: "Europe/Stockholm",
  Switzerland: "Europe/Zurich",
  Syria: "Asia/Damascus",
  Taiwan: "Asia/Taipei",
  Tajikistan: "Asia/Dushanbe",
  Tanzania: "Africa/Dar_es_Salaam",
  Thailand: "Asia/Bangkok",
  "Timor-Leste": "Asia/Dili",
  Togo: "Africa/Lome",
  Tonga: "Pacific/Tongatapu",
  "Trinidad and Tobago": "America/Port_of_Spain",
  Tunisia: "Africa/Tunis",
  Turkey: "Europe/Istanbul",
  Turkmenistan: "Asia/Ashgabat",
  Tuvalu: "Pacific/Funafuti",
  Uganda: "Africa/Kampala",
  Ukraine: "Europe/Kyiv",
  "United Arab Emirates": "Asia/Dubai",
  "United Kingdom": "Europe/London",
  "United States": "America/New_York",
  Uruguay: "America/Montevideo",
  Uzbekistan: "Asia/Tashkent",
  Vanuatu: "Pacific/Efate",
  "Vatican City": "Europe/Vatican",
  Venezuela: "America/Caracas",
  Vietnam: "Asia/Ho_Chi_Minh",
  Yemen: "Asia/Aden",
  Zambia: "Africa/Lusaka",
  Zimbabwe: "Africa/Harare",

  // Common territories / regions that customers may search for.
  Aruba: "America/Aruba",
  Bermuda: "Atlantic/Bermuda",
  "British Virgin Islands": "America/Tortola",
  "Cayman Islands": "America/Cayman",
  "Cook Islands": "Pacific/Rarotonga",
  Curaçao: "America/Curacao",
  "Faroe Islands": "Atlantic/Faroe",
  "French Polynesia": "Pacific/Tahiti",
  Gibraltar: "Europe/Gibraltar",
  Greenland: "America/Nuuk",
  Guadeloupe: "America/Guadeloupe",
  Guam: "Pacific/Guam",
  Guernsey: "Europe/Guernsey",
  "Isle of Man": "Europe/Isle_of_Man",
  Jersey: "Europe/Jersey",
  Martinique: "America/Martinique",
  "New Caledonia": "Pacific/Noumea",
  "Northern Mariana Islands": "Pacific/Saipan",
  "Puerto Rico": "America/Puerto_Rico",
  Réunion: "Indian/Reunion",
  "Saint Martin": "America/Marigot",
  "U.S. Virgin Islands": "America/St_Thomas",
};

const BIRTH_COUNTRY_TIMEZONES = {
  ...GLOBAL_COUNTRY_TIMEZONES,
  ...COUNTRY_TIMEZONES,
};

const BIRTH_COUNTRY_OPTIONS = Object.keys(BIRTH_COUNTRY_TIMEZONES).sort((a, b) =>
  a.localeCompare(b)
);

const getBirthCountryTimezone = (country) => {
  return BIRTH_COUNTRY_TIMEZONES[country] || "Asia/Singapore";
};


const ARCHETYPE_EMOJIS = {
  "The Friend": "🤝",
  "The Leader": "👑",
  "The Artist": "🎨",
  "The Performer": "🎤",
  "The Director": "💼",
  "The Pioneer": "🚀",
  "The Diplomat": "⚖️",
  "The Warrior": "⚔️",
  "The Analyzer": "📚",
  "The Philosopher": "🌙",
};

const PROFILE_DISPLAY = {
  friend: {
    actualName: "Friend",
    icon: "🤝",
    name: "The Companion",
    subtitle: "Connection & Loyalty",
    theme:
      "You value loyalty, trust and meaningful connections. Relationships often play an important role in your growth.",
  },
  robWealth: {
    actualName: "Rob Wealth",
    icon: "👑",
    name: "The Challenger",
    subtitle: "Independence & Drive",
    theme:
      "You are independent, competitive and willing to challenge existing limits when pursuing goals or opportunities.",
  },
  eatingGod: {
    actualName: "Eating God",
    icon: "🎨",
    name: "The Creator",
    subtitle: "Expression & Creativity",
    theme:
      "You enjoy expressing ideas, creativity and personal perspectives. Innovation often comes naturally to you.",
  },
  hurtingOfficer: {
    actualName: "Hurting Officer",
    icon: "🎤",
    name: "The Rebel Voice",
    subtitle: "Innovation & Change",
    theme:
      "You question assumptions and are not afraid to express alternative viewpoints when you believe something can improve.",
  },
  directWealth: {
    actualName: "Direct Wealth",
    icon: "💼",
    name: "The Builder",
    subtitle: "Stability & Results",
    theme:
      "You naturally focus on creating stability, ownership and tangible results. You prefer steady progress over unnecessary risk.",
  },
  indirectWealth: {
    actualName: "Indirect Wealth",
    icon: "🚀",
    name: "The Opportunist",
    subtitle: "Opportunity & Timing",
    theme:
      "You are alert to opportunities and often spot possibilities that others miss. Flexibility and timing are important strengths.",
  },
  directOfficer: {
    actualName: "Direct Officer",
    icon: "⚖️",
    name: "The Guardian",
    subtitle: "Responsibility & Structure",
    theme:
      "You value responsibility, structure and doing what is right. Others often see you as dependable and trustworthy.",
  },
  sevenKillings: {
    actualName: "Seven Killings",
    icon: "⚔️",
    name: "The Warrior",
    subtitle: "Courage & Action",
    theme:
      "You perform well under pressure and often step forward when challenges require courage, decisiveness and action.",
  },
  directResource: {
    actualName: "Direct Resource",
    icon: "📚",
    name: "The Nurturer",
    subtitle: "Learning & Support",
    theme:
      "You learn through observation, reflection and support. Building knowledge often strengthens your confidence.",
  },
  indirectResource: {
    actualName: "Indirect Resource",
    icon: "🌙",
    name: "The Mystic",
    subtitle: "Reflection & Insight",
    theme:
      "You are naturally curious and reflective, often seeking deeper meaning, understanding and personal insight.",
  },
};

function getProfileDisplay(profileName) {
  const stripped = String(profileName || "").replace(/\s+/g, "");
  const camelKey = stripped.charAt(0).toLowerCase() + stripped.slice(1);
  return PROFILE_DISPLAY[camelKey] || PROFILE_DISPLAY[stripped] || {};
}

function normalizeScore(value) {
  const raw = Number(value || 0);

  if (raw > 0 && raw <= 1) {
    return Math.round(raw * 100);
  }

  return Math.round(raw);
}

function getStrengthLabel(score) {
  const safeScore = normalizeScore(score);

  if (safeScore >= 80) return "Very Strong";
  if (safeScore >= 65) return "Strong";
  if (safeScore >= 45) return "Moderate";
  if (safeScore >= 25) return "Subtle";
  return "Dormant";
}

function getStrengthBarWidth(score) {
  const label = getStrengthLabel(score);

  if (label === "Very Strong") return "90%";
  if (label === "Strong") return "75%";
  if (label === "Moderate") return "58%";
  if (label === "Subtle") return "38%";
  return "18%";
}

function GenerateProfilePanel({ form, onChange, onGenerate }) {
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
          Click Here
        </button>
      </div>
    </section>
  );
}

function EmotionalEnergyProfile({ profile }) {
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


function TopStrengthsSection({ strengths }) {
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

function FocusRankingSection({ focusRanking, selectedYear }) {
  if (!Array.isArray(focusRanking) || focusRanking.length === 0) return null;

  return (
    <section className="rounded-[36px] border border-blue-200 bg-white px-8 py-10 shadow-md md:px-10">
      <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-700">
        🧭 Your {selectedYear} Priorities
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        What To Prioritise This Year
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        This ranking shows which life areas deserve the most attention this
        year, so you know where to focus instead of trying to improve everything
        at once.
      </p>

      <div className="mt-8 space-y-5">
        {focusRanking.map((item, index) => (
          <div
            key={`${item.key || item.area}-${index}`}
            className="rounded-[28px] border border-slate-200 bg-[#FFFDF8] p-7 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                  Priority {item.rank || index + 1}
                </p>

                <h3 className="mt-3 text-2xl font-bold text-slate-950">
                  {item.area || "Life Area"}
                </h3>

                {item.priority && (
                  <p className="mt-2 text-sm font-semibold text-blue-700">
                    {item.priority}
                  </p>
                )}
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-700">
                {item.rank || index + 1}
              </div>
            </div>

            {item.description && (
              <p className="mt-5 max-w-5xl text-base leading-7 text-stone-600">
                {item.description}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h4 className="text-base font-bold text-blue-900">
                  Why this matters
                </h4>

                <p className="mt-3 text-sm leading-6 text-blue-800">
                  {item.reason ||
                    "This area is important because it affects your choices, energy and growth this year."}
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <h4 className="text-base font-bold text-green-900">
                  What to do
                </h4>

                <p className="mt-3 text-sm leading-6 text-green-800">
                  {item.action ||
                    "Focus on one clear next step that helps this area become easier to manage."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelationshipArchetypeSection({ relationshipArchetype }) {
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

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <InsightList
          icon="✨"
          title="Relationship Strengths"
          items={relationshipArchetype.strengths}
        />

        <InsightList
          icon="⚠️"
          title="Relationship Blind Spots"
          items={relationshipArchetype.blindSpots}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <InsightList
          icon="✅"
          title="Green Flags"
          items={relationshipArchetype.greenFlags}
        />

        <InsightList
          icon="🚩"
          title="Red Flags"
          items={relationshipArchetype.redFlags}
        />
      </div>

      <div className="mt-5">
        <InsightList
          icon="💍"
          title="What You Need In A Partner"
          items={relationshipArchetype.partnerNeeds}
        />
      </div>
    </section>
  );
}


function WealthTeaserSection({ wealth }) {
  if (!wealth) return null;

  const teaserText =
    wealth.wealthStyle ||
    wealth.incomePath ||
    wealth.summary ||
    "This shows the natural way your chart tends to create value, attract opportunities and build financial direction.";

  return (
    <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-white via-[#FFFDF8] to-emerald-50 px-8 py-7 shadow-md">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
        💰 Wealth Archetype
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {wealth.wealthArchetype || "Your Wealth Style"}
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        {teaserText}
      </p>
    </section>
  );
}

function TopProfileStrengthSection({ chart, uiChart }) {
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
    <h3 className="text-xl font-bold text-slate-950">
      Understanding Your Archetypes
    </h3>

        <p className="mt-3 max-w-5xl text-stone-600">
      Each archetype represents a different part of your personality,
      decision-making style and life approach. Stronger archetypes tend to
      appear more naturally, while quieter archetypes may emerge in specific
      situations, relationships or stages of life.
    </p>

    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {supporting.map((item) => {
        const isDormant = item.score === 0;

        return (
          <div
            key={item.key}
            className={`rounded-2xl border p-5 ${
              isDormant
                ? "border-slate-200 bg-slate-50 opacity-75"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-950">
                  {item.icon} {item.name}
                </h4>

                <p className="text-sm text-stone-500">
                  {item.actualName}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  {item.subtitle}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isDormant
                    ? "bg-slate-100 text-slate-500"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {isDormant ? "Dormant" : `${item.score}%`}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              {item.theme}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}
    </section>
  );
}

function normalizeStoneItems(stones) {
  if (!stones) return [];

  if (Array.isArray(stones?.stoneDetails) && stones.stoneDetails.length) {
    return stones.stoneDetails;
  }

  const primaryGroups = stones?.primaryRecommendations || [];
  const secondaryGroups = stones?.secondaryRecommendations || [];

  return [...primaryGroups, ...secondaryGroups].flatMap((group) =>
    (group?.stones || []).map((stone, index) => ({
      rank: `${group.category || "support"}-${index}`,
      name: stone.name,
      type: stone.type,
      element: group.element,
      theme: stone.customerMessage || stone.reason || group.summary,
      bestFor: group.productStyle || "Daily energetic support",
    }))
  );
}

function RecommendedStones({ stones }) {
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

function buildShopifySearchUrl(item) {
  const rawTerms = [
    item?.stone,
    item?.category,
    ...(item?.productSearchTags || []),
    item?.name,
    item?.type,
  ].filter(Boolean);

  const uniqueTerms = [...new Set(rawTerms)];
  // Keep the query broad (1-2 terms). The store's product titles are
  // descriptive ("Natural Blue Moonstone Pendant ..."), so the stone name
  // alone matches best; stacking every tag over-narrows and returns nothing.
  const searchQuery = uniqueTerms.slice(0, 2).join(" ");

  return `https://www.huangsjadeiteandjewelry.com/search?q=${encodeURIComponent(
    searchQuery
  )}`;
}

function ProductRecommendationsSection({ products }) {
  if (!products) return null;

  const primaryProducts = products.primaryProducts || [];
  const secondaryProducts = products.secondaryProducts || [];
  const topProduct = products.topProduct || primaryProducts[0] || null;

  if (!primaryProducts.length && !secondaryProducts.length) return null;

  return (
    <section className="rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-[#FFFDF8] to-orange-50 px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
        Product Recommendations
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {topProduct
          ? `${topProduct.stone} ${topProduct.category} is your top match`
          : "Recommended pieces for your chart"}
      </h2>

      <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
        These recommendations translate your supportive elements into practical product forms,
        such as jadeite pendants, bracelets, bangles and gemstone pieces.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[...primaryProducts, ...secondaryProducts].slice(0, 5).map((item, index) => (
          <div
            key={`${item.stone}-${item.category}-${index}`}
            className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">🛍️</div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-orange-700">
              {item.priority} Recommendation
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-950">
              {item.stone} {item.category}
            </h3>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              {item.customerMessage || item.reason}
            </p>

                        <div className="mt-5 flex flex-wrap gap-2">
              {item.productSearchTags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                >
                  {tag}
                </span>
              ))}
            </div>

                       <a
  href={buildShopifySearchUrl(item)}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 block w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-center text-sm font-bold text-orange-700 transition hover:bg-orange-100"
>
  View Matching Pieces →
</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function WealthArchetypeSection({ wealth }) {
  if (!wealth) return null;

  return (
    <section className="rounded-[28px] border border-emerald-200 bg-white px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
        Wealth Archetype
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {wealth.wealthArchetype || "Your Wealth Style"}
      </h2>

      <p className="mt-4 text-lg text-emerald-700 font-semibold">
        {wealth.wealthStyle}
      </p>

      <p className="mt-5 max-w-4xl text-base leading-7 text-stone-600">
        {wealth.incomePath}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-950">
            💰 Income Style
          </h3>

          <p className="mt-4 text-base text-stone-600">
            {wealth.incomeStyle}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(wealth.idealIncomeModels || []).map((model) => (
              <span
                key={model}
                className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
              >
                {model}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-950">
            🧠 Wealth Mindset
          </h3>

          <p className="mt-4 text-base text-stone-600">
            {wealth.moneyMindset}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {wealth.primaryUsefulGod && (
              <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                Primary Support: {wealth.primaryUsefulGod}
              </span>
            )}

            {wealth.secondaryUsefulGod && (
              <span className="rounded-full bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700">
                Secondary Support: {wealth.secondaryUsefulGod}
              </span>
            )}
          </div>
        </div>
      </div>

      {!!wealth.moneyStrengths?.length && (
        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">
          <h3 className="text-xl font-bold text-green-900">
            ✨ Wealth Strengths
          </h3>

          <ul className="mt-4 space-y-3">
            {wealth.moneyStrengths.map((item) => (
              <li key={item} className="text-green-800">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!wealth.moneyBlindSpots?.length && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
          <h3 className="text-xl font-bold text-red-900">
            ⚠ Wealth Blind Spots
          </h3>

          <ul className="mt-4 space-y-3">
            {wealth.moneyBlindSpots.map((item) => (
              <li key={item} className="text-red-800">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RelationshipPatternSection({ relationshipPattern }) {
  if (!relationshipPattern) return null;

  const hasContent =
    relationshipPattern.relationshipStyle ||
    relationshipPattern.relationshipPattern ||
    relationshipPattern.summary ||
    relationshipPattern.emotionalNeeds?.length ||
    relationshipPattern.relationshipStrengths?.length ||
    relationshipPattern.relationshipBlindSpots?.length ||
    relationshipPattern.idealPartnerTraits?.length ||
    relationshipPattern.growthAdvice?.length;

  if (!hasContent) return null;

  return (
    <section className="rounded-[28px] border border-rose-200 bg-white px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
        Relationship Growth Insights
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        How You Can Grow In Relationships
      </h2>

      <p className="mt-5 max-w-4xl text-base leading-7 text-stone-600">
        {relationshipPattern.summary ||
          relationshipPattern.relationshipPattern ||
          "This section shows the emotional habits, needs and growth patterns that affect how you build trust and connection over time."}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {!!relationshipPattern.emotionalNeeds?.length && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
            <h3 className="text-xl font-bold text-rose-900">
              ❤️ Emotional Needs
            </h3>

            <ul className="mt-4 space-y-3">
              {relationshipPattern.emotionalNeeds.map((item) => (
                <li key={item} className="text-rose-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!!relationshipPattern.idealPartnerTraits?.length && (
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
            <h3 className="text-xl font-bold text-purple-900">
              💍 Ideal Partner Traits
            </h3>

            <ul className="mt-4 space-y-3">
              {relationshipPattern.idealPartnerTraits.map((item) => (
                <li key={item} className="text-purple-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {!!relationshipPattern.relationshipStrengths?.length && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <h3 className="text-xl font-bold text-green-900">
              ✨ Relationship Strengths
            </h3>

            <ul className="mt-4 space-y-3">
              {relationshipPattern.relationshipStrengths.map((item) => (
                <li key={item} className="text-green-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!!relationshipPattern.relationshipBlindSpots?.length && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="text-xl font-bold text-red-900">
              ⚠ Relationship Blind Spots
            </h3>

            <ul className="mt-4 space-y-3">
              {relationshipPattern.relationshipBlindSpots.map((item) => (
                <li key={item} className="text-red-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!!relationshipPattern.growthAdvice?.length && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="text-xl font-bold text-blue-900">
            🌱 Relationship Growth Advice
          </h3>

          <ul className="mt-4 space-y-3">
            {relationshipPattern.growthAdvice.map((item) => (
              <li key={item} className="text-blue-800">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

    </section>
  );
}

function GrowthAdviceSection({ growthAdvice }) {
  if (!growthAdvice) return null;

  return (
    <section className="rounded-[28px] border border-blue-200 bg-white px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
        Your Next Growth Phase
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-950">
        {growthAdvice.growthFocus || "Your Growth Direction"}
      </h2>

      <p className="mt-5 max-w-4xl text-base leading-7 text-stone-600">
        {growthAdvice.summary}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
          <h3 className="text-xl font-bold text-green-900">
            ✨ Strengths To Lean On
          </h3>

          <ul className="mt-4 space-y-3">
            {(growthAdvice.growthStrengths || []).map((item) => (
              <li key={item} className="text-green-800">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h3 className="text-xl font-bold text-red-900">
            ⚠ Patterns To Avoid
          </h3>

          <ul className="mt-4 space-y-3">
            {(growthAdvice.avoidPatterns || []).map((item) => (
              <li key={item} className="text-red-800">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="text-xl font-bold text-blue-900">
          🚀 Next Level Actions
        </h3>

        <ul className="mt-4 space-y-3">
          {(growthAdvice.nextLevelActions || []).map((item) => (
            <li key={item} className="text-blue-800">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {growthAdvice.supportiveEnergy?.primaryUsefulGod && (
        <div className="mt-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-6">
          <h3 className="text-xl font-bold text-yellow-900">
            🌿 Supportive Energy
          </h3>

          <p className="mt-4 text-yellow-800">
            Primary Useful God:{" "}
            <strong>
              {growthAdvice.supportiveEnergy.primaryUsefulGod}
            </strong>
          </p>

          {growthAdvice.supportiveEnergy.secondaryUsefulGod && (
            <p className="mt-2 text-yellow-800">
              Secondary Support:{" "}
              <strong>
                {growthAdvice.supportiveEnergy.secondaryUsefulGod}
              </strong>
            </p>
          )}

          <p className="mt-4 text-sm text-yellow-700">
            {growthAdvice.supportiveEnergy.note}
          </p>
        </div>
      )}
    </section>
  );
}

function EmotionalEnergyBalance({ elements }) {
  const elementRows = (elements || []).map((element) => {
    const percentage = Number(element.percentage || 0);

    let label = "Balanced";
    if (percentage >= 25) label = "Strong";
    if (percentage <= 12) label = "Weak";

    const emojiMap = {
      Wood: "🌿",
      Fire: "🔥",
      Earth: "⛰️",
      Metal: "⚔️",
      Water: "💧",
    };

    const annualPercentage = Number(
      element.annualPercentage || element.annual || percentage
    );

    const scaleElementBar = (value) => {
      return Math.min(100, Math.round((Number(value || 0) / 40) * 100));
    };

    const convertToTen = (value) => {
      return Math.min(10, Math.round((Number(value || 0) / 40) * 10));
    };

    return {
      name: element?.name || "",
      emoji: emojiMap[element?.name] || "✨",
      natal: convertToTen(percentage),
      annual: convertToTen(annualPercentage),
      label,
      natalScore: scaleElementBar(percentage),
      annualScore: scaleElementBar(annualPercentage),
    };
  });

  if (!elementRows.length) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
        〰️ Energy Analysis
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-950">
        Your Emotional Energy Balance
      </h2>

      <p className="mt-6 text-lg leading-relaxed text-slate-600">
        <span className="font-bold text-blue-700">What this shows:</span>{" "}
        An overview of how your emotional energy naturally behaves across the Five Elements.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {elementRows.map(({ name, emoji, natal, annual, label, natalScore, annualScore }) => {
          const statusClass =
            label === "Strong"
              ? "bg-green-50 text-green-700"
              : label === "Balanced"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700";

          return (
            <div
              key={name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  {emoji}
                </div>
                <h3 className="text-xl font-bold text-slate-950">{name}</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Natal Strength</span>
                    <span className="font-bold text-slate-900">{natal}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-red-900"
                      style={{ width: `${natalScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Yearly Influence</span>
                    <span className="font-bold text-slate-900">{annual}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-orange-600"
                      style={{ width: `${annualScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={`mt-6 rounded-xl px-4 py-3 text-base font-bold ${statusClass}`}>
                ● {label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getFriendlyCoreEnergyStatus(status, score) {
  const numericScore = Number(score);

  if (Number.isFinite(numericScore)) {
    if (numericScore >= 80) return "Very Strong";
    if (numericScore >= 65) return "Strong";
    if (numericScore >= 45) return "Balanced";
    if (numericScore >= 25) return "Gentle";
    return "Needs Support";
  }

  if (status === "Excessive") return "Very Strong";
  if (status === "Under-supported") return "Needs Support";

  return status || "-";
}

function formatCoreEnergyScore(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) return "";

  return `Strength Score: ${numericScore.toFixed(2)} / 100`;
}

function UsefulGodSection({ balance }) {
  if (!balance) return null;

    const coreEnergyStatus = getFriendlyCoreEnergyStatus(
    balance?.coreEnergyStatus,
    balance?.coreEnergyScore
  );
  const coreEnergyScore = formatCoreEnergyScore(balance?.coreEnergyScore);
  const seasonalDominantElement = balance?.seasonalDominantElement || "-";
  const supportiveElements = balance?.supportiveElements || [];
  const cautionElements = balance?.cautionElements || [];

  const explanation =
    balance?.explanation ||
    "Focusing on supportive elements can help you stay emotionally grounded, reduce internal pressure and create more flow in your daily life.";

  const balanceCards = [
        {
      emoji: "🧘",
      label: "Core Energy Strength",
      value: coreEnergyStatus,
      score: coreEnergyScore,
      text: "This shows how strong your core chart energy is, without labelling it as good or bad.",
    },
    {
      emoji: "🌿",
      label: "Environmental Energy",
      value: seasonalDominantElement,
      score: "",
      text: "This shows the strongest surrounding energy influencing your natural temperament and timing.",
    },
    {
      emoji: "👍",
      label: "Supportive Elements",
      value: supportiveElements.length ? supportiveElements.join(" · ") : "-",
      score: "",
      text: "These elements help restore balance, improve flow and support better decision-making.",
    },
    {
      emoji: "🛡️",
      label: "Elements to Balance Carefully",
      value: cautionElements.length ? cautionElements.join(" · ") : "-",
      score: "",
      text: "These elements are not bad, but too much of them may create pressure, overthinking or imbalance.",
    },
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <div className="mb-8 inline-flex items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-orange-700">
        ✨ Energy Guidance
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-950">
        Personal Energy Balance
      </h2>

      <p className="mt-5 text-lg leading-relaxed text-stone-500">
        Discover the energies that support your well-being and those to be mindful of.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {balanceCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl">
                {item.emoji}
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">
                  {item.label}
                </p>

                <h3 className="mt-4 text-2xl font-bold text-slate-950">
                  {item.value}
                </h3>

                {item.score && (
                  <p className="mt-1 text-sm text-stone-500">{item.score}</p>
                )}
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-stone-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-yellow-50 p-6">
        <p className="text-lg font-bold text-slate-950">
          ✨ What this means for you
        </p>

        <p className="mt-4 text-base leading-relaxed text-stone-600">
          {explanation}
        </p>
      </div>
    </section>
  );
}

function getFreePreviewReport(report) {
  if (!report) return null;

  return {
    ...report,
    executiveSummary: getFirstParagraph(report.executiveSummary),
    strengths: (report.strengths || []).slice(0, 2),
    blindSpots: (report.blindSpots || []).slice(0, 2),
    growthAdvice: (report.growthAdvice || []).slice(0, 2),
  };
}

function getFirstParagraph(text) {
  if (!text) return "";

  return String(text)
    .split("\n\n")
    .filter(Boolean)
    .slice(0, 2)
    .join("\n\n");
}

function FinalReflectionSection() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white px-8 py-10 shadow-md md:px-10">
      <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-600">
        Final Reflection
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        Your chart is a guide, not a fixed destiny.
      </h2>

      <p className="mt-5 max-w-5xl text-lg leading-8 text-stone-600">
        Your Bazi profile reflects your natural strengths, recurring patterns
        and the energies that support your growth. Use it as a guide for making
        more conscious choices in your career, wealth, relationships and
        wellbeing.
      </p>
    </section>
  );
}

function AdminBulletList({ items, render }) {
  if (!Array.isArray(items) || !items.length) {
    return <p className="mt-3 text-sm italic text-stone-400">No data.</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-base leading-7 text-stone-700">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1 text-orange-600">•</span>
          <span>
            {render
              ? render(item)
              : typeof item === "string"
              ? item
              : item?.title || item?.text || JSON.stringify(item)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AdminReportSection({ icon, title, children }) {
  return (
    <div className="mt-10 border-t border-amber-100 pt-8">
      <h3 className="text-2xl font-bold text-slate-950">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function AdminMonthCallout({ label, months, tone = "good" }) {
  if (!months?.length) return null;

  const toneClass =
    tone === "good"
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";

  return (
    <p className="mt-3 text-sm">
      <span className={`rounded-full px-2.5 py-0.5 font-bold ${toneClass}`}>
        {label}: {months.join(", ")}
      </span>
    </p>
  );
}

function AdminStrengthRiskGrid({ strengths, risks, strengthLabel = "Strengths", riskLabel = "Risks" }) {
  if (!strengths?.length && !risks?.length) return null;

  return (
    <div className="mt-5 grid gap-5 md:grid-cols-2">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
          {strengthLabel}
        </p>
        <AdminBulletList items={strengths} />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
          {riskLabel}
        </p>
        <AdminBulletList items={risks} />
      </div>
    </div>
  );
}

function AdminFullReport({ report, clientName }) {
  if (!report) {
    return (
      <p className="mt-6 text-sm italic text-stone-400">
        Full report data is not available for this chart.
      </p>
    );
  }

  const narrative = report.narrative || {};
  const personality = report.personalityAndStructure || {};
  const usefulGod = report.usefulGodAndElements || {};
  const lifeAreas = report.lifeAreas || {};
  const stones = report.practicalSupport?.stones || {};
  const eightMansions = report.personalDirectionsAndStars?.eightMansions || null;
  const shenSha = report.personalDirectionsAndStars?.shenSha?.stars || [];

  const rankedProfiles = [...(personality.tenProfileScoring?.rankedProfiles || [])].sort(
    (a, b) => b.percentage - a.percentage
  );
  const findProfilePct = (name) =>
    rankedProfiles.find((p) => p.profile === name)?.percentage;
  const career = lifeAreas.career || {};
  const wealth = lifeAreas.wealth || {};
  const wealthArchetype = lifeAreas.wealthArchetype || {};
  const relationship = lifeAreas.relationship || {};
  const relationshipArchetype = lifeAreas.relationshipArchetype || {};
  const relationshipPattern = lifeAreas.relationshipPattern || {};
  const health = lifeAreas.health || {};
  const blindSpots = personality.blindSpots || {};
  const lifeThemes = lifeAreas.lifeThemes || {};
  const growthAdvice = lifeAreas.growthAdvice || {};
  const elementalBalance = report.chartFoundation?.elementalBalance || [];
  const monthlyOutlook = report.annualEnergy?.monthlyOverlay?.months || [];
  const strongerElements = elementalBalance.slice(0, 2).map((e) => e.name);
  const weakerElements = [...elementalBalance].slice(-2).map((e) => e.name);

  const directWealthPct = findProfilePct("Direct Wealth");
  const indirectWealthPct = findProfilePct("Indirect Wealth");

  // Only surface a career-relevant profile's % if it's actually prominent
  // in this chart (top 4) - forcing it into every report regardless of
  // rank would misrepresent charts where it's dormant.
  const findTopProfilePct = (names, topN = 4) => {
    for (const name of names) {
      const idx = rankedProfiles.findIndex((p) => p.profile === name);
      if (idx !== -1 && idx < topN) {
        return { name: rankedProfiles[idx].profile, percentage: rankedProfiles[idx].percentage };
      }
    }
    return null;
  };
  const careerAuthorityProfile = findTopProfilePct(["Direct Officer", "Seven Killings"]);
  const careerOutputProfile = findTopProfilePct(["Hurting Officer", "Eating God"]);

  const weakestElement = elementalBalance[elementalBalance.length - 1];

  // Which element plays which Ten-God role for this Day Master (Self/
  // Resource/Output/Wealth/Officer) - structural fact, independent of
  // favourability.
  const elementForRole = (roleName) =>
    elementalBalance.find((e) => e.role === roleName)?.name;
  const officerElement = elementForRole("Officer");
  const outputElement = elementForRole("Output");
  const wealthElement = elementForRole("Wealth");

  // A role being structurally relevant to an area (e.g. Officer -> Career)
  // doesn't mean it's good for THIS chart - that depends on the Day Master's
  // strength band. Intersect with what's actually favourable here so a weak
  // Day Master chart (where Officer drains rather than helps) doesn't get a
  // false "strong career month" callout.
  const favourableSet = new Set([
    ...(usefulGod.favourableElements || []),
    ...(usefulGod.secondaryFavourableElements || []),
  ]);

  const monthNamesWhere = (predicate) =>
    monthlyOutlook.filter(predicate).map((m) => m.monthName);

  const cautionSet = new Set(usefulGod.cautionElements || []);
  const partnerStarElement = relationship.spouseStar?.element || null;

  const careerStrongMonths = monthNamesWhere(
    (m) =>
      favourableSet.has(m.dominantElement) &&
      (m.dominantElement === officerElement || m.dominantElement === outputElement)
  );
  const careerCautionMonths = monthNamesWhere(
    (m) =>
      cautionSet.has(m.dominantElement) &&
      (m.dominantElement === officerElement || m.dominantElement === outputElement)
  );
  const wealthStrongMonths = monthNamesWhere(
    (m) => favourableSet.has(m.dominantElement) && m.dominantElement === wealthElement
  );
  const wealthCautionMonths = monthNamesWhere(
    (m) => cautionSet.has(m.dominantElement) && m.dominantElement === wealthElement
  );
  // "Good" relationship months are anchored to the partner star element
  // (the chart's own structural relationship signal) rather than the
  // general favourable set, mirroring how Career/Wealth use their own
  // role element rather than a generic favourable/caution split.
  const relationshipGoodMonths = monthNamesWhere(
    (m) => favourableSet.has(m.dominantElement) && m.dominantElement === partnerStarElement
  );
  const relationshipCautionMonths = monthNamesWhere((m) =>
    (relationship.timingNotes?.activatedBy || []).includes(m.dominantElement)
  );
  const wellnessEasierMonths = monthNamesWhere((m) => m.read === "Good");
  const wellnessCautionMonths = monthNamesWhere((m) => m.read === "Caution");

  return (
    <div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-bold text-slate-700">Client Profile</p>

        <button
          type="button"
          data-html2canvas-ignore="true"
          onClick={() => exportAdminReportToPdf(clientName)}
          className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600"
        >
          Export as PDF
        </button>
      </div>

      <table className="mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 text-sm">
        <tbody>
          {[
            ["Name", clientName || "-"],
            [
              "Day Master",
              report.chartFoundation?.dayMasterElement
                ? `${report.chartFoundation.dayMasterElement} (${
                    report.chartFoundation?.dayMasterStrength?.status || "-"
                  })`
                : report.chartFoundation?.dayMasterStrength?.status || "-",
            ],
            ["Stronger Elements", strongerElements.join(", ") || "-"],
            ["Weaker Elements", weakerElements.join(", ") || "-"],
            ["Structure", personality.structureScoring?.mainStructure?.name || "-"],
            [
              "Useful God",
              `${usefulGod.primaryUsefulGod || "-"} (primary) · ${
                usefulGod.secondaryUsefulGod || "-"
              } (secondary)`,
            ],
          ].map(([label, value]) => (
            <tr key={label} className="border-b border-slate-100 last:border-0">
              <td className="bg-slate-50 px-4 py-2.5 font-semibold text-slate-700">
                {label}
              </td>
              <td className="px-4 py-2.5 text-stone-700">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!!elementalBalance.length && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">5 Elements Balance</h3>
          <p className="mt-2 text-sm text-stone-500">
            Natal Chart vs. {report.annualEnergy?.selectedYear || "this year"}'s Annual
            Energy, and what each element represents for this Day Master.
          </p>
          <div className="mt-4 space-y-3">
            {elementalBalance.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-base font-bold text-slate-950">
                  {item.name} — Natal {item.natalPercentage}% · Annual{" "}
                  {item.annualPercentage}%
                  {item.role && (
                    <span className="ml-2 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      {item.role}
                    </span>
                  )}
                </p>
                {item.roleDescription && (
                  <p className="mt-1 text-sm text-stone-600">
                    For this Day Master, {item.name} governs {item.roleDescription}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!!rankedProfiles.length && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">Personality Profile Breakdown</h3>
          <p className="mt-3 text-sm text-stone-500">
            Full ten-god profile ranking, strongest to most dormant.
          </p>
          <div className="mt-4 space-y-3">
            {rankedProfiles.map((item) => {
              const display = getProfileDisplay(item.profile);
              return (
                <div
                  key={item.profile}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="text-base font-bold text-slate-950">
                    {display.icon} {item.percentage}% {item.profile}
                    {display.name ? ` — ${display.name}` : ""}
                  </p>
                  {display.subtitle && (
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      {display.subtitle}
                    </p>
                  )}
                  {display.theme && (
                    <p className="mt-1.5 text-sm text-stone-600">{display.theme}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!!monthlyOutlook.length && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">
            🗓️ Monthly Outlook — {report.annualEnergy?.selectedYear || ""}
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Each month's energy read against this chart's favourable and
            caution elements.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  <th className="px-4 py-2.5">Month</th>
                  <th className="px-4 py-2.5">Read</th>
                  <th className="px-4 py-2.5">Note</th>
                </tr>
              </thead>
              <tbody>
                {monthlyOutlook.map((item) => (
                  <tr
                    key={item.month}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-2.5 font-semibold text-slate-800">
                      {item.monthName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.read === "Good"
                            ? "bg-green-50 text-green-700"
                            : item.read === "Caution"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.read}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-stone-600">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
        The Four Key Areas
      </p>

      <AdminReportSection icon="💼" title="Career Timing & Direction">
        {(careerAuthorityProfile || careerOutputProfile) && (
          <p className="mt-3 text-sm font-semibold text-amber-700">
            {careerAuthorityProfile &&
              `${careerAuthorityProfile.name} ${careerAuthorityProfile.percentage}%`}
            {careerAuthorityProfile && careerOutputProfile && " · "}
            {careerOutputProfile &&
              `${careerOutputProfile.name} ${careerOutputProfile.percentage}%`}
          </p>
        )}
        <AdminMonthCallout label="Strongest months" months={careerStrongMonths} tone="good" />
        <AdminMonthCallout label="Pace yourself" months={careerCautionMonths} tone="caution" />
        {career.careerStyle && (
          <p className="mt-3 text-base text-stone-700">
            <strong>{career.careerStyle}</strong>
            {career.leadershipStyle ? ` · ${career.leadershipStyle}` : ""}
          </p>
        )}
        {(career.careerStrategy || career.idealWorkEnvironment) && (
          <p className="mt-2 text-base leading-7 text-stone-700">
            {career.careerStrategy || career.idealWorkEnvironment}
          </p>
        )}
        {narrative.careerFocus && (
          <p className="mt-3 text-base leading-7 text-stone-700">{narrative.careerFocus}</p>
        )}
        <AdminStrengthRiskGrid
          strengths={career.careerStrengths}
          risks={career.careerRisks}
          strengthLabel="Career Strengths"
          riskLabel="Career Risks"
        />
        {!!career.recommendedDirections?.length && (
          <div className="mt-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Recommended Directions
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {career.recommendedDirections.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </AdminReportSection>

      <AdminReportSection icon="💰" title="Wealth Opportunities">
        {(directWealthPct != null || indirectWealthPct != null) && (
          <p className="mt-3 text-sm font-semibold text-amber-700">
            {indirectWealthPct != null && `Indirect Wealth ${indirectWealthPct}%`}
            {indirectWealthPct != null && directWealthPct != null && " · "}
            {directWealthPct != null && `Direct Wealth ${directWealthPct}%`}
          </p>
        )}
        <AdminMonthCallout label="Strongest months" months={wealthStrongMonths} tone="good" />
        <AdminMonthCallout label="Pace yourself" months={wealthCautionMonths} tone="caution" />
        {wealthArchetype.wealthArchetype && (
          <p className="mt-3 text-base text-stone-700">
            <strong>{wealthArchetype.wealthArchetype}</strong>
            {wealth.incomeStyle ? ` · ${wealth.incomeStyle}` : ""}
          </p>
        )}
        {narrative.wealthFocus && (
          <p className="mt-3 text-base leading-7 text-stone-700">{narrative.wealthFocus}</p>
        )}
        {wealth.wealthStrategy && (
          <p className="mt-3 text-base leading-7 text-stone-700">{wealth.wealthStrategy}</p>
        )}
        <AdminStrengthRiskGrid
          strengths={wealth.wealthStrengths || wealthArchetype.moneyStrengths}
          risks={wealth.wealthRisks || wealthArchetype.moneyBlindSpots}
          strengthLabel="Wealth Strengths"
          riskLabel="Wealth Blind Spots"
        />
        {!!wealthArchetype.idealIncomeModels?.length && (
          <div className="mt-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Ideal Income Models
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {wealthArchetype.idealIncomeModels.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </AdminReportSection>

      <AdminReportSection icon="❤️" title="Relationship Dynamics">
        {relationshipArchetype.name && (
          <p className="mt-3 text-base text-stone-700">
            <strong>{relationshipArchetype.name}</strong>
            {relationshipPattern.relationshipStyle
              ? ` · ${relationshipPattern.relationshipStyle}`
              : ""}
          </p>
        )}
        <AdminMonthCallout label="Good months" months={relationshipGoodMonths} tone="good" />
        <AdminMonthCallout
          label="Extra grounding needed"
          months={relationshipCautionMonths}
          tone="caution"
        />
        {narrative.relationshipFocus && (
          <p className="mt-3 text-base leading-7 text-stone-700">
            {narrative.relationshipFocus}
          </p>
        )}
        {relationship.spouseStar?.interpretation && (
          <p className="mt-3 text-base leading-7 text-stone-700">
            {relationship.spouseStar.interpretation}
          </p>
        )}
        {!!favourableSet.size && (
          <p className="mt-3 text-base leading-7 text-stone-700">
            Partners whose own chart leans toward {[...favourableSet].join(", ")} -
            this chart's own supportive elements - tend to reinforce rather than
            drain this person's energy, since those are the same elements this
            Day Master already benefits from.
          </p>
        )}
        {!!relationship.partnerDynamics?.potentialChallenges?.length && (
          <p className="mt-3 text-base leading-7 text-stone-700">
            {relationship.partnerDynamics.potentialChallenges.join(" ")}
          </p>
        )}
        {relationship.timingNotes?.annualInfluence && (
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            <strong>{report.annualEnergy?.selectedYear || "This year"}:</strong>{" "}
            {relationship.timingNotes.annualInfluence}{" "}
            {relationship.timingNotes.caution}
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

      <AdminReportSection icon="🌿" title="Wellness & Energy Balance">
        {report.chartFoundation?.dayMasterStrength?.status && (
          <p className="mt-3 text-sm font-semibold text-amber-700">
            Day Master: {report.chartFoundation.dayMasterStrength.status}
            {report.chartFoundation.dayMasterStrength.strengthScore != null &&
              ` (${Number(report.chartFoundation.dayMasterStrength.strengthScore).toFixed(1)}/100)`}
          </p>
        )}
        <AdminMonthCallout label="Easier months" months={wellnessEasierMonths} tone="good" />
        <AdminMonthCallout label="Pace yourself" months={wellnessCautionMonths} tone="caution" />
        {health.vitalityLevel && (
          <p className="mt-3 text-base text-stone-700">
            <strong>{health.vitalityLevel}</strong>
            {health.stressPattern ? ` · ${health.stressPattern}` : ""}
          </p>
        )}
        {narrative.wellnessFocus && (
          <p className="mt-3 text-base leading-7 text-stone-700">{narrative.wellnessFocus}</p>
        )}
        {health.healthStrategy && (
          <p className="mt-3 text-base leading-7 text-stone-700">{health.healthStrategy}</p>
        )}
        {weakestElement && (
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            <strong>
              {weakestElement.name} is your weakest element at {weakestElement.natalPercentage}%
              natally
            </strong>
            {weakestElement.roleDescription &&
              ` — for this Day Master, ${weakestElement.name} governs ${weakestElement.roleDescription}, so this is worth conscious support.`}
            {weakestElement.bodySystem &&
              ` In classical Five-Element wellness, ${weakestElement.name} is also associated with ${weakestElement.bodySystem} — worth keeping in mind as a lifestyle/energy focus, not a medical diagnosis.`}
          </p>
        )}
        <AdminStrengthRiskGrid
          strengths={health.wellnessStrengths}
          risks={health.wellnessRisks}
          strengthLabel="Wellness Strengths"
          riskLabel="Wellness Risks"
        />
      </AdminReportSection>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
        Additional Reference
      </p>

      <AdminReportSection icon="✨" title="Hidden Strengths">
        <AdminBulletList
          items={personality.topStrengths}
          render={(item) => (
            <>
              <strong>{item.title}</strong> — {item.description}
            </>
          )}
        />
      </AdminReportSection>

      <AdminReportSection icon="⚠️" title="Personal Blind Spots">
        {blindSpots.summary && (
          <p className="mt-3 text-base leading-7 text-stone-700">{blindSpots.summary}</p>
        )}
        <AdminBulletList items={blindSpots.blindSpots} />
        {blindSpots.growthAdvice && (
          <p className="mt-4 text-base leading-7 text-stone-700">
            <strong>Growth advice:</strong> {blindSpots.growthAdvice}
          </p>
        )}
      </AdminReportSection>

      <AdminReportSection icon="💎" title="Supportive Elements & Stones">
        <p className="mt-3 text-base text-stone-700">
          Favourable: {(usefulGod.favourableElements || []).join(", ") || "-"} · Use carefully:{" "}
          {(usefulGod.cautionElements || []).join(", ") || "-"}
        </p>
        {!!stones.primaryRecommendations?.length && (
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Primary Stones ({stones.primaryRecommendations[0]?.element})
            </p>
            <AdminBulletList
              items={stones.primaryRecommendations[0]?.stones}
              render={(item) => (
                <>
                  <strong>{item.name}</strong> — {item.customerMessage}
                </>
              )}
            />
          </div>
        )}
        {!!stones.secondaryRecommendations?.length && (
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Secondary Stones ({stones.secondaryRecommendations[0]?.element})
            </p>
            <AdminBulletList
              items={stones.secondaryRecommendations[0]?.stones}
              render={(item) => (
                <>
                  <strong>{item.name}</strong> — {item.customerMessage}
                </>
              )}
            />
          </div>
        )}
      </AdminReportSection>

      <AdminReportSection icon="🧭" title="Long-Term Life Direction">
        {!!lifeThemes.primaryThemes?.length && (
          <p className="mt-3 text-base text-stone-700">
            <strong>Primary themes:</strong> {lifeThemes.primaryThemes.join(" · ")}
          </p>
        )}
        {!!lifeThemes.supportingThemes?.length && (
          <p className="mt-2 text-base text-stone-700">
            <strong>Supporting themes:</strong> {lifeThemes.supportingThemes.join(" · ")}
          </p>
        )}
        {growthAdvice.summary && (
          <p className="mt-3 text-base leading-7 text-stone-700">{growthAdvice.summary}</p>
        )}
        {!!growthAdvice.nextLevelActions?.length && (
          <div className="mt-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Next Level Actions
            </p>
            <AdminBulletList items={growthAdvice.nextLevelActions} />
          </div>
        )}
      </AdminReportSection>

      {eightMansions && (
        <AdminReportSection icon="🧭" title="Personal Directions (Eight Mansions)">
          <p className="mt-3 text-base text-stone-700">
            <strong>
              {eightMansions.lifeStar} ({eightMansions.trigram}, {eightMansions.element})
            </strong>{" "}
            · Personal direction: {eightMansions.personalDirection} · {eightMansions.group}
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Favourable Directions
              </p>
              <AdminBulletList
                items={eightMansions.favourableDirections}
                render={(item) => (
                  <>
                    <strong>{item.direction}</strong> — {item.name} ({item.label}):{" "}
                    {item.theme}
                  </>
                )}
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
                Unfavourable Directions
              </p>
              <AdminBulletList
                items={eightMansions.unfavourableDirections}
                render={(item) => (
                  <>
                    <strong>{item.direction}</strong> — {item.name} ({item.label})
                  </>
                )}
              />
            </div>
          </div>
        </AdminReportSection>
      )}

      {!!shenSha.length && (
        <AdminReportSection icon="🌸" title="Personal Stars (Shen Sha)">
          <AdminBulletList
            items={shenSha}
            render={(item) => {
              const branches = item.branches
                ? item.branches.map((b) => `${b.zh} ${b.animal}`).join(" / ")
                : `${item.branch.zh} ${item.branch.animal}`;
              return (
                <>
                  <strong>
                    {item.name} ({item.zh})
                  </strong>{" "}
                  — {branches}
                  {item.active ? " · active in this chart" : ""}. {item.theme}
                  {item.caution ? ` ${item.caution}` : ""}
                </>
              );
            }}
          />
        </AdminReportSection>
      )}

      <details
        data-html2canvas-ignore="true"
        className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <summary className="cursor-pointer text-sm font-bold text-slate-700">
          Raw report data (debug)
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs leading-5 text-slate-600">
          {JSON.stringify(report, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function exportAdminReportToPdf(clientName) {
  const element = document.getElementById("admin-full-report");
  if (!element) return;

  // html2canvas-pro (not plain html2canvas) is required here: Tailwind v4
  // generates oklch() colors, which the unmaintained-for-this stock
  // html2canvas can't parse and silently fails on.
  Promise.all([import("html2canvas-pro"), import("jspdf")]).then(
    ([{ default: html2canvas }, { jsPDF }]) => {
      html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${clientName || "client"}-bazi-paid-report.pdf`);
      });
    }
  );
}

function PremiumInsights({ report, isAdmin = false, fullReport = null, clientName = "" }) {
  if (!report) return null;

  if (isAdmin) {
    return (
      <section
        id="admin-full-report"
        className="rounded-[36px] border border-amber-300 bg-white px-8 py-10 shadow-lg md:px-10"
      >
        <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-800">
          🔓 Full Report (Admin)
        </p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Complete Paid Reading
        </h2>

        <AdminFullReport report={fullReport} clientName={clientName} />
      </section>
    );
  }

  const premiumItems = [
    {
      icon: "💼",
      title: "Career Timing & Direction",
      text: "Understand when to push forward, when to refine your path and how your chart supports better career decisions.",
    },
    {
      icon: "💰",
      title: "Wealth Opportunities",
      text: "Go deeper into how you attract income, where money flows more naturally and what patterns may block financial growth.",
    },
    {
      icon: "❤️",
      title: "Relationship Dynamics",
      text: "Explore emotional needs, connection patterns, compatibility themes and the type of bond that supports you best.",
    },
    {
      icon: "🌿",
      title: "Wellness & Energy Balance",
      text: "Identify where your system may feel stretched and what supportive energies help you restore balance.",
    },
    {
      icon: "✨",
      title: "Hidden Strengths",
      text: "Reveal strengths that may not be obvious on the surface but can become powerful when consciously developed.",
    },
    {
      icon: "⚠️",
      title: "Personal Blind Spots",
      text: "Understand repeated patterns that may quietly affect your decisions, relationships, work and emotional wellbeing.",
    },
    {
      icon: "💎",
      title: "Supportive Elements & Stones",
      text: "Receive more specific guidance on favourable elements, gemstone support and practical energetic alignment.",
    },
    {
      icon: "🧭",
      title: "Long-Term Life Direction",
      text: "Connect your current year energy with deeper life themes, growth cycles and long-term personal development.",
    },
  ];

  return (
    <section className="rounded-[36px] border border-orange-200 bg-gradient-to-br from-white via-[#FFFDF8] to-orange-50 px-8 py-10 shadow-lg md:px-10">
      <div className="mb-8 max-w-5xl">
        <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-700">
          Premium Insights Preview
        </p>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          What the Full Reading Goes Deeper Into
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
          Your free profile gives you the main energetic patterns. A full reading connects these patterns into timing, decisions, relationships, wealth direction and practical next steps.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {premiumItems.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
              {item.icon}
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-950">
              {item.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[28px] border border-yellow-200 bg-yellow-50 p-7">
        <h3 className="text-2xl font-bold text-slate-950">
          Want the complete personalised breakdown?
        </h3>

        <p className="mt-4 max-w-4xl text-base leading-7 text-stone-700">
          The full consultation helps you understand not only what your chart shows, but how to apply it in your career, money decisions, relationships, wellness and personal growth.
        </p>
      </div>
    </section>
  );
}

function InsightList({ icon, title, items }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-2xl">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      </div>

      <ul className="mt-5 space-y-4 text-base leading-7 text-stone-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 text-orange-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightParagraph({ icon, title, text }) {
  if (!text) return null;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      </div>

      <p className="mt-5 text-base leading-8 text-stone-600">{text}</p>
    </div>
  );
}

function CTASection() {
  return (
    <section className="mt-8 rounded-[28px] border border-yellow-500 bg-slate-950 px-6 py-14 text-center shadow-xl">
      <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-yellow-400">
        WANT THE FULL PICTURE?
      </p>

      <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
        Unlock Your Full Bazi Destiny Blueprint
      </h2>

      <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-300 md:text-xl">
        Your free profile reveals your surface energetic tendencies. A full consultation goes deeper into your Bazi structure, favourable elements, emotional patterns, career timing, relationship dynamics and long-term life cycles.
      </p>

      <a
        href="https://www.huangsjadeiteandjewelry.com/collections/singapore-feng-shui-master-services-%E5%BC%80%E5%85%89-kai-guang/products/personal-feng-shui-energy-analysis-gemstone-alignment"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block rounded-2xl bg-orange-500 px-10 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-400"
      >
        Book Full Reading
      </a>
    </section>
  );
}

function normalizeGuidanceItem(item, fallbackFocus, fallbackIcon) {
  if (!item) return null;

  const rawScore =
    item.score ?? item.percentage ?? item.intensity ?? item.confidence ?? null;

  const displayScore =
    typeof rawScore === "number" ? normalizeScore(rawScore) : null;

  const actionCopy = {
    Career:
      "Increase visibility through useful conversations, clearer positioning and work that allows people to understand your value.",
    Wealth:
      "Choose fewer but higher-quality opportunities. Focus on what can produce steady value instead of chasing every possible opening.",
    Relationship:
      "Let trust build through consistency, emotional honesty and actions over time instead of guessing or testing the connection too early.",
    Wellness:
      "Create recovery space before pressure builds. Your system works better when rest, routine and emotional reset are part of the plan.",
  };

  const title = `${fallbackFocus} Action`;

  const explanation =
    item.action ||
    item.nextStep ||
    item.focusAction ||
    actionCopy[fallbackFocus] ||
    item.advice ||
    item.explanation ||
    item.summary ||
    item.description ||
    item.message ||
    item.interpretation ||
    item.bullets?.[0] ||
    "Focus on one practical step that helps you use this area of life with more clarity and balance.";

  return {
    ...item,
    icon: item.icon || fallbackIcon,
    focus: item.focus || fallbackFocus,
    title,
    explanation,
    displayScore,
  };
}

function LifeGuidanceSection({ guidance }) {
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

function getLifeAreaStatus(item, fallbackFocus) {
  const text = [
    item?.status,
    item?.title,
    item?.explanation,
    item?.advice,
    item?.summary,
    item?.description,
    ...(item?.bullets || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const focus = String(fallbackFocus || "").toLowerCase();

  const rawScore =
    item?.displayScore ??
    item?.score ??
    item?.percentage ??
    item?.intensity ??
    item?.confidence ??
    null;

  const score = typeof rawScore === "number" ? normalizeScore(rawScore) : null;

  const hasPressure =
    text.includes("avoid") ||
    text.includes("caution") ||
    text.includes("pressure") ||
    text.includes("overload") ||
    text.includes("imbalance") ||
    text.includes("stress") ||
    text.includes("drain") ||
    text.includes("rest") ||
    text.includes("restore") ||
    text.includes("recovery");

  const hasStrong =
    text.includes("strong") ||
    text.includes("strongest") ||
    text.includes("strength") ||
    text.includes("favourable") ||
    text.includes("favorable") ||
    text.includes("valued");

  const hasOpportunity =
    text.includes("opportunity") ||
    text.includes("opportunities") ||
    text.includes("result") ||
    text.includes("results") ||
    text.includes("produce") ||
    text.includes("wealth") ||
    text.includes("financial") ||
    text.includes("value");

  const hasGrowth =
    text.includes("develop") ||
    text.includes("growth") ||
    text.includes("learning") ||
    text.includes("build") ||
    text.includes("support") ||
    text.includes("communication") ||
    text.includes("visibility") ||
    text.includes("knowledge") ||
    text.includes("problem-solving") ||
    text.includes("relationship-building");

  const hasConnection =
    text.includes("relationship") ||
    text.includes("connection") ||
    text.includes("trust") ||
    text.includes("shared") ||
    text.includes("emotional") ||
    text.includes("understanding");

  if (focus === "career") {
    if (hasPressure) return "Needs Focus";
    if (score !== null && score >= 75) return "Strong Direction";
    if (hasStrong) return "Strong Direction";
    return hasGrowth ? "Building Momentum" : "Developing Direction";
  }

  if (focus === "wealth") {
    if (hasPressure) return "Needs Discipline";
    if (score !== null && score >= 75) return "Strong Potential";
    if (hasStrong) return "Strong Potential";
    return hasOpportunity ? "Active Opportunities" : "Building Stability";
  }

  if (focus === "relationship") {
    if (hasPressure) return "Needs Clarity";
    if (score !== null && score >= 75) return "Strong Connection";
    if (hasStrong) return "Strong Connection";
    return hasConnection ? "Deepening Connections" : "Developing Trust";
  }

  if (focus === "wellness") {
    if (hasPressure) return "Needs Restoration";
    if (score !== null && score >= 75) return "Stable Support";
    if (hasStrong) return "Stable Support";
    return "Restoring Balance";
  }

  if (hasPressure) return "Needs Balance";
  if (hasStrong) return "Strong";
  if (hasOpportunity) return "Active";
  if (hasGrowth) return "Developing";

  return "Active";
}

function getStatusStyle(status) {
  const strongStatuses = [
    "Strong",
    "Strong Direction",
    "Strong Potential",
    "Strong Connection",
    "Stable Support",
  ];

  const activeStatuses = [
    "Active",
    "Active Opportunities",
    "Building Momentum",
  ];

  const developingStatuses = [
    "Developing",
    "Developing Direction",
    "Developing Trust",
    "Deepening Connections",
    "Building Stability",
    "Restoring Balance",
  ];

  const cautionStatuses = [
    "Needs Balance",
    "Needs Focus",
    "Needs Discipline",
    "Needs Clarity",
    "Needs Restoration",
  ];

  if (strongStatuses.includes(status)) {
    return {
      badge: "bg-green-50 text-green-700",
      bar: "bg-green-600",
      width: "90%",
    };
  }

  if (activeStatuses.includes(status)) {
    return {
      badge: "bg-orange-50 text-orange-700",
      bar: "bg-orange-500",
      width: "76%",
    };
  }

  if (developingStatuses.includes(status)) {
    return {
      badge: "bg-blue-50 text-blue-700",
      bar: "bg-blue-500",
      width: "60%",
    };
  }

  if (cautionStatuses.includes(status)) {
    return {
      badge: "bg-red-50 text-red-700",
      bar: "bg-red-500",
      width: "42%",
    };
  }

  return {
    badge: "bg-stone-100 text-stone-700",
    bar: "bg-stone-500",
    width: "65%",
  };
}

function AnnualLifeOverview({ guidance, selectedYear }) {
  const guidanceItems = [
    normalizeGuidanceItem(guidance?.career, "Career", "💼"),
    normalizeGuidanceItem(guidance?.wealth, "Wealth", "💰"),
    normalizeGuidanceItem(guidance?.relationship, "Relationship", "❤️"),
    normalizeGuidanceItem(guidance?.wellness || guidance?.health, "Wellness", "🌿"),
  ].filter(Boolean);

  if (!guidanceItems.length) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        Your {selectedYear} Life Energy Overview
      </p>

      <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-3xl">
        Your {selectedYear} Life Areas
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
        These 4 key areas show where your energy is flowing strongly, where growth is developing, and where better balance is needed.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {guidanceItems.map((item, index) => {
          const status = getLifeAreaStatus(item, item.focus);
          const statusStyle = getStatusStyle(status);

          return (
            <div
              key={`${item.focus}-${index}`}
              className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-50 text-3xl">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {item.focus} Energy
                  </h3>

                  <div
                    className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] ${statusStyle.badge}`}
                  >
                    {status}
                  </div>
                </div>
              </div>

              <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${statusStyle.bar}`}
                  style={{ width: statusStyle.width }}
                />
              </div>

              <p className="mt-6 text-sm leading-6 text-stone-600">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LifeThemesSection({ lifeThemes }) {
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

              const themeDescriptions = {
    "Creative Expression":
      "Your growth comes through expressing ideas, emotions and creativity more honestly. When you allow your voice, style and perspective to be seen, opportunities and self-confidence can open naturally.",

    "Building Support Systems":
      "Your path improves when you stop carrying everything alone and build reliable support around you. The right people, routines and systems can help you feel safer, steadier and less overwhelmed.",

    "Adaptability and Learning":
      "You grow through curiosity, flexibility and being willing to learn from changing situations. Rather than needing one fixed path, your chart benefits when you stay open and adjust with awareness.",

    "Sharing Ideas":
      "Your ideas are part of your value. Speaking, teaching, explaining or sharing your perspective can help others understand you better and create stronger opportunities over time.",

    "Innovation":
      "You are not meant to only repeat old methods. This theme supports fresh thinking, experimentation and finding better ways to solve problems or express your abilities.",

    "Relationships and Connections":
      "Your growth often comes through the people you meet, the trust you build and the communities you choose to be part of. The right connections can open doors, but weak boundaries may also make you feel stretched.",

    "Balancing Independence and Support":
      "One of your recurring lessons is knowing when to carry things yourself and when to allow the right people to support you. You do not need to prove your strength by doing everything alone.",

    "Strategic Decision Making":
      "Long-term progress becomes stronger when you slow down, choose clearly and avoid reacting to every opportunity at once. Your chart benefits from structure, timing and better prioritisation.",

    "Building Through People":
      "Opportunities become stronger when relationships, collaboration and shared direction are handled with care. People are not just distractions; the right people can become part of your growth system.",

    "Trust and Reciprocity":
      "Your path asks you to build exchanges where support, effort and loyalty can flow both ways. You grow when you stop overgiving and start noticing who also shows up for you.",

    "Knowledge and Wisdom":
      "Your growth is strongly linked to learning, reflection and turning insight into practical direction. The more you understand yourself and your environment, the easier it becomes to make aligned choices.",

    "Growth and Expansion":
      "This theme points to a period where new experiences, new people or new responsibilities can help you mature. Expansion works best when it is supported by grounding and clear priorities.",

    "Creating Stability":
      "Your chart benefits when you build routines, foundations and dependable systems instead of relying only on short bursts of motivation. Stability gives your potential somewhere safe to grow.",

    "Visibility and Influence":
      "This theme asks you to be seen more clearly, but in a way that feels grounded, intentional and aligned with your values. Your influence grows when visibility is supported by purpose.",

    "Emotional Clarity":
      "Your growth comes from understanding what you truly feel before reacting, pleasing others or withdrawing. Clear emotions help you communicate better and choose relationships more wisely.",

    "Personal Boundaries":
      "This theme asks you to protect your energy, time and emotional space. Healthy boundaries do not make you cold; they help your relationships and decisions become cleaner.",

    "Discipline and Responsibility":
      "You grow by turning pressure into maturity, structure and dependable action. This theme supports consistency, but also reminds you not to carry responsibility until it becomes emotional heaviness.",

    "Courage and Direction":
      "Your chart pushes you to act with more courage and clarity. When you stop waiting for perfect certainty, your direction becomes stronger through movement and experience.",

    "Emotional Recovery":
      "Your growth depends on knowing when to pause, rest and reset. Recovery is not a weakness here; it helps your system stay clear, sensitive and sustainable.",
  };

  if (!primaryThemes.length && !supportingThemes.length) return null;

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

      <div className="mt-8 space-y-5">
        {primaryThemes.map((theme, index) => (
          <div
            key={`${theme}-${index}`}
            className="rounded-[28px] border border-orange-100 bg-white/85 p-7 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-700">
              Primary Theme {index + 1}
            </p>

            <h3 className="mt-3 text-2xl font-bold text-slate-950">
              {theme}
            </h3>

            <p className="mt-4 max-w-5xl text-base leading-8 text-stone-600">
                                                                                              {themeDescriptions[theme] ||
                "This theme highlights a recurring pattern in how your chart grows, makes decisions and responds to life. It becomes more meaningful when you work with it consciously instead of treating it as a background habit."}
            </p>
          </div>
        ))}
      </div>

      {supportingThemes.length > 0 && (
        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-stone-500">
            Supporting Themes
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {supportingThemes.map((theme) => (
              <div
                key={theme}
                className="rounded-2xl bg-stone-50 px-5 py-4"
              >
                <p className="font-semibold text-stone-800">{theme}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                                                  {themeDescriptions[theme] ||
                    "This supporting theme adds another layer to your growth pattern. It may not be the loudest theme, but it quietly influences how you respond to people, timing and opportunities."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function HuangsBaZiUIFrontend() {
  // Admin mode: visit with ?admin=PASSWORD to unlock the full paid report.
  // Password comes from VITE_ADMIN_PASSWORD (set in Vercel / .env); falls back
  // to a default for local dev. Light internal gate, not strong security.
  const isAdmin = (() => {
    if (typeof window === "undefined") return false;
    try {
      const provided = new URLSearchParams(window.location.search).get("admin");
      if (!provided) return false;
      const expected = import.meta.env?.VITE_ADMIN_PASSWORD || "huangs2026";
      return provided === expected;
    } catch {
      return false;
    }
  })();

  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    birthHour: "00",
    birthMinute: "00",
    birthTime: "",
    birthTimeUnknown: false,
    useBirthTime: true,
    gender: "",
    birthCountry: "",
    selectedYear: 2026,
  });

  const [submittedInput, setSubmittedInput] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const chart = useMemo(() => {
    if (!submittedInput) return null;

    return buildBaziChart({
      name: submittedInput.name,
      birthDate: submittedInput.birthDate,
      birthTime: submittedInput.birthTime,
      birthCountry: submittedInput.birthCountry,
      timezone: submittedInput.timezone,
      selectedYear: submittedInput.selectedYear,
      gender: submittedInput.gender,
      useBirthTime: submittedInput.useBirthTime,
    });
  }, [submittedInput]);

  const uiChart = useMemo(() => {
    if (!chart || !submittedInput) return null;

    return mapChartToUi(chart, submittedInput.selectedYear);
  }, [chart, submittedInput]);

  function updateForm(nextValue) {
    setForm((current) => ({ ...current, ...nextValue }));
  }

  function generateProfile() {
    if (!form.birthDate) {
      alert("Please select your birth date.");
      return;
    }

    if (!form.gender) {
      alert("Please select your gender.");
      return;
    }

    if (!form.birthCountry) {
      alert("Please select your birth country.");
      return;
    }

    const hour24 = Number(form.birthHour || "00");
    const minute = form.birthMinute || "00";

    const birthTime = form.birthTimeUnknown
      ? ""
      : `${String(hour24).padStart(2, "0")}:${minute}`;

    setSubmittedInput({
      ...form,
      birthTime,
      timezone: getBirthCountryTimezone(form.birthCountry),
      useBirthTime: !form.birthTimeUnknown && Boolean(birthTime),
    });

    setPopupOpen(true);
  }

        const guidance =
    chart?.practicalSupport?.guidance ||
    chart?.practicalGuidanceV1 ||
    uiChart?.guidance ||
    uiChart?.practicalGuidance ||
    null;

  const wealthArchetype =
    chart?.wealthArchetypeV2 ||
    chart?.wealthArchetypeV1 ||
    chart?.wealthArchetype ||
    uiChart?.wealthArchetype ||
    null;

  const growthAdvice =
    chart?.growthAdviceV1 ||
    chart?.growthAdvice ||
    uiChart?.growthAdvice ||
    uiChart?.lifeAreas?.growthAdvice ||
    null;

          const relationshipPattern =
    chart?.relationshipPatternV1 ||
    chart?.relationshipPattern ||
    uiChart?.relationshipPattern ||
    uiChart?.lifeAreas?.relationshipPattern ||
    uiChart?.guidance?.relationship?.relationshipPattern ||
    null;

  const relationshipArchetype =
    chart?.relationshipArchetypeV1 ||
    chart?.relationshipArchetype ||
    uiChart?.relationshipArchetype ||
    uiChart?.lifeAreas?.relationshipArchetype ||
    uiChart?.guidance?.relationship?.relationshipArchetype ||
    null;

  const topStrengths =
    chart?.topStrengthsV1 ||
    chart?.topStrengths ||
    uiChart?.topStrengths ||
    uiChart?.personalityAndStructure?.topStrengths ||
    [];

  const focusRanking =
    chart?.focusRankingV1 ||
    chart?.focusRanking ||
    uiChart?.focusRanking ||
    uiChart?.lifeAreas?.focusRanking ||
    [];

  const previewReport = getFreePreviewReport(
    chart?.pdfReportSchemaV2 ||
      chart?.pdfReportSchemaV1 ||
      chart?.pdfReportSchema
  );

  return (
    <main className="min-h-screen bg-[#F7F3EB]">
      <LeadPopup open={popupOpen} setOpen={setPopupOpen} />

      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 md:px-8 md:pb-6">
        <GenerateProfilePanel
          form={form}
          onChange={updateForm}
          onGenerate={generateProfile}
        />

        {uiChart ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="space-y-10"
          >
            {isAdmin && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-800">
                  🔓 Admin Mode — Full Report Unlocked
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  This view shows the complete paid report. Customers see the teaser version.
                </p>
              </div>
            )}

            {chart?.readingConfidence?.level === "approximate" && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-6 py-4">
                <p className="text-sm font-semibold text-sky-800">
                  ⏱️ Approximate reading (no birth time)
                </p>
                <p className="mt-1 text-xs leading-5 text-sky-700">
                  {chart.readingConfidence.note}
                </p>
              </div>
            )}

                                                                     <EmotionalEnergyProfile profile={uiChart.profile} />

            <TopStrengthsSection strengths={topStrengths} />

            <TopProfileStrengthSection chart={chart} uiChart={uiChart} />

            <AnnualLifeOverview
              guidance={guidance}
              selectedYear={submittedInput.selectedYear}
            />

            <FocusRankingSection
              focusRanking={focusRanking}
              selectedYear={submittedInput.selectedYear}
            />

            <EmotionalEnergyBalance elements={uiChart?.elements} />

            <UsefulGodSection balance={uiChart?.personalEnergyBalance} />

            <RelationshipArchetypeSection
              relationshipArchetype={relationshipArchetype}
            />

            <RelationshipPatternSection
              relationshipPattern={relationshipPattern}
            />

            <WealthArchetypeSection wealth={wealthArchetype} />

            <GrowthAdviceSection growthAdvice={growthAdvice} />

            <LifeThemesSection
              lifeThemes={
                chart?.lifeThemes ||
                uiChart?.lifeThemes ||
                uiChart?.lifeAreas?.lifeThemes ||
                chart?.lifeAreas?.lifeThemes
              }
            />

            <RecommendedStones
              stones={
                chart?.recommendations?.stones ||
                chart?.practicalSupport?.stones ||
                uiChart?.stones ||
                uiChart?.stoneRecommendations
              }
            />

            <ProductRecommendationsSection
              products={
                chart?.recommendations?.products ||
                chart?.practicalSupport?.products
              }
            />

                        <FinalReflectionSection />

            <PremiumInsights
              report={previewReport}
              isAdmin={isAdmin}
              fullReport={chart?.paidReportSchemaV1}
              clientName={submittedInput?.name}
            />

            <CTASection />
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}