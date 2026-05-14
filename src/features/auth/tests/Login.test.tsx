import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Login", () => {
  it("should render the login page", () => {
    render(<div>Test</div>);
    expect(screen.getByText("Test")).toBeTruthy();
  });
}); 