import { useState } from "react";
import type {
  ITaskPriority,
  ITaskStatus,
  ITask,
} from "../../types/index.types";
import { priorityConfig, statusConfig } from "../../utils/helpers";
import { Button } from "../ui/Button";

export default function CreateTask({
  onAddTask,
  onClose,
}: {
  onAddTask: (task: Partial<ITask>) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onAddTask({
      content,
      status: status as ITaskStatus,
      priority: priority as ITaskPriority,
    });
    setContent("");
    setStatus("todo");
    setPriority("medium");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={onSubmit}
        className="w-[400px] bg-white p-6 rounded-lg shadow-lg"
      >
        <header className="flex items-center justify-between">
          <h2>Create Task</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <section className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
              Content
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 h-14 p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ITaskStatus)}
              className="w-full border border-gray-200 rounded px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-gray-500 text-xs font-semibold uppercase mr-2">
              Priority
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ITaskPriority)}
              className="w-full border border-gray-200 rounded px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(priorityConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </section>
        <footer className="flex items-center justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            Create
          </Button>
        </footer>
      </form>
    </div>
  );
}
