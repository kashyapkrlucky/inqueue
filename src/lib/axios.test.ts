import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosInstance from "./axios";
import useAuthStore from "../features/auth/store/useAuthStore";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../shared/utils";
import type { IUser } from "../features/auth/types";

const getRefreshedTokens = useAuthStore.getState().getRefreshedTokens;

const user: IUser = {
  _id: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Test User",
  email: "test@example.com",
  username: "test",
  status: "active",
};

describe("axios refresh handling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, "", "/login");
    localStorage.clear();
    localStorage.setItem(ACCESS_TOKEN_KEY, "expired-access-token");
    localStorage.setItem(REFRESH_TOKEN_KEY, "invalid-refresh-token");
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    useAuthStore.setState({
      user,
      access_token: "expired-access-token",
      refresh_token: "invalid-refresh-token",
      isAuthenticated: true,
      loading: false,
      isGuestLoading: false,
      error: null,
      getRefreshedTokens,
    });
  });

  it("logs out when refreshing tokens fails after a 401", async () => {
    useAuthStore.setState({
      getRefreshedTokens: vi.fn().mockRejectedValue(new Error("Invalid refresh token")),
    });

    await expect(
      axiosInstance.get("/v1/modules/tasks", {
        adapter: async (config) => {
          throw {
            config,
            response: {
              status: 401,
            },
          };
        },
      }),
    ).rejects.toThrow("Invalid refresh token");

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
