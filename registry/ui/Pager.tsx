import React, { useRef } from "react";
import { useTblxContext, useTblxPager } from "tblx";

// =====================
// Types
// =====================

export type TblxPagerProps = {
  /** Items per page (for calculating total pages) */
  limit?: number;
  /** Custom className */
  className?: string;
  /** Scroll to top after page change */
  scrollToTop?: boolean;
  /** Element ref to scroll to (defaults to component's parent) */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
};

// =====================
// Component
// =====================

/**
 * Pagination controls component.
 * Uses totalCount from context (passed to Tblx provider).
 *
 * @example
 * ```tsx
 * <Tblx rows={data} totalCount={100} onStateChange={handleStateChange}>
 *   <Tblx.Table columns={columns} />
 *   <Tblx.Pager limit={50} />
 * </Tblx>
 * ```
 */
export function TblxPager({
  limit = 50,
  className = "",
  scrollToTop = true,
  scrollTargetRef,
}: TblxPagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rows } = useTblxContext();

  const {
    currentPage,
    canGoPrevious,
    canGoNext,
    pageNumbers,
    goToPage,
  } = useTblxPager({
    limit,
    scrollToTop,
    scrollTargetRef,
    fallbackScrollRef: containerRef,
  });

  // Don't render pager when there are no rows
  if (rows.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={`tblx__pager ${className}`}>
      {/* Previous Arrow */}
      <button
        type="button"
        className="tblx__pager-arrow"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Previous page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="tblx__pager-pages">
        {pageNumbers.map((page, index) => {
          if (page < 0) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="tblx__pager-ellipsis"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              className={`tblx__pager-page ${
                page === currentPage ? "tblx__pager-page--active" : ""
              }`}
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Arrow */}
      <button
        type="button"
        className="tblx__pager-arrow"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export default TblxPager;
