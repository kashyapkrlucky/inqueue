interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function InfoCard({ title, description, icon }: InfoCardProps) {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
