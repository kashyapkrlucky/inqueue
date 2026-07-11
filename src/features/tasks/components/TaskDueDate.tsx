import { useMemo } from "react";
import type { ITask } from "../types";
import { CheckCircleIcon, ClockIcon } from "lucide-react";
import { formatDate } from "@/shared/utils";

export default function TaskDueDate({ task }: { task: ITask }) {
  const updatedAt = task.updatedAt ? new Date(task.updatedAt) : null;

  const isDone = task.status === "done";

  const dueDate = useMemo(() => {
    if (!task.dueDate) return null;
    return task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
  }, [task.dueDate]);

  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;

  if (isDone) {
    return (
      <span className="inline-flex items-center text-xs gap-1.5 text-emerald-600">
        <CheckCircleIcon className="h-3.5 w-3.5" />
        <span>{formatDate(updatedAt!)}</span>
      </span>
    );
  }
  return (
    <>
      {isOverdue ? (
        <span className="inline-flex items-center text-xs gap-1.5 text-red-600 font-semibold">
          <ClockIcon className="h-3.5 w-3.5 text-red-500" />
          <span>Due on {formatDate(dueDate!)}</span>
        </span>
      ) : <span className="inline-flex items-center text-xs gap-1.5 text-gray-600 font-semibold">
          <ClockIcon className="h-3.5 w-3.5 text-gray-500" />
          <span>Due on {formatDate(dueDate!)}</span>
        </span>}
    </>
  );
}
