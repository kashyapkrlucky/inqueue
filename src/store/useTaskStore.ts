import { create } from "zustand";
import type { ITask, ITaskPriority, ITaskStatus } from "../types/index.types";
import axios from "../lib/axios";
// import { TaskRepository } from "../repository/TaskRepository";

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
  addTask: (task: Partial<ITask>) => Promise<void>;
  updateTask: (taskId: string, task: Partial<ITask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  stats: TaskStats;
  getStats: () => Promise<void>;
  homeData: { recent: ITask[]; upcoming: ITask[] };
  getRecents: () => Promise<void>;
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
    // TaskRepository.create(task);
  },
  getTasks: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/v1/public/tasks");
      set({ tasks: data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      // const tasks = await TaskRepository.list();
      // set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  getStats: async () => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get("/v1/public/tasks/stats");
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
      } = await axios.get("/v1/public/tasks/recent");
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
      } = await axios.post("/v1/public/tasks", task);
      set((state) => ({ tasks: [data, ...state.tasks] }));
      // TaskRepository.create(task as ITask);
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
      await axios.patch<Partial<ITask>>(`/v1/public/tasks/${taskId}`, task);
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
      // TaskRepository.remove(taskId);
      await axios.delete("/v1/public/tasks/" + taskId);
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
}));
