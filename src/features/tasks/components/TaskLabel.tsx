import { colorConfig } from "@/features/labels/utils";
import type { ITask } from "../types";
import { TagIcon } from "lucide-react";
export default function TaskLabel({ task }: { task: ITask }) {
  const labelClass =
    task?.label?.color &&
    colorConfig[task?.label?.color as keyof typeof colorConfig].class;

  if (!task?.label) return null;
  return (
    <span
      className={`${labelClass} text-xs text-white px-1.5 py-0.5 rounded-sm capitalize shadow-xs flex items-center gap-1`}
    >
      <TagIcon className="h-3 w-3 text-white" />
      {task?.label?.name}
    </span>
  );
}
