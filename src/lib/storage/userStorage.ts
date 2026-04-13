const USER_STORAGE_KEY = "userId";

export function loadUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_STORAGE_KEY);
}

export function saveUser(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_STORAGE_KEY, userId);
}