import { Loader2Icon } from "lucide-react";
import CustomAreaChart from "../../../shared/components/charts/AreaChart";

interface TaskActivityProps {
  data: Array<{ _id: string; done: number }>;
  loading: boolean;
}

export function TaskActivity({
  data,
  loading,
}: TaskActivityProps) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const dayData = days.map(day => {
    const item = data.find(d => d._id === day);
    return {
      name: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks: (item ? item.done : 0),
    };
  });

 

  return (
    <div className="w-1/3 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Task activity</h2>
          <p className="mt-1 text-xs text-gray-500">
            Completed per day (last 7)
          </p>
        </div>
        {loading && (
          <Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      <div className="mt-5 relative">
        <CustomAreaChart data={dayData}/>
      </div>
    </div>
  );
}
