import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({ currentPage, totalPages, basePath }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          prefetch={true}
          className="p-2 rounded-lg border border-gray-medium text-text hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Link>
      )}

      {/* Page Numbers */}
      {start > 1 && (
        <>
          <Link
            href={`${basePath}?page=1`}
            prefetch={true}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-medium text-text hover:border-primary hover:text-primary text-sm transition-colors"
          >
            1
          </Link>
          {start > 2 && <span className="text-text-light">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          prefetch={true}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
            page === currentPage
              ? "bg-primary text-white border-primary"
              : "border-gray-medium text-text hover:border-primary hover:text-primary"
          }`}
        >
          {page}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-text-light">...</span>}
          <Link
            href={`${basePath}?page=${totalPages}`}
            prefetch={true}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-medium text-text hover:border-primary hover:text-primary text-sm transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          prefetch={true}
          className="p-2 rounded-lg border border-gray-medium text-text hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
