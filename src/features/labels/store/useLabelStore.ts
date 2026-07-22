import { create } from "zustand";

import type {
  ITaskLabel,
  ITaskLabelCreateInput,
  ITaskLabelUpdateInput,
} from "../types";
import axios from "../../../lib/axios";
import { runAsyncAction } from "@/shared/utils/asyncAction";
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
    await runAsyncAction(
      { set, loadingKey: "labelLoading", errorKey: "error", errorMessage: "Failed to fetch labels" },
      async () => {
        const {
          data: { data },
        } = await axios.get("/tasks/labels");
        set({ labels: data });
      },
    );
  },
  createLabel: async (payload: ITaskLabelCreateInput) => {
    await runAsyncAction(
      { set, loadingKey: "labelLoading", errorKey: "error", errorMessage: "Failed to create label" },
      async () => {
        const {
          data: { data },
        } = await axios.post("/tasks/labels", payload);
        set((state) => ({ labels: [data, ...state.labels] }));
      },
    );
  },
  updateLabel: async (id: string, payload: ITaskLabelUpdateInput) => {
    await runAsyncAction(
      { set, loadingKey: "labelLoading", errorKey: "error", errorMessage: "Failed to update label" },
      async () => {
        await axios.patch(`/tasks/labels/${id}`, payload);
        set((state) => {
          const updatedLabels = state.labels.map((label) =>
            label._id === id ? { id, ...label, ...payload } : label,
          );
          return { labels: updatedLabels };
        });
      },
    );
  },
  deleteLabel: async (id: string) => {
    await runAsyncAction(
      { set, loadingKey: "labelLoading", errorKey: "error", errorMessage: "Failed to delete label" },
      async () => {
        await axios.delete(`/tasks/labels/${id}`);
        set((state) => ({
          labels: state.labels.filter((label) => label._id !== id),
        }));
      },
    );
  },
}));
