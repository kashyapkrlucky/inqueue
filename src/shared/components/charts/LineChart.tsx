interface LineChartPoint {
  name: string;
  tasks: number;
}

const WIDTH = 520;
const HEIGHT = 300;
const PADDING = {
  top: 28,
  right: 20,
  bottom: 58,
  left: 40,
};

const getPoints = (data: LineChartPoint[]) => {
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

export default function CustomLineChart({ data }: { data: LineChartPoint[] }) {
  const points = getPoints(data);
  const max = Math.max(...data.map((item) => item.tasks), 1);
  const path = createSmoothPath(points);

  return (
    <svg
      className="h-[300px] w-full"
      role="img"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-label="Task trend line chart"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
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
              x={PADDING.left - 10}
              y={y + 4}
              textAnchor="end"
              className="fill-gray-400 text-[10px]"
            >
              {Math.round(max * (1 - ratio))}
            </text>
          </g>
        );
      })}

      <path
        d={path}
        fill="none"
        stroke="#4f46e5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />

      {points.map((point) => (
        <g key={point.name}>
          <circle cx={point.x} cy={point.y} r="6" fill="#eef2ff" />
          <circle cx={point.x} cy={point.y} r="3.25" fill="#4f46e5" />
          <title>{`${point.name}: ${point.tasks}`}</title>
          <text
            x={point.x}
            y={HEIGHT - 24}
            textAnchor="end"
            transform={`rotate(-35 ${point.x} ${HEIGHT - 24})`}
            className="fill-gray-400 text-[10px]"
          >
            {point.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
