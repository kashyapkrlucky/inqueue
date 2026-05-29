import { useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Modal from "../../../shared/components/ui/Modal";
import TaskEditor from "./TaskEditor";
import { PenBoxIcon } from "lucide-react";
import type { ITask } from "../types";

export default function EditTask({ task }: { task: ITask }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        icon={<PenBoxIcon className="h-3 w-3" />}
        onClick={() => setIsTaskModalOpen(true)}
      >
        Edit
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
