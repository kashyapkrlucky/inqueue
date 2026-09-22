import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

const mockAuthState = { isAuthenticated: false };

vi.mock("../../../features/auth/store/useAuthStore", () => ({
  default: () => mockAuthState,
}));

const renderAt = (path: string, element: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={element} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/" element={<div>Home page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockAuthState.isAuthenticated = false;
  });

  it("renders an auth-protected route's children when authenticated", () => {
    mockAuthState.isAuthenticated = true;

    renderAt(
      "/board",
      <ProtectedRoute type="auth">
        <div>Board content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Board content")).toBeInTheDocument();
  });

  it("redirects an auth-protected route to /login when not authenticated", () => {
    mockAuthState.isAuthenticated = false;

    renderAt(
      "/board",
      <ProtectedRoute type="auth">
        <div>Board content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Board content")).not.toBeInTheDocument();
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders a guest-only route's children when not authenticated", () => {
    mockAuthState.isAuthenticated = false;

    renderAt(
      "/login",
      <ProtectedRoute type="guest">
        <div>Login form</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Login form")).toBeInTheDocument();
  });

  it("redirects a guest-only route to / when already authenticated", () => {
    mockAuthState.isAuthenticated = true;

    renderAt(
      "/login",
      <ProtectedRoute type="guest">
        <div>Login form</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("redirects to a custom redirectTo target when provided", () => {
    mockAuthState.isAuthenticated = false;

    renderAt(
      "/board",
      <ProtectedRoute type="auth" redirectTo="/">
        <div>Board content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Board content")).not.toBeInTheDocument();
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });
});
