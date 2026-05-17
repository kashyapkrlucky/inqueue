import { useEffect, useMemo, useState } from "react";
import { FilterIcon, Plus } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITask, ITaskStatus, ITaskPriority } from "../types";
import CreateTask from "../components/CreateTask";
import {
  getTaskPriority,
  getTaskStatus,
  priorityConfig,
  statusConfig,
} from "../utils";
import { TaskCard } from "../components/TaskCard";
import { Button } from "../../../shared/components/form/Button";
import CustomToast from "../../../shared/components/ui/CustomToast";
import PageLoader from "../../../shared/components/loaders/PageLoader";
import Text from "../../../shared/components/content/Text";
import ListLoading from "../../../shared/components/ui/ListLoading";
import Input from "../../../shared/components/form/Input";
import Select from "../../../shared/components/form/Select";
import Modal from "../../../shared/components/ui/Modal";

export default function Tasks() {
  const { tasks, getTasks, loading, error, addTask } = useTaskStore();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ITaskPriority | "all">(
    "all",
  );

  if (error) {
    CustomToast("error", error);
  }

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onAddTask = (task: Partial<ITask>) => {
    addTask(task);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const st = getTaskStatus(t.status);
      const pr = getTaskPriority(t.priority);
      if (statusFilter !== "all" && st !== statusFilter) return false;
      if (priorityFilter !== "all" && pr !== priorityFilter) return false;
      if (!q) return true;
      return (t.content ?? "").toLowerCase().includes(q);
    });
  }, [tasks, query, statusFilter, priorityFilter]);

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTask((prev) => (prev === taskId ? null : taskId));
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setQuery("");
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white overflow-y-scroll">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 h-full relative">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50 to-white space-y-4 pt-4">
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Text variant="h1">My Tasks</Text>
                <Text variant="body-sm" color="muted" className="mt-1">
                  Track what matters. Update status, priority, and details in
                  one place.
                </Text>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </header>

          <section className="flex-1 rounded-xl bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end justify-end">
              <Input
                label="Search"
                type="text"
                boxClassName="flex flex-col gap-2 sm:col-span-6"
                placeholder="Search tasks by title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <Select
                label="Status"
                value={statusFilter}
                boxClassName="flex flex-col gap-2 sm:col-span-2"
                onChange={(e) =>
                  setStatusFilter(e.target.value as ITaskStatus | "all")
                }
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>

              <Select
                label="Priority"
                value={priorityFilter}
                boxClassName="flex flex-col gap-2 sm:col-span-2"
                onChange={(e) =>
                  setPriorityFilter(e.target.value as ITaskPriority | "all")
                }
              >
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>

              <Button
                icon={<FilterIcon className="h-4 w-4" />}
                onClick={handleResetFilters}
                className="sm:col-span-2 justify-end"
              >
                Reset Filters
              </Button>
            </div>
          </section>
        </div>

        <section className="flex-1 py-4">
          <ListLoading
            isLoading={loading}
            items={filteredTasks}
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
        </section>

        <Modal
          title="Create Task"
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        >
          <CreateTask
            onAddTask={onAddTask}
            onClose={() => setIsTaskModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}
