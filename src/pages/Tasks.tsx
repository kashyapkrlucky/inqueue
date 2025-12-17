import { useState } from "react";
import {
  Plus,
  Clock,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Status = "todo" | "inProgress" | "done";

type Task = {
  id: string;
  title: string;
  status: Status;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  createdAt: Date;
};

const statusConfig = {
  todo: {
    label: "To Do",
    icon: Circle,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
  },
  inProgress: {
    label: "In Progress",
    icon: Clock,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  done: {
    label: "Done",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-gray-400",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-500",
  },
  high: {
    label: "High",
    color: "bg-red-500",
  },
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      status: "todo",
      priority: "high",
      dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Review pull requests",
      status: "inProgress",
      priority: "medium",
      dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Update documentation",
      status: "done",
      priority: "low",
      createdAt: new Date(),
    },
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const addNewTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task",
      status: "todo" as const,
      priority: "medium" as const,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
    setExpandedTask(newTask.id);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const updateTaskStatus = (taskId: string, newStatus: Status) => {
    updateTask({
      ...tasks.find((task) => task.id === taskId)!,
      status: newStatus,
    });
  };

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="lg:text-2xl font-bold text-gray-800">My Tasks</h1>
          <div className="flex space-x-3">
            <button
              onClick={addNewTask}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center whitespace-nowrap"
            >
              <Plus size={16} className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 mb-4">No tasks yet</p>
            <button
              onClick={() => {
                const newTask = {
                  id: Date.now().toString(),
                  title: "My First Task",
                  status: "todo" as const,
                  priority: "medium" as const,
                  createdAt: new Date(),
                };
                setTasks([newTask]);
                setExpandedTask(newTask.id);
              }}
              className="text-indigo-500 hover:text-indigo-700 font-medium px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all ${
                  expandedTask === task.id
                    ? "ring-2 ring-blue-200"
                    : "hover:shadow-md"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <button
                      onClick={() => {
                        const newStatus =
                          task.status === "done" ? "todo" : "done";
                        updateTaskStatus(task.id, newStatus);
                      }}
                      className={`mt-0.5 mr-3 flex-shrink-0 transition-colors ${
                        task.status === "done"
                          ? "text-green-500 hover:text-green-600"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                      aria-label={
                        task.status === "done"
                          ? "Mark as not done"
                          : "Mark as done"
                      }
                    >
                      {task.status === "done" ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div
                      className="flex-1 min-w-0"
                      onClick={() => toggleTaskExpanded(task.id)}
                    >
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[task.status].bgColor
                          } ${statusConfig[task.status].textColor} mr-2`}
                        >
                          {statusConfig[task.status].label}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            priorityConfig[task.priority].color
                          }`}
                          title={`Priority: ${
                            priorityConfig[task.priority].label
                          }`}
                        />
                        <h3
                          className={`text-sm font-medium ${
                            task.status === "done"
                              ? "line-through text-gray-400"
                              : "text-gray-900"
                          } ml-2`}
                        >
                          {task.title}
                        </h3>
                      </div>

                      {task.dueDate && expandedTask !== task.id && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          Due {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>

                    <div className="ml-2 flex-shrink-0 flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskExpanded(task.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                      >
                        {expandedTask === task.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedTask === task.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      <div>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) =>
                            updateTask({
                              ...task,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Status:
                              </span>
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  updateTaskStatus(
                                    task.id,
                                    e.target.value as Status
                                  )
                                }
                                className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {Object.entries(statusConfig).map(
                                  ([key, config]) => (
                                    <option key={key} value={key}>
                                      {config.label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Priority:
                              </span>
                              <select
                                value={task.priority}
                                onChange={(e) =>
                                  updateTask({
                                    ...task,
                                    priority: e.target.value as
                                      | "low"
                                      | "medium"
                                      | "high",
                                  })
                                }
                                className="border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {Object.entries(priorityConfig).map(
                                  ([key, config]) => (
                                    <option key={key} value={key}>
                                      {config.label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500">
                            Created: {formatDate(task.createdAt)}
                            {task.dueDate && (
                              <span className="ml-3">
                                <Clock size={12} className="inline mr-1" />
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
