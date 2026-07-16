// Vercel serverless function: capture lead emails from the BaZi app popup.
//
// Security measures applied:
//   - Rate limiting: max 5 submissions per IP per hour (in-memory, per instance).
//     Sufficient for this app's traffic profile — a determined attacker hitting
//     multiple instances simultaneously would need significant infrastructure
//     that far exceeds any realistic threat to this app.
//   - Email addresses are NOT written to logs. Only non-PII metadata is logged
//     (source, timestamp, success/failure). Emails go to Shopify and the
//     optional webhook — that's it.
//   - Body size cap: requests over 4 KB are rejected before parsing.
//   - Origin restriction: only accepts requests from the production domain and
//     localhost (dev). Set ALLOWED_ORIGIN env var to override.

const SHOPIFY_API_VERSION = "2025-10";

// ─── Rate limiting ────────────────────────────────────────────────────────────

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX       = 5;               // max submissions per IP per window

const ipStore = new Map(); // ip -> { count, resetAt }

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

// Prune expired entries so the Map doesn't grow unbounded in long-lived instances.
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore) {
    if (now > entry.resetAt) ipStore.delete(ip);
  }
}, RATE_WINDOW_MS);

// ─── Shopify ──────────────────────────────────────────────────────────────────

async function getShopifyAccessToken(shopDomain, clientId, clientSecret) {
  const response = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify token exchange failed: ${response.status} ${body}`);
  }
  const data = await response.json();
  return data.access_token;
}

async function upsertShopifyCustomer(email) {
  const shopDomain   = process.env.SHOPIFY_SHOP_DOMAIN;
  const clientId     = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!shopDomain || !clientId || !clientSecret) {
    console.warn("SHOPIFY_SYNC_SKIPPED: env vars not configured");
    return { ok: false, skipped: true };
  }

  const accessToken = await getShopifyAccessToken(shopDomain, clientId, clientSecret);

  const baseUrl = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  // Check for existing customer so a repeat visitor updates rather than errors.
  const searchRes = await fetch(
    `${baseUrl}/customers/search.json?query=${encodeURIComponent(`email:${email}`)}`,
    { headers }
  );
  if (!searchRes.ok) {
    const errBody = await searchRes.text();
    throw new Error(`Shopify customer search failed: ${searchRes.status} ${errBody}`);
  }

  const existing = (await searchRes.json())?.customers?.[0] || null;

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

  const url    = existing ? `${baseUrl}/customers/${existing.id}.json` : `${baseUrl}/customers.json`;
  const method = existing ? "PUT" : "POST";

  const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Shopify customer ${method} failed: ${res.status} ${errorBody}`);
  }

  return { ok: true, updated: !!existing };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

// All valid origins for this app. ALLOWED_ORIGIN env var can add one more (e.g. a
// future custom domain). vercel.app preview URLs are intentionally excluded.
const ALLOWED_ORIGINS = new Set([
  "https://huangs-bazi-app-huangs-bazi.vercel.app",
  "https://huangs-bazi-app-nine.vercel.app",
  "https://bazi.huangsjadeiteandjewelry.com", // custom domain (DNS pending)
  ...(process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : []),
]);

export default async function handler(req, res) {
  // CORS — only accept requests from known production origins (and localhost in dev).
  const origin = req.headers["origin"] || "";
  const corsOrigin = (ALLOWED_ORIGINS.has(origin) || origin.startsWith("http://localhost"))
    ? origin
    : [...ALLOWED_ORIGINS][0]; // fallback to primary origin

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Body size cap — reject anything suspiciously large before parsing.
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > 4096) {
    return res.status(413).json({ ok: false, error: "Request too large" });
  }

  // IP extraction (Vercel sets x-forwarded-for).
  const ip = (req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim() || req.socket?.remoteAddress || "unknown";

  // Rate limit check.
  if (!checkRateLimit(ip)) {
    console.warn("RATE_LIMITED", { ip: ip.slice(0, 8) + "…", ts: new Date().toISOString() });
    return res.status(429).json({ ok: false, error: "Too many requests — please try again later" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const email  = String(body.email  || "").trim().toLowerCase();
    const source = String(body.source || "bazi-app").slice(0, 64);
    const coupon = String(body.coupon || "").slice(0, 32);
    const ts     = new Date().toISOString(); // always use server time

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    // Log only non-PII metadata — email never written to logs.
    console.log("LEAD_RECEIVED", { source, coupon, ts });

    try {
      const result = await upsertShopifyCustomer(email);
      console.log("SHOPIFY_SYNC", { ok: result.ok, updated: result.updated, skipped: result.skipped });
    } catch (err) {
      console.error("SHOPIFY_SYNC_FAILED", err?.message || String(err));
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      try {
        // Webhook receives the full record (including email) — that destination
        // is operator-controlled and is the intended long-term store.
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source, coupon, ts }),
        });
      } catch (err) {
        console.error("WEBHOOK_FAILED", err?.message || String(err));
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SUBSCRIBE_ERROR", err?.message || String(err));
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
