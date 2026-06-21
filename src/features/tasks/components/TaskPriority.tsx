import type { ITask } from "../types";
import { getTaskPriority, priorityConfig } from "../utils";

export default function TaskPriority({ task }: { task: ITask }) {
  const priority = getTaskPriority(task.priority);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700"
      title={`Priority: ${priorityConfig[priority].label}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${priorityConfig[priority].color}`}
      />
      {priorityConfig[priority].label}
    </span>
  );
}
