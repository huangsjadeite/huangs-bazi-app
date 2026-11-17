// Voucher-style last page: the reading fee is credited toward a purchase.
// Both PDFs.

// Edit here if the reading price changes.
const CREDIT_AMOUNT = "$38";

const EXACT = { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" };

export default function CreditSection() {
  return (
    <section className="mt-10 print:mt-0" style={{ breakBefore: "page", breakInside: "avoid" }}>
      <div
        className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 px-6 py-10 text-center print:mt-24 print:border-[#8B1A1A] print:bg-[#FBEFE6]"
        style={EXACT}
      >
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700 print:text-[#8B1A1A]">Your {CREDIT_AMOUNT} Credit</p>
        <p className="mt-4 text-5xl font-extrabold text-slate-950 print:text-[#8B1A1A]">{CREDIT_AMOUNT}</p>
        <h2 className="mt-4 text-2xl font-bold text-slate-950">Your reading pays for itself</h2>
        <p className="mt-3 text-base leading-7 text-stone-700">
          Your {CREDIT_AMOUNT} is fully credited toward any jadeite or jewellery purchase at HUANGS.
        </p>
        <p className="mt-8 text-xs text-stone-500">One-time credit, not exchangeable for cash.</p>
      </div>
    </section>
  );
}
