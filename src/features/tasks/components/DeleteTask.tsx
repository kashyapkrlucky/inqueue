import { useCallback, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { Trash2Icon } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import Confirm from "../../../shared/components/ui/Confirm";

interface DeleteTaskProps {
  taskId: string;
  buttonType?: "icon" | "text";
  iconOnly?: boolean;
  setMoreMenuOpen?: (value: boolean) => void;
}

export default function DeleteTask({
  taskId,
  iconOnly = false,
  setMoreMenuOpen,
}: DeleteTaskProps) {
  const { deleteTask } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
      setIsTaskModalOpen(false);
      setMoreMenuOpen?.(false);
    },
    [deleteTask, setMoreMenuOpen],
  );
  return (
    <>
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className={`${iconOnly ? 'h-9 w-9 justify-center items-center' : 'w-full items-start'} p-1 inline-flex rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
        aria-label="Delete"
      >
        <Trash2Icon className="w-4 h-4" />
        {!iconOnly ? <span className="text-xs ml-2">Delete</span> : null}
      </button>

      <Modal
        title="Please Confirm"
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setMoreMenuOpen?.(false);
        }}
      >
        <Confirm
          text="Are you sure you want to delete this task?"
          confirmAction={() => onDeleteTask(taskId)}
          closeAction={() => {
            setIsTaskModalOpen(false);
            setMoreMenuOpen?.(false);
          }}
        />
      </Modal>
    </>
  );
}
