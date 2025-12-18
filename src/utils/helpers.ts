import { formatDistance } from "date-fns";

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const monthYearOnly = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString("default", { month: "short", year: "numeric" });
};

export const formatRelativeTime = (date: string) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const TOKEN_KEY = "auth_token";

// Helper functions for token management
export const getStoredToken = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const setStoredToken = (
  data: object | string | null,
  key: string = TOKEN_KEY
): void => {
  if (typeof window !== "undefined") {
    if (data) {
      localStorage.setItem(
        key,
        typeof data === "string" ? data : JSON.stringify(data)
      );
    } else {
      localStorage.removeItem(key);
    }
  }
};
