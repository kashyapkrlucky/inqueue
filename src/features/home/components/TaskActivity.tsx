import { ChartAreaIcon, Loader2Icon } from "lucide-react";
import CustomAreaChart from "../../../shared/components/charts/AreaChart";
import InfoCard from "../../../shared/components/content/InfoCard";

interface TaskActivityProps {
  data: Array<{ _id: string; done: number }>;
  loading: boolean;
}

export function TaskActivity({ data, loading }: TaskActivityProps) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  const dayData = days.map((day) => {
    const item = data.find((d) => d._id === day);
    return {
      name: new Date(day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      label: new Date(day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      tasks: item ? item.done : 0,
    };
  });

  return (
    <div className="w-full md:w-1/3 rounded-2xl bg-white p-5 shadow-sm">
      <InfoCard
        title="Task activity"
        description="Completed per day (last 7)"
        icon={
          loading ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <ChartAreaIcon className="h-4 w-4" />
          )
        }
        iconBg="bg-indigo-50"
        iconColor="text-indigo-700"
      />

      <div className="mt-1 relative">
        <CustomAreaChart data={dayData} />
      </div>
    </div>
  );
}
