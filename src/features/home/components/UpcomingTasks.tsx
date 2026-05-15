import { ArrowUpRightIcon, CalendarIcon, ClockIcon } from "lucide-react";
import type { ITask } from "../../tasks/types";
import { formatDate } from "../../../shared/utils";
import InfoCard from "../../../shared/components/content/InfoCard";
import { NoItems } from "../../../shared/components/content/NoItems";
interface UpcomingTasksProps {
  upcomingTasks: ITask[];
}
const getTaskTitle = (task: ITask) =>
  task.content?.trim() ? task.content : "Untitled task";
export function UpcomingTasks({ upcomingTasks }: UpcomingTasksProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <InfoCard
        title="Upcoming"
        description="Tasks with a due date"
        icon={<CalendarIcon className="h-4 w-4" />}
        iconBg="bg-orange-50"
        iconColor="text-orange-700"
      />

      <div className="mt-4 space-y-2">
        {upcomingTasks.length === 0 ? (
          <NoItems title="No upcoming due tasks" />
        ) : (
          upcomingTasks.map((task) => (
            <div
              key={task._id ?? task.content}
              className="rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-gray-900">
                    {getTaskTitle(task)}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Due {task?.dueDate ? formatDate(task?.dueDate) : "—"}
                  </div>
                </div>
                <ArrowUpRightIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
