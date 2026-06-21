export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 ">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          disabled={!hasPrevious}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          className="relative ml-3 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          disabled={!hasNext}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}