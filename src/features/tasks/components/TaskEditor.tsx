import { useCallback, useState } from "react";
import type {
  ITaskPriority,
  ITaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  ITask,
} from "../types";
import { priorityConfig, statusConfig } from "../utils";
import { Button } from "../../../shared/components/form/Button";
import Textarea from "../../../shared/components/form/Textarea";
import Select from "../../../shared/components/form/Select";
import Input from "../../../shared/components/form/Input";
import CustomToast from "../../../shared/components/ui/CustomToast";
import { useTaskStore } from "../store/useTaskStore";
import { useLabelStore } from "../../labels/store/useLabelStore";

export default function TaskEditor({
  task,
  onClose,
}: {
  task?: ITask | undefined;
  onClose: () => void;
}) {
  const { addTask, updateTask } = useTaskStore();
  const { labels } = useLabelStore();
  const [content, setContent] = useState(task?.content || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [label, setLabel] = useState(task?.label?._id || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );

  const onAddTask = useCallback(
    (task: CreateTaskInput) => {
      addTask(task);
    },
    [addTask],
  );

  const onUpdateTask = useCallback(
    (taskId: string, task: UpdateTaskInput) => {
      updateTask(taskId, task);
    },
    [updateTask],
  );
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
    
    if (task) {
      onUpdateTask(task._id, {
        content,
        status: status as ITaskStatus,
        priority: priority as ITaskPriority,
        dueDate: new Date(dueDate),
        label: label as string,
      });
    } else {
      onAddTask({
        content,
        status: status as ITaskStatus,
        priority: priority as ITaskPriority,
        dueDate: new Date(dueDate),
        label: label as string,
      });
    }
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
          onChange={(e) => setStatus(e.target.value as ITaskStatus)}
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
          onChange={(e) => setPriority(e.target.value as ITaskPriority)}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(priorityConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          label="Due Date"
          name="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Select
          id="label"
          label="Label"
          value={label}
          className="uppercase"
          onChange={(e) => setLabel(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">Select Label</option>
          {labels.map((label) => (
            <option key={label._id} value={label._id}>
              {label.name}
            </option>
          ))}
        </Select>
      </section>
      <footer className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!content.trim() || !dueDate}
        >
          {task ? "Update" : "Create"}
        </Button>
      </footer>
    </form>
  );
}
