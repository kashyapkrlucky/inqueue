import { BoardColumn } from "./BoardColumn";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { useCallback, useState } from "react";
import type { ITask, ITaskStatus } from "@/features/tasks/types";

interface GridViewProps {
  tasks: ITask[];
}

export const GridView = ({ tasks }: GridViewProps) => {
  const { updateTask } = useTaskStore();
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null,
  );
  const [activeTouchTaskId, setActiveTouchTaskId] = useState<string | null>(
    null,
  );

  const handleDragStart = useCallback((taskId: string) => {
    setActiveTouchTaskId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedOverColumn(null);
    setActiveTouchTaskId(null);
  }, []);

  const handleDragOver = useCallback((status: string) => {
    setDraggedOverColumn(status);
  }, []);

  const handleDrop = useCallback(
    (taskId: string, newStatus: string) => {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== newStatus) {
        updateTask(taskId, { status: newStatus as ITaskStatus }, true);
      }
      setDraggedOverColumn(null);
      setActiveTouchTaskId(null);
    },
    [tasks, updateTask],
  );

  const handlePointerDragMove = useCallback((clientX: number, clientY: number) => {
    const element = document
      .elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>("[data-board-status]");
    const status = element?.dataset.boardStatus;

    setDraggedOverColumn(status ?? null);
  }, []);

  const handlePointerDragEnd = useCallback(
    (taskId: string, clientX: number, clientY: number) => {
      const element = document
        .elementFromPoint(clientX, clientY)
        ?.closest<HTMLElement>("[data-board-status]");
      const status = element?.dataset.boardStatus;

      if (status) {
        handleDrop(taskId, status);
        return;
      }

      handleDragEnd();
    },
    [handleDragEnd, handleDrop],
  );

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");
  return (
    <div className="flex-1 flex flex-row gap-4 overflow-x-auto overflow-y-hidden pb-2 md:overflow-hidden md:divide-x md:divide-gray-200">
      <BoardColumn
        title="To Do"
        tasks={todoTasks}
        bgColor="bg-gray-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerDragMove={handlePointerDragMove}
        onPointerDragEnd={handlePointerDragEnd}
        status="todo"
        isDraggingOver={draggedOverColumn === "todo"}
        activeTouchTaskId={activeTouchTaskId}
      />
      <BoardColumn
        title="In Progress"
        tasks={inProgressTasks}
        bgColor="bg-blue-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerDragMove={handlePointerDragMove}
        onPointerDragEnd={handlePointerDragEnd}
        status="in_progress"
        isDraggingOver={draggedOverColumn === "in_progress"}
        activeTouchTaskId={activeTouchTaskId}
      />
      <BoardColumn
        title="Done"
        tasks={doneTasks}
        bgColor="bg-emerald-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerDragMove={handlePointerDragMove}
        onPointerDragEnd={handlePointerDragEnd}
        status="done"
        isDraggingOver={draggedOverColumn === "done"}
        activeTouchTaskId={activeTouchTaskId}
      />
    </div>
  );
};
