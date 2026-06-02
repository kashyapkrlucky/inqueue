import { BoardColumn } from "./BoardColumn";
import { useTaskStore } from "@/features/tasks/store/useTaskStore";
import { useCallback, useState } from "react";
import type { ITask } from "@/features/tasks/types";

interface GridViewProps {
  tasks: ITask[];
}

export const GridView = ({ tasks }: GridViewProps) => {
  const { updateTask } = useTaskStore();
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null,
  );
  const handleDragStart = useCallback(() => {
    // Drag start handled by BoardTaskCard
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedOverColumn(null);
  }, []);

  const handleDragOver = useCallback((status: string) => {
    setDraggedOverColumn(status);
  }, []);

  const handleDrop = useCallback(
    (taskId: string, newStatus: string) => {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== newStatus) {
        updateTask(taskId, {
          ...task,
          status: newStatus as "todo" | "in_progress" | "done",
        });
      }
      setDraggedOverColumn(null);
    },
    [tasks, updateTask],
  );

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");
  return (
    <div className="flex-1 flex flex-row gap-4 overflow-hidden divide-x divide-gray-200">
      <BoardColumn
        title="To Do"
        tasks={todoTasks}
        bgColor="bg-gray-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        status="todo"
        isDraggingOver={draggedOverColumn === "todo"}
      />
      <BoardColumn
        title="In Progress"
        tasks={inProgressTasks}
        bgColor="bg-blue-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        status="in_progress"
        isDraggingOver={draggedOverColumn === "in_progress"}
      />
      <BoardColumn
        title="Done"
        tasks={doneTasks}
        bgColor="bg-emerald-500"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        status="done"
        isDraggingOver={draggedOverColumn === "done"}
      />
    </div>
  );
};
