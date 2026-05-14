export const APP_NAME = "InQ";

import { TaskStatus, TaskPriority } from "../types/index.types";

export const TASK_STATUS_CONFIG = {
  [TaskStatus.TODO]: {
    label: "To Do",
    color: "gray",
    nextStatuses: [TaskStatus.IN_PROGRESS],
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "blue",
    nextStatuses: [TaskStatus.IN_REVIEW, TaskStatus.DONE, TaskStatus.BLOCKED],
  },
  [TaskStatus.IN_REVIEW]: {
    label: "In Review",
    color: "yellow",
    nextStatuses: [TaskStatus.DONE, TaskStatus.IN_PROGRESS],
  },
  [TaskStatus.DONE]: {
    label: "Done",
    color: "green",
    nextStatuses: [TaskStatus.TODO],
  },
  [TaskStatus.BLOCKED]: {
    label: "Blocked",
    color: "red",
    nextStatuses: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
  },
};

export const PRIORITY_CONFIG = {
  [TaskPriority.LOW]: { label: "Low", color: "gray", value: 1 },
  [TaskPriority.MEDIUM]: { label: "Medium", color: "yellow", value: 2 },
  [TaskPriority.HIGH]: { label: "High", color: "orange", value: 3 },
  [TaskPriority.URGENT]: { label: "Urgent", color: "red", value: 4 },
};
