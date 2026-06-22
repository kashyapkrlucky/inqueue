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

interface ChartItem {
  name: string;
  value: number;
  fill: string;
}

function ChartPanel({
  title,
  hasData,
  data,
}: {
  title: string;
  hasData: boolean;
  data: ChartItem[];
}) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h3>
      </div>
      <div className="flex min-h-56 items-center justify-center">
        {hasData ? (
          <CustomActiveShapePieChart data={data} />
        ) : (
          <div className="text-sm text-gray-500">No tasks</div>
        )}
      </div>
    </div>
  );
}

export function TaskStatistics({ taskStats, loading }: TaskStatisticsProps) {
  const isTaskData =
    taskStats.todo > 0 || taskStats.in_progress > 0 || taskStats.done > 0;
  const isTaskPriorityData =
    taskStats.low > 0 || taskStats.medium > 0 || taskStats.high > 0;
  const taskStatsData: ChartItem[] = [
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

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartPanel title="Status" hasData={isTaskData} data={taskStatsData} />
        <ChartPanel
          title="Priority"
          hasData={isTaskPriorityData}
          data={taskPriorityData}
        />
      </div>
    </div>
  );
}
