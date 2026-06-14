import { useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Modal from "../../../shared/components/ui/Modal";
import LabelEditor from "./LabelEditor";
import { PlusIcon } from "lucide-react";

export default function CreateLabel() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setIsTaskModalOpen(true)}
      >
        Add Task Label
      </Button>
      <Modal
        title="Create Task Label"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <LabelEditor
          label={undefined}
          onClose={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </>
  );
}
