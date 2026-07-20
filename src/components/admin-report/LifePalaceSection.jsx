import { AdminReportSection } from "./shared";

const PALACE_STEM_MEANING = {
  Metal: "the life path is oriented around clarity, precision and building things of lasting value",
  Water: "the life path is oriented around wisdom, adaptability and the accumulation of deep inner knowing",
  Wood: "the life path is oriented around growth, initiation and laying foundations that others can build on",
  Fire: "the life path is oriented around vision, recognition and bringing people together through inspiration and warmth",
  Earth: "the life path is oriented around stability, service and building structures that stand the test of time",
};
const PALACE_BRANCH_FLAVOUR = {
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
const CONCEPTION_STEM_MEANING = {
  Metal: "arrived with a natural inclination toward precision, discernment and structural thinking",
  Water: "arrived with heightened intuition, emotional depth and an innate capacity for reading situations",
  Wood: "arrived with an instinctive drive toward growth, ambition and forward momentum",
  Fire: "arrived with a natural warmth, expressiveness and an innate awareness of how things are perceived",
  Earth: "arrived with an instinctive groundedness, practicality and a deep orientation toward service and stability",
};

export default function LifePalaceSection({ lifePalace, conceptionPalace }) {
  if (!lifePalace && !conceptionPalace) return null;

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
            {PALACE_STEM_MEANING[lifePalace.pillar.stem.element] && (
              <p className="mt-2 text-sm text-stone-600">
                With a {lifePalace.pillar.stem.element} Life Palace, {PALACE_STEM_MEANING[lifePalace.pillar.stem.element]}
                {PALACE_BRANCH_FLAVOUR[lifePalace.pillar.branch.animal]
                  ? `, expressed through the ${lifePalace.pillar.branch.animal}'s quality of ${PALACE_BRANCH_FLAVOUR[lifePalace.pillar.branch.animal]}.`
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
            {CONCEPTION_STEM_MEANING[conceptionPalace.pillar.stem.element] && (
              <p className="mt-2 text-sm text-stone-600">
                This person {CONCEPTION_STEM_MEANING[conceptionPalace.pillar.stem.element]}
                {PALACE_BRANCH_FLAVOUR[conceptionPalace.pillar.branch.animal]
                  ? `, coloured by the ${conceptionPalace.pillar.branch.animal}'s energy of ${PALACE_BRANCH_FLAVOUR[conceptionPalace.pillar.branch.animal]}.`
                  : "."}
              </p>
            )}
          </div>
        )}
      </div>
    </AdminReportSection>
  );
}
