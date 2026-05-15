interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export default function InfoCard({ title, description, icon, iconBg = "bg-gray-50", iconColor = "text-gray-700" }: InfoCardProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
}
