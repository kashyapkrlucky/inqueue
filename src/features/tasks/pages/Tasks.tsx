import { useEffect, useMemo, useState } from "react";
import { ListTodoIcon } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITaskStatus, ITaskPriority } from "../types";
import { getTaskPriority, getTaskStatus } from "../utils";
import { TaskCard } from "../components/TaskCard";
import CustomToast from "../../../shared/components/ui/CustomToast";
import PageLoader from "../../../shared/components/loaders/PageLoader";
import ListLoading from "../../../shared/components/ui/ListLoading";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { TaskFilters } from "../components/TaskFilters";
import Pagination from "../../../shared/components/ui/Pagination";
import CreateTask from "../components/CreateTask";

export default function Tasks() {
  const { tasks, getTasks, loading, error, totalPages } = useTaskStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ITaskPriority | "all">(
    "all",
  );

  if (error) {
    CustomToast("error", error);
  }

  useEffect(() => {
    getTasks(currentPage, itemsPerPage);
  }, [getTasks, currentPage, itemsPerPage]);

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
    <div className="max-w-7xl mx-auto p-6 pb-0 h-screen flex flex-col gap-4 overflow-hidden">
      <PageHeader
        icon={<ListTodoIcon className="w-5 h-5 text-indigo-600" />}
        title={`My Tasks`}
        description="Track what matters. Update status, priority, and details in one place."
        subContent={<CreateTask />}
      />

      <TaskFilters
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        handleResetFilters={handleResetFilters}
      />

      <section className="flex-1 pt-4 overflow-y-auto">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
