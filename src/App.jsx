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

      <div className="mt-7 rounded-[28px] border border-rose-100 bg-rose-50 p-7">
        <p className="text-base leading-7 text-rose-800">
          Your full reading covers your relationship strengths, blind spots,
          compatibility green/red flags and exactly what you need in a partner.
        </p>
      </div>
    </section>
  );
}


function WealthTeaserSection({ wealth }) {
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
          <p className="text-base text-stone-600">
            You have <strong>{supporting.length} more personality patterns</strong>{" "}
            in your chart — see the complete 10-pattern breakdown in your full reading.
          </p>
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
    <div className="mt-10 border-t border-amber-100 pt-8 print:border-[#8B1A1A] print:mt-8 print:pt-6">
      <h3 className="text-2xl font-bold text-slate-950 print:text-[#8B1A1A]">
        {icon && <span className="print:hidden">{icon} </span>}{title}
      </h3>
      <div className="hidden print:block print:border-b print:border-[#8B1A1A] print:mt-1 print:mb-4" />
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
  const luckPillars = report.personalDirectionsAndStars?.luckPillars || null;
  const lifePalace = report.personalDirectionsAndStars?.lifePalace || null;
  const conceptionPalace = report.personalDirectionsAndStars?.conceptionPalace || null;
  const natalPillars = report.chartFoundation?.pillars || null;
  const tenGodByPillar = report.chartFoundation?.tenGodByPillar || null;
  const annualPillar = report.annualEnergy?.annualOverlay?.annualPillar || null;
  const annualZodiac = report.annualEnergy?.annualZodiac || null;

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

  const DAY_MASTER_TRAITS = {
    Jia:  "Driven, principled and growth-oriented. Like a tall tree — pioneering by nature, with a strong sense of direction and deep-rooted conviction.",
    Yi:   "Flexible, creative and people-attuned. Adapts well to changing conditions and builds lasting connections through warmth and resourcefulness.",
    Bing: "Warm, expressive and naturally charismatic. Brings energy and light to those around them through enthusiasm, generosity and a strong presence.",
    Ding: "Thoughtful, loyal and quietly perceptive. Like a steady flame — consistent in care, emotionally intelligent and deeply attuned to those nearby.",
    Wu:   "Stable, patient and deeply dependable. Like a mountain — grounded and protective, with a strong inner foundation and slow-to-change conviction.",
    Ji:   "Nurturing, practical and quietly supportive. Naturally builds a stable foundation for others, with a grounded, detail-oriented and giving nature.",
    Geng: "Principled, decisive and direct. Strong sense of right and wrong with a preference for straightforward action and clear personal standards.",
    Xin:  "Refined, perceptive and aesthetically attuned. Sensitive to quality and detail, with an appreciation for beauty, precision and how things are perceived.",
    Ren:  "Ambitious, resourceful and expansive. Like a great river — naturally drawn to big-picture thinking, opportunity and adaptive flow.",
    Gui:  "Gentle, intuitive and deeply perceptive. Quietly absorbs and processes the world, with a rich inner life and natural empathy for others.",
  };

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

  const annualZodiacName = annualZodiac?.displayName || "";
  const coverYearLabel = `${report.annualEnergy?.selectedYear || new Date().getFullYear()}${annualZodiacName ? ` ${annualZodiacName}` : ""} Year`;

  function expandMonthlyNote(item) {
    const elementInfo = elementalBalance?.find((e) => e.name === item.dominantElement);
    const roleDesc = elementInfo?.roleDescription;
    const { chinese, branchAnimal, dominantElement, read } = item;
    const roleText = roleDesc
      ? ` For this chart, ${dominantElement} energy governs ${roleDesc}.`
      : "";
    const goodActionMap = {
      Metal: "express ideas, build visibility and pursue creative or communication-led opportunities",
      Water: "attract resources, pursue wealth goals and strengthen key relationships",
      Wood: "build structure, take on responsibilities and establish long-term commitments",
      Fire: "seek support, invest in learning and draw on mentors or helpful people",
      Earth: "ground decisions, consolidate progress and build on what you already have",
    };
    const cautionNoteMap = {
      Earth: "adds to what is already being managed in this chart, which can amplify heaviness or a sense of overcommitment",
      Fire: "adds warmth that this chart needs to process carefully, which may stir emotional intensity or scattered energy",
      Wood: "can intensify structure and obligation demands already present in this chart",
      Metal: "may feel draining or overly cutting when the chart is already under pressure",
      Water: "adds flow that can feel unsteady or emotionally heavy during a demanding period",
    };
    if (read === "Good") {
      const action = goodActionMap[dominantElement] || "act on plans and take meaningful steps forward";
      return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This is a supportive window — a good time to ${action}. Use this month's momentum to take action on goals you have been building toward, and lean into opportunities that feel aligned rather than holding back.`;
    }
    if (read === "Caution") {
      const cautionNote = cautionNoteMap[dominantElement] || "may create added demands on your energy";
      return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This energy ${cautionNote}. Pace yourself carefully — focus on maintaining what is already in place rather than starting new initiatives. Give yourself room to rest and recover, and avoid making major commitments from a place of pressure or urgency.`;
    }
    return `${chinese} (${branchAnimal}) brings ${dominantElement} energy this month.${roleText} This is a relatively neutral period for this chart — a steady time to maintain momentum without major push or pull in either direction. Use the quieter energy to consolidate, reflect and prepare for upcoming active windows.`;
  }

  // primaryUsefulGod from usefulGodV4 is an element name ("Metal", "Water", etc.)
  const dziBeadMap = {
    "Metal": { label: "7-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=7+eye+dzi+bead",           why: "Amplifies expression, communication, creativity and professional visibility" },
    "Water": { label: "3-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=3+eye+dzi+bead",           why: "Activates wealth flow, opportunity recognition and financial abundance" },
    "Wood":  { label: "9-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=9+eye+dzi+bead",           why: "Strengthens authority, career structure and disciplined achievement" },
    "Fire":  { label: "1-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=1+eye+dzi+bead",           why: "Sharpens wisdom, clarity, protective learning and intuitive support" },
    "Earth": { label: "5-Eye Dzi Bead",       url: "https://www.huangsjadeiteandjewelry.com/search?q=5+eye+dzi+bead",           why: "Grounds and balances energy, bringing stability and all-round luck from five directions" },
  };

  const primaryDzi = dziBeadMap[usefulGod.primaryUsefulGod] || null;
  const secondaryDziRaw = dziBeadMap[usefulGod.secondaryUsefulGod] || null;
  const secondaryDzi = secondaryDziRaw?.label !== primaryDzi?.label ? secondaryDziRaw : null;

  function exportReadingAsJson() {
    const dayPillar = natalPillars?.day?.stem;
    const data = {
      meta: {
        exportedAt: new Date().toISOString().slice(0, 10),
        year: report.annualEnergy?.selectedYear || new Date().getFullYear(),
        annualPillar: annualZodiacName || null,
      },
      client: {
        name: clientName || null,
        gender: report.client?.gender || null,
      },
      dayMaster: {
        zh: dayPillar?.zh || null,
        stem: dayPillar?.name || null,
        element: dayPillar?.element || null,
        strength: report.chartFoundation?.dayMasterStrength?.status || null,
        strengthScore: report.chartFoundation?.dayMasterStrength?.strengthScore ?? null,
      },
      elementsBalance: elementalBalance.map((e) => ({
        element: e.name,
        role: e.role || null,
        roleDescription: e.roleDescription || null,
        natalPct: Math.round(e.natalPercentage),
        annualPct: Math.round(e.annualPercentage),
      })),
      usefulGod: {
        primary: usefulGod.primaryUsefulGod || null,
        secondary: usefulGod.secondaryUsefulGod || null,
        favourableElements: usefulGod.favourableElements || [],
        secondaryFavourableElements: usefulGod.secondaryFavourableElements || [],
        cautionElements: usefulGod.cautionElements || [],
      },
      personalityProfiles: rankedProfiles.map((p) => ({
        profile: p.profile,
        percentage: Math.round(p.percentage),
      })),
      monthlyOutlook: monthlyOutlook.map((m) => ({
        month: m.monthName,
        pillar: m.chinese,
        animal: m.branchAnimal,
        dominantElement: m.dominantElement,
        read: m.read,
        note: expandMonthlyNote(m),
      })),
      career: report.lifeAreas?.career || null,
      wealth: {
        ...(report.lifeAreas?.wealth || {}),
        ...(report.lifeAreas?.wealthArchetype || {}),
      },
      relationship: {
        ...(report.lifeAreas?.relationship || {}),
        ...(report.lifeAreas?.relationshipArchetype || {}),
      },
      wellness: report.lifeAreas?.health || null,
      blindSpots: report.personality?.blindSpots || null,
      hiddenStrengths: report.personality?.topStrengths || null,
      lifeThemes: report.lifeThemes || null,
      stones: report.stones || null,
      dziBeads: {
        primary: primaryDzi ? { element: usefulGod.primaryUsefulGod, ...primaryDzi } : null,
        secondary: secondaryDzi ? { element: usefulGod.secondaryUsefulGod, ...secondaryDzi } : null,
      },
      eightMansions: eightMansions || null,
      lifePalace: lifePalace
        ? {
            pillar: `${lifePalace.pillar.stem.zh}${lifePalace.pillar.branch.zh}`,
            stem: lifePalace.pillar.stem.name,
            element: lifePalace.pillar.stem.element,
            animal: lifePalace.pillar.branch.animal,
          }
        : null,
      conceptionPalace: conceptionPalace
        ? {
            pillar: `${conceptionPalace.pillar.stem.zh}${conceptionPalace.pillar.branch.zh}`,
            stem: conceptionPalace.pillar.stem.name,
            element: conceptionPalace.pillar.stem.element,
            animal: conceptionPalace.pillar.branch.animal,
          }
        : null,
      shenSha: shenSha.map((s) => ({
        name: s.name,
        zh: s.zh,
        active: s.active || false,
        theme: s.theme || null,
        caution: s.caution || null,
      })),
      luckPillars: luckPillars
        ? {
            startingAge: luckPillars.startingAge,
            direction: luckPillars.direction,
            pillars: luckPillars.pillars.map((p) => ({
              ageRange: p.ageRange,
              pillar: p.pillarLabel,
              element: p.element,
              tenGod: p.tenGod,
            })),
          }
        : null,
    };

    const filename = `${(clientName || "client").toLowerCase().replace(/\s+/g, "-")}-bazi-${data.meta.year}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Print-only cover page */}
      <div className="print-cover hidden print:flex print:flex-col print:items-center print:justify-center print:py-24 print:text-center">
        <img src={huangsLogo} alt="Huangs Jadeite and Jewelry" className="h-16 w-auto mb-6" />
        <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{color:"#8B1A1A"}}>HUANGS JADEITE &amp; JEWELRY</p>
        <h1 className="text-2xl font-bold mb-6 leading-snug" style={{color:"#8B1A1A"}}>
          Personal Feng Shui Energy Analysis<br/>for {coverYearLabel}
        </h1>
        <div className="print-cover-body max-w-md text-sm text-gray-600 leading-relaxed text-left mt-4">
          <p>This personalized Bazi report is designed to help you better understand your elemental balance, natural strengths, emotional tendencies and life direction.</p>
          <p className="mt-3">The purpose of this analysis is to provide guidance and self-awareness in areas such as career, wealth, relationships and health.</p>
        </div>
      </div>

      {/* Print footer — shows on every page via CSS */}
      <div className="print-footer hidden">
        Bazi Analysis generated by huangsjadeiteandjewelry.com.
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 print-no-export">
        <p className="text-sm font-bold text-slate-700">Client Profile</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exportReadingAsJson()}
            className="rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-600"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => exportAdminReportToPdf()}
            className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600"
          >
            Export Client PDF
          </button>
        </div>
      </div>

      {/* Client Profile heading for print */}
      <h2 className="hidden print:block mt-4 text-3xl font-bold" style={{color:"#8B1A1A"}}>Client Profile</h2>
      <div className="hidden print:block border-b mt-1 mb-4" style={{borderColor:"#8B1A1A"}} />

      <table className="mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 text-sm print:rounded-none print:border-[#8B1A1A]">
        <tbody>
          {[
            ["Name", clientName || "-"],
            ["Gender", report.client?.gender || "-"],
            ["Birth Country", report.client?.birthCountry || "-"],
            [
              "Day Master",
              (() => {
                const stem = natalPillars?.day?.stem;
                const label = stem
                  ? `${stem.zh} ${stem.name} ${stem.element}`
                  : report.chartFoundation?.dayMasterElement || "-";
                const trait = stem ? DAY_MASTER_TRAITS[stem.name] : null;
                return trait ? (
                  <>
                    {label}
                    <br />
                    <span className="text-xs text-stone-500 leading-relaxed">{trait}</span>
                  </>
                ) : label;
              })(),
            ],
            ["Stronger Elements", strongerElements.join(", ") || "-"],
            ["Weaker Elements", weakerElements.join(", ") || "-"],
            [
              "Useful God",
              `${usefulGod.primaryUsefulGod || "-"} (primary) · ${
                usefulGod.secondaryUsefulGod || "-"
              } (secondary)`,
            ],
          ].map(([label, value]) => (
            <tr key={label} className="border-b border-slate-100 last:border-0 print:border-[#e5d5c0]">
              <td className="bg-slate-50 px-4 py-2.5 font-semibold text-slate-700 print:bg-[#8B1A1A] print:text-white print:w-40">
                {label}
              </td>
              <td className="px-4 py-2.5 text-stone-700 print:bg-[#FAE5D3]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {natalPillars && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-950">Natal Chart</h3>

            {annualPillar?.chinese && (
              <p className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
                {report.annualEnergy?.selectedYear || "Annual"} Pillar:{" "}
                {annualPillar.chinese}
                {annualZodiac?.displayName ? ` (${annualZodiac.displayName})` : ""}
              </p>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-stone-500 md:grid-cols-4">
            <p><span className="font-semibold text-slate-700">Year —</span> ancestral energy, family background and relationship with society. Governs early life (0–16).</p>
            <p><span className="font-semibold text-slate-700">Month —</span> career, parents and productive adult years (17–40). Primary pillar for professional life.</p>
            <p><span className="font-semibold text-slate-700">Day —</span> the self. The Day Heavenly Stem is the Day Master — the chart's core identity. The Day Branch represents the inner self and partner energy.</p>
            <p><span className="font-semibold text-slate-700">Hour —</span> aspirations, children and the later years of life (40+). Reflects what the person is building toward.</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  <th className="px-4 py-2.5"></th>
                  {["hour", "day", "month", "year"].map((key) => (
                    <th key={key} className="px-4 py-2.5 capitalize">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">
                    Heavenly Stem
                  </td>
                  {["hour", "day", "month", "year"].map((key) => {
                    const pillar = natalPillars[key];
                    return (
                      <td key={key} className="px-4 py-2.5">
                        {pillar?.stem ? (
                          <>
                            <span className="text-lg font-bold text-slate-950">
                              {pillar.stem.zh}
                            </span>{" "}
                            <span className="text-stone-500">
                              {pillar.stem.name} {pillar.stem.element}
                            </span>
                          </>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">
                    Earthly Branch
                  </td>
                  {["hour", "day", "month", "year"].map((key) => {
                    const pillar = natalPillars[key];
                    return (
                      <td key={key} className="px-4 py-2.5">
                        {pillar?.branch ? (
                          <>
                            <span className="text-lg font-bold text-slate-950">
                              {pillar.branch.zh}
                            </span>{" "}
                            <span className="text-stone-500">
                              {pillar.branch.animal} {pillar.branch.element}
                            </span>
                          </>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-t border-slate-100 align-top">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">
                    Hidden Stems
                  </td>
                  {["hour", "day", "month", "year"].map((key) => {
                    const pillar = natalPillars[key];
                    const hiddenTenGods = tenGodByPillar?.[key]?.hiddenStems || [];
                    return (
                      <td key={key} className="px-4 py-2.5">
                        {pillar?.branch?.hiddenStems?.length ? (
                          <div className="space-y-1">
                            {pillar.branch.hiddenStems.map((hidden, i) => (
                              <p key={hidden.key}>
                                <span className="font-semibold text-slate-800">
                                  {hidden.zh}
                                </span>{" "}
                                <span className="text-xs text-stone-500">
                                  {hiddenTenGods[i]?.tenGod || ""}
                                </span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!!elementalBalance.length && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-950">5 Elements Balance</h3>
          <p className="mt-2 text-sm text-stone-500">
            Natal Chart vs. {report.annualEnergy?.selectedYear || "this year"}'s Annual
            Energy, and what each element represents in this chart.
          </p>
          <div className="mt-4 space-y-3">
            {elementalBalance.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-base font-bold text-slate-950">
                  {item.name} — Natal {Math.round(item.natalPercentage)}% · Annual{" "}
                  {Math.round(item.annualPercentage)}%
                </p>
                {item.roleDescription && (
                  <p className="mt-1 text-sm text-stone-600">
                    {item.name} governs {item.roleDescription}.
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
            Your personality is shaped by ten archetypal energy patterns derived from your natal chart. Each pattern influences how you think, make decisions, respond under pressure and connect with others. The percentage shows how strongly each pattern is wired into your natural behaviour — a higher score means that energy is dominant and shows up consistently, while a lower score indicates a dormant pattern that may emerge in specific situations or can be consciously developed over time.
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
                    {display.icon} {Math.round(item.percentage)}% {item.profile}
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
            Each month's energy is read against this chart's favourable and caution elements. In the Chinese calendar, each month carries its own pillar — a heavenly stem and earthly branch pair — so every month has a different zodiac animal (the month's branch). This follows the classical Bazi methodology and is not related to the Western zodiac.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Why a different animal each month: the 12 earthly branches are permanently mapped to the 12 Chinese months — Tiger is always the first month of spring, Rabbit the second, Dragon the third, and so on. Each calendar month corresponds to one of these branches, so the animal naturally changes every month.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                  <th className="px-4 py-2.5">Month</th>
                  <th className="px-4 py-2.5">Read</th>
                  <th className="px-4 py-2.5">Note</th>
                </tr>
              </thead>
              <tbody>
                {monthlyOutlook.map((item) => (
                  <tr
                    key={item.month}
                    className="border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3]"
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
                    <td className="px-4 py-2.5 text-stone-600 leading-6">{expandMonthlyNote(item)}</td>
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
              `${careerAuthorityProfile.name} · ${getProfileDisplay(careerAuthorityProfile.name).name || ""} — ${Math.round(careerAuthorityProfile.percentage)}%`}
            {careerAuthorityProfile && careerOutputProfile && " · "}
            {careerOutputProfile &&
              `${careerOutputProfile.name} · ${getProfileDisplay(careerOutputProfile.name).name || ""} — ${Math.round(careerOutputProfile.percentage)}%`}
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
            {indirectWealthPct != null && `Indirect Wealth · ${getProfileDisplay("Indirect Wealth").name || ""} ${Math.round(indirectWealthPct)}%`}
            {indirectWealthPct != null && directWealthPct != null && " · "}
            {directWealthPct != null && `Direct Wealth · ${getProfileDisplay("Direct Wealth").name || ""} ${Math.round(directWealthPct)}%`}
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
            Partners whose own chart leans toward {[...favourableSet].join(", ")} —
            your chart's own supportive elements — tend to reinforce rather than
            drain your energy, since those are the same elements your chart
            already benefits from.
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
            Chart Strength: {report.chartFoundation.dayMasterStrength.status}
            {report.chartFoundation.dayMasterStrength.strengthScore != null &&
              ` (${Math.round(Number(report.chartFoundation.dayMasterStrength.strengthScore))}/100)`}
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
              {weakestElement.name} is your weakest element at {Math.round(weakestElement.natalPercentage)}%
              natally
            </strong>
            {weakestElement.roleDescription &&
              ` — ${weakestElement.name} governs ${weakestElement.roleDescription}, so this is worth conscious support.`}
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

      {(primaryDzi || secondaryDzi) && (
        <AdminReportSection icon="🪬" title="Recommended Dzi Beads">
          <p className="mt-3 text-sm text-stone-500">
            Tibetan amulet recommendations based on this chart's Useful God and energy needs.
          </p>
          <div className="mt-4 space-y-4">
            {primaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.primaryUsefulGod} energy · Primary Useful God
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={primaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {primaryDzi.label}
                  </a>
                </p>
                <p className="mt-1 text-sm text-stone-600">{primaryDzi.why}</p>
              </div>
            )}
            {secondaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.secondaryUsefulGod} energy · Secondary Useful God
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={secondaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {secondaryDzi.label}
                  </a>
                </p>
                <p className="mt-1 text-sm text-stone-600">{secondaryDzi.why}</p>
              </div>
            )}
          </div>
        </AdminReportSection>
      )}

      <AdminReportSection icon="🧭" title="Long-Term Life Direction">
        {!!lifeThemes.primaryThemes?.length && (
          <div className="mt-3 space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Primary Themes
            </p>
            {lifeThemes.primaryThemes.map((theme) => (
              <div key={theme}>
                <p className="text-base font-semibold text-slate-900">{theme}</p>
                <p className="mt-1 text-base leading-7 text-stone-700">
                  {THEME_DESCRIPTIONS[theme]}
                </p>
              </div>
            ))}
          </div>
        )}
        {!!lifeThemes.supportingThemes?.length && (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Supporting Themes
            </p>
            {lifeThemes.supportingThemes.map((theme) => (
              <div key={theme}>
                <p className="text-base font-semibold text-slate-900">{theme}</p>
                <p className="mt-1 text-base leading-7 text-stone-700">
                  {THEME_DESCRIPTIONS[theme]}
                </p>
              </div>
            ))}
          </div>
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
          <p className="mt-3 text-base leading-7 text-stone-600">
            Based on your birth year, Eight Mansions assigns you a Kua number that determines which compass directions support or drain your energy. Use your favourable directions for your desk, bed headboard and where you sit during important conversations or decisions. Avoiding unfavourable directions for sleep and major commitments helps reduce unnecessary friction over time.
          </p>
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

      {(lifePalace || conceptionPalace) && (() => {
        const palaceStemMeaning = {
          Metal: "the life path is oriented around clarity, precision and building things of lasting value",
          Water: "the life path is oriented around wisdom, adaptability and the accumulation of deep inner knowing",
          Wood: "the life path is oriented around growth, initiation and laying foundations that others can build on",
          Fire: "the life path is oriented around vision, recognition and bringing people together through inspiration and warmth",
          Earth: "the life path is oriented around stability, service and building structures that stand the test of time",
        };
        const palaceBranchFlavour = {
          Rat: "resourcefulness and social intelligence",
          Ox: "perseverance and patient accumulation",
          Tiger: "boldness and forward momentum",
          Rabbit: "diplomacy and creative refinement",
          Dragon: "ambition and transformative scale",
          Snake: "depth, strategy and quiet power",
          Horse: "freedom, movement and dynamic energy",
          Goat: "compassion, creativity and collaborative flow",
          Monkey: "adaptability, wit and versatile execution",
          Rooster: "precision, discernment and high standards",
          Dog: "loyalty, duty and principled commitment",
          Pig: "abundance-mindedness, generosity and natural ease",
        };
        const conceptionStemMeaning = {
          Metal: "arrived with a natural inclination toward precision, discernment and structural thinking",
          Water: "arrived with heightened intuition, emotional depth and an innate capacity for reading situations",
          Wood: "arrived with an instinctive drive toward growth, ambition and forward momentum",
          Fire: "arrived with a natural warmth, expressiveness and an innate awareness of how things are perceived",
          Earth: "arrived with an instinctive groundedness, practicality and a deep orientation toward service and stability",
        };
        return (
          <AdminReportSection icon="🔮" title="Life Palace & Conception Palace">
            <p className="mt-3 text-base leading-7 text-stone-600">
              These two pillars reveal your soul-level purpose and the energy of your arrival into this life. The <strong>Life Palace</strong> reflects your innate potential and natural life path — the deeper mission your chart is oriented toward beyond day-to-day circumstances. The <strong>Conception Palace</strong> shows the energetic conditions surrounding your earliest formation, offering insight into inherited tendencies and what you came into this life already carrying. Together they provide a wider lens on who you came here to be.
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {lifePalace && (
                <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">Life Palace 命宮</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {lifePalace.pillar.stem.zh}{lifePalace.pillar.branch.zh}{" "}
                    ({lifePalace.pillar.stem.element} {lifePalace.pillar.branch.animal})
                  </p>
                  {palaceStemMeaning[lifePalace.pillar.stem.element] && (
                    <p className="mt-2 text-sm text-stone-600">
                      With a {lifePalace.pillar.stem.element} Life Palace, {palaceStemMeaning[lifePalace.pillar.stem.element]}
                      {palaceBranchFlavour[lifePalace.pillar.branch.animal]
                        ? `, expressed through the ${lifePalace.pillar.branch.animal}'s quality of ${palaceBranchFlavour[lifePalace.pillar.branch.animal]}.`
                        : "."}
                    </p>
                  )}
                </div>
              )}
              {conceptionPalace && (
                <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">Conception Palace 胎元</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {conceptionPalace.pillar.stem.zh}{conceptionPalace.pillar.branch.zh}{" "}
                    ({conceptionPalace.pillar.stem.element} {conceptionPalace.pillar.branch.animal})
                  </p>
                  {conceptionStemMeaning[conceptionPalace.pillar.stem.element] && (
                    <p className="mt-2 text-sm text-stone-600">
                      This person {conceptionStemMeaning[conceptionPalace.pillar.stem.element]}
                      {palaceBranchFlavour[conceptionPalace.pillar.branch.animal]
                        ? `, coloured by the ${conceptionPalace.pillar.branch.animal}'s energy of ${palaceBranchFlavour[conceptionPalace.pillar.branch.animal]}.`
                        : "."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </AdminReportSection>
        );
      })()}

      {!!shenSha.length && (
        <AdminReportSection icon="🌸" title="Personal Stars (Shen Sha)">
          <p className="mt-3 text-base leading-7 text-stone-600">
            Shen Sha are auxiliary stars derived from your natal chart that highlight specific recurring themes in your life — from romance and travel to learning, protection and hidden obstacles. They are not dominant forces like your Day Master or Useful God, but they colour how certain energies show up in your experiences. Stars marked <em>active in this chart</em> have a stronger and more consistent influence on your daily patterns.
          </p>
          <div className="mt-3">
            <AdminBulletList
              items={shenSha}
              render={(item) => {
                const target = item.branches
                  ? item.branches.map((b) => `${b.zh} ${b.animal}`).join(" / ")
                  : item.branch
                  ? `${item.branch.zh} ${item.branch.animal}`
                  : item.stem
                  ? `${item.stem.zh} ${item.stem.name}`
                  : "";
                return (
                  <>
                    <strong>
                      {item.name} ({item.zh})
                    </strong>{" "}
                    — {target}
                    {item.active ? " · active in this chart" : ""}.{" "}
                    {item.theme}
                    {item.caution ? ` ${item.caution}` : ""}
                  </>
                );
              }}
            />
          </div>
        </AdminReportSection>
      )}

      {!!luckPillars?.pillars?.length && (() => {
        // Compute client's current age to highlight the active pillar
        const birthYear = report.client?.birthDate
          ? Number(report.client.birthDate.split("-")[0])
          : null;
        const birthMonth = report.client?.birthDate
          ? Number(report.client.birthDate.split("-")[1])
          : null;
        const now = new Date();
        const currentAge = birthYear
          ? now.getFullYear() - birthYear - (now.getMonth() + 1 < birthMonth ? 1 : 0)
          : null;

        const tenGodTheme = {
          "Friend":           "A decade of peer connection, mutual support and building through relationships. Collaborative energy — shared goals and alliances matter most.",
          "Rob Wealth":       "A decade of competition, ambition and fighting for position. Drive is high but so is rivalry — stay focused on long-term strategy over short-term wins.",
          "Eating God":       "A decade of creative expression, skill-building and personal output. A productive window to develop expertise and share your work with the world.",
          "Hurting Officer":  "A decade of independence, innovation and breaking with convention. Strong drive to do things your own way — powerful if channelled, disruptive if unchecked.",
          "Direct Wealth":    "A decade oriented toward building tangible assets, financial discipline and steady, structured growth. Hard work pays off reliably during this period.",
          "Indirect Wealth":  "A decade of opportunity, opportunistic gains and wealth through non-traditional routes. Flexible thinking and timing matter more than routine effort.",
          "Direct Officer":   "A decade of responsibility, reputation and institutional advancement. Status and career structure are prominent — authority is earned through discipline.",
          "Seven Killings":   "A decade of pressure, intensity and ambition. Challenges are sharper here, but so is the drive to overcome them — breakthrough potential is high for those who persevere.",
          "Direct Resource":  "A decade of support, mentorship and learning. A nurturing period — help arrives from others, and investing in knowledge or credentials pays long-term dividends.",
          "Indirect Resource":"A decade of intuition, spiritual insight and unconventional wisdom. Less structured support, more inner-guided clarity — trust gut instinct over outside opinion.",
        };

        const primaryEl = usefulGod.primaryUsefulGod;
        const secondaryEl = usefulGod.secondaryUsefulGod;

        function pillarRead(stemElement) {
          if (stemElement === primaryEl) return "favourable";
          if (stemElement === secondaryEl) return "supported";
          // Elements that produce or are produced by the useful god are broadly neutral;
          // elements that clash or drain it lean caution. Keep it simple: anything
          // that isn't a useful-god element is caution if it's in the top-2 strongest
          // natal elements (already excess in the chart).
          const strongEls = elementalBalance
            .slice(0, 2)
            .map((e) => e.name);
          if (strongEls.includes(stemElement)) return "caution";
          return "neutral";
        }

        const readStyle = {
          favourable: { badge: "bg-emerald-100 text-emerald-800", label: "Favourable" },
          supported:  { badge: "bg-teal-100 text-teal-700",      label: "Supported"  },
          caution:    { badge: "bg-amber-100 text-amber-800",     label: "Caution"    },
          neutral:    { badge: "bg-slate-100 text-slate-600",     label: "Neutral"    },
        };

        return (
          <AdminReportSection icon="📈" title="Luck Pillars (大運)">
            <p className="mt-3 text-base leading-7 text-stone-600">
              Luck Pillars are 10-year energy cycles that map the broader seasons of your life. Each pillar brings a different elemental emphasis that colours your career, relationships, wealth and personal growth during that period. Knowing which pillar you are currently in helps you work with the energy of your season rather than against it — some pillars accelerate growth, others call for consolidation, and understanding the difference allows you to pace yourself wisely.
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Cycles begin from age {luckPillars.startingAge.years}y{luckPillars.startingAge.months}m, stepping{" "}
              {luckPillars.direction === "forward" ? "forward" : "in reverse"}{" "}
              through the cycle from the month pillar.
              {currentAge !== null && ` Current age: ${currentAge}.`}
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                    <th className="px-4 py-2.5">Age</th>
                    <th className="px-4 py-2.5">Pillar</th>
                    <th className="px-4 py-2.5">Read</th>
                    <th className="px-4 py-2.5">Decade Theme</th>
                  </tr>
                </thead>
                <tbody>
                  {luckPillars.pillars.map((p, i) => {
                    const isCurrent = currentAge !== null &&
                      currentAge >= p.startAge.years &&
                      currentAge < p.endAge.years;
                    const read = pillarRead(p.pillar.stem.element);
                    const rs = readStyle[read];
                    const theme = tenGodTheme[p.tenGod] || null;
                    return (
                      <tr
                        key={i}
                        className={`border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3] ${isCurrent ? "bg-amber-50 print:bg-[#FAE5D3]" : ""}`}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                          {p.startAge.years}y–{p.endAge.years}y
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white print:bg-[#8B1A1A]">
                              NOW
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {p.pillar.stem.zh}{p.pillar.branch.zh}
                          </span>{" "}
                          <span className="text-stone-500">
                            ({p.pillar.stem.name} {p.pillar.branch.animal})
                          </span>
                          <br />
                          <span className="text-xs text-stone-400">{p.pillar.stem.element} · {p.tenGod}{getProfileDisplay(p.tenGod)?.name ? ` · ${getProfileDisplay(p.tenGod).name}` : ""}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${rs.badge}`}>
                            {rs.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-600 leading-5">
                          {theme || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminReportSection>
        );
      })()}

      <AdminReportSection icon="📖" title="Bazi Reference — The 10 Energy Archetypes">
        <p className="mt-3 text-sm text-stone-500">
          Each personality pattern in this report is derived from one of ten classical Bazi archetypes. Use this table as a quick reference when explaining any term that appears in the chart above.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 print:rounded-none print:border-[#8B1A1A]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600 print:bg-[#8B1A1A] print:text-white">
                <th className="px-4 py-2.5">Bazi Term</th>
                <th className="px-4 py-2.5">Also Called</th>
                <th className="px-4 py-2.5">In Simple Terms</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Friend",           "The Companion",   "Loyalty, peer support, building through relationships"],
                ["Rob Wealth",       "The Challenger",  "Drive, ambition, bold self-assertion and healthy competition"],
                ["Eating God",       "The Creator",     "Creative expression, skill-building and personal output"],
                ["Hurting Officer",  "The Rebel Voice", "Independence, innovation and questioning the status quo"],
                ["Direct Wealth",    "The Builder",     "Stability, discipline and steady, structured results"],
                ["Indirect Wealth",  "The Opportunist", "Spotting opportunities, flexibility and network-driven gains"],
                ["Direct Officer",   "The Guardian",    "Responsibility, reputation and doing what is right"],
                ["Seven Killings",   "The Warrior",     "Pressure, decisiveness and breakthrough intensity"],
                ["Direct Resource",  "The Nurturer",    "Support, mentorship and investing in knowledge"],
                ["Indirect Resource","The Mystic",      "Intuition, reflection and unconventional insight"],
              ].map(([term, name, desc], i) => (
                <tr key={term} className="border-t border-slate-100 align-top print:border-[#e5d5c0] odd:print:bg-white even:print:bg-[#FAE5D3]">
                  <td className="px-4 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{term}</td>
                  <td className="px-4 py-2.5 font-semibold text-amber-800 whitespace-nowrap">{name}</td>
                  <td className="px-4 py-2.5 text-stone-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminReportSection>

      <details
        className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 print-no-export"
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

function exportAdminReportToPdf() {
  const style = document.createElement("style");
  style.id = "huangs-print-style";
  style.textContent = `
    @media print {
      @page {
        margin: 1.5cm;
        size: A4;
        /* Blank out browser-injected URL/date/page-number headers and footers */
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: "Bazi Analysis generated by huangsjadeiteandjewelry.com."; font-size: 9pt; color: #888; }
        @bottom-right { content: ""; }
      }
      body * { visibility: hidden !important; }
      #admin-full-report, #admin-full-report * { visibility: visible !important; }
      #admin-full-report { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }
      .print-no-export { display: none !important; }
      .print-footer { display: none !important; }
      .print-cover {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        min-height: 85vh;
        padding: 5cm 2cm 3cm 2cm !important;
        page-break-after: always;
      }
      .print-cover img {
        display: block !important;
        margin: 0 auto 1.5rem auto !important;
        max-width: 200px !important;
        width: auto !important;
        height: auto !important;
      }
      .print-cover > h1,
      .print-cover > p {
        text-align: center !important;
        width: 100% !important;
      }
      .print-cover-body {
        text-align: left !important;
        max-width: 480px !important;
        margin: 1rem auto 0 auto !important;
      }
      table { border-collapse: collapse; width: 100%; }
      .print-break-before { page-break-before: always; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => {
    const existing = document.getElementById("huangs-print-style");
    if (existing) existing.remove();
  }, 1500);
}

function PremiumInsights({ report, isAdmin = false, fullReport = null, clientName = "" }) {
  if (!report) return null;

  if (isAdmin) {
    return (
      <section
        id="admin-full-report"
        className="rounded-[36px] border border-amber-300 bg-white px-8 py-10 shadow-lg md:px-10"
      >
        <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-800 print:hidden">
          🔓 Full Report (Admin)
        </p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl print:hidden">
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

      <div className="mt-10 rounded-[28px] border border-yellow-500 bg-slate-950 px-6 py-14 text-center shadow-xl">
        <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-yellow-400">
          WANT THE FULL PICTURE?
        </p>

        <h3 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
          Unlock Your Full Bazi Destiny Blueprint
        </h3>

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
      </div>
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

const THEME_DESCRIPTIONS = {
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

  const wealthArchetype =
    chart?.wealthArchetypeV2 ||
    chart?.wealthArchetypeV1 ||
    chart?.wealthArchetype ||
    uiChart?.wealthArchetype ||
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

            <EmotionalEnergyBalance elements={uiChart?.elements} />

            <RelationshipArchetypeSection
              relationshipArchetype={relationshipArchetype}
            />

            <WealthTeaserSection wealth={wealthArchetype} />

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

            <PremiumInsights
              report={previewReport}
              isAdmin={isAdmin}
              fullReport={chart?.paidReportSchemaV1}
              clientName={submittedInput?.name}
            />
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}