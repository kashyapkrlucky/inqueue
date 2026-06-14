import { useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Modal from "../../../shared/components/ui/Modal";
import LabelEditor from "./LabelEditor";
import { PenLineIcon } from "lucide-react";
import type { ITaskLabel } from "../types";

export default function EditLabel({ label }: { label: ITaskLabel }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        icon={<PenLineIcon className="h-4 w-4 " />}
        onClick={() => setIsTaskModalOpen(true)}
        aria-label="Edit label"
        className="text-gray-500 hover:text-blue-600"
      >
      </Button>
      <Modal
        title="Edit Label"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <LabelEditor label={label} onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </>
  );
}
