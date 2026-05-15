import InlineLoader from "../loaders/InlineLoader";

interface ListLoadingProps<T> {
  children: (item: T) => React.ReactNode;
  isLoading: boolean;
  items: T[];
  gap?: string;
  emptyMessage?: string;
}

export default function ListLoading<T extends { _id: string }>({
  children,
  isLoading,
  gap = "py-3",
  items = [],
  emptyMessage = "No items found",
}: ListLoadingProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <InlineLoader />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item._id.toString()} className={`${gap} first:pt-0 last:pb-0`}>
          {children(item)}
        </div>
      ))}
    </div>
  );
}
