import { CalendarIcon, CheckCircle2Icon, NotebookTextIcon, TargetIcon } from "lucide-react";

interface TaskStatsProps {
  taskStats: {
    total: number;
    done: number;
  };
  notes: number;
  upcomingTasks: number;
}

export function TaskStats({ taskStats, notes, upcomingTasks }: TaskStatsProps) {
    return (
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total tasks
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{taskStats.total}</p>
                <p className="mt-1 text-xs text-gray-500">Across all statuses</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
                <TargetIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Done
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{taskStats.done}</p>
                <p className="mt-1 text-xs text-gray-500">Completed tasks</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <CheckCircle2Icon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{notes}</p>
                <p className="mt-1 text-xs text-gray-500">Stored in your workspace</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <NotebookTextIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Upcoming
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{upcomingTasks}</p>
                <p className="mt-1 text-xs text-gray-500">Due soon</p>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <CalendarIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>
    );
}