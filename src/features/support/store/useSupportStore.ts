import { create } from "zustand";
import type { IFeedback, FeedbackCreationInput, FeedbackUpdateInput } from "../types";
import axios from "@/lib/axios";
import { runAsyncAction } from "@/shared/utils/asyncAction";


interface SupportStore {
  feedbacks: IFeedback[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  feedback: IFeedback | null;
  getFeedbacks: (page?: number, limit?: number) => void;
  getFeedbackById: (feedbackId: string) => Promise<IFeedback | undefined>;
  addFeedback: (feedback: FeedbackCreationInput) => void;
  updateFeedback: (
    feedbackId: string,
    feedback: FeedbackUpdateInput,
  ) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  feedbacks: [],
  totalPages: 0,
  loading: false,
  error: null,
  feedback: null,
  getFeedbacks: async (page = 1, limit = 10) => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch feedbacks", toast: false },
      async () => {
        const {
          data: { data, totalPages },
        } = await axios.get("/feedbacks/support", {
          params: {
            page,
            limit,
          },
        });
        set({ feedbacks: data, totalPages });
      },
    );
  },
  addFeedback: async (feedback: FeedbackCreationInput) => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to add feedback", toast: false },
      async () => {
        const {
          data: { data },
        } = await axios.post("/feedbacks/support", feedback);
        set((state) => ({ feedbacks: [...state.feedbacks, data] }));
      },
    );
  },
  getFeedbackById: async (feedbackId: string) => {
    return runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to fetch feedback", toast: false },
      async () => {
        const {
          data: { data },
        } = await axios.get(`/feedbacks/support/${feedbackId}`);
        set({ feedback: data });
        return data;
      },
    );
  },

  updateFeedback: async (feedbackId: string, feedback: FeedbackUpdateInput) => {
    await runAsyncAction(
      { set, loadingKey: "loading", errorKey: "error", errorMessage: "Failed to update feedback", toast: false },
      async () => {
        await axios.patch(`/feedbacks/support/${feedbackId}`, feedback);
        set((state) => ({
          feedbacks: state.feedbacks.map((f) =>
            f._id === feedbackId ? { ...f, ...feedback } : f,
          ),
        }));
      },
    );
  },
}));
