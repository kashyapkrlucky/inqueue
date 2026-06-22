import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

type RenderWithProvidersOptions = RenderOptions & {
  route?: string;
};

const createWrapper =
  (route = "/") =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  );

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/", ...options }: RenderWithProvidersOptions = {},
) => render(ui, { wrapper: createWrapper(route), ...options });
