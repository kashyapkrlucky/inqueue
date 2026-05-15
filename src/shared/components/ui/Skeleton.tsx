import React from "react";

export function Skeleton({
  className = "",
  lines = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}></div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`} {...props}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full ml-4"></div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { items?: number }) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {[...Array(items)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
