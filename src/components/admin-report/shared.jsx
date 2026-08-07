export function AdminBulletList({ items, render }) {
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

export function AdminReportSection({ icon, title, children }) {
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

export function AdminMonthCallout({ label, months, tone = "good" }) {
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

export function AdminStrengthRiskGrid({ strengths, risks, strengthLabel = "Strengths", riskLabel = "Risks" }) {
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
