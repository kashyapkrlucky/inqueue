import Input from "../../../shared/components/form/Input";
import type { ITaskPriority, ITaskStatus } from "../types";
import Select from "../../../shared/components/form/Select";
import { priorityConfig, statusConfig } from "../utils";
import { FilterIcon } from "lucide-react";
import { Button } from "../../../shared/components/form/Button";

interface TaskFiltersProps {
  query: string;
  setQuery: (query: string) => void;
  statusFilter: ITaskStatus | "all";
  setStatusFilter: (status: ITaskStatus | "all") => void;
  priorityFilter: ITaskPriority | "all";
  setPriorityFilter: (priority: ITaskPriority | "all") => void;
  handleResetFilters: () => void;
}
export function TaskFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  handleResetFilters,
}: TaskFiltersProps) {
  return (
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
        onChange={(e) => setStatusFilter(e.target.value as ITaskStatus | "all")}
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
  );
}
