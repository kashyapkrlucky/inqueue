import { useMemo, useState, type KeyboardEvent } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type {
  ITask,
  ITaskPriority,
  ITaskStatus,
} from "../types";
import {
  getTaskPriority,
  getTaskStatus,
  priorityConfig,
  statusConfig,
} from "../utils";
import { formatDate } from "../../../shared/utils";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Confirm from "../../../shared/components/ui/Confirm";
import Input from "../../../shared/components/form/Input";
import Select from "../../../shared/components/form/Select";
import CustomToast from "../../../shared/components/ui/CustomToast";

const nextStatus = (status: ITaskStatus): ITaskStatus => {
  if (status === "todo") return "in_progress";
  if (status === "in_progress") return "done";
  return "todo";
};

export const TaskCard = ({
  task,
  expanded,
  onToggleExpanded,
}: {
  task: ITask;
  expanded: boolean;
  onToggleExpanded: () => void;
}) => {
  const { updateTask, deleteTask, loading } = useTaskStore();
  const [draftContent, setDraftContent] = useState(task.content ?? "");

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  const status = getTaskStatus(task.status);
  const priority = getTaskPriority(task.priority);
  const StatusIcon = statusConfig[status].icon;

  const createdAt = useMemo(() => {
    return new Date(task.createdAt);
  }, [task.createdAt]);

  const dueDate = useMemo(() => {
    if (!task.dueDate) return null;
    return task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
  }, [task.dueDate]);

  const canMutate = Boolean(task._id);

  const commitUpdate = async (id: string, partial: Partial<ITask>) => {
    if (!canMutate) return;
    await updateTask(id, { ...task, ...partial } as ITask);
    CustomToast("success", "Task updated successfully 11");
  };

  const onToggleStatus = async () => {
    if (!canMutate) return;
    await commitUpdate(task._id, { status: nextStatus(status) });
  };

  const onCommitContent = async () => {
    const trimmed = draftContent.trim();
    if (trimmed === (task.content ?? "").trim()) return;
    if (!canMutate) return;
    await commitUpdate(task._id, { content: trimmed });
  };

  const onContentKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await onCommitContent();
      handleToggleExpanded();
    }
  };

  const onDelete = async () => {
    if (!task._id) return;
    await deleteTask(task._id);
    CustomToast("success", "Task deleted successfully");
  };

  const handleToggleExpanded = () => {
    if (!expanded) {
      setDraftContent(task.content ?? "");
    }
    onToggleExpanded();
  };

  return (
    <div className="group rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-2.5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggleStatus}
            disabled={!canMutate || loading}
            className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              status === "done"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : status === "in_progress"
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
            } ${!canMutate ? "opacity-60 cursor-not-allowed" : "hover:bg-white"}`}
            aria-label="Toggle status"
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <StatusIcon className="h-4 w-4" />
            )}
          </button>

          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <p
              className={`truncate text-sm font-semibold ${status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}
            >
              {task.content?.trim() ? task.content : "Untitled task"}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDate(createdAt)}
              </span>
              {dueDate ? (
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  Due {formatDate(dueDate)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700"
                title={`Priority: ${priorityConfig[priority].label}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${priorityConfig[priority].color}`}
                />
                {priorityConfig[priority].label}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpanded();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // onDelete();
                setIsDeleteConfirm(true);
              }}
              disabled={!canMutate || loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Delete"
            >
              <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
              <Input
                label="Task"
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                onBlur={onCommitContent}
                onKeyDown={onContentKeyDown}
                disabled={!canMutate || loading}
                onClick={(e) => e.stopPropagation()}
                boxClassName="sm:col-span-7 flex flex-col gap-2"
              />
              <Select
                label="Status"
                value={status}
                onChange={(e) =>
                  commitUpdate(task?._id, {
                    status: e.target.value as ITaskStatus,
                  })
                }
                disabled={!canMutate || loading}
                onClick={(e) => e.stopPropagation()}
                boxClassName="sm:col-span-3 flex flex-col gap-2"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Priority"
                value={priority}
                onChange={(e) =>
                  commitUpdate(task?._id, {
                    priority: e.target.value as ITaskPriority,
                  })
                }
                disabled={!canMutate || loading}
                onClick={(e) => e.stopPropagation()}
                boxClassName="sm:col-span-2 flex flex-col gap-2"
              >
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ) : null}
      </div>
      {isDeleteConfirm && (
        <Confirm
          text="Are you sure you want to delete this task?"
          confirmAction={() => onDelete()}
          closeAction={() => setIsDeleteConfirm(false)}
        />
      )}
    </div>
  );
};
