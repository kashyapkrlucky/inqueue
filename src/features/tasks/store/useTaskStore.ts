import { create } from "zustand";
import type { ITask, ITaskPriority, ITaskStatus, CreateTaskInput, UpdateTaskInput } from "../types";
import axios from "../../../lib/axios";

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
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (taskId: string, task: UpdateTaskInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
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
    try {
      set({ loading: true });
      const {
        data: { data, totalPages },
      } = await axios.get(`/v1/modules/tasks?page=${page}&limit=${limit}`);

      set({ tasks: data, totalPages });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  getStats: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/v1/modules/tasks/stats");
      set({ stats: data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  getRecents: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/v1/modules/tasks/recent");
      set({ homeData: data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  addTask: async (task: CreateTaskInput, isTaskByDates = false) => {
    try {
      set({ inlineLoading: true });
      const {
        data: { data },
      } = await axios.post("/v1/modules/tasks", task);
      if (isTaskByDates) {
        set((state) => ({ taskByDates: [data, ...state.taskByDates] }));
      } else {
        set((state) => ({ tasks: [data, ...state.tasks] }));
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ inlineLoading: false });
    }
  },
  updateTask: async (taskId: string, task: UpdateTaskInput, isTaskByDates = false) => {
    try {
      set({ inlineLoading: true });
      const {
        data: { data },
      } = await axios.patch(`/v1/modules/tasks/${taskId}`, task);
      if (isTaskByDates) {
        set((state) => ({
          taskByDates: state.taskByDates.map((t) =>
            t._id == taskId ? { ...t, data } : t,
          ),
        }));
      } else {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t._id == taskId ? { ...t, data } : t,
          ),
        }));
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ inlineLoading: false });
    }
  },
  deleteTask: async (taskId: string, isTaskByDates = false) => {
    try {
      set({ inlineLoading: true });
      await axios.delete("/v1/modules/tasks/" + taskId);
      if (isTaskByDates) {
        set((state) => ({
          taskByDates: state.taskByDates.filter((t) => t._id !== taskId),
        }));
      } else {
        set((state) => ({
          tasks: state.tasks.filter((t) => t._id !== taskId),
        }));
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ inlineLoading: false });
    }
  },
  getTaskCalendar: async (startDate: string, endDate: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/v1/modules/tasks/calendar", {
        startDate,
        endDate,
      });
      set({ taskByDates: data.tasks });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
