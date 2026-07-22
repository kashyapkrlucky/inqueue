import type { ITask } from "../../tasks/types";
import { MoreMenu } from "../../../shared/components/ui/MoreMenu";
import EditTask from "../../tasks/components/EditTask";
import DeleteTask from "../../tasks/components/DeleteTask";
import { useRef, useState } from "react";
import TaskLabel from "@/features/tasks/components/TaskLabel";
import TaskDueDate from "@/features/tasks/components/TaskDueDate";
import { getTaskPriority, priorityConfig } from "@/features/tasks/utils";

interface BoardTaskCardProps {
  task: ITask;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onPointerDragMove: (clientX: number, clientY: number) => void;
  onPointerDragEnd: (taskId: string, clientX: number, clientY: number) => void;
  isTouchDragging: boolean;
}

export const BoardTaskCard = ({
  task,
  onDragStart,
  onDragEnd,
  onPointerDragMove,
  onPointerDragEnd,
  isTouchDragging,
}: BoardTaskCardProps) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pointerDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
  }>({
    active: false,
    pointerId: null,
  });

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task._id);
    onDragStart(task._id);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const isInteractiveElement = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    Boolean(target.closest("button, a, input, textarea, select"));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" || isInteractiveElement(e.target)) {
      return;
    }

    pointerDragRef.current = {
      active: true,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    onDragStart(task._id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = pointerDragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) {
      return;
    }

    e.preventDefault();
    onPointerDragMove(e.clientX, e.clientY);
  };

  const stopPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = pointerDragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) {
      return;
    }

    pointerDragRef.current = {
      active: false,
      pointerId: null,
    };
    e.currentTarget.releasePointerCapture(e.pointerId);
    onPointerDragEnd(task._id, e.clientX, e.clientY);
  };

  const priority = getTaskPriority(task.priority);

  return (
    <div
      className={`relative group w-full flex flex-row rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 pl-3 pr-2.5 py-2.5 select-none border-2 hover:border-indigo-200 cursor-move touch-none ${
        isTouchDragging
          ? "scale-[1.02] border-indigo-300 opacity-80 shadow-lg"
          : "border-white"
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopPointerDrag}
      onPointerCancel={stopPointerDrag}
    >
      <span
        className={`absolute inset-y-1.5 left-1 w-1 rounded-full ${priorityConfig[priority].color}`}
        aria-hidden="true"
      />

      <div className="flex-1 flex flex-col gap-2 min-w-0 pl-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 min-w-0">
            {task.content || "Untitled task"}
          </p>

          <div className="flex-shrink-0 -mt-1 -mr-1 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <MoreMenu
              moreMenuOpen={moreMenuOpen}
              setMoreMenuOpen={setMoreMenuOpen}
              menuItems={[
                {
                  value: <EditTask task={task} setMoreMenuOpen={setMoreMenuOpen} isTaskByDates={true} />,
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

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-gray-500">
          {/* <TaskPriority task={task} /> */}
          <TaskDueDate task={task} />
          <TaskLabel task={task} />
        </div>
      </div>
    </div>
  );
};
