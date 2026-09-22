import { useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Modal from "../../../shared/components/ui/Modal";
import TaskEditor from "./TaskEditor";
import { PlusIcon } from "lucide-react";

export default function CreateTask() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setIsTaskModalOpen(true)}
      >
        Add Task
      </Button>
      <Modal
        title="Create Task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <TaskEditor task={undefined} onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </>
  );
}
