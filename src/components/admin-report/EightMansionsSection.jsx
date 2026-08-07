import { AdminBulletList, AdminReportSection } from "./shared";

export default function EightMansionsSection({ eightMansions }) {
  if (!eightMansions) return null;

  return (
    <AdminReportSection icon="🧭" title="Personal Directions (Eight Mansions)">
      <p className="mt-3 text-base leading-7 text-stone-600">
        Based on your birth year, Eight Mansions assigns you a Kua number that determines which compass directions support or drain your energy. Use your favourable directions for your desk, bed headboard and where you sit during important conversations or decisions. Avoiding unfavourable directions for sleep and major commitments helps reduce unnecessary friction over time.
      </p>
      <div className="mt-4 flex items-start gap-5 rounded-xl border border-slate-200 bg-slate-50 p-4 print:bg-[#FAF3EF] print:border-[#e5d5c0]">
        <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0" aria-label="iPhone compass diagram">
          <circle cx="55" cy="55" r="52" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="1.5"/>
          <circle cx="55" cy="55" r="44" fill="none" stroke="#3A3A3C" strokeWidth="1"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
            const r1 = deg % 90 === 0 ? 36 : 41;
            const r2 = 44;
            const a = (deg - 90) * Math.PI / 180;
            return <line key={deg} x1={55 + r1*Math.cos(a)} y1={55 + r1*Math.sin(a)} x2={55 + r2*Math.cos(a)} y2={55 + r2*Math.sin(a)} stroke="#636366" strokeWidth={deg % 90 === 0 ? 1.5 : 0.75}/>;
          })}
          <polygon points="55,12 50,55 55,48 60,55" fill="#FF3B30"/>
          <polygon points="55,98 50,55 55,62 60,55" fill="#EBEBF5"/>
          <text x="55" y="10" textAnchor="middle" fill="#FF3B30" fontSize="11" fontWeight="bold" fontFamily="system-ui">N</text>
          <text x="55" y="106" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">S</text>
          <text x="104" y="59" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">E</text>
          <text x="6" y="59" textAnchor="middle" fill="#EBEBF5" fontSize="11" fontWeight="bold" fontFamily="system-ui">W</text>
          <circle cx="55" cy="55" r="4" fill="#636366"/>
          <circle cx="55" cy="55" r="2" fill="#EBEBF5"/>
        </svg>
        <div className="text-xs text-stone-500 leading-relaxed">
          <p className="font-semibold text-stone-700 mb-1">How to find your directions</p>
          <p>Open the <strong>Compass app</strong> on your iPhone. Hold your phone flat and level. The <span className="text-red-600 font-bold">red needle always points North</span> — the white needle points South.</p>
          <p className="mt-1.5">Once you know where North is, East is to your right, West to your left, and South is behind you. Use this to position your desk, bed headboard and seating accordingly.</p>
        </div>
      </div>
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
  );
}
