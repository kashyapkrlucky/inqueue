import { beforeEach, describe, expect, it, vi } from "vitest";
import { authAxios } from "../../../lib/axios";
import { USER_KEY } from "../../../shared/utils";
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

  it("persists the user (not tokens) after a successful guest login", async () => {
    // access_token/refresh_token are still present in the response body for
    // backward compatibility with non-browser clients, but the browser flow
    // relies solely on the httpOnly cookies the auth server sets alongside
    // this response — the store never reads or stores them.
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

  it("clears the stored user and notifies the server on logout", () => {
    vi.mocked(authAxios.post).mockResolvedValueOnce({ data: { data: {} } });
    localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    useAuthStore.setState({
      user: guestUser,
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    expect(authAxios.post).toHaveBeenCalledWith("/v1/public/logout");
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
