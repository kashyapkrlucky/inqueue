import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Search,
  Loader2,
  // AlertTriangle,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITask, ITaskStatus, ITaskPriority } from "../types/index.types";
import CreateTask from "../components/tasks/CreateTask";
import {
  getTaskPriority,
  getTaskStatus,
  priorityConfig,
  statusConfig,
} from "../utils/helpers";
import { TaskCard } from "../components/tasks/TaskCard";
import { Button } from "../components/ui/Button";

export default function Tasks() {
  const { tasks, getTasks, loading, error, addTask } = useTaskStore();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ITaskPriority | "all">(
    "all",
  );
  console.log(error);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onAddTask = (task: Partial<ITask>) => {
    addTask(task);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white overflow-y-scroll">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 h-full relative">
        <header className="flex flex-col gap-4">
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
              <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
          </div>
          <div className="h-24 flex flex-row gap-4 mb-6">
            <section className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
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
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      In Progress
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.in_progress}
                    </p>
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Done
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats.done}
                    </p>
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </section>

            <section className="flex-1 rounded-xl bg-white p-3 shadow-sm">
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
          </div>
        </header>

        {/* {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div className="min-w-0">
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 break-words text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null} */}

        <section className="flex-1 ">
          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading tasks…
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-900">
                No tasks found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting filters or create a new task.
              </p>
              <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => {
                const key = task._id;
                const isExpanded = expandedTask === task._id;
                return (
                  <li
                    key={key}
                    className={`transition-all ${
                      isExpanded ? "ring-2 ring-indigo-600/80 rounded-xl" : ""
                    }`}
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

        {isTaskModalOpen && (
          <CreateTask
            onAddTask={onAddTask}
            onClose={() => setIsTaskModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
