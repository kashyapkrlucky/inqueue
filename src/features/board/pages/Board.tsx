import CustomToast from "../../../shared/components/ui/CustomToast";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { BoardColumn } from "../components/BoardColumn";
import { useEffect, useState, useCallback } from "react";
import { Button } from "../../../shared/components/form/Button";
import CreateTask from "../../tasks/components/CreateTask";
import { PlusIcon } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import type { CreateTaskInput, UpdateTaskInput } from "../../tasks/types";
import { BoardFilters } from "../components/BoardFilters";
import { NoItems } from "../../../shared/components/content/NoItems";
import { KanbanIcon } from "lucide-react";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import InlineLoader from "../../../shared/components/loaders/InlineLoader";
import PageLoader from "../../../shared/components/loaders/PageLoader";

export default function Board() {
  const { tasks, loading, error, addTask, getTaskCalendar, deleteTask, updateTask } =
    useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<"today" | "week" | "month">("today");
  const [isPageLoading, setIsPageLoading] = useState(true);
 

  const onAddTask = useCallback((task: CreateTaskInput) => {
    addTask(task);
    setIsTaskModalOpen(false);
  }, [addTask]);

  const onDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  const onUpdateTask = useCallback((taskId: string, task: UpdateTaskInput) => {
    updateTask(taskId, task);
  }, [updateTask]);

  const getTasksByDate = useCallback((start: string, end: string) => {
    getTaskCalendar(start, end);
  }, [getTaskCalendar]);

  const handleDragStart = useCallback(() => {
    // Drag start handled by BoardTaskCard
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedOverColumn(null);
  }, []);

  const handleDragOver = useCallback((status: string) => {
    setDraggedOverColumn(status);
  }, []);

  const handleDrop = useCallback((taskId: string, newStatus: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { ...task, status: newStatus as "todo" | "in_progress" | "done" });
    }
    setDraggedOverColumn(null);
  }, [tasks, updateTask]);

  // Load initial tasks for today
  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    getTaskCalendar(startOfDay.toISOString(), endOfDay.toISOString());
    setIsPageLoading(false);
  }, [getTaskCalendar]);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  if (error) {
    CustomToast("error", error);
  }

  if (isPageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 h-screen flex flex-col gap-4">
      <PageHeader
        icon={<KanbanIcon className="w-5 h-5 text-indigo-600" />}
        title="Board"
        description="Manage and track your tasks across different stages"
        subContent={
          <div className="flex items-center gap-4">
            {loading && <InlineLoader/>}
            <Button
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </Button>
            <BoardFilters 
              getTasksByDate={getTasksByDate} 
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
          </div>
        }
      />

      {tasks.length === 0 && !loading ? (
        <div className="flex-1 flex items-center justify-center">
          <NoItems
            title="No tasks found"
            description="Create a task to get started or change the date filter"
            icon={<KanbanIcon className="w-6 h-6" />}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-row overflow-hidden divide-x divide-gray-200">
          <BoardColumn
            title="To Do"
            tasks={todoTasks}
            bgColor="bg-gray-500"
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
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
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
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
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            status="done"
            isDraggingOver={draggedOverColumn === "done"}
          />
        </div>
      )}

      <Modal
        title="Create Task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <CreateTask
          task={undefined}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onClose={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
