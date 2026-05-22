import { useState } from "react";
import type { ITaskPriority, ITaskStatus, CreateTaskInput } from "../types";
import { priorityConfig, statusConfig } from "../utils";
import { Button } from "../../../shared/components/form/Button";
import Textarea from "../../../shared/components/form/Textarea";
import Select from "../../../shared/components/form/Select";
import Input from "../../../shared/components/form/Input";
import CustomToast from "../../../shared/components/ui/CustomToast";

export default function CreateTask({
  onAddTask,
  onClose,
}: {
  onAddTask: (task: CreateTaskInput) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) {
      CustomToast("error", "Content is required");
      return;
    }
    if (!dueDate) {
      CustomToast("error", "Due date is required");
      return;
    }
    await onAddTask({
      content,
      status: status as ITaskStatus,
      priority: priority as ITaskPriority,
      dueDate: new Date(dueDate),
    });
    setContent("");
    setStatus("todo");
    setPriority("medium");
    setDueDate("");
    onClose();
  };
  return (
    <form onSubmit={onSubmit}>
      <section className="flex flex-col gap-4">
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

        <Input type="date" label="Due Date" name="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </section>
      <footer className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create
        </Button>
      </footer>
    </form>
  );
}
