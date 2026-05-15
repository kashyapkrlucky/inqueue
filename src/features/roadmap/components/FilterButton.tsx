import { Button } from "../../../shared/components/form/Button";

interface FilterButtonProps {
  label: string;
  filter: "lastWeek" | "lastMonth" | "twoMonths" | null;
  activeFilter: "lastWeek" | "lastMonth" | "twoMonths" | null;
  onClick: (filter: "lastWeek" | "lastMonth" | "twoMonths" | null) => void;
}

export function FilterButton({
  label,
  filter,
  activeFilter,
  onClick,
}: FilterButtonProps) {
  return (
    <Button
      variant={activeFilter === filter ? "primary" : "outline"}
      size="sm"
      onClick={() => onClick(filter)}
    >
      {label}
    </Button>
  );
}
