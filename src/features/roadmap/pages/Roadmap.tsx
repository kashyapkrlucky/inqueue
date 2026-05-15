import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import type { ITask } from "../../tasks/types";
import { useRoadmapStore } from "../store/useRoadmapStore";
import { DateSidebar } from "../components/DateSidebar";
import Text from "../../../shared/components/content/Text";

export default function Roadmap() {
  const { tasks, getTasks } = useRoadmapStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);
  const daysInMonth = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd]
  );

  // Calculate padding days before the 1st of the month
  const firstDayOfWeek = useMemo(() => monthStart.getDay(), [monthStart]);
  const paddingDays = useMemo(() => Array.from({ length: firstDayOfWeek }, () => null), [firstDayOfWeek]);

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.updatedAt), date));
  }, [tasks]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const monthStartString = useMemo(() => monthStart.toISOString(), [monthStart]);
  const monthEndString = useMemo(() => monthEnd.toISOString(), [monthEnd]);

  useEffect(() => {
    getTasks(monthStartString, monthEndString);
  }, [monthStartString, monthEndString, getTasks]);

  const selectedDateTasks = useMemo(
    () => (selectedDate ? getTasksForDate(selectedDate) : []),
    [selectedDate, getTasksForDate]
  );

  const handleUpdateTask = useCallback((task: ITask) => {
    // TODO: Implement update task functionality
    console.log("Update task:", task);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    // TODO: Implement delete task functionality
    console.log("Delete task:", taskId);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <Text variant="h1" className="text-xl">
              {format(currentMonth, "MMMM yyyy")}
            </Text>
            <Text variant="body-xs" color="muted">
              Task Calendar
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-col">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
                    className={`h-20 w-full relative aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all hover:shadow-md cursor-pointer ${isToday ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50 hover:bg-gray-100"}
                      ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    `}
                  >
                    <span className={`text-2xl font-bold ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayTasks.length <= 3 ? (
                          dayTasks.map((task) => (
                            <div
                              key={task._id}
                              className={`w-3 h-3 rounded-full ${
                                task.status === "done"
                                  ? "bg-emerald-500"
                                  : task.status === "in_progress"
                                  ? "bg-indigo-500"
                                  : "bg-gray-400"
                              }`}
                            />
                          ))
                        ) : (
                          <span className="text-[10px] font-semibold text-gray-600">
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
        </div>

        {/* Date Sidebar */}
        <DateSidebar
          date={selectedDate}
          tasks={selectedDateTasks}
          onClose={handleCloseSidebar}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}
