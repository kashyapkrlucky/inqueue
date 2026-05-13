import {
  Pie,
  PieChart,
  Sector,
  type PieSectorDataItem,
  Tooltip,
  type TooltipIndex,
} from 'recharts';

interface dateItem {
    name: string;
    value: number;
    fill: string;
}

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.name} `}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${value} (${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function CustomPieChart({
  isAnimationActive = true,
  defaultIndex = undefined,
  data,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
  data: dateItem[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        minHeight: '250px',
        maxHeight: "250px",
        padding: '10px',
        justifyContent: 'center',
        alignItems: 'stretch',
        fontSize:10
      }}
    >
    <PieChart
      style={{
        width: '100%',
        maxWidth: '30vw',
        maxHeight: '30vh',
        aspectRatio: 1,
      }}
      responsive
      margin={{
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      }}
    >
      <Pie
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="30%"
        innerRadius="30%"
        outerRadius="50%"
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
      />
      <Tooltip content={() => null} defaultIndex={defaultIndex} />
    </PieChart>
    </div>
  );
}
