import { AdminReportSection } from "./shared";

const ARCHETYPE_REFERENCE = [
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
];

export default function ReferenceTableSection() {
  return (
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
            {ARCHETYPE_REFERENCE.map(([term, name, desc]) => (
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
  );
}
