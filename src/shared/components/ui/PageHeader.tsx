interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  subContent?: React.ReactNode;
}

export function PageHeader({ icon, title, description, subContent }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg">
              {icon}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-sm text-gray-500 ml-13">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {subContent}
        </div>
      </div>
  );
}