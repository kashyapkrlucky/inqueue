import InlineLoader from "./InlineLoader";
import { NoItems } from "./NoItems";

interface GridLoadingProps<T> {
  children: (item: T) => React.ReactNode;
  isLoading: boolean;
  items: T[];
  emptyMessage?: string;
}

export default function GridLoading<T extends { _id: string }>({
  children,
  isLoading,
  items = [],
  emptyMessage = "No items found",
}: GridLoadingProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <InlineLoader />
      </div>
    );
  }

  if (!items.length) {
    return <NoItems title={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
      {items.map((item) => (
        <div key={item._id.toString()}>{children(item)}</div>
      ))}
    </div>
  );
}
