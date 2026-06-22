import { useState } from "react";

interface AreaChartPoint {
  name: string;
  tasks: number;
}

const WIDTH = 360;
const HEIGHT = 220;
const PADDING = {
  top: 20,
  right: 18,
  bottom: 42,
  left: 34,
};

const getPoints = (data: AreaChartPoint[]) => {
  const max = Math.max(...data.map((item) => item.tasks), 1);
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  return data.map((item, index) => ({
    ...item,
    x: PADDING.left + index * xStep,
    y: PADDING.top + innerHeight - (item.tasks / max) * innerHeight,
  }));
};

const createSmoothPath = (points: ReturnType<typeof getPoints>) => {
  if (points.length === 0) {
    return "";
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
};

export default function CustomAreaChart({ data }: { data: AreaChartPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = getPoints(data);
  const activePoint =
    activeIndex === null ? undefined : points[activeIndex] ?? undefined;
  const linePath = createSmoothPath(points);
  const chartBottom = HEIGHT - PADDING.bottom;
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const areaPath =
    firstPoint && lastPoint
      ? `${linePath} L ${lastPoint.x} ${chartBottom} L ${firstPoint.x} ${chartBottom} Z`
      : "";
  const max = Math.max(...data.map((item) => item.tasks), 1);

  return (
    <svg
      className="h-full min-h-52 w-full"
      role="img"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-label="Completed tasks over the last seven days"
    >
      <defs>
        <linearGradient id="task-activity-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {[0, 0.5, 1].map((ratio) => {
        const y = PADDING.top + (HEIGHT - PADDING.top - PADDING.bottom) * ratio;
        return (
          <g key={ratio}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={y}
              y2={y}
              stroke="#eef2f7"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 9}
              y={y + 4}
              textAnchor="end"
              className="fill-gray-400 text-[10px]"
            >
              {Math.round(max * (1 - ratio))}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="url(#task-activity-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="#10b981"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />

      {points.map((point, index) => (
        <g key={point.name}>
          <circle
            cx={point.x}
            cy={point.y}
            r={activeIndex === index ? "8" : "6"}
            fill="#d1fae5"
          />
          <circle cx={point.x} cy={point.y} r="3" fill="#059669" />
          <circle
            cx={point.x}
            cy={point.y}
            r="13"
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            tabIndex={0}
          />
          <title>{`${point.name}: ${point.tasks}`}</title>
          <text
            x={point.x}
            y={HEIGHT - 18}
            textAnchor="middle"
            className="fill-gray-400 text-[10px]"
          >
            {point.name}
          </text>
        </g>
      ))}

      {activePoint ? (
        <g
          transform={`translate(${Math.min(
            Math.max(activePoint.x - 48, PADDING.left),
            WIDTH - 104,
          )} ${Math.max(activePoint.y - 48, PADDING.top)})`}
          pointerEvents="none"
        >
          <rect
            width="96"
            height="34"
            rx="8"
            fill="white"
            stroke="#d1fae5"
            filter="drop-shadow(0 8px 14px rgb(15 23 42 / 0.12))"
          />
          <text x="10" y="14" className="fill-gray-500 text-[10px]">
            {activePoint.name}
          </text>
          <text x="10" y="27" className="fill-emerald-700 text-[11px] font-semibold">
            {activePoint.tasks} done
          </text>
        </g>
      ) : null}
    </svg>
  );
}
