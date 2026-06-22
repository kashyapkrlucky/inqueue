import { useMemo, useState } from "react";

interface DateItem {
  name: string;
  value: number;
  fill: string;
}

const CIRCLE_RADIUS = 44;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function CustomPieChart({ data }: { data: DateItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = useMemo(
    () =>
      data.filter((item) => item.value > 0).map((item, index, visibleItems) => {
        const previousTotal = data
          .filter((previous) => previous.value > 0)
          .slice(0, index)
          .reduce((sum, previous) => sum + previous.value, 0);
        const percent = total > 0 ? item.value / total : 0;

        return {
          ...item,
          index,
          isOnlySegment: visibleItems.length === 1,
          percent,
          dash: `${percent * CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`,
          offset: -(previousTotal / Math.max(total, 1)) * CIRCLE_CIRCUMFERENCE,
        };
      }),
    [data, total],
  );
  const active = segments[activeIndex] ?? segments[0];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3">
      <svg
        className="h-32 w-32 shrink-0"
        role="img"
        viewBox="0 0 120 120"
        aria-label={active ? `${active.name}: ${active.value}` : "Donut chart"}
      >
        <circle
          cx="60"
          cy="60"
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="#eef2f7"
          strokeWidth="16"
        />
        <g transform="rotate(-90 60 60)">
          {segments.map((segment) => (
            <circle
              key={segment.name}
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={segment.fill}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.offset}
              strokeLinecap={segment.isOnlySegment ? "round" : "butt"}
              strokeWidth="14"
              className={`cursor-pointer transition-opacity duration-200 ${
                segment.index === activeIndex ? "opacity-100" : "opacity-70"
              }`}
              onMouseEnter={() => setActiveIndex(segment.index)}
              onFocus={() => setActiveIndex(segment.index)}
              tabIndex={0}
            />
          ))}
        </g>
        <circle cx="60" cy="60" r="33" fill="white" />
        <text
          x="60"
          y="56"
          textAnchor="middle"
          className="fill-gray-900 text-[13px] font-bold"
        >
          {active?.value ?? 0}
        </text>
        <text
          x="60"
          y="71"
          textAnchor="middle"
          className="fill-gray-500 text-[8px] font-medium"
        >
          {active ? active.name : "Tasks"}
        </text>
      </svg>

      <div className="grid w-full max-w-48 gap-1 text-xs">
        {segments.map((segment) => (
          <button
            key={segment.name}
            type="button"
            className={`flex h-7 items-center justify-between gap-2 rounded-md px-2 text-left transition ${
              segment.index === activeIndex
                ? "bg-gray-50 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onMouseEnter={() => setActiveIndex(segment.index)}
            onFocus={() => setActiveIndex(segment.index)}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: segment.fill }}
              />
              <span className="truncate">{segment.name}</span>
            </span>
            <span className="font-semibold text-gray-900">
              {(segment.percent * 100).toFixed(0)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
