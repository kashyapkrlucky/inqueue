import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GridView } from "./GridView";
import type { ITask } from "@/features/tasks/types";
import type { IUser } from "@/features/auth/types";

const updateTask = vi.fn();

vi.mock("@/features/tasks/store/useTaskStore", () => ({
  useTaskStore: () => ({
    updateTask,
  }),
}));

vi.mock("@/shared/components/ui/MoreMenu", () => ({
  MoreMenu: () => null,
}));

vi.mock("@/features/tasks/components/TaskPriority", () => ({
  default: () => null,
}));

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

const createDataTransfer = () => {
  const data = new Map<string, string>();

  return {
    dropEffect: "",
    effectAllowed: "",
    getData: vi.fn((key: string) => data.get(key) ?? ""),
    setData: vi.fn((key: string, value: string) => data.set(key, value)),
  };
};

describe("GridView", () => {
  beforeEach(() => {
    updateTask.mockReset();
    // jsdom doesn't implement the Pointer Events capture APIs.
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
  });

  it("updates calendar tasks when a task is dropped into another column", () => {
    render(<GridView tasks={[task]} />);
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(screen.getByText("Move me"), { dataTransfer });
    fireEvent.drop(screen.getByText("Done").closest("[data-board-status]")!, {
      dataTransfer,
    });

    expect(updateTask).toHaveBeenCalledWith("task-1", { status: "done" }, true);
  });

  it("does not call updateTask when a task is dropped back into its own column", () => {
    render(<GridView tasks={[task]} />);
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(screen.getByText("Move me"), { dataTransfer });
    fireEvent.drop(screen.getByText("To Do").closest("[data-board-status]")!, {
      dataTransfer,
    });

    expect(updateTask).not.toHaveBeenCalled();
  });

  it("moves a task via touch/pointer dragging into another column", () => {
    render(<GridView tasks={[task]} />);
    const card = screen.getByText("Move me").closest("[draggable]")! as HTMLElement;
    const doneColumn = screen
      .getByText("Done")
      .closest("[data-board-status]")! as HTMLElement;

    document.elementFromPoint = vi.fn().mockReturnValue(doneColumn);

    fireEvent.pointerDown(card, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(card, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 200,
      clientY: 50,
    });
    fireEvent.pointerUp(card, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 200,
      clientY: 50,
    });

    expect(updateTask).toHaveBeenCalledWith("task-1", { status: "done" }, true);
  });

  it("ignores mouse-type pointer events so native drag-and-drop still owns them", () => {
    render(<GridView tasks={[task]} />);
    const card = screen.getByText("Move me").closest("[draggable]")! as HTMLElement;
    const doneColumn = screen
      .getByText("Done")
      .closest("[data-board-status]")! as HTMLElement;

    document.elementFromPoint = vi.fn().mockReturnValue(doneColumn);

    fireEvent.pointerDown(card, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(card, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 200,
      clientY: 50,
    });
    fireEvent.pointerUp(card, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 200,
      clientY: 50,
    });

    expect(updateTask).not.toHaveBeenCalled();
  });
});
