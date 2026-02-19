import { useEffect, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useNoteStore } from "../store/useNoteStore";
import {
  asDate,
  clamp,
  formatDate,
  getTaskPriority,
  getTaskStatus,
} from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { TaskStats } from "../components/home/TaskStats";
import { TaskDistributions } from "../components/home/TaskDistributions";
import { NotesActivity } from "../components/home/NotesActivity";
import { UpcomingTasks } from "../components/home/UpcomingTasks";
import { RecentTasks } from "../components/home/RecentTasks";
import { RecentNotes } from "../components/home/RecentNotes";

const Home = () => {
  const {
    tasks,
    loading: tasksLoading,
    // error: tasksError,
    getTasks,
  } = useTaskStore();
  const {
    notes,
    loading: notesLoading,
    // error: notesError,
    getNotes,
  } = useNoteStore();

  useEffect(() => {
    void getTasks();
    void getNotes();
  }, [getTasks, getNotes]);

  const { isAuthenticated, loading: authLoading } = useAuth();

  const loading = tasksLoading || notesLoading || authLoading;
  // const error = tasksError || notesError;

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
      .map((t) => ({ _id: t._id, task: t, due: asDate(t.dueDate) }))
      .filter((x) => x.due && x.due.getTime() >= now.getTime())
      .sort((a, b) => a.due!.getTime() - b.due!.getTime())
      .slice(0, 6);
  }, [tasks]);

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
    const total = Math.max(1, taskStats.low + taskStats.medium + taskStats.high);
    return {
      lowPct: clamp((taskStats.low / total) * 100, 0, 100),
      mediumPct: clamp((taskStats.medium / total) * 100, 0, 100),
      highPct: clamp((taskStats.high / total) * 100, 0, 100),
    };
  }, [taskStats]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        <p>Syncing tasks and notes…</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Home
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your notes, tasks, and what’s coming up.
            </p>
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {formatDate(new Date())}
          </div>
        </div>

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

        <TaskStats
          taskStats={taskStats}
          notes={notes.length}
          upcomingTasks={upcomingTasks.length}
        />

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TaskDistributions
            taskStats={taskStats}
            taskStatusChart={taskStatusChart}
            taskPriorityChart={taskPriorityChart}
            loading={loading}
          />

          <NotesActivity
            notesByMonth={notesByMonth}
            loading={loading}
            notes={notes}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UpcomingTasks upcomingTasks={upcomingTasks} />
          <RecentTasks tasks={tasks} />
          <RecentNotes notes={notes} />
        </section>
      </main>
    </div>
  );
};

export default Home;
