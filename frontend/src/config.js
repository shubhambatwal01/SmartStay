const normalizeUrl = (value) => value?.trim().replace(/\/+$/, "");

export const API_URL =
  normalizeUrl(import.meta.env.VITE_API_URL) ||
  "https://smartstay-8bre.onrender.com";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    "Missing VITE_GOOGLE_CLIENT_ID. Add it to frontend/.env and restart Vite.",
  );
}
