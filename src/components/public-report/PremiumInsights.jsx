import AdminFullReport from "../admin-report/AdminFullReport";

export default function PremiumInsights({ report, isAdmin = false, fullReport = null, clientName = "" }) {
  if (!report) return null;

  if (isAdmin) {
    return (
      <section
        id="admin-full-report"
        className="rounded-[36px] border border-amber-300 bg-white px-8 py-10 shadow-lg md:px-10"
      >
        <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-800 print:hidden">
          🔓 Full Report (Admin)
        </p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl print:hidden">
          Complete Paid Reading
        </h2>

        <AdminFullReport report={fullReport} clientName={clientName} />
      </section>
    );
  }

  const premiumItems = [
    {
      icon: "💼",
      title: "Career Timing & Direction",
      text: "Understand when to push forward, when to refine your path and how your chart supports better career decisions.",
    },
    {
      icon: "💰",
      title: "Wealth Opportunities",
      text: "Go deeper into how you attract income, where money flows more naturally and what patterns may block financial growth.",
    },
    {
      icon: "❤️",
      title: "Relationship Dynamics",
      text: "Explore emotional needs, connection patterns, compatibility themes and the type of bond that supports you best.",
    },
    {
      icon: "🌿",
      title: "Wellness & Energy Balance",
      text: "Identify where your system may feel stretched and what supportive energies help you restore balance.",
    },
    {
      icon: "✨",
      title: "Hidden Strengths",
      text: "Reveal strengths that may not be obvious on the surface but can become powerful when consciously developed.",
    },
    {
      icon: "⚠️",
      title: "Personal Blind Spots",
      text: "Understand repeated patterns that may quietly affect your decisions, relationships, work and emotional wellbeing.",
    },
    {
      icon: "💎",
      title: "Main Supportive Elements & Stones",
      text: "Receive more specific guidance on favourable elements, gemstone support and practical energetic alignment.",
    },
    {
      icon: "🧭",
      title: "Your Life Direction",
      text: "Connect your current year energy with deeper life themes, growth cycles and long-term personal development.",
    },
  ];

  return (
    <section className="rounded-[36px] border border-orange-200 bg-gradient-to-br from-white via-[#FFFDF8] to-orange-50 px-8 py-10 shadow-lg md:px-10">
      <div className="mb-8 max-w-5xl">
        <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-700">
          Premium Insights Preview
        </p>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          What the Full Reading Goes Deeper Into
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
          Your free profile gives you the main energetic patterns. A full reading connects these patterns into timing, decisions, relationships, wealth direction and practical next steps.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {premiumItems.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
              {item.icon}
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-950">
              {item.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] border border-yellow-500 bg-slate-950 px-6 py-14 text-center shadow-xl">
        <p className="mb-4 text-sm font-semibold tracking-[0.35em] text-yellow-400">
          WANT THE FULL PICTURE?
        </p>

        <h3 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
          Unlock Your Full Bazi Destiny Blueprint
        </h3>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-300 md:text-xl">
          Your free profile reveals your surface energetic tendencies. A full consultation goes deeper into your Bazi structure, favourable elements, emotional patterns, career timing, relationship dynamics and long-term life cycles.
        </p>

        <a
          href="https://www.huangsjadeiteandjewelry.com/collections/singapore-feng-shui-master-services-%E5%BC%80%E5%85%89-kai-guang/products/personal-feng-shui-energy-analysis-gemstone-alignment"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-2xl bg-orange-500 px-10 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-400"
        >
          Book Full Reading
        </a>
      </div>
    </section>
  );
}
