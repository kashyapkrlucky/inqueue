import { create } from "zustand";
import { authAxios } from "../../../lib/axios";
import { getStoredToken, setStoredToken, USER_KEY } from "../../../shared/utils";
import type { IUser } from "../types";

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  isGuestLoading: boolean;
  error: string | null;
  logout: () => void;
  clearError: () => void;
  initialize: () => Promise<void>;

  getUserData: (code: string) => Promise<{ user: IUser } | null>;
  onGuestLogin: () => Promise<{ user: IUser } | null>;
  getLoggedInUser: () => IUser | null;
  getRefreshedTokens: () => Promise<void>;
}

const persistUser = (user: IUser) => {
  setStoredToken(USER_KEY, JSON.stringify(user));
};

const readStoredUser = (): IUser | null => {
  const raw = getStoredToken(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IUser;
  } catch {
    setStoredToken(USER_KEY, null);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  isAuthenticated: !!readStoredUser(),
  loading: false,
  isGuestLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const user = readStoredUser();
      if (user) {
        set({ isAuthenticated: true, user });
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
      set({ loading: true, error: null });
      const {
        data: { data },
      } = await authAxios.post("/v1/public/session", { code });
      const { user } = data as { user?: IUser };
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      set({ user, isAuthenticated: true });
      persistUser(user);
      return { user };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  onGuestLogin: async () => {
    try {
      set({ isGuestLoading: true, error: null });
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const {
        data: { data },
      } = await authAxios.post("/v1/public/guest", { clientId });
      const { user } = data as { user?: IUser };
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      set({ user, isAuthenticated: true });
      persistUser(user);
      return { user };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Guest login failed",
      });
      return null;
    } finally {
      set({ isGuestLoading: false });
    }
  },

  getLoggedInUser: () => {
    return readStoredUser();
  },

  logout: () => {
    // Best-effort: clears the httpOnly auth cookies server-side. Fire and
    // forget so a network failure never blocks the local sign-out.
    authAxios.post("/v1/public/logout").catch(() => {});

    setStoredToken(USER_KEY, null);
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  getRefreshedTokens: async () => {
    // No body needed: the refresh token lives in an httpOnly cookie that the
    // browser attaches automatically (authAxios sends withCredentials: true).
    await authAxios.post("/v1/public/session/refresh");
    set({ isAuthenticated: true });
  },
}));

export default useAuthStore;
