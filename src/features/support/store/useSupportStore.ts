import { create } from "zustand";
import type { IFeedback, FeedbackCreationInput, FeedbackUpdateInput } from "../types";
import axios from "@/lib/axios";


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
    try {
      set({ loading: true });
      const {
        data: { data, totalPages },
      } = await axios.get("/feedbacks/support", {
        params: {
          page,
          limit,
        },
      });
      set({ feedbacks: data, totalPages });
    }  catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add feedback",
      });
    } finally {
      set({ loading: false });
    }
  },
  addFeedback: async (feedback: FeedbackCreationInput) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/feedbacks/support", feedback);
      set((state) => ({ feedbacks: [...state.feedbacks, data] }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add feedback",
      });
    } finally {
      set({ loading: false });
    }
  },
  getFeedbackById: async (feedbackId: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.get(`/feedbacks/support/${feedbackId}`);
      set({ feedback: data });
      return data;
    }  catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add feedback",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateFeedback: async (feedbackId: string, feedback: FeedbackUpdateInput) => {
    try {
      await axios.patch(`/feedbacks/support/${feedbackId}`, feedback);
      set((state) => ({
        feedbacks: state.feedbacks.map((f) =>
          f._id === feedbackId ? { ...f, ...feedback } : f,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update feedback",
      });
    }
  },
}));
