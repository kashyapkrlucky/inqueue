import { useEffect, useMemo } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  NotebookText,
  Target,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { useNoteStore } from "../store/useNoteStore";
import { formatDate } from "../utils/helpers";
import type { ITask, INote } from "../types/index.types";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

const getTaskStatus = (status: ITask["status"]): TaskStatus => {
  if (status === "todo" || status === "in_progress" || status === "done") return status;
  return "todo";
};

const getTaskPriority = (priority: ITask["priority"]): TaskPriority => {
  if (priority === "low" || priority === "medium" || priority === "high") return priority;
  return "medium";
};

const asDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const Home = () => {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    getTasks,
  } = useTaskStore();
  const {
    notes,
    loading: notesLoading,
    error: notesError,
    getNotes,
  } = useNoteStore();

  useEffect(() => {
    void getTasks();
    void getNotes();
  }, [getTasks, getNotes]);

  const loading = tasksLoading || notesLoading;
  const error = tasksError || notesError;

  const taskStats = useMemo(() => {
    const base = {
      total: tasks.length,
      todo: 0,
      in_progress: 0,
      done: 0,
      low: 0,
      medium: 0,
      high: 0,
    } as const;

    const mutable = { ...base } as {
      total: number;
      todo: number;
      in_progress: number;
      done: number;
      low: number;
      medium: number;
      high: number;
    };

    for (const t of tasks) {
      mutable[getTaskStatus(t.status)] += 1;
      mutable[getTaskPriority(t.priority)] += 1;
    }
    return mutable;
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .map((t) => ({ task: t, due: asDate(t.dueDate) }))
      .filter((x) => x.due && x.due.getTime() >= now.getTime())
      .sort((a, b) => (a.due!.getTime() - b.due!.getTime()))
      .slice(0, 6);
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .map((t) => ({ task: t, created: asDate(t.createdAt) ?? new Date(0) }))
      .sort((a, b) => b.created.getTime() - a.created.getTime())
      .slice(0, 6)
      .map((x) => x.task);
  }, [tasks]);

  const recentNotes = useMemo(() => {
    return [...notes]
      .map((n) => ({ note: n, updated: asDate(n.updatedAt) ?? asDate(n.createdAt) ?? new Date(0) }))
      .sort((a, b) => b.updated.getTime() - a.updated.getTime())
      .slice(0, 6)
      .map((x) => x.note);
  }, [notes]);

  const notesByMonth = useMemo(() => {
    const now = new Date();
    const months: Array<{ key: string; label: string; count: number }> = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("default", { month: "short" });
      months.push({ key, label, count: 0 });
    }

    for (const n of notes) {
      const created = asDate(n.createdAt);
      if (!created) continue;
      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const idx = months.findIndex((m) => m.key === key);
      if (idx >= 0) months[idx].count += 1;
    }

    const max = Math.max(1, ...months.map((m) => m.count));
    return { months, max };
  }, [notes]);

  const taskStatusChart = useMemo(() => {
    const total = Math.max(1, taskStats.total);
    const todoPct = clamp((taskStats.todo / total) * 100, 0, 100);
    const inProgressPct = clamp((taskStats.in_progress / total) * 100, 0, 100);
    const donePct = clamp((taskStats.done / total) * 100, 0, 100);
    return { todoPct, inProgressPct, donePct };
  }, [taskStats]);

  const taskPriorityChart = useMemo(() => {
    const max = Math.max(1, taskStats.low, taskStats.medium, taskStats.high);
    return {
      lowPct: clamp((taskStats.low / max) * 100, 0, 100),
      mediumPct: clamp((taskStats.medium / max) * 100, 0, 100),
      highPct: clamp((taskStats.high / max) * 100, 0, 100),
    };
  }, [taskStats]);

  const getNoteTitle = (note: INote) => (note.title?.trim() ? note.title : "Untitled note");
  const getTaskTitle = (task: ITask) => (task.content?.trim() ? task.content : "Untitled task");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Home</h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your notes, tasks, and what’s coming up.
            </p>
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {formatDate(new Date())}
          </div>
        </div>

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

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total tasks
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{taskStats.total}</p>
                <p className="mt-1 text-xs text-gray-500">Across all statuses</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Done
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{taskStats.done}</p>
                <p className="mt-1 text-xs text-gray-500">Completed tasks</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{notes.length}</p>
                <p className="mt-1 text-xs text-gray-500">Stored in your workspace</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <NotebookText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Upcoming
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{upcomingTasks.length}</p>
                <p className="mt-1 text-xs text-gray-500">Due soon</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Task distribution</h2>
                <p className="mt-1 text-xs text-gray-500">Status mix + priority strength</p>
              </div>
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : null}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>Status</span>
                <span>{taskStats.total} total</span>
              </div>
              <div className="mt-2 overflow-hidden rounded-full bg-gray-100">
                <div className="flex h-3 w-full">
                  <div className="h-full bg-gray-400" style={{ width: `${taskStatusChart.todoPct}%` }} />
                  <div className="h-full bg-blue-500" style={{ width: `${taskStatusChart.inProgressPct}%` }} />
                  <div className="h-full bg-green-500" style={{ width: `${taskStatusChart.donePct}%` }} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  To do
                  <span className="ml-auto font-semibold text-gray-900">{taskStats.todo}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  In progress
                  <span className="ml-auto font-semibold text-gray-900">{taskStats.in_progress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Done
                  <span className="ml-auto font-semibold text-gray-900">{taskStats.done}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>Priority</span>
                <span>relative</span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-gray-600">Low</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-gray-400" style={{ width: `${taskPriorityChart.lowPct}%` }} />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold text-gray-900">{taskStats.low}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-gray-600">Medium</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-blue-500" style={{ width: `${taskPriorityChart.mediumPct}%` }} />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold text-gray-900">{taskStats.medium}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-gray-600">High</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-red-500" style={{ width: `${taskPriorityChart.highPct}%` }} />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold text-gray-900">{taskStats.high}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Notes activity</h2>
                <p className="mt-1 text-xs text-gray-500">Created per month (last 6)</p>
              </div>
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : null}
            </div>

            <div className="mt-5 flex items-end gap-2">
              {notesByMonth.months.map((m) => (
                <div key={m.key} className="flex-1">
                  <div className="h-24 rounded-xl bg-gray-50 p-2">
                    <div
                      className="w-full rounded-lg bg-indigo-500"
                      style={{ height: `${clamp((m.count / notesByMonth.max) * 100, 4, 100)}%` }}
                      title={`${m.count} notes`}
                    />
                  </div>
                  <div className="mt-2 text-center text-[11px] font-semibold text-gray-600">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                <span>Total notes</span>
                <span className="text-gray-900">{notes.length}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Upcoming</h2>
                <p className="mt-1 text-xs text-gray-500">Tasks with a due date</p>
              </div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Calendar className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {upcomingTasks.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  No upcoming due tasks.
                </div>
              ) : (
                upcomingTasks.map(({ task, due }) => (
                  <div key={task._id ?? `${task.content}-${String(due)}`}
                    className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {getTaskTitle(task)}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          Due {due ? formatDate(due) : "—"}
                        </div>
                      </div>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Recent tasks</h2>
                    <p className="mt-1 text-xs text-gray-500">Latest created</p>
                  </div>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {recentTasks.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      No tasks yet.
                    </div>
                  ) : (
                    recentTasks.map((t) => {
                      const created = asDate(t.createdAt);
                      const status = getTaskStatus(t.status);
                      return (
                        <div
                          key={t._id ?? `${t.content}-${String(t.createdAt)}`}
                          className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-gray-900">
                                {getTaskTitle(t)}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                                    status === "done"
                                      ? "bg-green-50 text-green-700"
                                      : status === "in_progress"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  {status === "in_progress" ? "In progress" : status}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {created ? formatDate(created) : "—"}
                                </span>
                              </div>
                            </div>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Recent notes</h2>
                    <p className="mt-1 text-xs text-gray-500">Latest updated</p>
                  </div>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <NotebookText className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {recentNotes.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      No notes yet.
                    </div>
                  ) : (
                    recentNotes.map((n) => {
                      const updated = asDate(n.updatedAt) ?? asDate(n.createdAt);
                      const snippet = (n.content ?? "").trim().slice(0, 80);
                      return (
                        <div
                          key={n._id}
                          className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-gray-900">
                                {getNoteTitle(n)}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {snippet ? snippet : "No content"}
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3.5 w-3.5" />
                                {updated ? `Updated ${formatDate(updated)}` : "—"}
                              </div>
                            </div>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Syncing tasks and notes…
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
