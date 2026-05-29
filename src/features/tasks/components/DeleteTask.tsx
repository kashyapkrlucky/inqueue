import { useCallback, useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import { useTaskStore } from "../store/useTaskStore";
import { Trash2Icon } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import Confirm from "../../../shared/components/ui/Confirm";

interface DeleteTaskProps {
  taskId: string;
  buttonType?: "icon" | "text";
}

export default function DeleteTask({
  taskId,
  buttonType = "icon",
}: DeleteTaskProps) {
  const { deleteTask } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
    },
    [deleteTask],
  );
  return (
    <>
      <div>
        {buttonType === "icon" ? (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onDeleteTask(taskId)}
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onDeleteTask(taskId)}
          >
            Delete
          </Button>
        )}
      </div>
      <Modal
        title="Edit Task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <Confirm
          text="Are you sure you want to delete this task?"
          confirmAction={() => onDeleteTask(taskId)}
          closeAction={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </>
  );
}
