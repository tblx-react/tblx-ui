import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useTblxContext, TblxSelectOption } from "tblx";

// =====================
// Types
// =====================

export type TblxMultiselectFilterProps = {
  /** The key used to store this filter's value in state */
  inputKey: string;
  /** Label displayed on the dropdown button */
  label: string;
  /** Available options */
  options: TblxSelectOption[];
  /** Custom className */
  className?: string;
};

// =====================
// Component
// =====================

export function TblxMultiselectFilter({
  inputKey,
  label,
  options,
  className = "",
}: TblxMultiselectFilterProps) {
  const { state, handleFilterChange } = useTblxContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get current values from context state
  const selectedValues = useMemo(() => {
    return (state.filters?.[inputKey] as string[]) || [];
  }, [state.filters, inputKey]);

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
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      handleFilterChange({ [inputKey]: newValues });
    },
    [inputKey, selectedValues, handleFilterChange]
  );

  // Get the display label (shows count if multiple selected)
  const displayLabel = useMemo(() => {
    if (selectedValues.length === 0) return label;
    if (selectedValues.length === 1) {
      return (
        options.find((opt) => opt.value === selectedValues[0])?.label ?? label
      );
    }
    return `${label} (${selectedValues.length})`;
  }, [selectedValues, options, label]);

  return (
    <div className={`tblx-select tblx-multiselect ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="tblx-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{displayLabel}</span>
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
          {options.map((option) => (
            <li key={option.value} className="tblx-select-option">
              <label className="tblx-select-option-label">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
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

export default TblxMultiselectFilter;
