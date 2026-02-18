import { ArrowUpRightIcon, CalendarIcon, FileTextIcon } from "lucide-react";
import { asDate, formatDate, getTaskStatus } from "../../utils/helpers";
import type { ITask } from "../../types/index.types";

interface RecentTasksProps {
  tasks: ITask[];
}
export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Recent tasks</h2>
          <p className="mt-1 text-xs text-gray-500">Latest created</p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
          <FileTextIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            No tasks yet.
          </div>
        ) : (
          tasks.map((t) => {
            const created = asDate(t.createdAt);
            const status = getTaskStatus(t.status);
            return (
              <div
                key={t._id ?? `${t.content}-${String(t.createdAt)}`}
                className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {t?.content}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                          status === "done"
                            ? "bg-green-50 text-green-700"
                            : status === "in_progress"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {status === "in_progress" ? "In progress" : status}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {created ? formatDate(created) : "—"}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRightIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
