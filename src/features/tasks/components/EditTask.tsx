import { useState } from "react";
import Modal from "../../../shared/components/ui/Modal";
import TaskEditor from "./TaskEditor";
import { PenBoxIcon } from "lucide-react";
import type { ITask } from "../types";

interface EditTaskProps {
  task: ITask;
  setMoreMenuOpen: (value: boolean) => void;
  iconOnly?: boolean;
  isTaskByDates?: boolean;
}
export default function EditTask({
  task,
  setMoreMenuOpen,
  iconOnly,
  isTaskByDates,
}: EditTaskProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onClose = () => {
    setIsTaskModalOpen(false);
    setMoreMenuOpen(false);
  };
  return (
    <>
      <button
        className={`${iconOnly ? "h-9 w-9 justify-center items-center" : "w-full items-start"} p-1 inline-flex rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
        onClick={() => setIsTaskModalOpen(true)}
        aria-label="Edit"
      >
        <PenBoxIcon className="w-4 h-4" />
        {!iconOnly ? <span className="text-xs ml-2">Edit</span> : null}
      </button>
      <Modal title="Edit Task" isOpen={isTaskModalOpen} onClose={onClose}>
        <TaskEditor task={task} onClose={onClose} isTaskByDates={isTaskByDates} />
      </Modal>
    </>
  );
}
