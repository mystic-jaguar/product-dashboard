const KEY = "token";

// localStorage only exists in the browser, so guard for server rendering.
export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(KEY);
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);
