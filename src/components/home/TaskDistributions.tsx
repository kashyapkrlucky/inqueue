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
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>Status</span>
            <span>{taskStats.total} total</span>
          </div>
          <div className="mt-2 overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-3 w-full">
              <div
                className="h-full bg-gray-400"
                style={{ width: `${taskStatusChart.todoPct}%` }}
              />
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${taskStatusChart.inProgressPct}%` }}
              />
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${taskStatusChart.donePct}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              To do
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.todo}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              In progress
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.in_progress}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Done
              <span className="ml-auto font-semibold text-gray-900">
                {taskStats.done}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Chart */}

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>Priority</span>
            <span></span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-20 text-xs font-semibold text-gray-600">
                Low
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-red-200"
                  style={{ width: `${taskPriorityChart.lowPct}%` }}
                />
              </div>
              <div className="w-8 text-right text-xs font-semibold text-gray-900">
                {taskStats.low}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 text-xs font-semibold text-gray-600">
                Medium
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-red-400"
                  style={{ width: `${taskPriorityChart.mediumPct}%` }}
                />
              </div>
              <div className="w-8 text-right text-xs font-semibold text-gray-900">
                {taskStats.medium}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 text-xs font-semibold text-gray-600">
                High
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${taskPriorityChart.highPct}%` }}
                />
              </div>
              <div className="w-8 text-right text-xs font-semibold text-gray-900">
                {taskStats.high}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
