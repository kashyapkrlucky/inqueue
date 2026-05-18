import { useMemo } from "react";
import { eachDayOfInterval, isSameDay, format } from "date-fns";
import type { ITask } from "../../tasks/types";

interface CalendarGridProps {
  monthStart: Date;
  monthEnd: Date;
  selectedDate: Date | null;
  handleDateClick: (date: Date) => void;
  getTasksForDate: (date: Date) => ITask[];
}

export default function CalendarGrid({
  monthStart,
  monthEnd,
  selectedDate,
  handleDateClick,
  getTasksForDate,
}: CalendarGridProps) {
  const daysInMonth = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate padding days before the 1st of the month
  const firstDayOfWeek = useMemo(() => monthStart.getDay(), [monthStart]);
  const paddingDays = useMemo(
    () => Array.from({ length: firstDayOfWeek }, () => null),
    [firstDayOfWeek],
  );

  const taskStatusClass = (status: string) => {
    if (status === "done") {
      return "bg-emerald-500";
    } else if (status === "in_progress") {
      return "bg-indigo-500";
    } else {
      return "bg-gray-400";
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-bold text-indigo-700 py-1 uppercase "
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {/* Padding days before the 1st of the month */}
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="aspect-square h-20 w-full" />
        ))}

        {/* Actual days of the month */}
        {daysInMonth.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`h-20 w-full relative aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all hover:shadow-md cursor-pointer ${isToday ? "bg-indigo-50 border-2 border-indigo-500" : "bg-gray-50 hover:bg-gray-100"}
                      ${isSelected ? "ring-2 ring-emerald-500 ring-offset-2" : ""}
                    `}
            >
              <span
                className={`text-2xl font-bold ${isToday ? "text-blue-600" : "text-gray-900"}`}
              >
                {format(day, "d")}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5">
                  {dayTasks.length <= 3 ? (
                    dayTasks.map((task) => (
                      <div
                        key={task._id}
                        className={`w-3 h-3 rounded-full ${taskStatusClass(task.status || "todo")}`}
                      />
                    ))
                  ) : (
                    <span className="text-[10px] font-semibold text-gray-600 bg-yellow-200 px-1 py-0.5 rounded">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
