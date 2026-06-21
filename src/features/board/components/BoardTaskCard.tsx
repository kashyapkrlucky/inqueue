import type { ITask } from "../../tasks/types";
import { MoreMenu } from "../../../shared/components/ui/MoreMenu";
import EditTask from "../../tasks/components/EditTask";
import DeleteTask from "../../tasks/components/DeleteTask";
import { useState } from "react";
import TaskPriority from "@/features/tasks/components/TaskPriority";
import TaskLabel from "@/features/tasks/components/TaskLabel";
import TaskDueDate from "@/features/tasks/components/TaskDueDate";

interface BoardTaskCardProps {
  task: ITask;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const BoardTaskCard = ({
  task,
  onDragStart,
  onDragEnd,
}: BoardTaskCardProps) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

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
      className="relative group w-full flex flex-row gap-1 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 p-2 select-none border-2 border-white hover:border-indigo-200 cursor-move"
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

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 text-xs text-gray-500">
          <TaskPriority task={task} />

          <TaskDueDate task={task} />

          <div className={`absolute bottom-2 right-0`}>
            <TaskLabel task={task} />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <MoreMenu
          moreMenuOpen={moreMenuOpen}
          setMoreMenuOpen={setMoreMenuOpen}
          menuItems={[
            {
              value: <EditTask task={task} setMoreMenuOpen={setMoreMenuOpen} />,
            },
            {
              value: (
                <DeleteTask
                  buttonType="text"
                  taskId={task._id}
                  setMoreMenuOpen={setMoreMenuOpen}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
