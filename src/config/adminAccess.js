// Admin mode: visit with ?admin=PASSWORD to unlock the full paid report and
// the admin tools (?tool=zodiac). Password comes from VITE_ADMIN_PASSWORD (set
// in Vercel / .env); falls back to a default for local dev. Light internal
// gate, not strong security.
export function isAdminUrl() {
  if (typeof window === "undefined") return false;
  try {
    const provided = new URLSearchParams(window.location.search).get("admin");
    if (!provided) return false;
    const expected = import.meta.env?.VITE_ADMIN_PASSWORD || "huangs2026";
    return provided === expected;
  } catch {
    return false;
  }
}

export function getAdminTool() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("tool");
}

// Same page with ?tool set (or removed when tool is null), keeping the admin key.
export function adminToolHref(tool) {
  const params = new URLSearchParams(window.location.search);
  if (tool) params.set("tool", tool);
  else params.delete("tool");
  return `${window.location.pathname}?${params}`;
}
