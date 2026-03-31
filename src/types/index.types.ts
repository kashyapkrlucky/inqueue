/**
 * Represents a user in the system
 */
export interface IUser {
  /** Unique identifier for the user */
  _id: string;
  /** User's full name */
  name: string;
  /** User's email address (must be unique) */
  email: string;
  /** User's username (must be unique) */
  userName: string;
  /** Hashed password (not returned in API responses) */
  password?: string;
  /** URL to the user's avatar image */
  avatar?: string;
  /** Cloudinary public ID for the avatar image */
  avatarId?: string;
  /** User account status */
  status: "active" | "inactive";
  /** When the user account was created */
  createdAt?: Date;
  /** When the user account was last updated */
  updatedAt?: Date;
}

/**
 * Represents a folder for organizing notes
 */
export interface IFolder {
  /** Unique identifier for the folder */
  _id: string;
  /** ID of the user who owns the folder */
  user: IUser;
  /** Title of the folder */
  title: string;
  /** When the folder was created */
  createdAt?: Date;
  /** When the folder was last updated */
  updatedAt?: Date;
}

/**
 * Represents a note or page in the system
 */
export interface INote {
  /** Unique identifier for the note */
  _id: string;
  /** ID of the user who owns the note */
  user?: IUser;
  /** Title of the note */
  title: string;
  /** Main content of the note */
  content: string;
  /** Optional reference to the parent folder */
  folder?: IFolder;
  /** When the note was created */
  createdAt?: string;
  /** When the note was last updated */
  updatedAt?: string;
}

export type ITaskStatus = "todo" | "in_progress" | "done";
export type ITaskPriority = "low" | "medium" | "high";

/**
 * Represents a task or to-do item
 */
export interface ITask {
  /** Unique identifier for the task */
  _id: string;
  /** ID of the user who created the task */
  user: string;
  /** The task description */
  content: string;
  /** Status of the task (e.g., completed or not) */
  status?: ITaskStatus;
  /** Priority of the task (e.g., low, medium, high) */
  priority?: ITaskPriority;
  /** Due date for the task */
  dueDate?: Date;
  /** When the task was created */
  createdAt: Date;
  /** When the task was last updated */
  updatedAt?: Date;
}

export type NewTask = {
  content: string;
  status?: ITaskStatus;
  priority?: ITaskPriority;
  dueDate?: Date;
};

export type TaskUpdate = Partial<Omit<ITask, '_id' | 'createdAt'>>; // updatedAt managed by repo



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

// // Enums (using const objects for erasable syntax compatibility)
// export const TaskStatus = {
//   TODO: 'todo',
//   IN_PROGRESS: 'in_progress',
//   IN_REVIEW: 'in_review',
//   DONE: 'done',
//   BLOCKED: 'blocked'
// } as const;

// export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

// export const TaskPriority = {
//   LOW: 'low',
//   MEDIUM: 'medium',
//   HIGH: 'high',
//   URGENT: 'urgent'
// } as const;

// export type TaskPriorityType = typeof TaskPriority[keyof typeof TaskPriority];

// export const UserRole = {
//   DEVELOPER: 'developer',
//   DESIGNER: 'designer',
//   MANAGER: 'manager',
//   QA: 'qa'
// } as const;

// export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// export const Department = {
//   ENGINEERING: 'engineering',
//   DESIGN: 'design',
//   PRODUCT: 'product',
//   MARKETING: 'marketing'
// } as const;

// export type DepartmentType = typeof Department[keyof typeof Department];

// // Advanced TypeScript types
// export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// export type TaskUpdateData = Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignedTo' | 'tags'>>;

// export type UserFormData = Omit<User, 'id'>;

// // Utility types
// export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// // Generic types
// export interface ApiResponse<T> {
//   data: T;
//   success: boolean;
//   message?: string;
//   timestamp: Date;
// }

// export interface PaginatedResponse<T> {
//   items: T[];
//   total: number;
//   page: number;
//   pageSize: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// // Function types
// export type TaskFilterFn = (task: Task) => boolean;
// export type TaskSortFn = (a: Task, b: Task) => number;

// // Complex union types
// export type TaskAction = 
//   | { type: 'CREATE_TASK'; payload: TaskFormData }
//   | { type: 'UPDATE_TASK'; payload: { id: string; updates: TaskUpdateData } }
//   | { type: 'DELETE_TASK'; payload: string }
//   | { type: 'ASSIGN_TASK'; payload: { taskId: string; userId: string } }
//   | { type: 'FILTER_TASKS'; payload: TaskFilterFn }
//   | { type: 'SORT_TASKS'; payload: TaskSortFn };

// // Conditional types
// export type TaskStatusActions<T extends TaskStatusType> = 
//   T extends typeof TaskStatus.TODO ? 'start' | 'delete' :
//   T extends typeof TaskStatus.IN_PROGRESS ? 'complete' | 'block' | 'reassign' :
//   T extends typeof TaskStatus.IN_REVIEW ? 'approve' | 'reject' :
//   T extends typeof TaskStatus.DONE ? 'reopen' | 'archive' :
//   T extends typeof TaskStatus.BLOCKED ? 'unblock' | 'reassign' : never;

// // Mapped types
// export type TaskStatusConfig = {
//   [K in keyof typeof TaskStatus]: {
//     label: string;
//     color: string;
//     nextStatuses: TaskStatusType[];
//   };
// };

// // Branded types for type safety
// export type TaskId = string & { readonly brand: unique symbol };
// export type UserId = string & { readonly brand: unique symbol };

// // Helper functions for branded types
// export const createTaskId = (id: string): TaskId => id as TaskId;
// export const createUserId = (id: string): UserId => id as UserId;

// // Discriminated unions
// export type TaskEvent = 
//   | { type: 'created'; timestamp: Date; user: User }
//   | { type: 'updated'; timestamp: Date; user: User; changes: Partial<Task> }
//   | { type: 'assigned'; timestamp: Date; from?: User; to: User }
//   | { type: 'status_changed'; timestamp: Date; user: User; from: TaskStatusType; to: TaskStatusType };

// // Template literal types
// export type TaskEventMessage = 
//   `Task ${string} was ${'created' | 'updated' | 'assigned' | 'status_changed'} by ${string}`;

// // Recursive types
// export interface TaskComment {
//   id: string;
//   content: string;
//   author: User;
//   createdAt: Date;
//   replies?: TaskComment[];
// }
