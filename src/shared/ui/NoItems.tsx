"use client";

interface NoItemsProps {
  title: string;
  description?: string;
}

export function NoItems({ title, description }: NoItemsProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
