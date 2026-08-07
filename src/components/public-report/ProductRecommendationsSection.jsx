import { buildShopifySearchUrl } from "./helpers";

export default function ProductRecommendationsSection({ products }) {
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
