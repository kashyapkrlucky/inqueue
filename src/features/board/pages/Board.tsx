import CustomToast from "../../../shared/components/ui/CustomToast";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { useEffect, useState, useCallback, useMemo } from "react";
import CreateTask from "../../tasks/components/CreateTask";
import { NoItems } from "../../../shared/components/content/NoItems";
import { ChevronLeftIcon, ChevronRightIcon, KanbanIcon } from "lucide-react";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import InlineLoader from "../../../shared/components/loaders/InlineLoader";
import PageLoader from "../../../shared/components/loaders/PageLoader";
import { Button } from "@/shared/components/form/Button";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import Text from "@/shared/components/content/Text";
import { GridView } from "../components/GridView";
import { CalendarView } from "../components/CalendarView";

export default function Board() {
  const { tasks, loading, error, getTaskCalendar } = useTaskStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  type TabType = "Grid" | "Calendar";
  const [viewMode, setViewMode] = useState<TabType>("Grid");
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  const handleFilterChange = useCallback((type: TabType) => {
    setViewMode(type);
  }, []);
  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);

  const monthStartString = useMemo(
    () => monthStart.toISOString(),
    [monthStart],
  );
  const monthEndString = useMemo(() => monthEnd.toISOString(), [monthEnd]);

  useEffect(() => {
    getTaskCalendar(monthStartString, monthEndString);
    setIsPageLoading(false);
  }, [monthStartString, monthEndString, getTaskCalendar]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);
  const getTasksForDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
    },
    [tasks],
  );
  const selectedDateTasks = useMemo(
    () => (selectedDate ? getTasksForDate(selectedDate) : []),
    [selectedDate, getTasksForDate],
  );
  const handleCloseSidebar = useCallback(() => {
    setSelectedDate(null);
  }, []);

  if (error) {
    CustomToast("error", error);
  }

  if (isPageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 h-screen flex flex-col gap-4">
      <PageHeader
        icon={<KanbanIcon className="w-5 h-5 text-indigo-600" />}
        title="Board"
        description="Manage and track your tasks across different stages"
        subContent={
          <div className="flex items-center gap-4">
            {loading && <InlineLoader />}
            <div className="flex flex-row-reverse justify-center items-center gap-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handlePreviousMonth}>
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </Button>
                <Text variant="h1" className="text-xl">
                  {format(currentMonth, "MMMM yyyy")}
                </Text>
                <Button variant="ghost" onClick={handleNextMonth}>
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <CreateTask />
                <div className="inline-flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl py-1 md:py-1.5 px-2 border border-gray-200/50">
                  <button
                    onClick={() => handleFilterChange("Grid")}
                    className={`
          relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200
          ${
            viewMode === "Grid"
              ? "bg-white text-indigo-600 shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }
        `}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => handleFilterChange("Calendar")}
                    className={`
          relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200
          ${
            viewMode === "Calendar"
              ? "bg-white text-indigo-600 shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }
        `}
                  >
                    Calendar
                  </button>
                </div>

              </div>
            </div>
          </div>
        }
      />

      {viewMode === "Grid" && (
        <>
          {tasks.length === 0 && !loading && (
            <div className="flex-1 flex items-center justify-center">
              <NoItems
                title="No tasks found"
                description="Create a task to get started or change the date filter"
                icon={<KanbanIcon className="w-6 h-6" />}
              />
            </div>
          )}

          {tasks.length > 0 && <GridView tasks={tasks} />}
        </>
      )}
      {viewMode === "Calendar" && (
        <CalendarView
          monthStart={monthStart}
          monthEnd={monthEnd}
          selectedDate={selectedDate}
          handleDateClick={handleDateClick}
          getTasksForDate={getTasksForDate}
          selectedDateTasks={selectedDateTasks}
          handleCloseSidebar={handleCloseSidebar}
        />
      )}
    </div>
  );
}
