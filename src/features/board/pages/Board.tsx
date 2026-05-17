import PageLoader from "../../../shared/components/loaders/PageLoader";
import CustomToast from "../../../shared/components/ui/CustomToast";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { BoardColumn } from "../components/BoardColumn";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import CreateTask from "../../tasks/components/CreateTask";
import { PlusIcon } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import type { ITask } from "../../tasks/types";

export default function Board() {
  const { tasks, getTasks, loading, error, addTask } = useTaskStore();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onAddTask = (task: Partial<ITask>) => {
    addTask(task);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    CustomToast("error", error);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 h-screen flex flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Board
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your notes, tasks, and what’s coming up.
          </p>
        </div>
        <div className="text-2xl font-semibold text-gray-600">
          <Button
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsTaskModalOpen(true)}
          >
            Add Task
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-row overflow-hidden divide-x divide-gray-200">
        <BoardColumn
          title="To Do"
          tasks={tasks.filter((task) => task.status === "todo")}
          bgColor="bg-gray-500"
        />
        <BoardColumn
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "in_progress")}
          bgColor="bg-blue-500"
        />
        <BoardColumn
          title="Done"
          tasks={tasks.filter((task) => task.status === "done")}
          bgColor="bg-emerald-500"
        />
      </div>

      <Modal
        title="Create Task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <CreateTask
          onAddTask={onAddTask}
          onClose={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
