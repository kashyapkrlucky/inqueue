import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { DateSidebar } from "../components/DateSidebar";
import Text from "../../../shared/components/content/Text";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import CalendarGrid from "../components/CalendarGrid";
import PageLoader from "../../../shared/components/loaders/PageLoader";

export default function Calendar() {
  const { tasks, getTaskCalendar, loading } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);

  const monthStartString = useMemo(
    () => monthStart.toISOString(),
    [monthStart],
  );
  const monthEndString = useMemo(() => monthEnd.toISOString(), [monthEnd]);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedDate(null);
  }, []);

  useEffect(() => {
    getTaskCalendar(monthStartString, monthEndString);
  }, [monthStartString, monthEndString, getTaskCalendar]);

  const getTasksForDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => isSameDay(new Date(task.createdAt), date));
    },
    [tasks],
  );
  const selectedDateTasks = useMemo(
    () => (selectedDate ? getTasksForDate(selectedDate) : []),
    [selectedDate, getTasksForDate],
  );

  if (loading) {
    return <PageLoader />;
  }

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
        <CalendarGrid
          monthStart={monthStart}
          monthEnd={monthEnd}
          selectedDate={selectedDate}
          handleDateClick={handleDateClick}
          getTasksForDate={getTasksForDate}
        />

        {/* Date Sidebar */}
        <DateSidebar
          date={selectedDate}
          tasks={selectedDateTasks}
          onClose={handleCloseSidebar}
        />
      </div>
    </div>
  );
}
