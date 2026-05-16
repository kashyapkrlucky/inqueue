import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";


export default function CustomLineChart({
  data,
}: {
  data: { name: string; tasks: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
        <XAxis
          dataKey="name"
          angle={-45}
          tick={{ fontSize: 12 }}
          stroke="var(--color-text-3)"
        />
        <YAxis
          dataKey="tasks"
          width="auto"
          tickCount={5}
          domain={[0, "dataMax + 10"]}
          tick={{ fontSize: 12 }}
          stroke="var(--color-text-3)"
        />
        <Tooltip
          content={
            <CustomTooltip
              label={data[0]?.name}
              payload={[{ value: data[0]?.tasks }]}
            />
          }
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
    </ResponsiveContainer>
  );
}
