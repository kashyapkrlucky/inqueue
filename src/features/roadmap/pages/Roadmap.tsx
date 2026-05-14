import { useState, useMemo } from "react";
import { useTaskStore } from "../../tasks/store/useTaskStore";
import { Calendar, Filter, Clock, CheckCircle, Circle, Edit3, Trash2, Archive, MoreVertical, Tag, CalendarDays, User, AlertCircle } from "lucide-react";
import {
  format,
  subDays,
  endOfDay,
  eachMonthOfInterval,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import type { ITask } from "../../tasks/types";

type FilterOption = "lastWeek" | "lastMonth" | "twoMonths" | null;
type TaskStatus = "todo" | "in_progress" | "done";

interface DateRange {
  from: Date;
  to: Date;
}

interface FilterButtonProps {
  label: string;
  filter: FilterOption;
  activeFilter: FilterOption;
  onClick: (filter: FilterOption) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  filter,
  activeFilter,
  onClick,
}) => (
  <button
    onClick={() => onClick(filter)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
      activeFilter === filter
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
    }`}
  >
    {label}
  </button>
);

interface TaskCardProps {
  task: ITask;
  dateRange: DateRange;
  onClick: (task: ITask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, dateRange, onClick }) => {
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
};

interface SelectedTaskPanelProps {
  task: ITask | null;
}

const SelectedTaskPanel: React.FC<SelectedTaskPanelProps> = ({ task }) => {
  const timeSinceCreation = useMemo(() => {
    if (!task) return "";
    const now = new Date();
    const created = new Date(task.createdAt);
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }, [task]);

  if (!task) {
    return (
      <div className="w-80 p-6 bg-white border-l border-gray-200">
        <div className="text-center text-gray-500 mt-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Circle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Task Selected</h3>
          <p className="text-sm text-gray-500">Select a task from the roadmap to view its details and manage actions</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in_progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  const getProgressPercentage = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return 100;
      case "in_progress":
        return 50;
      default:
        return 0;
    }
  };

  
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(task.status as TaskStatus)}`}>
          {getStatusIcon(task.status as TaskStatus)}
          {(task.status || "todo").replace("_", " ").toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Task Title */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">{task.content}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="w-4 h-4" />
            <span>Created {timeSinceCreation}</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Progress</h4>
            <span className="text-sm font-medium text-gray-900">{getProgressPercentage(task.status as TaskStatus)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                task.status === "done" ? "bg-emerald-500" : 
                task.status === "in_progress" ? "bg-indigo-500" : "bg-gray-400"
              }`}
              style={{ width: `${getProgressPercentage(task.status as TaskStatus)}%` }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Assigned to</p>
                <p className="text-sm font-medium text-gray-900">Unassigned</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="text-sm font-medium text-gray-900">Medium</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</h4>
              <p className="text-sm text-gray-900">{format(new Date(task.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</h4>
              <p className="text-sm text-gray-900">{format(new Date(task.updatedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
        </div>

        {/* Task ID */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">ID:</span>
            <span className="text-xs font-mono text-gray-700">{task._id}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Archive className="w-4 h-4" />
            Archive
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Complete
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Roadmap() {
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(endOfDay(new Date()), 7),
    to: endOfDay(new Date()),
  });
  const [activeFilter, setActiveFilter] = useState<FilterOption>("lastWeek");

  const monthsInInterval = useMemo(
    () => eachMonthOfInterval({ start: dateRange.from, end: dateRange.to }),
    [dateRange]
  );

  const daysInInterval = useMemo(
    () => eachDayOfInterval({ start: dateRange.from, end: dateRange.to }),
    [dateRange]
  );

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left side - Date range */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Date Range</p>
            <p className="text-sm font-semibold text-gray-900">
              {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Right side - Filter buttons */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg">
            <Filter className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex space-x-2">
            <FilterButton
              label="Last Week"
              filter="lastWeek"
              activeFilter={activeFilter}
              onClick={handleFilterClick}
            />
            <FilterButton
              label="Last Month"
              filter="lastMonth"
              activeFilter={activeFilter}
              onClick={handleFilterClick}
            />
            <FilterButton
              label="2 Months"
              filter="twoMonths"
              activeFilter={activeFilter}
              onClick={handleFilterClick}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timeline Header */}
          <div className="bg-white border-b border-gray-200">
            {/* Months ruler */}
            <div className="flex h-10 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
              {monthsInInterval.map((month, index) => (
                <div
                  key={index}
                  className="flex-1 border-r border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {format(month, "MMM yyyy")}
                </div>
              ))}
            </div>
            {/* Days ruler */}
            <div className="flex h-8 bg-white">
              {daysInInterval.map((day, index) => {
                const isToday = isSameDay(day, new Date());
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                
                return (
                  <div
                    key={index}
                    className={`flex-1 border-r border-gray-100 flex items-center justify-center text-xs font-medium ${
                      isToday
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : isWeekend
                        ? "bg-gray-50 text-gray-500"
                        : "text-gray-700"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Tasks Grid */}
          <div className="flex-1 overflow-y-auto bg-white">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm mt-2">Tasks will appear here when created</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tasks.map((task: ITask) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    dateRange={dateRange}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <SelectedTaskPanel task={selectedTask} />
      </div>
    </div>
  );
}
