import React from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxLoadingProps = {
  /** Custom loading content */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
};

// =====================
// Component
// =====================

export function TblxLoading({ children, className = "" }: TblxLoadingProps) {
  const { isLoading, rows } = useTblxContext();

  // Only show full loading state when no data exists yet
  if (!isLoading || rows.length > 0) {
    return null;
  }

  return (
    <div className={`tblx__loading ${className}`}>
      {children || (
        <div className="tblx__loading-spinner">
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
}

// =====================
// Loading Overlay (for when data exists but is refreshing)
// =====================

export type TblxLoadingOverlayProps = {
  /** Custom className */
  className?: string;
};

export function TblxLoadingOverlay({ className = "" }: TblxLoadingOverlayProps) {
  const { isLoading, isLoadingMore, rows } = useTblxContext();

  // Show overlay when loading with existing data
  // Hide it when we're in "load more" mode (infinite scroll appending)
  const showOverlay = isLoading && rows.length > 0 && !isLoadingMore;

  if (!showOverlay) {
    return null;
  }

  return (
    <>
      {/* Background overlay */}
      <div className={`tblx__loading-overlay ${className}`} aria-hidden="true" />
      {/* Sticky spinner container - in document flow for sticky to work */}
      <div className="tblx__loading-overlay-sticky">
        <div
          className="tblx__overlay-spinner"
          role="status"
          aria-label="Loading"
        />
      </div>
    </>
  );
}

export default TblxLoading;
