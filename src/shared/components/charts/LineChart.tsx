import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function CustomLineChart({
  data,
}: {
  data: { name: string; tasks: number }[];
}) {
  return (
    <LineChart
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: 1.618,
        fontSize: 12,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
      <XAxis dataKey="name" angle={-45} stroke="var(--color-text-3)" />
      <YAxis
        dataKey="tasks"
        width="auto"
        tickCount={5}
        domain={[0, "dataMax + 10"]}
        stroke="var(--color-text-3)"
      />
      <Tooltip
        cursor={{
          stroke: "var(--color-border-2)",
        }}
        contentStyle={{
          backgroundColor: "var(--color-surface-raised)",
          borderColor: "var(--color-border-2)",
        }}
      />
      <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />

      <Line
        type="monotone"
        dataKey="tasks"
        stroke="var(--color-chart-2)"
        dot={{
          fill: "var(--color-surface-base)",
        }}
        activeDot={{ stroke: "var(--color-surface-base)" }}
      />
    </LineChart>
  );
}
