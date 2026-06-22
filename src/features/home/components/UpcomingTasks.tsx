import { CalendarIcon, ClockIcon } from "lucide-react";
import type { ITask } from "../../tasks/types";
import InfoCard from "../../../shared/components/content/InfoCard";
import { NoItems } from "../../../shared/components/content/NoItems";
import { formatRelativeTime } from "../../../shared/utils";
import EditTask from "@/features/tasks/components/EditTask";
interface UpcomingTasksProps {
  upcomingTasks: ITask[];
}
const getTaskTitle = (task: ITask) =>
  task.content?.trim() ? task.content : "Untitled task";
export function UpcomingTasks({ upcomingTasks }: UpcomingTasksProps) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-5 shadow-sm">
      <InfoCard
        title="Upcoming"
        description="Tasks with a due date"
        icon={<CalendarIcon className="h-4 w-4" />}
        iconBg="bg-orange-50"
        iconColor="text-orange-700"
      />

      <div className="mt-4 space-y-2 h-[240px] overflow-y-auto hide-scrollbar">
        {upcomingTasks.length === 0 ? (
          <NoItems title="No upcoming due tasks" />
        ) : (
          upcomingTasks.map((task) => (
            <div
              key={task._id ?? task.content}
              className="group relative overflow-hidden flex flex-col md:flex-row items-center justify-between rounded-lg border border-gray-200 transition-all duration-200"
            >
              <div className="text-xs py-2 px-4 font-medium text-gray-900 group-hover:text-orange-700 transition-colors">
                {getTaskTitle(task)}
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3 text-orange-600" />
                  <span className="font-semibold text-orange-700 text-xs">
                    Due {formatRelativeTime(task.dueDate.toString())}
                  </span>
                </div>
                <EditTask
                  iconOnly={true}
                  task={task}
                  setMoreMenuOpen={() => {}}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
