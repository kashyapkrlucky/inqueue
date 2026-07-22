import { useEffect } from "react";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { TaskStats } from "../components/TaskStats";
import { TaskStatistics } from "../components/TaskStatistics";
import { TaskActivity } from "../components/TaskActivity";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { RecentTasks } from "../components/RecentTasks";
import PageLoader from "../../../shared/components/loaders/PageLoader";
import useAuthStore from "../../auth/store/useAuthStore";
import { formatDate } from "../../../shared/utils";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { LayoutDashboardIcon } from "lucide-react";

const Home = () => {
  const {
    loading: tasksLoading,
    getStats,
    getRecents,
    stats,
    homeData,
  } = useTaskStore();

  const { isAuthenticated, loading: authLoading, user } = useAuthStore();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      void getStats();
      void getRecents();
    }
  }, [getStats, getRecents, authLoading, isAuthenticated]);

  const loading = tasksLoading  || authLoading;

  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 h-screen flex flex-col gap-4">
      <PageHeader
        icon={<LayoutDashboardIcon className="w-5 h-5 text-indigo-600" />}
        title={`Welcome, ${user?.name || user?.username}`}
        description="Overview of your notes, tasks, and what’s coming up."
        subContent={
          <p className="text-2xl font-semibold text-gray-600">
            {formatDate(new Date())}
          </p>
        }
      />

      <TaskStats
        taskStats={stats}
        upcomingTasks={homeData.upcoming.length}
      />

      <section className="flex flex-col md:flex-row gap-4 h-72">
        <UpcomingTasks upcomingTasks={homeData.upcoming} />
        <RecentTasks tasks={homeData.recent} />
      </section>

      <section className="flex flex-col md:flex-row gap-4">
        <TaskStatistics taskStats={stats} loading={loading} />
        <TaskActivity data={stats.weeklyStats} loading={loading} />
      </section>
    </div>
  );
};

export default Home;
