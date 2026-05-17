import {
  CalendarIcon,
  ClockIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import type { ITask } from "../../tasks/types";
import { formatDate } from "../../../shared/utils";
import { MoreMenu } from "../../../shared/components/ui/MoreMenu";
import { PRIORITY_CONFIG } from "../../tasks/types";

interface BoardTaskCardProps {
  task: ITask;
}

export const BoardTaskCard = ({ task }: BoardTaskCardProps) => {
  const createdAt = task.createdAt;
  const dueDate = task.dueDate;
  const isOverdue =
    (dueDate ? new Date(dueDate) : new Date(createdAt)) < new Date();
  const priorityConfig = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

  return (
    <div
      className="group w-full flex flex-row gap-3 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-200 p-4 select-none border border-gray-100 hover:border-gray-200"
      key={task._id}
    >
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex flex-col items-start gap-2">
          <p className="truncate text-sm font-semibold text-gray-900 leading-tight">
            {task.content || "Untitled task"}
          </p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-white ${priorityConfig?.color}`}
          >
            {priorityConfig?.label}
          </span>
        </div>

        <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
            <span>{formatDate(new Date(createdAt))}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 ${isOverdue ? "text-red-600 font-medium" : ""}`}
          >
            <ClockIcon className={`h-3.5 w-3.5 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
            <span>
              Due{" "}
              {dueDate
                ? formatDate(new Date(dueDate))
                : formatDate(new Date(createdAt))}
            </span>
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <MoreMenu
          menuItems={[
            {
              label: "Edit",
              icon: <SquarePenIcon className="h-4 w-4 text-gray-500" />,
              onClick: () => {
                console.log("Edit");
              },
            },
            {
              label: "Delete",
              icon: <Trash2Icon className="h-4 w-4 text-red-500" />,
              onClick: () => {
                console.log("Delete");
              },
            },
          ]}
        />
      </div>
    </div>
  );
};
