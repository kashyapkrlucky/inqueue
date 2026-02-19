import { Loader2Icon } from "lucide-react";

interface TaskDistributionsProps {
  taskStats: {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
    low: number;
    medium: number;
    high: number;
  };
  taskStatusChart: {
    todoPct: number;
    inProgressPct: number;
    donePct: number;
  };
  taskPriorityChart: {
    lowPct: number;
    mediumPct: number;
    highPct: number;
  };
  loading: boolean;
}

export function TaskDistributions({
  taskStats,
  taskStatusChart,
  taskPriorityChart,
  loading,
}: TaskDistributionsProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Task distribution</h2>
          <p className="mt-1 text-xs text-gray-500">
            Status mix + priority strength
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
            {/* <span>{taskStats.total} total</span> */}
          </div>

          {/* Donut Chart */}
          <div className="mt-3 flex items-center justify-center">
            <div className="relative">
              {/* Donut Chart using conic gradient */}
              <div
                className="h-24 w-24 rounded-full"
                style={{
                  background: `conic-gradient(
                    #9ca3af 0% ${taskStatusChart.todoPct}%,
                    #6366f1 ${taskStatusChart.todoPct}% ${taskStatusChart.todoPct + taskStatusChart.inProgressPct}%,
                    #10b981 ${taskStatusChart.todoPct + taskStatusChart.inProgressPct}% 100%
                  )`
                }}
              />
              {/* Center hole for donut effect */}
              <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white" />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-gray-600">To do</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.todo}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-gray-600">In progress</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.in_progress}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-gray-600">Done</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.done}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Chart */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Priority</span>
            {/* <span>{taskStats.low + taskStats.medium + taskStats.high} total</span> */}
          </div>

          {/* Donut Chart */}
          <div className="mt-3 flex items-center justify-center">
            <div className="relative">
              {/* Donut Chart using conic gradient */}
              <div
                className="h-24 w-24 rounded-full"
                style={{
                  background: `conic-gradient(
                    #fef2f2 0% ${taskPriorityChart.lowPct}%,
                    #fca5a5 ${taskPriorityChart.lowPct}% ${taskPriorityChart.lowPct + taskPriorityChart.mediumPct}%,
                    #dc2626 ${taskPriorityChart.lowPct + taskPriorityChart.mediumPct}% 100%
                  )`
                }}
              />
              {/* Center hole for donut effect */}
              <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white" />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-red-200" />
              <span className="text-gray-600">Low</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.low}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="text-gray-600">Medium</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.medium}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-red-600" />
              <span className="text-gray-600">High</span>
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.high}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
