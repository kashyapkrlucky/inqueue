import { formatDistance } from "date-fns";
import type { ITask, ITaskPriority, ITaskStatus } from "../types/index.types";
import { CheckCircle2Icon, CircleIcon, ClockIcon } from "lucide-react";

export const TOKEN_KEY = "auth_token";

export const STORAGE_KEYS = {
  tasks: "tasks",
};

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

export function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}




export const statusConfig = {
  todo: {
    label: "To Do",
    icon: CircleIcon,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
  },
  in_progress: {
    label: "In Progress",
    icon: ClockIcon,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  done: {
    label: "Done",
    icon: CheckCircle2Icon,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
} as const satisfies Record<
  ITaskStatus,
  {
    label: string;
    icon: typeof CircleIcon;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
>;

export const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-gray-400",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-500",
  },
  high: {
    label: "High",
    color: "bg-red-500",
  },
} as const satisfies Record<ITaskPriority, { label: string; color: string }>;

export const getTaskStatus = (status: ITask["status"]): ITaskStatus => {
  if (status === "todo" || status === "in_progress" || status === "done") {
    return status;
  }
  return "todo";
};

export const getTaskPriority = (priority: ITask["priority"]): ITaskPriority => {
  if (priority === "low" || priority === "medium" || priority === "high") {
    return priority;
  }
  return "medium";
};

export const asDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));