import { useEffect, useMemo, useState } from "react";
import { ListTodoIcon } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import type { ITaskStatus, ITaskPriority } from "../types";
import { TaskCard } from "../components/TaskCard";
import PageLoader from "../../../shared/components/loaders/PageLoader";
import ListLoading from "../../../shared/components/ui/ListLoading";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { TaskFilters } from "../components/TaskFilters";
import Pagination from "../../../shared/components/ui/Pagination";
import CreateTask from "../components/CreateTask";
import { useLabelStore } from "../../labels/store/useLabelStore";

export default function Tasks() {
  const { tasks, getTasks, loading, totalPages } = useTaskStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [query, setQuery] = useState("");
  const { getLabels } = useLabelStore();
  const [statusFilter, setStatusFilter] = useState<ITaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ITaskPriority | "all">(
    "all",
  );

  useEffect(() => {
    getTasks(currentPage, itemsPerPage, {
      status: statusFilter,
      priority: priorityFilter,
    });
    getLabels()
  }, [getTasks, currentPage, itemsPerPage, statusFilter, priorityFilter, getLabels]);

  const handleStatusFilterChange = (status: ITaskStatus | "all") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (priority: ITaskPriority | "all") => {
    setPriorityFilter(priority);
    setCurrentPage(1);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => (t.content ?? "").toLowerCase().includes(q));
  }, [tasks, query]);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setCurrentPage(1);
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
        setStatusFilter={handleStatusFilterChange}
        priorityFilter={priorityFilter}
        setPriorityFilter={handlePriorityFilterChange}
        handleResetFilters={handleResetFilters}
      />

      <section className="flex-1 pt-4 overflow-y-auto hide-scrollbar">
        <ListLoading
          isLoading={loading}
          items={filteredTasks}
          gap="py-1"
          emptyMessage="No tasks found, Try adjusting filters or create a new task."
        >
          {(task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          )}
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
