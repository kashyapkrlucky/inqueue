import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
  Calendar,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITask, ITaskStatus, ITaskPriority } from "../types/index.types";
import { formatDate, newId } from "../utils/helpers";
import useAuthStore from "../store/useAuthStore";

const statusConfig = {
  todo: {
    label: "To Do",
    icon: Circle,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
} as const satisfies Record<
  ITaskStatus,
  {
    label: string;
    icon: typeof Circle;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
>;

const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-gray-400",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-500",
  },
  high: {
    label: "High",
    color: "bg-red-500",
  },
} as const satisfies Record<ITaskPriority, { label: string; color: string }>;

const getTaskStatus = (status: ITask["status"]): ITaskStatus => {
  if (status === "todo" || status === "in_progress" || status === "done") {
    return status;
  }
  return "todo";
};

const getTaskPriority = (priority: ITask["priority"]): ITaskPriority => {
  if (priority === "low" || priority === "medium" || priority === "high") {
    return priority;
  }
  return "medium";
};

const nextStatus = (status: ITaskStatus): ITaskStatus => {
  if (status === "todo") return "in_progress";
  if (status === "in_progress") return "done";
  return "todo";
};

export const TaskCreate = ({ task }: { task: ITask }) => {
  const [content, setContent] = useState(task?.content);
  const [status, setStatus] = useState(task?.status);
  const [priority, setPriority] = useState(task?.priority);

  return (
    <div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
          Priority
        </span>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 h-14 p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ITaskStatus)}
          className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-start gap-2">
        <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
          Priority
        </span>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as ITaskPriority)}
          className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(priorityConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
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
  const { updateTask, deleteTask, loading, getTasks } = useTaskStore();
  const [draftContent, setDraftContent] = useState(task.content ?? "");

  const status = getTaskStatus(task.status);
  const priority = getTaskPriority(task.priority);
  const StatusIcon = statusConfig[status].icon;

  const createdAt = useMemo(() => {
    const d =
      task.createdAt instanceof Date
        ? task.createdAt
        : new Date(task.createdAt);
    return d;
  }, [task.createdAt]);

  const dueDate = useMemo(() => {
    if (!task.dueDate) return null;
    return task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
  }, [task.dueDate]);

  const canMutate = Boolean(task._id);

  const commitUpdate = async (id: string, partial: Partial<ITask>) => {
    if (!canMutate) return;
    await updateTask(id, { ...task, ...partial } as ITask);
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
    getTasks();
  };

  const handleToggleExpanded = () => {
    if (!expanded) {
      setDraftContent(task.content ?? "");
    }
    onToggleExpanded();
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggleStatus}
            disabled={!canMutate || loading}
            className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              status === "done"
                ? "border-green-200 bg-green-50 text-green-700"
                : status === "in_progress"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
            } ${!canMutate ? "opacity-60 cursor-not-allowed" : "hover:bg-white"}`}
            aria-label="Toggle status"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <StatusIcon className="h-4 w-4" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[status].bgColor} ${statusConfig[status].textColor}`}
              >
                {statusConfig[status].label}
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700"
                title={`Priority: ${priorityConfig[priority].label}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${priorityConfig[priority].color}`}
                />
                {priorityConfig[priority].label}
              </span>
            </div>

            <div className="mt-2">
              <p
                className={`truncate text-sm font-semibold ${status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}
              >
                {task.content?.trim() ? task.content : "Untitled task"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {formatDate(createdAt)}
                </span>
                {dueDate ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Due {formatDate(dueDate)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpanded();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={!canMutate || loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Task
                </label>
                <input
                  type="text"
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  onBlur={onCommitContent}
                  onKeyDown={onContentKeyDown}
                  disabled={!canMutate || loading}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    commitUpdate(task?._id, {
                      status: e.target.value as ITaskStatus,
                    })
                  }
                  disabled={!canMutate || loading}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    commitUpdate(task?._id, {
                      priority: e.target.value as ITaskPriority,
                    })
                  }
                  disabled={!canMutate || loading}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default function Tasks() {
  const { tasks, getTasks, setTasks, loading, error } = useTaskStore();
  const { user } = useAuthStore();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ITaskPriority | "all">(
    "all",
  );

  const onAddTask = () => {
    const newTask: ITask = {
      _id: newId(),
      content: "",
      status: "todo",
      priority: "medium",
      user: user?._id,
      createdAt: new Date(),
    };
    setTasks(newTask);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const stats = useMemo(() => {
    const base = { todo: 0, in_progress: 0, done: 0 } as Record<
      ITaskStatus,
      number
    >;
    for (const t of tasks) {
      base[getTaskStatus(t.status)] += 1;
    }
    return base;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const st = getTaskStatus(t.status);
      const pr = getTaskPriority(t.priority);
      if (statusFilter !== "all" && st !== statusFilter) return false;
      if (priorityFilter !== "all" && pr !== priorityFilter) return false;
      if (!q) return true;
      return (t.content ?? "").toLowerCase().includes(q);
    });
  }, [tasks, query, statusFilter, priorityFilter]);

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTask((prev) => (prev === taskId ? null : taskId));
  };

  // const updateTask = (updatedTask: ITask) => {
  //   console.log(updatedTask);

  // };

  // const updateTaskStatus = (taskId: string, newStatus: string) => {
  //   console.log(taskId, newStatus);

  // };

  // const toggleTaskExpanded = (taskId: string) => {
  //   setExpandedTask(expandedTask === taskId ? null : taskId);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                My Tasks
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track what matters. Update status, priority, and details in one
                place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddTask}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div className="min-w-0">
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 break-words text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  To Do
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.todo}
                </p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
                <Circle className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  In Progress
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.in_progress}
                </p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Done
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.done}
                </p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Search
              </label>
              <div className="mt-1 flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks by title…"
                  className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ITaskStatus | "all")
                }
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="all">All</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as ITaskPriority | "all")
                }
                className="mt-1 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="all">All</option>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading tasks…
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-900">
                No tasks found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting filters or create a new task.
              </p>
              <button
                onClick={onAddTask}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => {
                const key = task._id ?? task.createdAt.toString();
                const isExpanded = expandedTask === task._id;
                return (
                  <li
                    key={key}
                    className={`transition-all ${
                      isExpanded ? "ring-2 ring-gray-900/10 rounded-2xl" : ""
                    }`}
                    onClick={() => {
                      if (!task._id) return;
                      toggleTaskExpanded(task._id);
                    }}
                  >
                    <TaskCard
                      task={task}
                      expanded={Boolean(task._id && isExpanded)}
                      onToggleExpanded={() => {
                        if (!task._id) return;
                        toggleTaskExpanded(task._id);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
