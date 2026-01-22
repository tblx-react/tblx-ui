import React from "react";
import { useTblxContext } from "tblx";

// =====================
// Types
// =====================

export type TblxFilterTogglerProps = {
  /** Custom className */
  className?: string;
  /** Label when filters are hidden */
  showLabel?: string;
  /** Label when filters are visible */
  hideLabel?: string;
};

// =====================
// Component
// =====================

export function TblxFilterToggler({
  className = "",
  showLabel = "Filters",
  hideLabel = "Hide Filters",
}: TblxFilterTogglerProps) {
  const { isFiltersVisible, setIsFiltersVisible } = useTblxContext();

  return (
    <button
      className={`tblx__filter-toggler ${isFiltersVisible ? "tblx__filter-toggler--active" : ""} ${className}`}
      onClick={() => setIsFiltersVisible(!isFiltersVisible)}
      type="button"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span>{isFiltersVisible ? hideLabel : showLabel}</span>
    </button>
  );
}

export default TblxFilterToggler;
