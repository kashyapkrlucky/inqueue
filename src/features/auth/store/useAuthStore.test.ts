import { beforeEach, describe, expect, it, vi } from "vitest";
import { authAxios } from "../../../lib/axios";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../../../shared/utils";
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
    access_token: null,
    refresh_token: null,
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

  it("persists auth data after a successful guest login", async () => {
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

    expect(authAxios.post).toHaveBeenCalledWith("/v1/modules/guest", {
      clientId: expect.any(String),
    });
    expect(result).toEqual({
      user: guestUser,
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("access-token");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh-token");
    expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(guestUser));
  });

  it("clears stored auth data on logout", () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, "access-token");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-token");
    localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    useAuthStore.setState({
      user: guestUser,
      access_token: "access-token",
      refresh_token: "refresh-token",
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      error: null,
    });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
