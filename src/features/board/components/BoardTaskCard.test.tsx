import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BoardTaskCard } from "./BoardTaskCard";
import type { ITask } from "@/features/tasks/types";
import type { IUser } from "@/features/auth/types";

vi.mock("@/features/tasks/components/TaskLabel", () => ({
  default: () => null,
}));

vi.mock("@/features/tasks/components/TaskDueDate", () => ({
  default: () => null,
}));

const user: IUser = {
  _id: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Board User",
  email: "board@example.com",
  username: "board-user",
  status: "active",
};

const task: ITask = {
  _id: "task-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user,
  content: "Move me",
  status: "todo",
  priority: "medium",
  dueDate: new Date("2026-01-10T00:00:00.000Z"),
};

const noop = () => {};

describe("BoardTaskCard", () => {
  const onMoveTo = vi.fn();

  beforeEach(() => {
    onMoveTo.mockReset();
  });

  it("offers a keyboard-operable 'Move to' option for every other status", () => {
    render(
      <BoardTaskCard
        task={task}
        onDragStart={noop}
        onDragEnd={noop}
        onPointerDragMove={noop}
        onPointerDragEnd={noop}
        onMoveTo={onMoveTo}
        isTouchDragging={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "More options" }));

    expect(
      screen.getByRole("button", { name: "Move to In Progress" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Move to Done" }),
    ).toBeInTheDocument();
    // The task is already "todo" — moving it "to" its own column isn't offered.
    expect(
      screen.queryByRole("button", { name: "Move to To Do" }),
    ).not.toBeInTheDocument();
  });

  it("calls onMoveTo and closes the menu when a 'Move to' option is chosen", () => {
    render(
      <BoardTaskCard
        task={task}
        onDragStart={noop}
        onDragEnd={noop}
        onPointerDragMove={noop}
        onPointerDragEnd={noop}
        onMoveTo={onMoveTo}
        isTouchDragging={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "More options" }));
    fireEvent.click(screen.getByRole("button", { name: "Move to Done" }));

    expect(onMoveTo).toHaveBeenCalledWith("task-1", "done");
    expect(
      screen.queryByRole("button", { name: "Move to Done" }),
    ).not.toBeInTheDocument();
  });
});
