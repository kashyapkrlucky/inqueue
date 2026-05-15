import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function CustomAreaChart({
  data,
}: {
  data: { name: string; tasks: number }[];
}) {
  return (
    <AreaChart
      style={{
        width: "100%",
        aspectRatio: 1.618,
        fontSize: 12,
      }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
      }}
      onContextMenu={(_, e) => e.preventDefault()}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" angle={-45} startOffset={20} />
      <YAxis
        dataKey="tasks"
        width="auto"
        tickCount={5}
        domain={[0, "dataMax + 5"]}
        stroke="var(--color-text-3)"
      />
      <Tooltip cursor={{ fill: "var(--color-bg-2)", opacity: 0.1 }} />
      <Area
        type="monotone"
        dataKey="tasks"
        stroke="var(--color-chart-2)"
        fill="var(--color-chart-2)"
      />
    </AreaChart>
  );
}
