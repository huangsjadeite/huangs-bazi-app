// General zodiac-sign compatibility (family, friends, work and partners), from
// zodiacCompatibilityV1. Shared by both PDF exports.

import { AdminReportSection } from "./shared";

function ZodiacMatchList({ title, tone, items }) {
  return (
    <div style={{ breakInside: "avoid" }}>
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${tone}`}>{title}</p>
      <ul className="mt-1.5 space-y-1.5 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item.key}>
            <strong>
              {item.zh} {item.animal}
            </strong>{" "}
            <span className="text-stone-500">({item.reasons.map((r) => `${r.zh} ${r.label}`).join(" + ")})</span> —{" "}
            {item.reasons.map((r) => r.text).join("; ")}.
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ZodiacCompatibilitySection({ compatibility }) {
  if (!compatibility) return null;
  const { sign, best, challenging, neutral } = compatibility;
  return (
    <AdminReportSection icon="🐉" title="Zodiac Compatibility">
      <p className="mt-3 text-base leading-7 text-stone-700">
        Your zodiac sign is the <strong>{sign.zh} {sign.animal}</strong>, from your Bazi year pillar (the Bazi year
        starts at 立春, around 4 February, not at Chinese New Year). These are the signs that naturally get on well
        with yours and the ones that need more patience. It applies to everyone around you: family, friends,
        colleagues, bosses, business partners and partners alike.
      </p>
      <div className="mt-3 grid gap-x-6 gap-y-4 md:grid-cols-2 print:grid-cols-2">
        <ZodiacMatchList title="Most compatible" tone="text-green-700" items={best} />
        <ZodiacMatchList title="Needs more effort" tone="text-red-700" items={challenging} />
      </div>
      {!!neutral.length && (
        <p className="mt-3 text-sm leading-6 text-stone-600">
          <strong>Neutral:</strong> {neutral.map((n) => `${n.zh} ${n.animal}`).join(", ")}. These neither
          especially help nor clash with your sign.
        </p>
      )}
      <p className="mt-2 text-xs leading-5 text-stone-500">
        Zodiac signs are a first guide only. A challenging sign can still work well when the two full birth charts
        support each other, and a full compatibility reading compares both charts.
      </p>
    </AdminReportSection>
  );
}
