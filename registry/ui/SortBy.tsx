import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTblxContext, TblxInputValue, TblxSelectOption, SortByOption } from "tblx";

// =====================
// Types
// =====================

export type TblxSortByProps = {
  /** Sort options to display in the dropdown */
  options: SortByOption[];
  /** Input key for the sort field */
  inputKey?: string;
  /** Label for the select */
  label?: string;
  /** Custom className */
  className?: string;
  /** Callback when value changes */
  onValueChange?: (values: TblxInputValue) => void;
};

// =====================
// Component
// =====================

export function TblxSortBy({
  options,
  inputKey = "sort",
  label = "Sort By",
  className = "",
  onValueChange,
}: TblxSortByProps) {
  const { state, handleSortChange } = useTblxContext();

  // Convert sort options to select format
  const sortBySelectOptions: TblxSelectOption[] = useMemo(() => {
    return options.map((sort) => ({
      value: sort.key + "|" + sort.direction,
      label: sort.label || sort.key,
    }));
  }, [options]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentValue = useMemo(() => {
    const sort = state.sortBy?.[0];
    return sort ? `${sort.key}|${sort.direction}` : null;
  }, [state.sortBy]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (optionValue: string) => {
      const newValue = currentValue === optionValue ? null : optionValue;
      setIsOpen(false);

      const values: TblxInputValue = { [inputKey]: newValue ? [newValue] : [] };
      onValueChange?.(values);
      handleSortChange(values);
    },
    [inputKey, currentValue, onValueChange, handleSortChange]
  );

  // Get the label for the selected value
  const selectedLabel = useMemo(() => {
    if (!currentValue) return null;
    return sortBySelectOptions.find((opt) => opt.value === currentValue)?.label ?? null;
  }, [currentValue, sortBySelectOptions]);

  if (options.length === 0) {
    return null;
  }

  return (
    <div className={`tblx-select ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="tblx-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedLabel ?? label}</span>
        <svg
          className={`tblx-select-chevron ${isOpen ? "tblx-select-chevron--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <ul className="tblx-select-dropdown" role="listbox">
          {sortBySelectOptions.map((option) => (
            <li key={option.value} className="tblx-select-option">
              <label className="tblx-select-option-label">
                <input
                  type="radio"
                  name={`tblx-select-${inputKey}`}
                  checked={currentValue === option.value}
                  onChange={() => handleChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TblxSortBy;
