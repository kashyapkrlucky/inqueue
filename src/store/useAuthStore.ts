import { create } from "zustand";
import axios from "../lib/axios";
import { getStoredToken, setStoredToken, TOKEN_KEY } from "../utils/helpers";
import type { IUser } from "../interfaces/index.types";

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredToken("user") ? JSON.parse(getStoredToken("user")!) : null,
  token: getStoredToken(TOKEN_KEY),
  isAuthenticated: !!getStoredToken(TOKEN_KEY),
  loading: false,
  error: null,
  people: [],
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { data },
      } = await axios.post("/users/signin", {
        email,
        password,
      });
      setStoredToken(data.token, TOKEN_KEY);
      setStoredToken(data.user, "user");
      set({
        loading: false,
        token: data.token,
        isAuthenticated: true,
        user: data.user,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? "Invalid email or password"
            : "An unknown error occurred",
      });
      throw error; // Re-throw to allow error handling in components
    }
  },

  logout: () => {
    setStoredToken(null, TOKEN_KEY);
    setStoredToken(null, "user");
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  signup: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { data },
      } = await axios.post("/users", {
        name,
        email,
        password,
      });
      setStoredToken(data.token, TOKEN_KEY);
      setStoredToken(data.user, "user");
      set({
        loading: false,
        token: data.token,
        isAuthenticated: true,
        user: data.user,
      });
    } catch (error) {
      console.error("Signup error:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const token = getStoredToken(TOKEN_KEY);
      const user = getStoredToken("user");
      if (token && user) {
        // Optionally validate token with backend here
        set({ token, isAuthenticated: true, user: JSON.parse(user) });
      }
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Initialization failed",
      });
    }
  },
}));

export default useAuthStore;
