export function createThemeTracker() {
  const used = new Set();

  function use(theme) {
    if (!theme) return false;
    const key = theme.toLowerCase().trim();
    if (used.has(key)) return false;
    used.add(key);
    return true;
  }

  function has(theme) {
    return used.has(theme.toLowerCase().trim());
  }

  return { use, has };
}