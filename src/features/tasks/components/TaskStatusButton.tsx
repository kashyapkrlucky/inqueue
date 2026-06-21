import { Loader2Icon } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITask } from "../types";
import type { ITaskStatus } from "../types";
import { getTaskStatus, statusConfig } from "../utils";
import CustomToast from "@/shared/components/ui/CustomToast";
export default function TaskStatusButton({ task }: { task: ITask }) {
  const { loading } = useTaskStore();
  const status = getTaskStatus(task.status);
  const StatusIcon = statusConfig[status].icon;

  const nextStatus = (status: ITaskStatus): ITaskStatus => {
    if (status === "todo") return "in_progress";
    if (status === "in_progress") return "done";
    return "todo";
  };
  const commitUpdate = async (id: string, partial: Partial<ITask>) => {
    console.log(id, partial);

    //   await updateTask(id, { ...task, ...partial } as ITask);
    CustomToast("success", "Task updated successfully");
  };

  const onToggleStatus = async () => {
    await commitUpdate(task._id, { status: nextStatus(status) });
  };
  return (
    <button
      type="button"
      onClick={onToggleStatus}
      disabled={loading}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
        status === "done"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : status === "in_progress"
            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
            : "border-gray-200 bg-gray-50 text-gray-700"
      } hover:bg-white`}
      aria-label="Toggle status"
    >
      {loading ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : (
        <StatusIcon className="h-4 w-4" />
      )}
    </button>
  );
}
