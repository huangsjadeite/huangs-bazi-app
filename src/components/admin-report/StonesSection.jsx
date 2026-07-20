import { AdminBulletList, AdminReportSection } from "./shared";

export default function StonesSection({ usefulGod, stones, primaryDzi, secondaryDzi }) {
  return (
    <>
      <AdminReportSection icon="💎" title="Main Supportive Elements & Stones">
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
                  <strong>{item.name}</strong> — {item.customerMessage.split(/\.\s+(?:Best|Helpful|Good)\s/)[0]}.
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
                  <strong>{item.name}</strong> — {item.customerMessage.split(/\.\s+(?:Best|Helpful|Good)\s/)[0]}.
                </>
              )}
            />
          </div>
        )}
      </AdminReportSection>

      {(primaryDzi || secondaryDzi) && (
        <AdminReportSection icon="🪬" title="Optional Dzi Beads">
          <p className="mt-3 text-sm text-stone-500">
            Tibetan amulet recommendations based on this chart's Useful God and energy needs.
          </p>
          <div className="mt-4 space-y-4">
            {primaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.primaryUsefulGod} energy
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={primaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {primaryDzi.label}
                  </a>
                  <span className="ml-2 text-sm font-normal text-stone-400">· {usefulGod.primaryUsefulGod} element</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">{primaryDzi.why}</p>
              </div>
            )}
            {secondaryDzi && (
              <div className="rounded-xl border border-slate-200 p-4 print:border-[#8B1A1A] print:bg-[#FAE5D3]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700 print:text-[#8B1A1A]">
                  Supporting your {usefulGod.secondaryUsefulGod} energy
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  <a href={secondaryDzi.url} target="_blank" rel="noreferrer" className="hover:underline print:no-underline print:text-slate-900">
                    {secondaryDzi.label}
                  </a>
                  <span className="ml-2 text-sm font-normal text-stone-400">· {usefulGod.secondaryUsefulGod} element</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">{secondaryDzi.why}</p>
              </div>
            )}
          </div>
        </AdminReportSection>
      )}
    </>
  );
}
