import { create } from "zustand";
import type { Settings, SettingsUpdateInput } from "../types";
import axios from "@/lib/axios";
import { runAsyncAction } from "@/shared/utils/asyncAction";

interface ISettingsStore {
  settingsLoading: boolean;
  error: string | null;
  settings: Settings;
  getSettings: () => void;
  updateSettings: (payload: SettingsUpdateInput) => void;
}

export const useSettingsStore = create<ISettingsStore>((set) => ({
  settingsLoading: false,
  error: null,
  settings: {} as Settings,
  getSettings: async () => {
    await runAsyncAction(
      { set, loadingKey: "settingsLoading", errorKey: "error", errorMessage: "Failed to fetch settings" },
      async () => {
        const {
          data: { data },
        } = await axios.get("/settings");
        console.log("data", data);
        set({ settings: data });
      },
    );
  },
  updateSettings: async (payload: SettingsUpdateInput) => {
    await runAsyncAction(
      { set, loadingKey: "settingsLoading", errorKey: "error", errorMessage: "Failed to update settings" },
      async () => {
        const {
          data: { data },
        } = await axios.post("/settings", payload);
        set({ settings: { ...data, ...payload } as Settings });
      },
    );
  },
}));
