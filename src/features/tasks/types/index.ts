import type { BaseEntity } from "../../../shared/types/index.types";
import type { IUser } from "../../auth/types";


export type ITaskStatus = "todo" | "in_progress" | "done";
export type ITaskPriority = "low" | "medium" | "high";

/**
 * Represents a task or to-do item
 */
export interface ITask extends BaseEntity {
  /** ID of the user who created the task */
  user: IUser;
  /** The task description */
  content: string;
  /** Status of the task (e.g., completed or not) */
  status?: ITaskStatus;
  /** Priority of the task (e.g., low, medium, high) */
  priority?: ITaskPriority;
  /** Due date for the task */
  dueDate: Date;
}

export type NewTask = {
  content: string;
  status?: ITaskStatus;
  priority?: ITaskPriority;
  dueDate?: Date;
};

export type CreateTaskInput = {
  content: string;
  status: ITaskStatus;
  priority: ITaskPriority;
  dueDate: Date;
};

export type TaskUpdate = Partial<Omit<ITask, '_id'>>;



// // Basic types and interfaces
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatusType;
//   priority: TaskPriorityType;
//   assignedTo?: User;
//   createdAt: Date;
//   updatedAt: Date;
//   tags: string[];
//   estimatedHours?: number;
//   actualHours?: number;
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRoleType;
//   avatar?: string;
//   department: DepartmentType;
// }

// Enums (using const objects for erasable syntax compatibility)
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  BLOCKED: 'blocked'
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export type TaskPriorityType = typeof TaskPriority[keyof typeof TaskPriority];

 
// Advanced TypeScript types
export type TaskFormData = Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>;

export type TaskUpdateData = Partial<Pick<ITask, 'content' | 'status' | 'priority'>>;

// Function types
export type TaskFilterFn = (task: ITask) => boolean;
export type TaskSortFn = (a: ITask, b: ITask) => number;

// Complex union types
export type TaskAction = 
  | { type: 'CREATE_TASK'; payload: TaskFormData }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: TaskUpdateData } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ASSIGN_TASK'; payload: { taskId: string; userId: string } }
  | { type: 'FILTER_TASKS'; payload: TaskFilterFn }
  | { type: 'SORT_TASKS'; payload: TaskSortFn };

// Conditional types
export type TaskStatusActions<T extends TaskStatusType> = 
  T extends typeof TaskStatus.TODO ? 'start' | 'delete' :
  T extends typeof TaskStatus.IN_PROGRESS ? 'complete' | 'block' | 'reassign' :
  T extends typeof TaskStatus.IN_REVIEW ? 'approve' | 'reject' :
  T extends typeof TaskStatus.DONE ? 'reopen' | 'archive' :
  T extends typeof TaskStatus.BLOCKED ? 'unblock' | 'reassign' : never;

// Mapped types
export type TaskStatusConfig = {
  [K in keyof typeof TaskStatus]: {
    label: string;
    color: string;
    nextStatuses: TaskStatusType[];
  };
};


export type TaskId = string & { readonly brand: unique symbol };



// Helper functions for branded types
export const createTaskId = (id: string): TaskId => id as TaskId;


// Discriminated unions
export type TaskEvent = 
  | { type: 'created'; timestamp: Date; user: IUser }
  | { type: 'updated'; timestamp: Date; user: IUser; changes: Partial<ITask> }
  | { type: 'assigned'; timestamp: Date; from?: IUser; to: IUser }
  | { type: 'status_changed'; timestamp: Date; user: IUser; from: TaskStatusType; to: TaskStatusType };

// Template literal types
export type TaskEventMessage = 
  `Task ${string} was ${'created' | 'updated' | 'assigned' | 'status_changed'} by ${string}`;

// Recursive types
export interface TaskComment {
  id: string;
  content: string;
  author: IUser;
  createdAt: Date;
  replies?: TaskComment[];
}


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
  [TaskPriority.LOW]: { label: "Low", color: "bg-gray-500", value: 1 },
  [TaskPriority.MEDIUM]: { label: "Medium", color: "bg-yellow-500", value: 2 },
  [TaskPriority.HIGH]: { label: "High", color: "bg-orange-500", value: 3 },
  [TaskPriority.URGENT]: { label: "Urgent", color: "bg-red-500", value: 4 },
};
