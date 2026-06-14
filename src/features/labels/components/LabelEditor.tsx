import { useCallback, useState } from "react";
import { Button } from "../../../shared/components/form/Button";
import Select from "../../../shared/components/form/Select";
import Input from "../../../shared/components/form/Input";
import CustomToast from "../../../shared/components/ui/CustomToast";
import { useLabelStore } from "../store/useLabelStore";
import type { ITaskLabel, ITaskLabelCreateInput, ITaskLabelUpdateInput } from "../types";
import { colorConfig } from "../utils";

export default function TaskEditor({
  label,
  onClose,
}: {
  label?: ITaskLabel | undefined;
  onClose: () => void;
}) {
  const { createLabel, updateLabel } = useLabelStore();
  const [name, setName] = useState(label?.name || "");
  const [color, setColor] = useState(label?.color || "red");

  const onAddLabel = useCallback(
    (label: ITaskLabelCreateInput) => {
      createLabel(label);
    },
    [createLabel],
  );

  const onUpdateLabel = useCallback(
    (labelId: string, data: ITaskLabelUpdateInput) => {
      updateLabel(labelId, data);
    },
    [updateLabel],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      CustomToast("error", "Name is required");
      return;
    }
    if (label) {
      onUpdateLabel(label._id, {
        name,
        color,
      });
    } else {
      onAddLabel({
        name,
        color,
      });
    }
    setName("");
    setColor("red");
    onClose();
  };
  return (
    <form onSubmit={onSubmit}>
      <section className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        <Select
          id="color"
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value as string)}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(colorConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </Select>
      </section>
      <footer className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={!name.trim() || !color}>
          {label ? "Update" : "Create"}
        </Button>
      </footer>
    </form>
  );
}
