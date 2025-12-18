import { create } from "zustand";
import type { ITask } from "../interfaces/index.types";
import axios from "../lib/axios";

interface TaskState {
    loading: boolean;
    tasks: ITask[];
    error: string | null;
    setTasks: (task: ITask) => void;
    getTasks: () => Promise<void>;
    addTask: (task: ITask) => Promise<void>;
    updateTask: (task: ITask) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
    loading: false,
    tasks: [
        { _id: "1", content: "Task 1", status: "todo", priority: "low", createdAt: new Date() },
        { _id: "2", content: "Task 2", status: "inProgress", priority: "medium", createdAt: new Date() },
        { _id: "3", content: "Task 3", status: "done", priority: "high", createdAt: new Date() },
    ],
    error: null,
    setTasks: (task: ITask) => set((state) => {
        return {
            ...state,
            tasks: [...state.tasks, task],
        }
    }),
    getTasks: async () => {
        try {
            set({ loading: true });
            const { data } = await axios.get("/tasks");
            // set({ tasks: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    }, 
    addTask: async (task: ITask) => {
        try {
            set({ loading: true });
            const { data } = await axios.post("/tasks", task);
            set({ tasks: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
    updateTask: async (task: ITask) => {
        try {
            set({ loading: true });
            const { data } = await axios.put("/tasks", task);
            set({ tasks: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
    deleteTask: async(taskId: string) => {
        try {
            set({ loading: true });
            const { data } = await axios.delete("/tasks/" + taskId);
            set({ tasks: data.data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        } finally {
            set({ loading: false });
        }
    },
}))