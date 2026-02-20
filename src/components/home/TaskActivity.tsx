import { Loader2Icon } from "lucide-react";

interface TaskActivityProps {
  data: {
    [key: string]: number;
  };
  loading: boolean;
}

export function TaskActivity({
  data,
  loading,
}: TaskActivityProps) {
  // Process data: if array, convert to object {month: count}
  const processedData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        acc[item._id] = item.done;
        return acc;
      }, {} as { [key: string]: number })
    : data;

  // Calculate chart dimensions and points
  const chartWidth = 300;
  const chartHeight = 120;
  const padding = 20;

  // Calculate points for the chart
  const points = Object.entries(processedData).map(([key, value], index) => {
    const count = typeof value === 'number' ? value : 0;
    const x =
      padding +
      (index / (Object.keys(processedData).length - 1)) * (chartWidth - 2 * padding);
    const y =
      chartHeight -
      padding -
      (count / Math.max(...Object.values(processedData).map(v => typeof v === 'number' ? v : 0), 1)) *
        (chartHeight - 2 * padding);
    return { x, y, count, label: key };
  });

  // Create area path (filled area under the line)
  const areaPath = points.length > 0 ? `M${points[0].x || 0},${chartHeight - padding} ${points.map((p) => `L${p.x || 0},${p.y || 0}`).join(" ")} L${points[points.length - 1].x || 0},${chartHeight - padding} Z` : "";

  // Create line path
  const linePath = points.length > 0 ? `M${points.map((p) => `${p.x || 0},${p.y || 0}`).join(" L")}` : "";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Task activity</h2>
          <p className="mt-1 text-xs text-gray-500">
            Marked done per day
          </p>
        </div>
        {loading && (
          <Loader2Icon className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Chart Container */}
      <div className="mt-5 relative">
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

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" opacity="0.3" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
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
              fill="#6366f1"
              className="hover:r-6"
              style={{ transition: "r 0.2s" }}
            >
              <title>{`${point.count} tasks done in ${point.label}`}</title>
            </circle>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Month labels */}
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
