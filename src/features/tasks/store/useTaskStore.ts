import { create } from "zustand";
import type { ITask, ITaskPriority, ITaskStatus, CreateTaskInput } from "../types";
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
  tasks: ITask[];
  error: string | null;
  setTasks: (task: ITask) => void;
  getTasks: () => Promise<void>;
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (taskId: string, task: Partial<ITask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  stats: TaskStats;
  getStats: () => Promise<void>;
  homeData: { recent: ITask[]; upcoming: ITask[] };
  getRecents: () => Promise<void>;
  getTaskCalendar: (startDate: string, endDate: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  loading: false,
  tasks: [],
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
  getTasks: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/v1/modules/tasks");
      set({ tasks: data });
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
  addTask: async (task: Partial<ITask>) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/v1/modules/tasks", task);
      set((state) => ({ tasks: [data, ...state.tasks] }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  updateTask: async (taskId: string, task: Partial<ITask>) => {
    try {
      console.log("Updating task:", taskId, task);
      set({ loading: true });
      await axios.patch<Partial<ITask>>(`/v1/modules/tasks/${taskId}`, task);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === taskId ? { ...t, ...task } : t,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  deleteTask: async (taskId: string) => {
    try {
      set({ loading: true });
      await axios.delete("/v1/modules/tasks/" + taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== taskId),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
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
      set({ tasks: data.tasks });
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
