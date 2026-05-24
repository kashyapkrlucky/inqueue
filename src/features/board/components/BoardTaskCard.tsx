import {
  // CalendarIcon,
  ClockIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import type { ITask, UpdateTaskInput } from "../../tasks/types";
import { formatDate } from "../../../shared/utils";
import { MoreMenu } from "../../../shared/components/ui/MoreMenu";
import { PRIORITY_CONFIG } from "../../tasks/types";
import Modal from "../../../shared/components/ui/Modal";
import CreateTask from "../../tasks/components/CreateTask";
import { useState } from "react";

interface BoardTaskCardProps {
  task: ITask;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, task: UpdateTaskInput) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const BoardTaskCard = ({
  task,
  onDeleteTask,
  onUpdateTask,
  onDragStart,
  onDragEnd,
}: BoardTaskCardProps) => {
  const createdAt = task.createdAt;
  const dueDate = task.dueDate;
  const isDone = task.status === "done";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const isOverdue =
    (dueDate ? new Date(dueDate) : new Date(createdAt)) < new Date();
  const priorityConfig =
    PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task._id);
    onDragStart(task._id);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div
      className="group w-full flex flex-row gap-1 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4 select-none border-2 border-white hover:border-indigo-200 cursor-move"
      key={task._id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {task.content || "Untitled task"}
          </p>
        </div>

        <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm ${priorityConfig?.color}`}
          >
            {priorityConfig?.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${(isOverdue && !isDone) ? "text-red-600 font-semibold" : ""}`}
          >
            <ClockIcon
              className={`h-3.5 w-3.5 ${(isOverdue && !isDone) ? "text-red-500" : "text-gray-400"}`}
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
          menuItems={[
            {
              label: "Edit",
              icon: <SquarePenIcon className="h-4 w-4 text-gray-500" />,
              onClick: () => {
                setIsEditOpen(true);
              },
            },
            {
              label: "Delete",
              icon: <Trash2Icon className="h-4 w-4 text-red-500" />,
              onClick: () => {
                onDeleteTask(task._id);
              },
            },
          ]}
        />
      </div>

      <Modal
        title="Edit Task"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <CreateTask task={task} onAddTask={() => {}} onUpdateTask={onUpdateTask} onClose={() => setIsEditOpen(false)} />
      </Modal>
    </div>
  );
};
