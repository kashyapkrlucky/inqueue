import { useMemo } from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { eachDayOfInterval, isSameDay } from "date-fns";
import type { ITask } from "../../tasks/types";

type TaskStatus = "todo" | "in_progress" | "done";

interface DateRange {
  from: Date;
  to: Date;
}

interface RoadmapTaskCardProps {
  task: ITask;
  dateRange: DateRange;
  onClick: (task: ITask) => void;
}

export function RoadmapTaskCard({ task, dateRange, onClick }: RoadmapTaskCardProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const daysInInterval = useMemo(
    () => eachDayOfInterval({ start: dateRange.from, end: dateRange.to }),
    [dateRange]
  );

  return (
    <div
      className="flex flex-row relative group hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick(task)}
    >
      {daysInInterval.map((day, index) => {
        const isTaskDate = isSameDay(day, new Date(task.updatedAt));
        const statusClass = getStatusColor(task.status as TaskStatus);
        
        return (
          <div
            key={index}
            className="relative flex-1 border-r border-gray-100 min-w-[96px] h-16 p-2"
          >
            {isTaskDate && (
              <div
                className={`absolute inset-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${statusClass} shadow-sm hover:shadow-md transition-shadow z-10`}
              >
                {getStatusIcon(task.status as TaskStatus)}
                <span className="text-xs font-medium truncate">
                  {task.content}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
