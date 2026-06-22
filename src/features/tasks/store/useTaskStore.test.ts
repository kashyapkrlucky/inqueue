import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "../../../lib/axios";
import { useTaskStore } from "./useTaskStore";
import type { ITask } from "../types";
import type { IUser } from "../../auth/types";

vi.mock("../../../lib/axios", () => ({
  default: {
    patch: vi.fn(),
  },
}));

const user: IUser = {
  _id: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  name: "Task User",
  email: "task@example.com",
  username: "task-user",
  status: "active",
};

const task: ITask = {
  _id: "task-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user,
  content: "Original task",
  status: "todo",
  priority: "medium",
  dueDate: new Date("2026-01-10T00:00:00.000Z"),
};

const resetTaskStore = () => {
  useTaskStore.setState({
    loading: false,
    inlineLoading: false,
    tasks: [],
    taskByDates: [],
    totalPages: 1,
    error: null,
    stats: {
      total: 0,
      todo: 0,
      in_progress: 0,
      done: 0,
      low: 0,
      medium: 0,
      high: 0,
      weeklyStats: [],
    },
    homeData: {
      recent: [],
      upcoming: [],
    },
  });
};

describe("useTaskStore updateTask", () => {
  beforeEach(() => {
    vi.mocked(axios.patch).mockReset();
    resetTaskStore();
  });

  it("merges updated task values into the tasks list", async () => {
    useTaskStore.setState({ tasks: [task] });
    const updatedTask = {
      ...task,
      content: "Updated task",
      status: "done",
      priority: "high",
    } satisfies ITask;
    vi.mocked(axios.patch).mockResolvedValueOnce({
      data: { data: updatedTask },
    });

    await useTaskStore
      .getState()
      .updateTask(task._id, { content: "Updated task", status: "done" });

    expect(useTaskStore.getState().tasks[0]).toMatchObject({
      _id: task._id,
      content: "Updated task",
      status: "done",
      priority: "high",
    });
    expect("task" in useTaskStore.getState().tasks[0]).toBe(false);
  });

  it("merges updated task values into calendar tasks", async () => {
    useTaskStore.setState({ taskByDates: [task] });
    const updatedTask = {
      ...task,
      status: "in_progress",
    } satisfies ITask;
    vi.mocked(axios.patch).mockResolvedValueOnce({
      data: { data: updatedTask },
    });

    await useTaskStore
      .getState()
      .updateTask(task._id, { status: "in_progress" }, true);

    expect(useTaskStore.getState().taskByDates[0]).toMatchObject({
      _id: task._id,
      status: "in_progress",
    });
    expect("task" in useTaskStore.getState().taskByDates[0]).toBe(false);
  });
});
