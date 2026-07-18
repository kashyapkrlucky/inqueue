import { create } from "zustand";
import axios from "../../../lib/axios";

export interface AgentResult {
  action: string;
  status: "executed" | "skipped" | "failed";
  message: string;
  data?: unknown;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  results?: AgentResult[];
}

interface AgentState {
  loading: boolean;
  error: string | null;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: Message) => void;
}

const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const useAgentStore = create<AgentState>((set, get) => ({
  loading: false,
  error: null,
  messages: [],
  sendMessage: async (message) => {
    try {
      set({ loading: true });
      get().addMessage({
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      });

      const chatMessages = get().messages.map((item) => ({
        role: item.isUser ? ("user" as const) : ("assistant" as const),
        content: item.text,
      }));

      const {
        data: { data },
      } = await axios.post("/agent", {
        messages: chatMessages,
        timezone: getTimezone(),
      });

      const results = data.results as AgentResult[] | undefined;

      get().addMessage({
        id: Date.now().toString(),
        text: data.reply,
        isUser: false,
        timestamp: new Date(),
        results,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Agent request failed";
      set({ error: message });
      get().addMessage({
        id: Date.now().toString(),
        text: message,
        isUser: false,
        timestamp: new Date(),
      });
    } finally {
      set({ loading: false });
    }
  },
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
