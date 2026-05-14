import { useState } from "react";
import type {
  ITaskPriority,
  ITaskStatus,
  ITask,
} from "../types";
import { priorityConfig, statusConfig } from "../utils";
import { Button } from "../../../shared/ui/Button";
import Textarea from "../../../shared/ui/Textarea";
import Select from "../../../shared/ui/Select";

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
          <Textarea
            id="content"
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <Select
            id="status"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </Select>
          <Select
            id="priority"
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.entries(priorityConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </Select>
        </section>
        <footer className="flex items-center justify-end gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Create
          </Button>
        </footer>
      </form>
    </div>
  );
}
