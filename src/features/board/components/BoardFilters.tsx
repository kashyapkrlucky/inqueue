import { useCallback } from "react";

interface BoardFiltersProps {
  getTasksByDate: (start: string, end: string) => void;
  currentFilter: "today" | "week" | "month";
  onFilterChange: (filter: "today" | "week" | "month") => void;
}

type FilterType = "today" | "week" | "month";

export const BoardFilters = ({ getTasksByDate, currentFilter, onFilterChange }: BoardFiltersProps) => {

  const getDateRange = useCallback((filterType: FilterType) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    switch (filterType) {
      case "today": {
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        return { start: startOfDay.toISOString(), end: endOfDay.toISOString() };
      }
      case "week": {
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
        endOfWeek.setHours(23, 59, 59, 999);

        return { start: startOfWeek.toISOString(), end: endOfWeek.toISOString() };
      }
      case "month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        return { start: startOfMonth.toISOString(), end: endOfMonth.toISOString() };
      }
    }
  }, []);

  const handleFilterChange = useCallback(
    (filterType: FilterType) => {
      onFilterChange(filterType);
      const dateRange = getDateRange(filterType);
      getTasksByDate(dateRange.start, dateRange.end);
    },
    [getTasksByDate, getDateRange, onFilterChange]
  );

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50">
      <button
        onClick={() => handleFilterChange("today")}
        className={`
          relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
          ${currentFilter === "today"
            ? "bg-white text-indigo-600 shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }
        `}
      >
        Today
      </button>
      <button
        onClick={() => handleFilterChange("week")}
        className={`
          relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
          ${currentFilter === "week"
            ? "bg-white text-indigo-600 shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }
        `}
      >
        This Week
      </button>
      <button
        onClick={() => handleFilterChange("month")}
        className={`
          relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
          ${currentFilter === "month"
            ? "bg-white text-indigo-600 shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          }
        `}
      >
        This Month
      </button>
    </div>
  );
};
