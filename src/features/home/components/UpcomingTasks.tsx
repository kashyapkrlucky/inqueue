import { CalendarIcon, ClockIcon } from "lucide-react";
import type { ITask } from "../../tasks/types";
import InfoCard from "../../../shared/components/content/InfoCard";
import { NoItems } from "../../../shared/components/content/NoItems";
import { formatRelativeTime } from "../../../shared/utils";
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

      <div className="mt-4 space-y-2  h-[240px] overflow-y-auto hide-scrollbar">
        {upcomingTasks.length === 0 ? (
          <NoItems title="No upcoming due tasks" />
        ) : (
          upcomingTasks.map((task) => (
            <div
              key={task._id ?? task.content}
              className="group relative overflow-hidden rounded-xl border border-gray-200 p-4 transition-all duration-200"
            >
              <div className="flex flex-col items-start justify-between gap-2">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                  {getTaskTitle(task)}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 border border-orange-200">
                    <ClockIcon className="h-3 w-3 text-orange-600" />
                    <span className="font-semibold text-orange-700">
                      Due{" "}
                      {formatRelativeTime(task.dueDate.toString())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
