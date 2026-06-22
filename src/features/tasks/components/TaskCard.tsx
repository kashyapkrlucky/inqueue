import type { ITask } from "../types";
import { getTaskStatus } from "../utils";
import EditTask from "./EditTask";
import TaskLabel from "./TaskLabel";
import TaskDueDate from "./TaskDueDate";
import TaskStatusButton from "./TaskStatusButton";
import TaskPriority from "./TaskPriority";
import DeleteTask from "./DeleteTask";

export const TaskCard = ({ task }: { task: ITask }) => {
  const status = getTaskStatus(task.status);
  return (
    <div className="group rounded-xl bg-white flex flex-row items-center justify-between shadow-xs hover:shadow-sm transition-shadow p-2">
      <div className="flex items-center gap-3">
        <TaskStatusButton task={task} />
        <p
          className={`truncate text-sm font-semibold ${status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}
        >
          {task.content?.trim()}
        </p>
        {task.label && <TaskLabel task={task} />}
      </div>
      <div className="flex items-center gap-2">
        <TaskDueDate task={task} />

        <TaskPriority task={task} />

        <EditTask task={task} setMoreMenuOpen={() => {}} iconOnly={true} />

        <DeleteTask taskId={task._id} iconOnly={true} />
      </div>
    </div>
  );
};
