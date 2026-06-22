// Vercel serverless function: capture lead emails from the BaZi app popup.
//
// Phase-1 behaviour:
//   - Validate the email.
//   - Log it to the Vercel function console (Vercel dashboard > Logs).
//   - OPTIONALLY forward it to a Google Sheet / Zapier / Make webhook if you
//     set the LEAD_WEBHOOK_URL environment variable. This lets leads land in a
//     spreadsheet with no code change.
//
// Vercel's filesystem is ephemeral, so a local file won't persist — the webhook
// approach is the standard way to get rows into a Google Sheet.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const email = String(body.email || "").trim().toLowerCase();
    const source = body.source || "bazi-app";
    const coupon = body.coupon || "";
    const ts = body.ts || new Date().toISOString();

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!looksLikeEmail) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const record = { email, source, coupon, ts };
    console.log("LEAD_CAPTURED", JSON.stringify(record));

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      } catch (err) {
        console.error("LEAD_WEBHOOK_FAILED", err?.message || err);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SUBSCRIBE_ERROR", err?.message || err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
