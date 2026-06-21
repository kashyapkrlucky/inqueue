import DeleteTask from "@/features/tasks/components/DeleteTask";
import EditTask from "@/features/tasks/components/EditTask";
import { PRIORITY_CONFIG, type ITask } from "@/features/tasks/types";
import { MoreMenu } from "@/shared/components/ui/MoreMenu";
import { formatDate } from "@/shared/utils";
import { ClockIcon } from "lucide-react";
import { useState } from "react";

interface CalendarTaskCardProps {
  task: ITask;
}

export const CalendarTaskCard = ({ task }: CalendarTaskCardProps) => {
  const createdAt = task.createdAt;
  const dueDate = task.dueDate;
  const isDone = task.status === "done";
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const isOverdue =
    (dueDate ? new Date(dueDate) : new Date(createdAt)) < new Date();
  const priorityConfig =
    PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

  return (
    <div className="group w-full flex flex-row gap-1 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4 select-none border-2 border-white hover:border-indigo-200 cursor-move">
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {task.content || "Untitled task"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 text-xs text-gray-500">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm ${priorityConfig?.color}`}
          >
            {priorityConfig?.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${isOverdue && !isDone ? "text-red-600 font-semibold" : ""}`}
          >
            <ClockIcon
              className={`h-3.5 w-3.5 ${isOverdue && !isDone ? "text-red-500" : "text-gray-400"}`}
            />
            <span>
              Due on{" "}
              {dueDate
                ? formatDate(new Date(dueDate))
                : formatDate(new Date(createdAt))}
            </span>
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <MoreMenu
          moreMenuOpen={moreMenuOpen}
          setMoreMenuOpen={setMoreMenuOpen}
          menuItems={[
            {
              value: <EditTask task={task} setMoreMenuOpen={() => {}} />,
            },
            {
              value: <DeleteTask buttonType="text" taskId={task._id} />,
            },
          ]}
        />
      </div>
    </div>
  );
};
