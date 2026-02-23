import { Loader2Icon } from "lucide-react";

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
      day,
      count: item ? item.done : 0,
      label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const chartWidth = 300;
  const chartHeight = 120;
  const padding = 20;
  const maxCount = Math.max(...dayData.map(d => d.count), 1);

  const points = dayData.map((d, index) => {
    const x = padding + (index / 6) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (d.count / maxCount) * (chartHeight - 2 * padding);
    return { x, y, count: d.count, label: d.label };
  });

  // Create smooth line path with quadratic curves
  let linePath = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    linePath += ` Q${midX},${midY} ${curr.x},${curr.y}`;
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
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
        {/* SVG Line Chart */}
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="30"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 20"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#00bc7d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#00bc7d"
              className="hover:r-6"
              style={{ transition: "r 0.2s" }}
            >
              <title>{`${point.count} tasks done on ${point.label}`}</title>
            </circle>
          ))}
        </svg>

        {/* Day labels */}
        <div className="flex justify-between mt-2 px-5">
          {points.map((point, index) => (
            <div key={index} className="text-center">
              <div className="text-[11px] font-semibold text-gray-600">
                {point.label}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {point.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
