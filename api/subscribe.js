// Vercel serverless function: capture lead emails from the BaZi app popup.
//
// Behaviour:
//   - Validate the email.
//   - Create (or update) a Shopify Customer record with marketing consent,
//     tagged "bazi-app-lead", via the Shopify Admin API. Requires
//     SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_API_TOKEN env vars (set in
//     Vercel project settings - see custom app setup in Shopify Admin >
//     Settings > Apps and sales channels > Develop apps).
//   - Also logs to the Vercel function console, and optionally forwards to a
//     webhook if LEAD_WEBHOOK_URL is set (the primary path now - points at a
//     Zap that writes straight into Shopify Customers, so no one with access
//     to this codebase needs to be able to read captured emails).
//
// If the Shopify env vars aren't set yet, that step is skipped (logged as a
// warning) rather than failing the whole request - the coupon reveal in the
// UI never depends on any of this succeeding.

// Bump this periodically - Shopify supports each dated API version for at
// least 12 months after release.
const SHOPIFY_API_VERSION = "2025-10";

async function upsertShopifyCustomer(email) {
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!shopDomain || !accessToken) {
    console.warn(
      "SHOPIFY_CUSTOMER_SYNC_SKIPPED: missing SHOPIFY_SHOP_DOMAIN or SHOPIFY_ADMIN_API_TOKEN"
    );
    return { ok: false, skipped: true };
  }

  const baseUrl = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  // Check for an existing customer with this email first, so a repeat
  // visitor updates their marketing consent instead of erroring on a
  // duplicate-email create.
  const searchResponse = await fetch(
    `${baseUrl}/customers/search.json?query=${encodeURIComponent(`email:${email}`)}`,
    { headers }
  );

  if (!searchResponse.ok) {
    const errBody = await searchResponse.text();
    throw new Error(`Shopify customer search failed: ${searchResponse.status} ${errBody}`);
  }

  const searchData = await searchResponse.json();
  const existingCustomer = searchData?.customers?.[0] || null;

  const payload = {
    customer: {
      email,
      email_marketing_consent: {
        state: "subscribed",
        opt_in_level: "single_opt_in",
      },
      tags: "bazi-app-lead",
    },
  };

  const url = existingCustomer
    ? `${baseUrl}/customers/${existingCustomer.id}.json`
    : `${baseUrl}/customers.json`;
  const method = existingCustomer ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Shopify customer ${method} failed: ${response.status} ${errorBody}`);
  }

  return { ok: true, updated: !!existingCustomer };
}

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

    try {
      const result = await upsertShopifyCustomer(email);
      console.log("SHOPIFY_CUSTOMER_SYNC", JSON.stringify({ email, ...result }));
    } catch (err) {
      console.error("SHOPIFY_CUSTOMER_SYNC_FAILED", err?.message || err);
    }

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
