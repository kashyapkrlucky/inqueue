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

const createMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getAgentPayload = (responseData: unknown) => {
  if (!responseData || typeof responseData !== "object") {
    return {};
  }

  const response = responseData as Record<string, unknown>;
  const nestedData = response.data;

  if (nestedData && typeof nestedData === "object") {
    return nestedData as Record<string, unknown>;
  }

  return response;
};

const getReplyText = (payload: Record<string, unknown>) => {
  const reply = payload.reply ?? payload.message ?? payload.content;

  if (typeof reply === "string") {
    return reply;
  }

  if (reply === null || typeof reply === "undefined") {
    return "I received a response, but it did not include a reply.";
  }

  return JSON.stringify(reply, null, 2);
};

export const useAgentStore = create<AgentState>((set, get) => ({
  loading: false,
  error: null,
  messages: [],
  sendMessage: async (message) => {
    try {
      set({ loading: true });
      get().addMessage({
        id: createMessageId(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      });

      const chatMessages = get().messages.map((item) => ({
        role: item.isUser ? ("user" as const) : ("assistant" as const),
        content: item.text,
      }));

      const { data } = await axios.post("/agent", {
        messages: chatMessages,
        timezone: getTimezone(),
      });

      const payload = getAgentPayload(data);
      const results = payload.results as AgentResult[] | undefined;

      get().addMessage({
        id: createMessageId(),
        text: getReplyText(payload),
        isUser: false,
        timestamp: new Date(),
        results,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Agent request failed";
      set({ error: message });
      get().addMessage({
        id: createMessageId(),
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
