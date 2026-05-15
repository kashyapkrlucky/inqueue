import { create } from "zustand";
import type { ITask } from "../../tasks/types";
import axios from "../../../lib/axios";

interface RoadmapState {
  loading: boolean;
  tasks: ITask[];
  error: string | null;
  getTasks: (startDate: string, endDate: string) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  loading: false,
  tasks: [],
  error: null,
  getTasks: async (startDate: string, endDate: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/v1/public/tasks/calendar", {
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
