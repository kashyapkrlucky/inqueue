import CalendarGrid from "@/features/board/components/CalendarGrid";
import DateSidebar from "@/features/board/components/DateSidebar";
import type { ITask } from "@/features/tasks/types";
interface CalendarViewProps {
  monthStart: Date;
  monthEnd: Date;
  selectedDate: Date | null;
  handleDateClick: (date: Date) => void;
  getTasksForDate: (date: Date) => ITask[];
  selectedDateTasks: ITask[];
  handleCloseSidebar: () => void;
}

export function CalendarView({
  monthStart,
  monthEnd,
  selectedDate,
  handleDateClick,
  getTasksForDate,
  selectedDateTasks,
  handleCloseSidebar,
}: CalendarViewProps) {
  return (
    <div className="flex-1 flex gap-4 overflow-hidden pb-2">
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
  );
}
