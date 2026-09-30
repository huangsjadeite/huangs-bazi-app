// Personal Date Selection: pick a day and see how it reads for this person,
// plus the best days in the next 30. All ratings come from dateSelectionV1.
import { useMemo, useState } from "react";
import { buildDateSelectionV1, findBestDatesV1 } from "../../engine/dateSelectionV1";

const RATING_STYLE = {
  Auspicious: "bg-emerald-100 text-emerald-800",
  Favourable: "bg-teal-100 text-teal-700",
  Neutral: "bg-slate-100 text-slate-600",
  Challenging: "bg-amber-100 text-amber-800",
  Inauspicious: "bg-red-100 text-red-700",
  "Clashes their Day pillar": "bg-red-100 text-red-700",
};

const PERSONAL_READ_TEXT = {
  good: "brings an element they need",
  neutral: "neither helps nor strains their chart",
  caution: "adds more of what their chart already has plenty of",
};

function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

function Row({ label, children }) {
  return (
    <tr className="border-t border-amber-200/60 align-top">
      <td className="w-40 px-4 py-2.5 text-sm text-stone-600">{label}</td>
      <td className="px-4 py-2.5 text-base font-semibold text-slate-900">{children}</td>
    </tr>
  );
}

export default function DateSelectionPanel({ rawChartData, usefulGod }) {
  const [date, setDate] = useState(todayIso);

  const natal = useMemo(
    () => ({
      dayStemKey: rawChartData?.natal?.day?.stem?.key,
      dayBranchKey: rawChartData?.natal?.day?.branch?.key,
    }),
    [rawChartData]
  );
  const elements = useMemo(
    () => ({
      favourable: usefulGod.favourableElements,
      secondaryFavourable: usefulGod.secondaryFavourableElements,
      caution: usefulGod.cautionElements,
    }),
    [usefulGod]
  );

  const read = useMemo(() => buildDateSelectionV1({ date, natal, elements }), [date, natal, elements]);
  const bestDates = useMemo(() => findBestDatesV1({ startDate: date, natal, elements }), [date, natal, elements]);

  if (!natal.dayStemKey) return null;

  return (
    <div className="mt-8" style={{ breakInside: "avoid" }}>
      <h3 className="text-xl font-bold text-slate-950">Date Selection (择日)</h3>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        How a given day reads for this person. It combines three things: whether the day's element is one they
        need, the day's Ten God energy for their Day Master, and the traditional 12 Day Officers (建除十二神) from
        the Tong Shu almanac.
      </p>

      <label className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-700 print:hidden">
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => event.target.value && setDate(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
      </label>

      {read && (
        <div className="mt-3 overflow-hidden rounded-2xl bg-amber-50 print:bg-[#FAE5D3]">
          <table className="w-full">
            <tbody>
              <Row label="Date">
                {formatDate(read.date)} · {read.dayPillar.zh} {read.dayPillar.stemElement} {read.dayPillar.animal} day
              </Row>
              <Row label="Day energy for them">
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${RATING_STYLE[read.rating]}`}>
                  {read.rating}
                </span>
                <p className="mt-1 text-sm font-normal text-stone-600">
                  {read.dominantElement} day, which {PERSONAL_READ_TEXT[read.personalRead]}.
                  {read.clashesDayBranch && " The day's branch clashes their Day pillar (日冲), so avoid important personal matters."}
                </p>
              </Row>
              <Row label="10 God energy">
                {read.energy} <span className="font-normal text-stone-500">({read.tenGod})</span>
              </Row>
              <Row label="12 Day Officer">
                {read.officer.zh} {read.officer.en}{" "}
                <span className="font-normal text-stone-500">· {read.officer.qualityLabel}</span>
              </Row>
              <Row label="Suitable for">{read.suitableFor.join(", ")}</Row>
              <Row label="Avoid">
                <span className="font-normal text-stone-700">{read.officer.avoid.join(", ")}</span>
              </Row>
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
        Best days in the next 30 days
      </p>
      {bestDates.length ? (
        <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
          {bestDates.map((item) => (
            <li key={item.date} className="flex flex-wrap items-center gap-2">
              <span className="w-32 font-semibold text-slate-900">{formatDate(item.date)}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${RATING_STYLE[item.rating]}`}>{item.rating}</span>
              <span>
                {item.dayPillar.zh} · {item.officer.zh} {item.officer.en} · good for {item.suitableFor.slice(0, 2).join(", ").toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-stone-500">No stand-out days in this window.</p>
      )}
    </div>
  );
}
