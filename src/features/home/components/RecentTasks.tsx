import { CalendarIcon, FileTextIcon } from "lucide-react";
import type { ITask } from "../../tasks/types";
import { asDate, formatDate } from "../../../shared/utils";
import { getTaskStatus } from "../../tasks/utils";
import InfoCard from "../../../shared/components/content/InfoCard";
import { NoItems } from "../../../shared/components/content/NoItems";
import CreateTask from "../../tasks/components/CreateTask";

interface RecentTasksProps {
  tasks: ITask[];
}
export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="w-full md:w-1/3 rounded-2xl bg-white p-4 shadow-sm">
      <InfoCard
        title="Recent tasks"
        description="Latest updated"
        icon={<FileTextIcon className="h-4 w-4" />}
      />

      <div className="mt-4 space-y-2 overflow-y-auto h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tasks.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center h-full">
            <NoItems title="No tasks yet." />
            <CreateTask />
          </div>
        ) : (
          tasks.map((t) => {
            const created = asDate(t.updatedAt);
            const status = getTaskStatus(t.status);
            return (
              <div
                key={t._id ?? `${t.content}-${String(t.updatedAt)}`}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 rounded-lg border border-gray-100 bg-white p-2.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="flex-1 flex flex-row items-center gap-2">
                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      status === "done"
                        ? "bg-emerald-500"
                        : status === "in_progress"
                          ? "bg-indigo-500"
                          : "bg-gray-400"
                    }`}
                  />
                  <span className="truncate max-w-[180px] text-xs font-medium text-gray-900">
                    {t?.content}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <CalendarIcon className="h-3 w-3" />
                  {created ? formatDate(created) : "—"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
