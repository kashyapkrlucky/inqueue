import { X, Edit3, Trash2, CheckCircle, Clock, Circle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../../shared/components/form/Button";
import type { ITask } from "../../tasks/types";

interface DateSidebarProps {
  date: Date | null;
  tasks: ITask[];
  onClose: () => void;
  onUpdateTask: (task: ITask) => void;
  onDeleteTask: (taskId: string) => void;
}

type TaskStatus = "todo" | "in_progress" | "done";

export function DateSidebar({
  date,
  tasks,
  onClose,
  onUpdateTask,
  onDeleteTask,
}: DateSidebarProps) {
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

  if (!date) return null;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(date, "MMMM dd, yyyy")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Circle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No tasks for this date</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        task.status as TaskStatus
                      )}`}
                    >
                      {getStatusIcon(task.status as TaskStatus)}
                      {(task.status || "todo").replace("_", " ").toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {task.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {format(new Date(task.updatedAt), "h:mm a")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    icon={<Edit3 className="w-3 h-3" />}
                    onClick={() => onUpdateTask(task)}
                  />
                  <Button
                    size="xs"
                    variant="danger"
                    icon={<Trash2 className="w-3 h-3" />}
                    onClick={() => task._id && onDeleteTask(task._id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
