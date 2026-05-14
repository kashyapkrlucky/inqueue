import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useNoteStore } from "../store/useNoteStore";
import {
  formatDate,
} from "../utils/helpers";
import { TaskStats } from "../components/home/TaskStats";
import { TaskStatistics } from "../components/home/TaskStatistics";
import { TaskActivity } from "../components/home/TaskActivity";
import { UpcomingTasks } from "../components/home/UpcomingTasks";
import { RecentTasks } from "../components/home/RecentTasks";
import { RecentNotes } from "../components/home/RecentNotes";
import useAuthStore from "../store/useAuthStore";

const Home = () => {
  const {
    loading: tasksLoading,
    getStats,
    getRecents,
    stats,
    homeData,
  } = useTaskStore();
  const {
    loading: notesLoading,
    stats: noteStats,
    getStats: getNoteStats,
  } = useNoteStore();

  const { isAuthenticated, loading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      void getStats();
      void getRecents();
      void getNoteStats();
    }
  }, [getStats, getRecents, getNoteStats, authLoading, isAuthenticated]);

  const loading = tasksLoading || notesLoading || authLoading;

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

        <TaskStats
          taskStats={stats}
          notes={noteStats.total}
          upcomingTasks={homeData.upcoming.length}
        />

        <section className="mb-6 flex flex-row gap-4">
          <TaskStatistics
            taskStats={stats}
            loading={loading}
          />

          <TaskActivity
            data={stats.weeklyStats}
            loading={loading}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UpcomingTasks upcomingTasks={homeData.upcoming} />
          <RecentTasks tasks={homeData.recent} />
          <RecentNotes notes={noteStats.recent} />
        </section>
      </main>
    </div>
  );
};

export default Home;
