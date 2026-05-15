import { InboxIcon } from "lucide-react";

interface NoItemsProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function NoItems({ title, description, icon }: NoItemsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-8 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
        {icon || <InboxIcon className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
