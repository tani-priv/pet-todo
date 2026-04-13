const HUNGER_STORAGE_KEY = "hunger";

export function loadHunger(): number | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(HUNGER_STORAGE_KEY);
  if (!raw) return null;

  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

export function saveHunger(hunger: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HUNGER_STORAGE_KEY, hunger.toString());
}