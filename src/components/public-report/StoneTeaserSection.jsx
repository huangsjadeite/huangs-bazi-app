import { selectTeaserStones } from "./helpers";

// Shopify cart permalink: adds the variant straight to cart and redirects to
// checkout, skipping the product page entirely. Variant ID is for "Personal
// Feng Shui Energy Analysis & Gemstone Alignment" — re-fetch it from
// https://www.huangsjadeiteandjewelry.com/products/personal-feng-shui-energy-analysis-gemstone-alignment.json
// if that product is ever deleted and recreated (its variant ID would change).
const BOOK_FULL_READING_URL =
  "https://www.huangsjadeiteandjewelry.com/cart/53586988302549:1";

export default function StoneTeaserSection({ stones, clientName = "" }) {
  const teaserStones = selectTeaserStones(stones, 3);

  if (teaserStones.length === 0) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-md">
      <h2 className="text-3xl font-bold text-slate-950">
        {clientName
          ? `${clientName}, here are your top 3 priority stones.`
          : "Your Top 3 Priority Stones"}
      </h2>

      <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
        Based on your chart, these stones support your personal energy. Wear
        them daily for a simple, practical boost.
      </p>

      <div className="mt-8 rounded-[28px] border border-yellow-500 bg-slate-950 px-6 py-12 text-center shadow-xl">
        <h3 className="mx-auto max-w-3xl text-2xl font-bold leading-tight text-white md:text-4xl">
          Your Full Bazi Analysis, Just $38
        </h3>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          Go beyond your top 3 stones. Get your full career timing, wealth
          direction, relationship dynamics, health guide — in one
          personalised reading.
        </p>

        <p className="mx-auto mt-4 max-w-3xl text-sm font-semibold text-yellow-400">
          Fully deductible from your purchase after your analysis results.
        </p>

        <a
          href={BOOK_FULL_READING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-2xl bg-orange-500 px-10 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-400"
        >
          Book Full Reading
        </a>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {teaserStones.map((item) => (
          <div
            key={item.rank}
            className="rounded-2xl border border-zinc-200 bg-[#FFFDF8] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">💎</div>

            <p className="mt-4 text-sm font-semibold text-stone-500">
              {item.element} Support
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-950">
              {item.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              {item.why}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs italic text-stone-500">
        Note: Stones have to be activated before use for maximum effect.
      </p>
    </section>
  );
}
