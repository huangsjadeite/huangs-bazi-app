// Reading ("Current Energy Year") options offered in the form.
//
// RELEASED_YEARS are live for everyone. PREVIEW_YEARS only appear on the local
// dev server (`npm run dev`); in the deployed build they show as "Coming Soon"
// and can't be picked. To release a year, move it from PREVIEW to RELEASED.
export const RELEASED_YEARS = [2026];
export const PREVIEW_YEARS = [2027];

export const DEFAULT_YEAR = RELEASED_YEARS[RELEASED_YEARS.length - 1];

// import.meta.env only exists under Vite; plain-node test scripts see false.
export const IS_DEV_PREVIEW = Boolean(import.meta.env?.DEV);
