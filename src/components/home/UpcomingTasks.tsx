import { ArrowUpRightIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { formatDate } from "../../utils/helpers";
import type { ITask } from "../../types/index.types";
interface UpcomingTasksProps {
  upcomingTasks: ITask[];
}
const getTaskTitle = (task: ITask) =>
  task.content?.trim() ? task.content : "Untitled task";
export function UpcomingTasks({ upcomingTasks }: UpcomingTasksProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Upcoming</h2>
          <p className="mt-1 text-xs text-gray-500">Tasks with a due date</p>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
          <CalendarIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {upcomingTasks.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            No upcoming due tasks.
          </div>
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
