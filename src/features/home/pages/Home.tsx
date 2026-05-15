import { useEffect } from "react";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { useNoteStore } from "../../notes/store/useNoteStore";
import { TaskStats } from "../components/TaskStats";
import { TaskStatistics } from "../components/TaskStatistics";
import { TaskActivity } from "../components/TaskActivity";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { RecentTasks } from "../components/RecentTasks";
import { RecentNotes } from "../components/RecentNotes";
import PageLoader from "../../../shared/ui/PageLoader";
import useAuthStore from "../../auth/store/useAuthStore";
import { formatDateWithTime } from "../../../shared/utils";

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
      <PageLoader/>
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
            {formatDateWithTime(new Date())}
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
          <RecentTasks tasks={homeData.recent} />
          <RecentNotes notes={noteStats.recent} />
          <UpcomingTasks upcomingTasks={homeData.upcoming} />
        </section>
      </main>
    </div>
  );
};

export default Home;
