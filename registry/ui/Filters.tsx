import React from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxFiltersProps = {
  /** Filter components as children */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Label text (default: "Filter By:") */
  label?: string;
};

// =====================
// Component
// =====================

export function TblxFilters({
  children,
  className = "",
  label = "Filter By:",
}: TblxFiltersProps) {
  const { isFiltersVisible } = useTblxContext();

  if (!isFiltersVisible) {
    return null;
  }

  return (
    <div className={`tblx__filters ${className}`}>
      {label && <span className="tblx__filters-label">{label}</span>}
      {children}
    </div>
  );
}

export default TblxFilters;
