import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarRangeIcon,
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
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { Button } from "../../../shared/components/form/Button";

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
    <div className="max-w-7xl mx-auto p-6 h-screen flex flex-col gap-4">
      {/* Header */}
      <PageHeader
        icon={<CalendarRangeIcon className="w-5 h-5 text-indigo-600" />}
        title="Task Calendar"
        description="Manage and track your tasks across different stages"
        subContent={
          <>
            <Button variant="ghost" onClick={handlePreviousMonth}>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <Text variant="h1" className="text-xl">
              {format(currentMonth, "MMMM yyyy")}
            </Text>
            <Button variant="ghost" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </Button>
          </>
        }
      />
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
