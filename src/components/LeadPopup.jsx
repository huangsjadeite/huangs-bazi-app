import { useState } from "react";

const COUPON_CODE = "BAZI30";

export default function LeadPopup({ open, setOpen }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) return;

    setSubmitted(true);

    // Send to backend in the background (fire-and-forget) so the coupon reveal
    // above is never delayed by the network. /api/subscribe logs the email and
    // optionally forwards it to a Google Sheet / webhook.
    try {
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "bazi-app-lead-popup",
          coupon: COUPON_CODE,
          ts: new Date().toISOString(),
        }),
      }).catch((err) => console.error("subscribe failed:", err));
    } catch (err) {
      console.error("subscribe error:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFF8EE] p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <div className="text-center">
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Unlock Your 30% Off Code
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Enter your email below and instantly reveal your one-time use
                30% discount code for Huangs Jadeite and Jewelry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none focus:border-[#C89B5E]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-[#C89B5E] px-4 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#B5894F]"
              >
                Reveal My 30% Off Code
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-6 text-slate-500">
              One-time use only. Exclusions apply. By submitting your email,
              you agree to receive marketing emails from Huangs Jadeite and
              Jewelry. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C89B5E]/15 text-3xl">
              ✨
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Your Code Is Ready
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use this one-time 30% off code on your next purchase:
            </p>

            <div className="mt-5 rounded-2xl border border-dashed border-[#C89B5E] bg-white px-4 py-4 text-2xl font-black tracking-widest text-[#A67C52]">
              {COUPON_CODE}
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Copy this code and enter it at checkout on
              huangsjadeiteandjewelry.com.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}