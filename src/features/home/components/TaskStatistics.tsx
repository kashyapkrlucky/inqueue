import { Loader2Icon } from "lucide-react";
import CustomActiveShapePieChart from "../../../shared/components/charts/PieChart";

interface TaskStatisticsProps {
  taskStats: {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
    low: number;
    medium: number;
    high: number;
  };
  loading: boolean;
}

interface dateItem {
  name: string;
  value: number;
  fill: string;
}

export function TaskStatistics({ taskStats, loading }: TaskStatisticsProps) {
  const isTaskData =
    taskStats.todo > 0 || taskStats.in_progress > 0 || taskStats.done > 0;
  const isTaskPriorityData =
    taskStats.low > 0 || taskStats.medium > 0 || taskStats.high > 0;
  const taskStatsData: dateItem[] = [
    { name: "To do", value: taskStats.todo, fill: "#9ca3af" },
    { name: "In progress", value: taskStats.in_progress, fill: "#6366f1" },
    { name: "Done", value: taskStats.done, fill: "#10b981" },
  ];

  const taskPriorityData = [
    { name: "Low", value: taskStats.low, fill: "#d1d5dc" },
    {
      name: "Medium",
      value: taskStats.medium,
      fill: "#ffb86a",
    },
    { name: "High", value: taskStats.high, fill: "#fb2c36" },
  ];

  return (
    <div className="flex-1 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Task Statistics</h2>
          <p className="mt-1 text-xs text-gray-500">
            Status &amp; Priority strength
          </p>
        </div>
        {loading ? (
          <Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Chart */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {isTaskData ? (
            <CustomActiveShapePieChart data={taskStatsData} />
          ) : (
            <div className="text-sm text-gray-500">No tasks</div>
          )}
          <span>Status</span>
        </div>

        {/* Priority Chart */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {isTaskPriorityData ? (
            <CustomActiveShapePieChart data={taskPriorityData} />
          ) : (
            <div className="text-sm text-gray-500">No tasks</div>
          )}
          <span>Priority</span>
        </div>
      </div>
    </div>
  );
}
