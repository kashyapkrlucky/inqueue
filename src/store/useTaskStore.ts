import { create } from "zustand";
import type { ITask, ITaskPriority, ITaskStatus } from "../types/index.types";
import axios from "../lib/axios";
import { TaskRepository } from "../repository/TaskRepository";

export type TaskFilter = {
  query: string;
  status: "all" | ITaskStatus;
  priority: "all" | ITaskPriority;
};
interface TaskState {
  loading: boolean;
  tasks: ITask[];
  error: string | null;
  setTasks: (task: ITask) => void;
  getTasks: () => Promise<void>;
  addTask: (task: ITask) => Promise<void>;
  updateTask: (taskId: string, task: ITask) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  loading: false,
  tasks: [],
  error: null,
  setTasks: (task: ITask) => {
    set((state) => {
      return {
        ...state,
        tasks: [...state.tasks, task],
      };
    });
    TaskRepository.create(task);
  },
  getTasks: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get("/tasks");
      set({ tasks: data.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      const tasks = await TaskRepository.list();
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  addTask: async (task: ITask) => {
    try {
      set({ loading: true });
      const { data } = await axios.post("/tasks", task);
      set({ tasks: data.data });
      TaskRepository.create(task);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  updateTask: async (taskId: string, task: ITask) => {
    try {
      console.log("Updating task:", taskId, task);
      set({ loading: true });
      TaskRepository.update(taskId, task);
      const { data } = await axios.put("/tasks", task);
      set({ tasks: data.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      const tasks = await TaskRepository.list();
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  deleteTask: async (taskId: string) => {
    try {
      set({ loading: true });
      TaskRepository.remove(taskId);
      const { data } = await axios.delete("/tasks/" + taskId);
      set({ tasks: data.data });
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

