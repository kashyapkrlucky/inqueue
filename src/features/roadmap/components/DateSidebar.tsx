import { X } from "lucide-react";
import { format } from "date-fns";
import type { ITask } from "../../tasks/types";
import { TaskCard } from "../../tasks/components/TaskCard";
import { useState } from "react";
import ListLoading from "../../../shared/components/ui/ListLoading";

interface DateSidebarProps {
  date: Date | null;
  tasks: ITask[];
  onClose: () => void;
}

export function DateSidebar({ date, tasks, onClose }: DateSidebarProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTask((prev) => (prev === taskId ? null : taskId));
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
        <ListLoading
          isLoading={false}
          items={tasks}
          gap="py-2"
          emptyMessage="No tasks found, Try adjusting filters or create a new task."
        >
          {(task) => {
            const key = task._id;
            const isExpanded = expandedTask === task._id;
            return (
              <TaskCard
                key={key}
                task={task}
                expanded={Boolean(task._id && isExpanded)}
                onToggleExpanded={() => {
                  if (!task._id) return;
                  toggleTaskExpanded(task._id);
                }}
              />
            );
          }}
        </ListLoading>
      </div>
    </div>
  );
}
