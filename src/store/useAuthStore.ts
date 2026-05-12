import { create } from "zustand";
import axios from "../lib/axios";
import { getStoredToken, setStoredToken, TOKEN_KEY } from "../utils/helpers";
import type { IUser } from "../types/index.types";

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

  getUserData: (code: string) => Promise<{ user: IUser; token: string } | null>;
  onGuestLogin: () => Promise<{ user: IUser; token: string } | null>;
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

  getUserData: async (code: string) => {
    try {
      const {
        data: { data },
      } = await axios.post("/v1/public/session", {
        code,
      });
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, token };
    } catch {
      return null;
    }
  },

  onGuestLogin: async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const {
        data: { data },
      } = await axios.post("/v1/public/guest", { clientUrl: baseUrl });
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, token };
    } catch {
      return null;
    }
  },
}));

export default useAuthStore;
