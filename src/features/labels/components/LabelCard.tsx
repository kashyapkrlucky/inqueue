import type { ITaskLabel } from "../types";
import EditLabel from "./EditLabel";
import { colorConfig } from "../utils";
import DeleteLabel from "./DeleteLabel";

interface LabelCardProps {
  label: ITaskLabel;
}

export default function LabelCard({ label }: LabelCardProps) {
  const color = colorConfig[label.color as keyof typeof colorConfig];

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full ${color.class}`} />

        <div>
          <h3 className="font-medium text-gray-700 uppercase text-sm tracking-wider">{label.name}</h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <EditLabel label={label} />
        <DeleteLabel labelId={label._id} />
      </div>
    </div>
  );
}
