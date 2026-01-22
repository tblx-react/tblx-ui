import React from "react";
import { useTblxInfiniteScroll } from "tblx";

// =====================
// Types
// =====================

export type TblxInfiniteScrollProps = {
  /** Custom loading indicator shown while loading more items */
  loadingIndicator?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Root margin for triggering load more (default: "200px") */
  rootMargin?: string;
};

// =====================
// Default Loading Indicator
// =====================

function DefaultLoadingIndicator() {
  return (
    <div className="tblx__load-more">
      <span>Loading more...</span>
    </div>
  );
}

// =====================
// Component
// =====================

/**
 * Infinite scroll sentinel component.
 * Automatically triggers load more when scrolled into view.
 *
 * @example
 * ```tsx
 * <Tblx rows={data} onStateChange={handleStateChange}>
 *   <Tblx.Table columns={columns} />
 *   <Tblx.InfiniteScroll />
 * </Tblx>
 * ```
 */
export function TblxInfiniteScroll({
  loadingIndicator,
  className = "",
  rootMargin,
}: TblxInfiniteScrollProps) {
  const { isLoadingMore, showSentinel, sentinelRef } = useTblxInfiniteScroll({
    rootMargin,
  });

  return (
    <div className={className}>
      {/* Loading indicator */}
      {isLoadingMore && (loadingIndicator || <DefaultLoadingIndicator />)}

      {/* Sentinel for triggering load more */}
      {showSentinel && <div ref={sentinelRef} aria-hidden="true" />}
    </div>
  );
}

export default TblxInfiniteScroll;
