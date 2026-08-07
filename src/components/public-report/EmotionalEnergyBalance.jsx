export default function EmotionalEnergyBalance({ elements }) {
  const elementRows = (elements || []).map((element) => {
    const percentage = Number(element.percentage || 0);

    let label = "Balanced";
    if (percentage >= 25) label = "Strong";
    if (percentage <= 12) label = "Weak";

    const emojiMap = {
      Wood: "🌿",
      Fire: "🔥",
      Earth: "⛰️",
      Metal: "⚔️",
      Water: "💧",
    };

    const annualPercentage = Number(
      element.annualPercentage || element.annual || percentage
    );

    const scaleElementBar = (value) => {
      return Math.min(100, Math.round((Number(value || 0) / 40) * 100));
    };

    const convertToTen = (value) => {
      return Math.min(10, Math.round((Number(value || 0) / 40) * 10));
    };

    return {
      name: element?.name || "",
      emoji: emojiMap[element?.name] || "✨",
      natal: convertToTen(percentage),
      annual: convertToTen(annualPercentage),
      label,
      natalScore: scaleElementBar(percentage),
      annualScore: scaleElementBar(annualPercentage),
    };
  });

  if (!elementRows.length) return null;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-md">
      <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
        〰️ Energy Analysis
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-950">
        Your Emotional Energy Balance
      </h2>

      <p className="mt-6 text-lg leading-relaxed text-slate-600">
        <span className="font-bold text-blue-700">What this shows:</span>{" "}
        An overview of how your emotional energy naturally behaves across the Five Elements.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {elementRows.map(({ name, emoji, natal, annual, label, natalScore, annualScore }) => {
          const statusClass =
            label === "Strong"
              ? "bg-green-50 text-green-700"
              : label === "Balanced"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700";

          return (
            <div
              key={name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  {emoji}
                </div>
                <h3 className="text-xl font-bold text-slate-950">{name}</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Natal Strength</span>
                    <span className="font-bold text-slate-900">{natal}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-red-900"
                      style={{ width: `${natalScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Yearly Influence</span>
                    <span className="font-bold text-slate-900">{annual}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-orange-600"
                      style={{ width: `${annualScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={`mt-6 rounded-xl px-4 py-3 text-base font-bold ${statusClass}`}>
                ● {label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
