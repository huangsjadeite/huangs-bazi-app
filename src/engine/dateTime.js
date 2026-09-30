import { getTimezoneFromBirthCountry } from "../data/countryTimezones.js";

export function parseBirthDate(birthDate) {
  if (typeof birthDate !== "string") {
    throw new Error("birthDate must be a string in YYYY-MM-DD format.");
  }

  const parts = birthDate.split("-");
  if (parts.length !== 3) {
    throw new Error("birthDate must use YYYY-MM-DD format.");
  }

  const [yearText, monthText, dayText] = parts;

  if (yearText.length !== 4 || monthText.length !== 2 || dayText.length !== 2) {
    throw new Error("birthDate must use YYYY-MM-DD format.");
  }

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error("birthDate contains invalid numbers.");
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValid) {
    throw new Error("birthDate is not a valid calendar date.");
  }

  return { year, month, day };
}

export function parseBirthTime(birthTime) {
  if (birthTime === undefined || birthTime === null || birthTime === "") return null;

  if (typeof birthTime !== "string") {
    throw new Error("birthTime must be a string in HH:mm format.");
  }

  const parts = birthTime.split(":");
  if (parts.length !== 2) {
    throw new Error("birthTime must use HH:mm format.");
  }

  const [hourText, minuteText] = parts;

  if (hourText.length !== 2 || minuteText.length !== 2) {
    throw new Error("birthTime must use HH:mm format.");
  }

  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("birthTime contains invalid numbers.");
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("birthTime must be a valid 24-hour time.");
  }

  return { hour, minute };
}

export function normalizeInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Input object is required.");
  }

  if (!input.birthDate) {
    throw new Error("birthDate is required.");
  }

  if (!input.birthCountry) {
    throw new Error("birthCountry is required.");
  }

  const parsedDate = parseBirthDate(input.birthDate);
  const parsedTime = parseBirthTime(input.birthTime);
  const timezone = getTimezoneFromBirthCountry(input.birthCountry);
  const useBirthTime = Boolean(parsedTime);

  return {
  name: input.name?.trim() || "",
  gender: input.gender || "",
  birthDate: input.birthDate,
  birthTime: input.birthTime || null,
  birthCountry: input.birthCountry,
  timezone,
  useBirthTime,
  year: parsedDate.year,
  month: parsedDate.month,
  day: parsedDate.day,
  hour: parsedTime ? parsedTime.hour : null,
  minute: parsedTime ? parsedTime.minute : null,
  selectedYear: Number(input.selectedYear) || null,
};
}