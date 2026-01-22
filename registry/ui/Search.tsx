import React, { useCallback, useMemo } from "react";
import { useTblxContext, TblxInputValue, debounce } from "tblx";

// =====================
// Types
// =====================

export type TblxSearchProps = {
  /** Input key for the search field */
  inputKey?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Custom className */
  className?: string;
  /** Callback when value changes (before debounce) */
  onValueChange?: (values: TblxInputValue) => void;
};

// =====================
// Component
// =====================

export function TblxSearch({
  inputKey = "search",
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
  onValueChange,
}: TblxSearchProps) {
  const { state, handleSearchChange } = useTblxContext();

  const debouncedChange = useMemo(
    () =>
      debounce((values: TblxInputValue) => {
        onValueChange?.(values);
        handleSearchChange(values);
      }, debounceMs),
    [handleSearchChange, onValueChange, debounceMs]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedChange({ [inputKey]: [value] });
    },
    [debouncedChange, inputKey]
  );

  return (
    <div className={`tblx-search-input ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={state.search || ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default TblxSearch;
