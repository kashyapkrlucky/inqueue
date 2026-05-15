import { useMemo } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Circle,
  Clock,
  Edit3,
  Archive,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "../../../shared/components/form/Button";
import type { ITask } from "../../tasks/types";

type TaskStatus = "todo" | "in_progress" | "done";

interface SelectedTaskPanelProps {
  task: ITask | null;
}

export function SelectedTaskPanel({ task }: SelectedTaskPanelProps) {
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
          <Button size="sm" icon={<Edit3 className="w-4 h-4" />}>
            Edit
          </Button>
          <Button size="sm" variant="outline" icon={<Archive className="w-4 h-4" />}>
            Archive
          </Button>
          <Button size="sm" variant="primary" icon={<CheckCircle className="w-4 h-4" />}>
            Complete
          </Button>
          <Button size="sm" variant="danger" icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
