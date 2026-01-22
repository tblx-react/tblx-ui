import React from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxEmptyProps = {
  /** Custom empty state content */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
};

// =====================
// Component
// =====================

export function TblxEmpty({ children, className = "" }: TblxEmptyProps) {
  const { rows, isLoading } = useTblxContext();

  // Only show when not loading and no data
  if (isLoading || rows.length > 0) {
    return null;
  }

  return (
    <div className={className}>
      {children || <span>No data found</span>}
    </div>
  );
}

export default TblxEmpty;
