import { CheckCircle2Icon, CircleIcon, ClockIcon } from "lucide-react";
import type { ITask, ITaskPriority, ITaskStatus } from "../types";


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
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
  },
  done: {
    label: "Done",
    icon: CheckCircle2Icon,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
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
    color: "bg-gray-300",
  },
  medium: {
    label: "Medium",
    color: "bg-orange-300",
  },
  high: {
    label: "High",
    color: "bg-red-300",
  },
} as const satisfies Record<ITaskPriority, { label: string; color: string }>;




// import { TaskStatus, TaskPriority } from '../types';
// import type { Task, TaskFilterFn, TaskSortFn, TaskStatusType, TaskPriorityType } from '../types';

// // Generic utility functions
// export const createId = (): string => Math.random().toString(36).substring(2, 9);

// // Type guards
// export const isValidTaskStatus = (status: string): status is TaskStatusType => {
//   return Object.values(TaskStatus).includes(status as TaskStatusType);
// };

// export const isValidTaskPriority = (priority: string): priority is TaskPriorityType => {
//   return Object.values(TaskPriority).includes(priority as TaskPriorityType);
// };

// // Higher-order functions with generics
// export const createTaskFilter = <K extends keyof Task>(
//   key: K,
//   value: Task[K]
// ): TaskFilterFn => {
//   return (task: Task): boolean => task[key] === value;
// };

// export const createTaskSorter = <K extends keyof Task>(
//   key: K,
//   direction: 'asc' | 'desc' = 'asc'
// ): TaskSortFn => {
//   return (a: Task, b: Task): number => {
//     const aVal = a[key];
//     const bVal = b[key];
    
//     // Handle undefined values
//     if (aVal === undefined && bVal === undefined) return 0;
//     if (aVal === undefined) return direction === 'asc' ? 1 : -1;
//     if (bVal === undefined) return direction === 'asc' ? -1 : 1;
    
//     if (aVal < bVal) return direction === 'asc' ? -1 : 1;
//     if (aVal > bVal) return direction === 'asc' ? 1 : -1;
//     return 0;
//   };
// };

// // Utility functions with mapped types
// export const getTaskSummary = (task: Task): string => {
//   const { title, status, priority, assignedTo } = task;
//   const assignee = assignedTo ? assignedTo.name : 'Unassigned';
//   return `${title} (${status}) - ${priority} - ${assignee}`;
// };

// // Function overloading
// export function formatDate(date: Date): string;
// export function formatDate(date: string): string;
// export function formatDate(date: Date | string): string {
//   const d = typeof date === 'string' ? new Date(date) : date;
//   return d.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// }

// // Conditional logic with utility types
// export const canTransitionStatus = (
//   from: TaskStatusType,
//   to: TaskStatusType
// ): boolean => {
//   const transitions: Record<TaskStatusType, TaskStatusType[]> = {
//     [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS],
//     [TaskStatus.IN_PROGRESS]: [TaskStatus.IN_REVIEW, TaskStatus.DONE, TaskStatus.BLOCKED],
//     [TaskStatus.IN_REVIEW]: [TaskStatus.DONE, TaskStatus.IN_PROGRESS],
//     [TaskStatus.DONE]: [TaskStatus.TODO],
//     [TaskStatus.BLOCKED]: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
//   };
  
//   return transitions[from]?.includes(to) ?? false;
// };

// // Array manipulation with type safety
// export const groupTasksByStatus = (tasks: Task[]): Record<TaskStatusType, Task[]> => {
//   return tasks.reduce((acc, task) => {
//     const status = task.status;
//     if (!acc[status]) {
//       acc[status] = [];
//     }
//     acc[status].push(task);
//     return acc;
//   }, {} as Record<TaskStatusType, Task[]>);
// };

// // Search functionality with generics
// export const searchTasks = (
//   tasks: Task[],
//   query: string,
//   fields: (keyof Task)[]
// ): Task[] => {
//   const lowercaseQuery = query.toLowerCase();
//   return tasks.filter(task =>
//     fields.some(field => {
//       const value = task[field];
//       return typeof value === 'string' && 
//              value.toLowerCase().includes(lowercaseQuery);
//     })
//   );
// };

// // Type-safe event emitter
// export type TaskEventCallback<T = unknown> = (data: T) => void;

// export class TaskEventEmitter {
//   private listeners: Map<string, TaskEventCallback[]> = new Map();

//   on<T = unknown>(event: string, callback: TaskEventCallback<T>): void {
//     if (!this.listeners.has(event)) {
//       this.listeners.set(event, []);
//     }
//     this.listeners.get(event)!.push(callback as TaskEventCallback);
//   }

//   emit<T = unknown>(event: string, data: T): void {
//     const callbacks = this.listeners.get(event) || [];
//     callbacks.forEach(callback => callback(data));
//   }

//   off(event: string, callback: TaskEventCallback): void {
//     const callbacks = this.listeners.get(event) || [];
//     const index = callbacks.indexOf(callback);
//     if (index > -1) {
//       callbacks.splice(index, 1);
//     }
//   }
// }
