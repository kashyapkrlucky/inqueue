import { describe, expect, it } from "vitest";
import { getTaskPriority, getTaskStatus, priorityConfig, statusConfig } from ".";

describe("task utils", () => {
  it("normalizes unknown task status values to todo", () => {
    expect(getTaskStatus("done")).toBe("done");
    expect(getTaskStatus("blocked" as "todo")).toBe("todo");
    expect(statusConfig.todo.label).toBe("To Do");
  });

  it("normalizes unknown task priority values to medium", () => {
    expect(getTaskPriority("high")).toBe("high");
    expect(getTaskPriority("urgent" as "medium")).toBe("medium");
    expect(priorityConfig.medium.label).toBe("Medium");
  });
});
