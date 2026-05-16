interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export default function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm font-bold text-blue-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}
