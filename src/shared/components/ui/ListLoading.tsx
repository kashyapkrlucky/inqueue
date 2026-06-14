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
  gap = "py-1",
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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <div
          key={item._id.toString()}
          className={`${gap} first:pt-0 last:pb-0`}
        >
          {children(item)}
        </div>
      ))}
    </div>
  );
}
