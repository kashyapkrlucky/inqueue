import { create } from "zustand";
import { authAxios } from "../../../lib/axios";
import { env } from "../../../lib/env";
import {
  getAccessToken,
  getRefreshToken,
  getStoredToken,
  setAuthTokens,
  setStoredToken,
  USER_KEY,
  type AuthTokens,
} from "../../../shared/utils";
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
      const { user, ...tokens } = data as { user?: IUser } & AuthTokens;
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      setAuthTokens(tokens);
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
      const clientId = env.VITE_CLIENT_ID;
      const {
        data: { data },
      } = await authAxios.post("/v1/public/guest", { clientId });
      const { user, ...tokens } = data as { user?: IUser } & AuthTokens;
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      setAuthTokens(tokens);
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
    // Best-effort: revokes the session and clears the auth cookies
    // server-side. The token is captured up front because request
    // interceptors run async — after the local tokens below are cleared.
    // Fire and forget so a network failure never blocks the local sign-out.
    const accessToken = getAccessToken();
    authAxios
      .post(
        "/v1/public/logout",
        undefined,
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
      )
      .catch(() => {});

    setAuthTokens(null);
    setStoredToken(USER_KEY, null);
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  getRefreshedTokens: async () => {
    // The refresh token is sent in the body because atlas-id's cookie isn't
    // available cross-site in production; atlas-id still falls back to its
    // cookie when the body is empty (e.g. same-site localhost).
    const refresh_token = getRefreshToken();
    const {
      data: { data },
    } = await authAxios.post(
      "/v1/public/session/refresh",
      refresh_token ? { refresh_token } : {},
    );
    // atlas-id rotates both tokens on every refresh; the old refresh token
    // is now invalid, so the new pair must be stored.
    setAuthTokens(data as AuthTokens);
    set({ isAuthenticated: true });
  },
}));

export default useAuthStore;
