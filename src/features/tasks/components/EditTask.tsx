import { useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Modal from "../../../shared/components/ui/Modal";
import TaskEditor from "./TaskEditor";
import { PlusIcon } from "lucide-react";
import type { ITask } from "../types";

export default function EditTask({ task }: { task: ITask }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <Button
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setIsTaskModalOpen(true)}
      >
        Edit Task
      </Button>
      <Modal
        title="Edit Task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <TaskEditor task={task} onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </>
  );
}
