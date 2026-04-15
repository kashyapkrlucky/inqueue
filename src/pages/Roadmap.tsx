import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { Calendar, Filter } from "lucide-react";
import {
  format,
  subDays,
  endOfDay,
  eachMonthOfInterval,
  eachDayOfInterval,
} from "date-fns";
import type { ITask } from "../types/index.types";

type FilterOption = "lastWeek" | "lastMonth" | "twoMonths" | null;

export default function Roadmap() {
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(endOfDay(new Date()), 7),
    to: endOfDay(new Date()),
  });
  const [activeFilter, setActiveFilter] = useState<FilterOption>("lastWeek");

  const handleFilterClick = (filter: FilterOption) => {
    const today = endOfDay(new Date());
    let fromDate: Date;

    switch (filter) {
      case "lastWeek":
        fromDate = subDays(today, 7);
        break;
      case "lastMonth":
        fromDate = subDays(today, 30);
        break;
      case "twoMonths":
        fromDate = subDays(today, 60);
        break;
      default:
        return;
    }

    setDateRange({ from: fromDate, to: today });
    setActiveFilter(filter);
  };

  const onTaskClick = (task: ITask) => {
    setSelectedTask(task);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
        {/* Left side - Date range */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">
            {format(dateRange.from, "MMM dd, yyyy")} -{" "}
            {format(dateRange.to, "MMM dd, yyyy")}
          </span>
        </div>

        {/* Right side - Filter buttons */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex space-x-1">
            <button
              onClick={() => handleFilterClick("lastWeek")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeFilter === "lastWeek"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => handleFilterClick("lastMonth")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeFilter === "lastMonth"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => handleFilterClick("twoMonths")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeFilter === "twoMonths"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              2 Months
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-row h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          {/* 1. roadmap topbar showing a ruler line with months dateRange.from to dateRange.to */}
          <div className="border-b border-gray-200">
            <div className="flex h-8 bg-gray-50">
              {eachMonthOfInterval({
                start: dateRange.from,
                end: dateRange.to,
              }).map((month, index) => (
                <div
                  key={index}
                  className="flex-1 border-r border-gray-300 flex items-center justify-center text-xs font-medium text-gray-700"
                >
                  {format(month, "MMM yyyy")}
                </div>
              ))}
            </div>
          </div>

          {/* 2. roadmap topbar showing a ruler line with dates dateRange.from to dateRange.to */}
          <div className="border-b border-gray-200">
            <div className="flex h-6 bg-white">
              {eachDayOfInterval({
                start: dateRange.from,
                end: dateRange.to,
              }).map((day, index) => (
                <div
                  key={index}
                  className="flex-1 border-r border-gray-100 flex items-center justify-center text-xs text-gray-600"
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
          </div>
          {/* 3. roadmap body showing tasks in a list view but task position starts from create date + 2 days interval */}
          <div className="flex flex-col justify-start divide-y divide-gray-200">
            {tasks.map((task: ITask) => (
              <div
                className="flex flex-row relative"
                key={task._id}
                onClick={() => onTaskClick(task)}
              >
                {eachDayOfInterval({
                  start: dateRange.from,
                  end: dateRange.to,
                }).map((day, index) => {
                  const isDateMatch =
                    day.getDate() === new Date(task.updatedAt).getDate() &&
                    day.getMonth() === new Date(task.updatedAt).getMonth();
                  const statusClass =
                    task.status === "done"
                      ? "bg-emerald-200"
                      : task.status === "in_progress"
                        ? "bg-indigo-200"
                        : "bg-gray-200";
                  return (
                    <div
                      className={`relative flex-1 border-r border-gray-100 w-24 h-12 p-1 rounded`}
                      key={index}
                      style={{ fontSize: "11px" }}
                    >
                      <div
                        className={`absolute w-24 top-0 left-0 h-12 flex items-center justify-center z-10 p-2 ${isDateMatch ? statusClass + " rounded-sm shadow-sm" : ""}`}
                      >
                        {isDateMatch ? task.content.slice(0, 28) : <>&nbsp;</>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 p-4 bg-white">
          {selectedTask && (
            <div>
              <h3>{selectedTask.content}</h3>
              <p>{selectedTask.status}</p>
              <p>{format(selectedTask.updatedAt, "MMM dd, yyyy")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
