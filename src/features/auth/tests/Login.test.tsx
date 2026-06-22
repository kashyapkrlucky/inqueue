import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Login from "../pages/Login";
import {
  TEXT_ATLAS_ID_DESCRIPTION,
  TEXT_CONTINUE_AS_GUEST,
  TEXT_DESCRIPTION,
  TEXT_SIGN_IN_WITH_ATLAS_ID,
  TEXT_WELCOME_BACK,
} from "../constants";

const authState = vi.hoisted(() => ({
  onGuestLogin: vi.fn(),
  isAuthenticated: false,
  loading: false,
  isGuestLoading: false,
}));

const navigate = vi.hoisted(() => vi.fn());

vi.mock("../store/useAuthStore", () => ({
  default: () => authState,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("Login", () => {
  beforeEach(() => {
    authState.onGuestLogin.mockReset();
    authState.isAuthenticated = false;
    authState.loading = false;
    authState.isGuestLoading = false;
    navigate.mockReset();
  });

  it("renders the login choices", () => {
    renderWithProviders(<Login />, { route: "/login" });

    expect(screen.getByRole("heading", { name: TEXT_WELCOME_BACK })).toBeInTheDocument();
    expect(screen.getByText(TEXT_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXT_SIGN_IN_WITH_ATLAS_ID })).toBeInTheDocument();
    expect(screen.getByText(TEXT_ATLAS_ID_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXT_CONTINUE_AS_GUEST })).toBeInTheDocument();
  });

  it("redirects an already authenticated user away from login", async () => {
    authState.isAuthenticated = true;

    renderWithProviders(<Login />, { route: "/login" });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });

  it("logs in as a guest and navigates home when the store returns tokens", async () => {
    authState.onGuestLogin.mockResolvedValue({
      user: {
        _id: "user-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        name: "Guest User",
        email: "guest@example.com",
        username: "guest",
        status: "active",
      },
      access_token: "access-token",
      refresh_token: "refresh-token",
    });

    renderWithProviders(<Login />, { route: "/login" });

    fireEvent.click(screen.getByRole("button", { name: TEXT_CONTINUE_AS_GUEST }));

    await waitFor(() => {
      expect(authState.onGuestLogin).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
