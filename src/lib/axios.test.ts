import { beforeEach, describe, expect, it, vi } from "vitest";
import axiosInstance, { authAxios } from "./axios";
import useAuthStore from "../features/auth/store/useAuthStore";
import { ACCESS_TOKEN_KEY, USER_KEY } from "../shared/utils";
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
    // logout() fires a best-effort request to revoke the session server-side.
    vi.spyOn(authAxios, "post").mockResolvedValue({ data: { data: {} } });
    window.history.pushState({}, "", "/login");
    localStorage.clear();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    useAuthStore.setState({
      user,
      isAuthenticated: true,
      loading: false,
      isGuestLoading: false,
      error: null,
      getRefreshedTokens,
    });
  });

  it("sends the stored access token as a Bearer header", async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, "access-token");
    let authorization: unknown;

    await axiosInstance.get("/v1/tasks", {
      adapter: async (config) => {
        authorization = config.headers.Authorization;
        return { data: {}, status: 200, statusText: "OK", headers: {}, config };
      },
    });

    expect(authorization).toBe("Bearer access-token");
  });

  it("logs out when refreshing tokens fails after a 401", async () => {
    useAuthStore.setState({
      getRefreshedTokens: vi.fn().mockRejectedValue(new Error("Invalid refresh token")),
    });

    await expect(
      axiosInstance.get("/v1/tasks", {
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
      isAuthenticated: false,
    });
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
