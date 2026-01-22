import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useTblxContext, TblxSelectOption } from "tblx";

// =====================
// Types
// =====================

export type TblxSelectFilterProps = {
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

export function TblxSelectFilter({
  inputKey,
  label,
  options,
  className = "",
}: TblxSelectFilterProps) {
  const { state, handleFilterChange } = useTblxContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get current value from context state
  const selectedValue = useMemo(() => {
    const values = state.filters?.[inputKey] as string[] | undefined;
    return values?.[0] ?? null;
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
      const newValue = selectedValue === optionValue ? null : optionValue;
      setIsOpen(false);
      handleFilterChange({ [inputKey]: newValue ? [newValue] : [] });
    },
    [inputKey, selectedValue, handleFilterChange]
  );

  // Get the label for the selected value
  const selectedLabel = useMemo(() => {
    if (!selectedValue) return null;
    return options.find((opt) => opt.value === selectedValue)?.label ?? null;
  }, [selectedValue, options]);

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
          {options.map((option) => (
            <li key={option.value} className="tblx-select-option">
              <label className="tblx-select-option-label">
                <input
                  type="radio"
                  name={`tblx-select-${inputKey}`}
                  checked={selectedValue === option.value}
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

export default TblxSelectFilter;
