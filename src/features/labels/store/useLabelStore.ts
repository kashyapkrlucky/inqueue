import { create } from "zustand";
import type {
  ITaskLabel,
  ITaskLabelCreateInput,
  ITaskLabelUpdateInput,
} from "../types";
import axios from "../../../lib/axios";
interface ILabelStore {
  labelLoading: boolean;
  error: string | null;
  labels: ITaskLabel[];
  currentLabel: ITaskLabel | null;
  getLabels: () => void;
  createLabel: (payload: ITaskLabelCreateInput) => void;
  updateLabel: (id: string, payload: ITaskLabelUpdateInput) => void;
  deleteLabel: (id: string) => void;
}

export const useLabelStore = create<ILabelStore>((set) => ({
  labelLoading: false,
  error: null,
  labels: [],
  currentLabel: null,
  getLabels: async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/tasks/labels");
      set({ labels: data });
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ labelLoading: false });
    }
  },
  createLabel: async (payload: ITaskLabelCreateInput) => {
    try {
      const {
        data: { data },
      } = await axios.post("/tasks/labels", payload);
      set((state) => ({ labels: [data, ...state.labels] }));
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ labelLoading: false });
    }
  },
  updateLabel: async (id: string, payload: ITaskLabelUpdateInput) => {
    try {
      await axios.patch(`/tasks/labels/${id}`, payload);
      set((state) => {
        const updatedLabels = state.labels.map((label) =>
          label._id === id ? { id, ...label, ...payload } : label,
        );
        return { labels: updatedLabels };
      });
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ labelLoading: false });
    }
  },
  deleteLabel: async (id: string) => {
    try {
      await axios.delete(`/tasks/labels/${id}`);
      set((state) => ({
        labels: state.labels.filter((label) => label._id !== id),
      }));
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ labelLoading: false });
    }
  },
}));
