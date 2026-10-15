import { beforeEach, describe, expect, it, vi } from "vitest";
import { authAxios } from "../../../lib/axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "../../../shared/utils";
import useAuthStore from "./useAuthStore";
import type { IUser } from "../types";

vi.mock("../../../lib/axios", () => ({
  authAxios: {
    post: vi.fn(),
  },
  default: {
    post: vi.fn(),
  },
}));

const guestUser: IUser = {
  _id: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Guest User",
  email: "guest@example.com",
  username: "guest",
  status: "active",
};

const resetAuthStore = () => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    loading: false,
    isGuestLoading: false,
    error: null,
  });
};

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.mocked(authAxios.post).mockReset();
    localStorage.clear();
    resetAuthStore();
  });

  it("persists the user and tokens after a successful guest login", async () => {
    // Tokens are stored because atlas-id's cookies aren't sent cross-site to
    // atlas-apps in production; they go out as a Bearer header instead.
    vi.mocked(authAxios.post).mockResolvedValueOnce({
      data: {
        data: {
          user: guestUser,
          access_token: "access-token",
          refresh_token: "refresh-token",
        },
      },
    });

    const result = await useAuthStore.getState().onGuestLogin();

    expect(authAxios.post).toHaveBeenCalledWith("/v1/public/guest", {
      clientId: expect.any(String),
    });
    expect(result).toEqual({ user: guestUser });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(guestUser));
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("access-token");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh-token");
  });

  it("sends the stored refresh token and stores the rotated pair", async () => {
    localStorage.setItem(REFRESH_TOKEN_KEY, "old-refresh");
    vi.mocked(authAxios.post).mockResolvedValueOnce({
      data: { data: { access_token: "new-access", refresh_token: "new-refresh" } },
    });

    await useAuthStore.getState().getRefreshedTokens();

    expect(authAxios.post).toHaveBeenCalledWith("/v1/public/session/refresh", {
      refresh_token: "old-refresh",
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("new-access");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("new-refresh");
  });

  it("sets an error and stays unauthenticated when guest login fails", async () => {
    vi.mocked(authAxios.post).mockRejectedValueOnce(new Error("Network error"));

    const result = await useAuthStore.getState().onGuestLogin();

    expect(result).toBeNull();
    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: false,
      error: "Network error",
    });
  });

  it("clears the stored user and tokens and notifies the server on logout", () => {
    vi.mocked(authAxios.post).mockResolvedValueOnce({ data: { data: {} } });
    localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    localStorage.setItem(ACCESS_TOKEN_KEY, "access-token");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-token");
    useAuthStore.setState({
      user: guestUser,
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    expect(authAxios.post).toHaveBeenCalledWith("/v1/public/logout", undefined, {
      headers: { Authorization: "Bearer access-token" },
    });
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });
});
