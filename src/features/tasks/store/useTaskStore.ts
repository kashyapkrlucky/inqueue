import { create } from "zustand";
import type { ITask, ITaskPriority, ITaskStatus, CreateTaskInput, UpdateTaskInput } from "../types";
import axios from "../../../lib/axios";
import { runAsyncAction } from "@/shared/utils/asyncAction";

export type TaskFilter = {
  query: string;
  status: "all" | ITaskStatus;
  priority: "all" | ITaskPriority;
};

interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  low: number;
  medium: number;
  high: number;
  weeklyStats: { _id: string; done: number }[];
}

interface TaskState {
  loading: boolean;
  inlineLoading: boolean;
  tasks: ITask[];
  taskByDates: ITask[];
  totalPages: number;
  error: string | null;
  setTasks: (task: ITask) => void;
  getTasks: (page: number, limit: number) => Promise<void>;
  addTask: (task: CreateTaskInput, isTaskByDates?: boolean) => Promise<void>;
  updateTask: (
    taskId: string,
    task: UpdateTaskInput,
    isTaskByDates?: boolean,
  ) => Promise<void>;
  deleteTask: (taskId: string, isTaskByDates?: boolean) => Promise<void>;
  stats: TaskStats;
  getStats: () => Promise<void>;
  homeData: { recent: ITask[]; upcoming: ITask[] };
  getRecents: () => Promise<void>;
  getTaskCalendar: (startDate: string, endDate: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  loading: false,
  inlineLoading: false,
  tasks: [],
  taskByDates: [],
  totalPages: 1,
  error: null,
  stats: {
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
    low: 0,
    medium: 0,
    high: 0,
    weeklyStats: [],
  },
  homeData: {
    recent: [],
    upcoming: [],
  },
  setTasks: (task: ITask) => {
    set((state) => {
      return {
        ...state,
        tasks: [...state.tasks, task],
      };
    });
  },
  getTasks: async (page: number = 1, limit: number = 10) => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch tasks" },
      async () => {
        const {
          data: { data, totalPages },
        } = await axios.get(`/tasks?page=${page}&limit=${limit}`);

        set({ tasks: data, totalPages });
      },
    );
  },
  getStats: async () => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch stats" },
      async () => {
        const {
          data: { data },
        } = await axios.get("/tasks/stats");
        set({ stats: data });
      },
    );
  },
  getRecents: async () => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch recent tasks" },
      async () => {
        const {
          data: { data },
        } = await axios.get("/tasks/recent");
        set({ homeData: data });
      },
    );
  },
  addTask: async (task: CreateTaskInput, isTaskByDates = false) => {
    await runAsyncAction(
      { set, loadingKey: "inlineLoading", errorKey: "error", errorMessage: "Failed to add task" },
      async () => {
        const {
          data: { data },
        } = await axios.post("/tasks", task);
        if (isTaskByDates) {
          set((state) => ({ taskByDates: [data, ...state.taskByDates] }));
        } else {
          set((state) => ({ tasks: [data, ...state.tasks] }));
        }
      },
    );
  },
  updateTask: async (taskId: string, task: UpdateTaskInput, isTaskByDates = false) => {
    await runAsyncAction(
      { set, loadingKey: "inlineLoading", errorKey: "error", errorMessage: "Failed to update task" },
      async () => {
        const {
          data: { data },
        } = await axios.patch(`/tasks/${taskId}`, task);
        const updatedTask = data as ITask;

        if (isTaskByDates) {
          set((state) => ({
            taskByDates: state.taskByDates.map((t) =>
              t._id === taskId ? { ...t, ...updatedTask } : t,
            ),
          }));
        } else {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t._id === taskId ? { ...t, ...updatedTask } : t,
            ),
          }));
        }
      },
    );
  },
  deleteTask: async (taskId: string, isTaskByDates = false) => {
    await runAsyncAction(
      { set, loadingKey: "inlineLoading", errorKey: "error", errorMessage: "Failed to delete task" },
      async () => {
        await axios.delete("/tasks/" + taskId);
        if (isTaskByDates) {
          set((state) => ({
            taskByDates: state.taskByDates.filter((t) => t._id !== taskId),
          }));
        } else {
          set((state) => ({
            tasks: state.tasks.filter((t) => t._id !== taskId),
          }));
        }
      },
    );
  },
  getTaskCalendar: async (startDate: string, endDate: string) => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch tasks" },
      async () => {
        const {
          data: { data },
        } = await axios.post("/tasks/calendar", {
          startDate,
          endDate,
        });
        set({ taskByDates: data.tasks });
      },
    );
  },
}));
