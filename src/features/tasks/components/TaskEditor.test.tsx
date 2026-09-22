import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TaskEditor from "./TaskEditor";
import type { ITask } from "../types";
import type { IUser } from "@/features/auth/types";

const addTask = vi.fn();
const updateTask = vi.fn();
const customToast = vi.fn();

vi.mock("../store/useTaskStore", () => ({
  useTaskStore: () => ({ addTask, updateTask }),
}));

vi.mock("../../labels/store/useLabelStore", () => ({
  useLabelStore: () => ({ labels: [] }),
}));

vi.mock("../../../shared/components/ui/CustomToast", () => ({
  default: (...args: unknown[]) => customToast(...args),
}));

const user: IUser = {
  _id: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Test User",
  email: "test@example.com",
  username: "test",
  status: "active",
};

const existingTask: ITask = {
  _id: "task-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user,
  content: "Existing task",
  status: "todo",
  priority: "medium",
  dueDate: new Date("2026-01-10T00:00:00.000Z"),
};

describe("TaskEditor", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    addTask.mockReset();
    updateTask.mockReset();
    customToast.mockReset();
    onClose.mockReset();
  });

  it("blocks submission and shows an error toast when content is empty", () => {
    const { container } = render(<TaskEditor onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2026-02-01" },
    });

    fireEvent.submit(container.querySelector("form")!);

    expect(customToast).toHaveBeenCalledWith("error", "Content is required");
    expect(addTask).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("blocks submission and shows an error toast when due date is empty", () => {
    const { container } = render(<TaskEditor onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Write tests" },
    });

    fireEvent.submit(container.querySelector("form")!);

    expect(customToast).toHaveBeenCalledWith("error", "Due date is required");
    expect(addTask).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("creates a new task with the entered values and closes the editor", () => {
    render(<TaskEditor onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Write tests" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2026-02-01" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(addTask).toHaveBeenCalledWith({
      content: "Write tests",
      status: "todo",
      priority: "high",
      dueDate: new Date("2026-02-01"),
      label: "",
    });
    expect(updateTask).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("updates an existing task and preserves the isTaskByDates flag", () => {
    render(
      <TaskEditor task={existingTask} onClose={onClose} isTaskByDates />,
    );

    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Updated content" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(updateTask).toHaveBeenCalledWith(
      "task-1",
      {
        content: "Updated content",
        status: "todo",
        priority: "medium",
        dueDate: new Date("2026-01-10"),
        label: "",
      },
      true,
    );
    expect(addTask).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("disables the submit button until content and due date are filled", () => {
    render(<TaskEditor onClose={onClose} />);

    const submitButton = screen.getByRole("button", { name: "Create" });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "   " },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Write tests" },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2026-02-01" },
    });
    expect(submitButton).toBeEnabled();
  });
});
