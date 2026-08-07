export default function MonthlyOutlookSection({ monthlyOutlook, selectedYear, expandMonthlyNote }) {
  if (!monthlyOutlook.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-950">
        🗓️ Monthly Outlook — {selectedYear || ""}
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
  );
}
