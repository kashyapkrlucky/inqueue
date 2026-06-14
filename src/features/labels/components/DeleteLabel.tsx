import { useCallback, useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import { useLabelStore } from "../store/useLabelStore";
import { Trash2Icon } from "lucide-react";
import Modal from "../../../shared/components/ui/Modal";
import Confirm from "../../../shared/components/ui/Confirm";

interface DeleteLabelProps {
  labelId: string;
  buttonType?: "icon" | "text";
}

export default function DeleteLabel({
  labelId,
  buttonType = "icon",
}: DeleteLabelProps) {
  const { deleteLabel } = useLabelStore();
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const onDeleteLabel = useCallback(
    (labelId: string) => {
      deleteLabel(labelId);
    },
    [deleteLabel],
  );
  return (
    <>
      <div>
        {buttonType === "icon" ? (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setIsLabelModalOpen(true)}
            className="p-2 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="xs"
            variant="ghost"
            icon={<Trash2Icon className="h-3 w-3" />}
            onClick={() => setIsLabelModalOpen(true)}
            className="p-2 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </Button>
        )}
      </div>
      <Modal
        title="Delete Label"
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      >
        <Confirm
          text="Are you sure you want to delete this label?"
          confirmAction={() => onDeleteLabel(labelId)}
          closeAction={() => setIsLabelModalOpen(false)}
        />
      </Modal>
    </>
  );
}
