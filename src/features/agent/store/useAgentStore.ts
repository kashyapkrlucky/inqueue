import { create } from "zustand";
import axios from "../../../lib/axios";
import type { CreateTaskInput } from "../../tasks/types";

export interface AgentAction {
  type: string;
  data: {
    content: string;
    dueDate: string;
  }[];
  isDone: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  actions?: AgentAction;
}

interface AgentState {
  loading: boolean;
  error: string | null;
  messages: Message[];
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  addMessage: (message: Message) => void;
  addManyTasks: (task: CreateTaskInput[]) => void;
  markDone: (id: string) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  loading: false,
  error: null,

  messages: [
    {
      id: "1",
      text: "Hi! I'm Tia. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ],
  sendMessage: async (message) => {
    try {
      get().addMessage({
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      });
      const {
        data: { data },
      } = await axios.post("/v1/modules/agent", { message });

      const { message: aiMessage, modifications } = data;
      get().addMessage({
        id: Date.now().toString(),
        text: aiMessage,
        isUser: false,
        timestamp: new Date(),
        actions: modifications,
      });
    } catch {
      set({ error: "Failed to send message" });
    }
  },
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  addManyTasks: async (task: CreateTaskInput[]) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await axios.post("/v1/modules/tasks/many", task);
      console.log(data);
      get().addMessage({
        id: Date.now().toString(),
        text: "Tasks added to you board, visit /tasks or /board to view",
        isUser: true,
        timestamp: new Date(),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
  markDone: (id: string) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              actions: { ...message.actions, isDone: true } as AgentAction,
            }
          : message
      ),
    }));
  },
}));
