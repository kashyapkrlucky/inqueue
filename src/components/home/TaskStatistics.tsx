import { Loader2Icon } from "lucide-react";
import CustomActiveShapePieChart from "../ui/CustomPieChart";

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

export function TaskStatistics({
  taskStats,
  loading,
}: TaskStatisticsProps) {
  const taskStatsData: dateItem[] = [
    { name: "To do", value: taskStats.todo + 1, fill: "#9ca3af" },
    { name: "In progress", value: taskStats.in_progress + 3, fill: "#6366f1" },
    { name: "Done", value: taskStats.done + 2, fill: "#10b981" },
  ];

  const taskPriorityData = [
    { name: "Low", value: taskStats.low + 1, fill: "#d1d5dc" },
    {
      name: "Medium",
      value: taskStats.medium + 1,
      fill: "#ffb86a",
    },
    { name: "High", value: taskStats.high + 1, fill: "#fb2c36" },
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

      <div className="grid grid-cols-2 gap-4">
        {/* Status Chart */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Status</span>
          </div>

          {/* Donut Chart */}
          <div className="mt-3 flex items-center justify-center">
            <CustomActiveShapePieChart data={taskStatsData} />
          </div>
        </div>

        {/* Priority Chart */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Priority</span>
          </div>

          {/* Donut Chart */}
          <div className="mt-3 flex items-center justify-center">
            <CustomActiveShapePieChart data={taskPriorityData} />
          </div>
        </div>
      </div>
    </div>
  );
}
